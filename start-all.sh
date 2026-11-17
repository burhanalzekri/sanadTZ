#!/data/data/com.termux/files/usr/bin/bash
# ============================================
# سَنَد تعز — سكربت تشغيل موحد
# ============================================

cd "$(dirname "$0")"
PROJECT_DIR="$(pwd)"
API_PORT="${PORT:-5000}"
PREVIEW_PORT="${VITE_PREVIEW_PORT:-4173}"
if [ -f .env ]; then
  set -a
  . ./.env 2>/dev/null
  set +a
  API_PORT="${PORT:-5000}"
  PREVIEW_PORT="${VITE_PREVIEW_PORT:-4173}"
fi
LOG_DIR="$PROJECT_DIR/.logs"
PID_DIR="$PROJECT_DIR/.pids"
mkdir -p "$LOG_DIR" "$PID_DIR"

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[0;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log_info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warn()    { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error()   { echo -e "${RED}❌ $1${NC}"; }

# ============================================
# قتل العمليات (دقيق)
# ============================================
kill_processes() {
  log_info "إيقاف العمليات القديمة..."

  # Vite preview — تطابق عدة أنماط
  pkill -f "vite.js preview" 2>/dev/null || true
  pkill -f "vite preview --config" 2>/dev/null || true
  pkill -f "pnpm.*sanad-taiz.*serve" 2>/dev/null || true

  # API server — تطابق عدة أنماط
  pkill -f "dist/index.mjs" 2>/dev/null || true
  pkill -f "pnpm.*api-server.*start" 2>/dev/null || true

  sleep 2

  # تحقق
  REMAINING=$(ps aux | grep -E "vite\.js preview|dist/index\.mjs" | grep -v grep | wc -l)
  if [ "$REMAINING" -gt 0 ]; then
    log_warn "لا تزال $REMAINING عملية تعمل — محاولة قوية"
    pkill -9 -f "vite.js preview" 2>/dev/null || true
    pkill -9 -f "dist/index.mjs" 2>/dev/null || true
    sleep 1
  fi

  rm -f "$PID_DIR/vite.pid" "$PID_DIR/api.pid"
}

# ============================================
# الحالة
# ============================================
show_status() {
  echo ""
  echo "📊 حالة خدمات سَنَد تعز"
  echo "========================"

  if pg_isready -q 2>/dev/null; then
    log_success "PostgreSQL: يعمل"
  else
    log_error "PostgreSQL: متوقف"
  fi

  if curl -s -m 2 -o /dev/null -w "%{http_code}" http://127.0.0.1:${API_PORT}/api/healthz 2>/dev/null | grep -q "200"; then
    log_success "الخادم API (:${API_PORT}): يعمل"
  else
    log_error "الخادم API (:${API_PORT}): متوقف"
  fi

  if curl -s -m 2 -o /dev/null -w "%{http_code}" http://127.0.0.1:${PREVIEW_PORT}/ 2>/dev/null | grep -q "200"; then
    log_success "الواجهة (:${PREVIEW_PORT}): يعمل"
  else
    log_error "الواجهة (:${PREVIEW_PORT}): متوقف"
  fi
  echo ""
}

# ============================================
# التشغيل
# ============================================
start_all() {
  echo ""
  echo "🚀 تشغيل سَنَد تعز"
  echo "=================="

  # 0. فحص .env
  if [ ! -f .env ]; then
    log_error ".env غير موجود! انسخ من .env.example"
    exit 1
  fi
  log_success ".env موجود"

  # 1. تحميل المتغيرات
  set -a
  . ./.env 2>/dev/null
  set +a

  # 2. PostgreSQL (بدون إيقاف عند الفشل)
  if pg_isready -q 2>/dev/null; then
    log_success "PostgreSQL يعمل مسبقاً"
  else
    log_info "تشغيل PostgreSQL..."
    pg_ctl -D $PREFIX/var/lib/postgresql -l $PREFIX/var/log/postgresql.log start > /dev/null 2>&1
    sleep 2
    if pg_isready -q 2>/dev/null; then
      log_success "PostgreSQL يعمل"
    else
      log_error "فشل تشغيل PostgreSQL"
      exit 1
    fi
  fi

  # 3. استعادة الحزم
  if [ -f .termux-fixes/restore.sh ]; then
    bash .termux-fixes/restore.sh > /dev/null 2>&1 || true
    log_success "حزم Termux جاهزة"
  fi

  # 4. فحص البناء
  if [ ! -f artifacts/api-server/dist/index.mjs ]; then
    log_error "الخادم غير مبني! شغّل build أولاً"
    exit 1
  fi
  if [ ! -f artifacts/sanad-taiz/dist/public/index.html ]; then
    log_error "الواجهة غير مبنية! شغّل build أولاً"
    exit 1
  fi
  log_success "البناء موجود"

  # 5. إيقاف العمليات القديمة
  kill_processes

  # 6. تشغيل الخادم
  log_info "تشغيل الخادم API..."
  nohup pnpm --filter @workspace/api-server run start \
    > "$LOG_DIR/api.log" 2>&1 &
  API_PID=$!
  echo $API_PID > "$PID_DIR/api.pid"

  # انتظار
  for i in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1
    CODE=$(curl -s -m 2 -o /dev/null -w "%{http_code}" http://127.0.0.1:${API_PORT}/api/healthz 2>/dev/null)
    if [ "$CODE" = "200" ]; then
      log_success "الخادم يعمل على :${API_PORT} (PID $API_PID)"
      break
    fi
    if [ "$i" = "10" ]; then
      log_error "فشل تشغيل الخادم بعد 10 ثوانٍ"
      echo "--- سجل الأخطاء ---"
      tail -30 "$LOG_DIR/api.log"
      exit 1
    fi
  done

  # 7. تشغيل الواجهة
  log_info "تشغيل الواجهة Vite preview..."
  nohup pnpm --filter @workspace/sanad-taiz run serve \
    > "$LOG_DIR/vite.log" 2>&1 &
  VITE_PID=$!
  echo $VITE_PID > "$PID_DIR/vite.pid"

  for i in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1
    CODE=$(curl -s -m 2 -o /dev/null -w "%{http_code}" http://127.0.0.1:${PREVIEW_PORT}/ 2>/dev/null)
    if [ "$CODE" = "200" ]; then
      log_success "الواجهة تعمل على :${PREVIEW_PORT} (PID $VITE_PID)"
      break
    fi
    if [ "$i" = "10" ]; then
      log_error "فشل تشغيل الواجهة بعد 10 ثوانٍ"
      tail -30 "$LOG_DIR/vite.log"
      exit 1
    fi
  done

  # 8. نجاح
  echo ""
  echo "============================================"
  log_success "🎉 كل الخدمات جاهزة!"
  echo "============================================"
  echo ""
  echo "  🌐 الواجهة:  http://127.0.0.1:${PREVIEW_PORT}/"
  echo "  🔌 API:      http://127.0.0.1:${API_PORT}/"
  echo "  👤 الدخول:   http://127.0.0.1:${PREVIEW_PORT}/sign-in"
  echo "  🔑 حساب:     ${ADMIN_EMAIL:-admin@example.com}"
  echo ""
  echo "  📋 السجلات:  tail -f $LOG_DIR/api.log"
  echo "               tail -f $LOG_DIR/vite.log"
  echo ""
  echo "  🛑 الإيقاف:  ./start-all.sh --stop"
  echo "  📊 الحالة:   ./start-all.sh --status"
  echo "============================================"
}

# ============================================
# الإيقاف
# ============================================
stop_all() {
  kill_processes
  log_success "تم إيقاف كل شيء"
  exit 0
}

# ============================================
# المعالجة
# ============================================
case "${1:-start}" in
  --stop|-s)   stop_all ;;
  --status|-t) show_status ;;
  --help|-h)   echo "الاستخدام: ./start-all.sh [--stop|--status|--help]" ;;
  start|"")    start_all ;;
  *)           log_error "أمر غير معروف: $1"; exit 1 ;;
esac
