import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { useCreatePathway, useCreateResource, useDeletePathway, useDeleteResource, useGetAdminSummary, useListAdminBookings, useListAdminPathways, useListAdminResources, useUpdateBookingStatus, useUpdatePathway, useUpdateResource, getGetAdminSummaryQueryKey, getListAdminBookingsQueryKey, getListAdminPathwaysQueryKey, getListAdminResourcesQueryKey, getListPublicPathwaysQueryKey, getListPublicResourcesQueryKey, type Booking, type BookingStatus, type ContentItem, type ContentItemInput, type Pathway, type PathwayInput } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useToast } from '@/components/toast-system';
import { useConfirm } from '@/components/confirm-dialog';
import { PageIntro, LoadingBlock, ErrorBlock, EmptyBlock } from '@/components/page-ui';
import { EmergencyAdmin, PathwayEditor, ResourceEditor } from '@/components/admin-editors';

export const isForbidden = (err: unknown): boolean => {
  if (!err) return false;
  const anyErr = err as { status?: number; response?: { status?: number } };
  return anyErr?.status === 403 || anyErr?.response?.status === 403;
};

export const preferredLabels: Record<string, string> = {
  morning: 'صباحاً',
  afternoon: 'بعد الظهر',
  evening: 'مساءً',
  anytime: 'أي وقت مناسب',
};

export const statusLabels: Record<string, string> = {
  pending: 'قيد المراجعة',
  contacted: 'تم التواصل',
  scheduled: 'مجدول',
  closed: 'مغلق',
};

export const kindLabels: Record<string, string> = {
  article: 'مقال',
  guide: 'دليل',
  course: 'دورة',
  video: 'فيديو',
  audio: 'صوت',
};

export function AdminPage(){
  const qc=useQueryClient();const summary=useGetAdminSummary();const bookings=useListAdminBookings();const pathways=useListAdminPathways();const resources=useListAdminResources();
  const updateStatus=useUpdateBookingStatus();const createPathway=useCreatePathway();const updatePathway=useUpdatePathway();const deletePathway=useDeletePathway();
  const createResource=useCreateResource();const updateResource=useUpdateResource();const deleteResource=useDeleteResource();
  const [tab,setTab]=useState<'bookings'|'pathways'|'resources'|'emergency'>('bookings');const [editPath,setEditPath]=useState<Pathway|null>(null);const [editResource,setEditResource]=useState<ContentItem|null>(null);const [notice,setNotice]=useState('');
  const toast = useToast();
  const confirm = useConfirm();
  const errors=[summary.error,bookings.error,pathways.error,resources.error].filter(Boolean);const blocked=errors.some(isForbidden);const loading=[summary,bookings,pathways,resources].some(q=>q.isLoading);
  function refreshAll(){void qc.invalidateQueries({queryKey:getGetAdminSummaryQueryKey()});void qc.invalidateQueries({queryKey:getListAdminBookingsQueryKey()});void qc.invalidateQueries({queryKey:getListAdminPathwaysQueryKey()});void qc.invalidateQueries({queryKey:getListAdminResourcesQueryKey()});void qc.invalidateQueries({queryKey:getListPublicPathwaysQueryKey()});void qc.invalidateQueries({queryKey:getListPublicResourcesQueryKey()});}
  function savePathway(payload:PathwayInput){const callbacks={onSuccess:()=>{toast.success('تم حفظ المسار بنجاح', 'تم تحديث مسار الدعم وسيظهر للمستخدمين.');setEditPath(null);refreshAll();},onError:()=>toast.error('تعذّر حفظ المسار', 'تحقق من اتصالك وحاول مرة أخرى.')};if(editPath)updatePathway.mutate({pathwayId:editPath.id,data:payload},callbacks);else createPathway.mutate({data:payload},callbacks);}
  function saveResource(payload:ContentItemInput){const callbacks={onSuccess:()=>{toast.success('تم حفظ المحتوى بنجاح', 'سيظهر المحتوى في المكتبة بعد النشر.');setEditResource(null);refreshAll();},onError:()=>toast.error('تعذّر حفظ المحتوى', 'تحقق من اتصالك وحاول مرة أخرى.')};if(editResource)updateResource.mutate({resourceId:editResource.id,data:payload},callbacks);else createResource.mutate({data:payload},callbacks);}
  async function removePathway(item:Pathway){const ok = await confirm({ title: 'تأكيد الحذف', message: `هل تريد حذف مسار «${item.title}» نهائياً؟`, confirmText: 'نعم، احذف', cancelText: 'إلغاء', danger: true }); if (!ok) return; deletePathway.mutate({pathwayId:item.id},{onSuccess:()=>{toast.success('تم حذف المسار', 'تم حذف مسار «' + item.title + '» نهائياً.');refreshAll();},onError:()=>toast.error('تعذّر حذف المسار', 'حاول مرة أخرى.')});}
  async function removeResource(item:ContentItem){const ok = await confirm({ title: 'تأكيد الحذف', message: `هل تريد حذف «${item.title}» نهائياً؟`, confirmText: 'نعم، احذف', cancelText: 'إلغاء', danger: true }); if (!ok) return; deleteResource.mutate({resourceId:item.id},{onSuccess:()=>{toast.success('تم حذف المحتوى', 'تم حذف «' + item.title + '» نهائياً.');refreshAll();},onError:()=>toast.error('تعذّر حذف المحتوى', 'حاول مرة أخرى.')});}
  if(blocked)return <div className="content-wrap page-space"><PageIntro eyebrow="منطقة الإدارة" title="الوصول مقيّد." description="هذه المساحة متاحة للفريق المخوّل فقط."/><div className="blocked-panel" role="alert" data-testid="admin-forbidden"><ShieldCheck/><div><b>تعذّر التحقق من صلاحية الوصول</b><p>سجّل الدخول بحساب المدير المعتمد للوصول إلى الطلبات والمحتوى.</p><Link href="/sign-in" className="button-primary">الانتقال إلى تسجيل الدخول</Link></div><Button variant="outline" onClick={()=>{summary.refetch();bookings.refetch();pathways.refetch();resources.refetch();}} data-testid="button-admin-retry">إعادة المحاولة</Button></div></div>;
  if(loading)return <div className="content-wrap page-space"><PageIntro eyebrow="منطقة الإدارة" title="لوحة سَنَد"/><LoadingBlock/></div>;
  if(errors.length)return <div className="content-wrap page-space"><PageIntro eyebrow="منطقة الإدارة" title="لوحة سَنَد"/><ErrorBlock retry={()=>{summary.refetch();bookings.refetch();pathways.refetch();resources.refetch();}} label="لم نتمكن من تحميل بيانات الإدارة"/></div>;
  return <div className="content-wrap page-space"><PageIntro eyebrow="مساحة الفريق" title="لوحة سَنَد" description="إدارة طلبات التواصل والمحتوى المنشور."/>
    <div className="admin-metrics">{[['طلبات جديدة',summary.data?.newBookings??0],['كل الطلبات',summary.data?.bookings??0],['مسارات الدعم',summary.data?.pathways??0],['موارد المكتبة',summary.data?.resources??0]].map(([label,value])=><div className="metric-card" key={label}><span>{label}</span><b data-testid={`metric-${label}`}>{value}</b></div>)}</div>
    <div className="admin-tabs" role="tablist">{[['bookings','الطلبات'],['pathways','المسارات'],['resources','المكتبة'],['emergency','الطوارئ']].map(([key,label])=><button key={key} className={tab===key?'admin-tab active':'admin-tab'} onClick={()=>{setTab(key as typeof tab);}} role="tab" aria-selected={tab===key} data-testid={`tab-admin-${key}`}>{label}</button>)}</div>
    {tab==='bookings'&&<section className="admin-section"><div className="admin-section-head"><div><h2>طلبات التواصل</h2><p>بيانات التواصل تظهر هنا للفريق المخوّل فقط.</p></div><Button variant="outline" onClick={()=>bookings.refetch()} data-testid="button-refresh-bookings">تحديث القائمة</Button></div>
      {bookings.data?.length?<div className="booking-list">{bookings.data.map((b:Booking)=><article className="booking-row" key={b.id} data-testid={`row-booking-${b.id}`}><div className="booking-person"><span className="avatar-initial">{b.nickname.slice(0,1)}</span><div><b>{b.nickname}</b><small>{new Date(b.createdAt).toLocaleDateString('ar-YE')}</small></div></div><div className="booking-contact"><span>{b.contactMethod==='email'?'بريد إلكتروني':b.contactMethod==='whatsapp'?'واتساب':'هاتف'}</span><b dir="ltr">{b.contactValue}</b></div><div className="booking-time"><span>الموعد المناسب</span><b>{new Date(b.preferredDate).toLocaleDateString('ar-YE')} · {preferredLabels[b.preferredTime]||b.preferredTime}</b></div><label className="status-select-label"><span>الحالة</span><select value={b.status} onChange={e=>updateStatus.mutate({bookingId:b.id,data:{status:e.target.value as BookingStatus}},{onSuccess:refreshAll})} aria-label={`حالة الطلب ${b.nickname}`} data-testid={`select-booking-status-${b.id}`}>{Object.entries(statusLabels).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label></article>)}</div>:<EmptyBlock title="لا توجد طلبات حالياً"/>}</section>}
    {tab==='pathways'&&<section className="admin-section"><div className="admin-section-head"><div><h2>مسارات الدعم</h2><p>أنشئ المسارات وحدّث محتواها ونشرها.</p></div><Button onClick={()=>setEditPath({id:'',slug:'',title:'',description:'',steps:[],activities:[],published:true})} data-testid="button-new-pathway">مسار جديد</Button></div>{editPath&&<PathwayEditor value={editPath} busy={createPathway.isPending||updatePathway.isPending} onCancel={()=>setEditPath(null)} onSave={savePathway}/>}
      {pathways.data?.length?<div className="manage-list">{pathways.data.map(p=><div className="manage-row" key={p.id} data-testid={`row-pathway-${p.id}`}><div><b>{p.title}</b><small>{p.slug} · {p.published?'منشور':'مسودة'}</small></div><div className="manage-actions"><button onClick={()=>setEditPath(p)} data-testid={`button-edit-pathway-${p.id}`}>تعديل</button><button className="danger-action" onClick={()=>removePathway(p)} data-testid={`button-delete-pathway-${p.id}`}>حذف</button></div></div>)}</div>:<EmptyBlock title="أضف أول مسار"/>}</section>}
    {tab==='emergency'&&<EmergencyAdmin/>}
    {tab==='resources'&&<section className="admin-section"><div className="admin-section-head"><div><h2>محتوى المكتبة</h2><p>مقالات وأدلة ودورات ومحتوى مرئي ومسموع.</p></div><Button onClick={()=>setEditResource({id:'',title:'',summary:'',kind:'article',category:'',body:'',mediaUrl:'',published:true})} data-testid="button-new-resource">محتوى جديد</Button></div>{editResource&&<ResourceEditor value={editResource} busy={createResource.isPending||updateResource.isPending} onCancel={()=>setEditResource(null)} onSave={saveResource}/>}
      {resources.data?.length?<div className="manage-list">{resources.data.map(r=><div className="manage-row" key={r.id} data-testid={`row-resource-${r.id}`}><div><b>{r.title}</b><small>{kindLabels[r.kind]||r.kind} · {r.category} · {r.published?'منشور':'مسودة'}</small></div><div className="manage-actions"><button onClick={()=>setEditResource(r)} data-testid={`button-edit-resource-${r.id}`}>تعديل</button><button className="danger-action" onClick={()=>removeResource(r)} data-testid={`button-delete-resource-${r.id}`}>حذف</button></div></div>)}</div>:<EmptyBlock title="أضف أول محتوى"/>}</section>}
  </div>;
}
