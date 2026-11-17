# بنية سند تعز بعد إعادة التنظيم

## مكونات المستودع

- `artifacts/sanad-taiz`: تطبيق React وVite وواجهة RTL.
- `artifacts/api-server`: خادم Express ومسارات API والمصادقة والرفع.
- `lib/db`: مخطط PostgreSQL واتصال Drizzle ORM.
- `lib/api-zod`: مخططات التحقق من الطلبات والاستجابات.
- `lib/api-client-react`: عميل React المولد من تعريفات API.
- `lib/api-spec`: تعريف API المشترك.

## فصل بيانات الواجهة

نُقلت البيانات الثابتة التي كانت داخل `App.tsx` إلى وحدات مستقلة لتسهيل الصيانة وتقليل تضخم الملف:

- `src/data/mood-options.ts`: خيارات الحالة المزاجية.
- `src/data/assessment-scales.ts`: تعريفات وبيانات مقاييس التقييم.
- `src/data/self-care-exercises.ts`: بيانات تمارين العناية بالذات.

الصفحات والمكونات التفاعلية ما زالت في `App.tsx`؛ فصلها إلى ملفات مستقلة خطوة تالية تتطلب اختبارات واجهة حتى لا تتغير الوظائف.

## إعداد CORS

في الإنتاج أضف أسماء النطاقات المسموح بها إلى `CORS_ORIGINS` في `.env`، مفصولة بفواصل، مثل:

```env
CORS_ORIGINS=https://example.com,https://www.example.com
```

لا يُسمح في الإنتاج بعكس أي Origin عشوائي مع `credentials`. في التطوير المحلي يُسمح بمنافذ localhost فقط.

## الملفات والبيانات

- لا ترفع `.env` أو كلمات المرور أو مفاتيح التشفير إلى Git أو ZIP عام.
- احتفظ بنسخة احتياطية من PostgreSQL قبل أي تغيير في المخطط.
- ملفات الصور المرفوعة موجودة في `artifacts/sanad-taiz/public/uploads`.
- امتدادات الرفع المسموحة: JPG وJPEG وPNG وWEBP وGIF. تم تعطيل SVG لتقليل مخاطر المحتوى النشط عند تقديم الملفات من نفس النطاق.

## أوامر التشغيل

```bash
pnpm install
cp .env.example .env
# عدّل DATABASE_URL وSESSION_SECRET وبيانات المدير
pnpm --filter @workspace/db run push
pnpm run build
```

شغّل الخادم والواجهة في نافذتين منفصلتين وفق `README-نسخة-التسليم.md`.
