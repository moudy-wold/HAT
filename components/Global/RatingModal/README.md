# مودالات التقييم - دليل الاستخدام

تم إنشاء مكونين للتقييم حسب احتياجاتك:

## 1. RatingModal - التقييم المتدرج (خطوة بخطوة)

### المميزات:
- تقييم كل عنصر (وجبة، مطعم، سائق) في خطوة منفصلة
- شريط تقدم يوضح المرحلة الحالية
- تصميم نظيف ومركز
- إمكانية التنقل بين الخطوات (السابق/التالي)
- إمكانية تخطي أي خطوة

### الاستخدام:
```tsx
import RatingModal from "@/app/[locale]/components/Global/RatingModal/RatingModal";

<RatingModal
  locale={locale}
  isOpen={showRatingModal}
  onClose={() => setShowRatingModal(false)}
  orderData={{
    order_id: "ORD-12345",
    meal: { id: "meal_123", name: "برجر لحم" },
    vendor: { id: "vendor_456", name: "مطعم الأصالة" },
    driver: { id: "driver_789", name: "أحمد محمد" }
  }}
/>
```

## 2. QuickRatingModal - التقييم السريع (كل شيء في واجهة واحدة)

### المميزات:
- عرض جميع عناصر التقييم في شاشة واحدة
- تصميم مضغوط وفعال
- أسرع للمستخدمين الذين يريدون إنهاء التقييم بسرعة
- إمكانية تقييم بعض العناصر وتخطي الأخرى

### الاستخدام:
```tsx
import QuickRatingModal from "@/app/[locale]/components/Global/RatingModal/QuickRatingModal";

<QuickRatingModal
  locale={locale}
  isOpen={showQuickRating}
  onClose={() => setShowQuickRating(false)}
  orderData={{
    order_id: "ORD-12345",
    meal: { id: "meal_123", name: "برجر لحم" },
    vendor: { id: "vendor_456", name: "مطعم الأصالة" },
    driver: { id: "driver_789", name: "أحمد محمد" }
  }}
/>
```

## 3. خصائص orderData

```tsx
interface OrderData {
  order_id: string;           // مطلوب - رقم الطلب
  meal?: {                   // اختياري - إذا كان موجود سيظهر تقييم الوجبة
    id: string;
    name: string;
  };
  vendor?: {                 // اختياري - إذا كان موجود سيظهر تقييم المطعم
    id: string;
    name: string;
  };
  driver?: {                 // اختياري - إذا كان موجود سيظهر تقييم السائق
    id: string;
    name: string;
  };
}
```

## 4. API المستخدم

يستخدم كلا المودالين API `Evulation_order` مع المعاملات التالية:

```tsx
await Evulation_order(
  type: string,          // "meal" | "vendor" | "driver"
  rateable_id: string,   // معرف الوجبة/المطعم/السائق
  order_id: string,      // رقم الطلب
  rating: number,        // التقييم من 1-5
  comment?: string       // التعليق (اختياري)
);
```

## 5. المميزات المشتركة

- **متعدد اللغات**: يدعم العربية والإنجليزية والتركية
- **تصميم متجاوب**: يعمل على جميع أحجام الشاشات
- **تجربة مستخدم سلسة**: انيميشن وانتقالات ناعمة
- **معالجة الأخطاء**: رسائل واضحة للمستخدم
- **ألوان النظام**: يستخدم لوحة ألوان المشروع (#fc6011)

## 6. التوصية

- استخدم **RatingModal** إذا كنت تريد تجربة أكثر تفاعلاً وتركيزاً
- استخدم **QuickRatingModal** إذا كنت تريد عملية تقييم سريعة وشاملة

## 7. مثال كامل للتطبيق

```tsx
import { useState } from 'react';
import RatingModal from './RatingModal';

function OrderCompleted({ orderData, locale }) {
  const [showRating, setShowRating] = useState(false);

  return (
    <div>
      <h2>تم تسليم طلبك بنجاح!</h2>
      <button 
        onClick={() => setShowRating(true)}
        className="bg-[#fc6011] text-white px-6 py-3 rounded-lg"
      >
        قيم طلبك
      </button>

      <RatingModal
        locale={locale}
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        orderData={orderData}
      />
    </div>
  );
}
```

## 8. ملاحظات للتطوير

- يمكن تخصيص الألوان بسهولة من خلال ملف التكوين
- يمكن إضافة المزيد من خيارات التخصيص للواجهة
- يمكن إضافة المزيد من أنواع التقييم حسب الحاجة
- المكونات قابلة للاختبار ومعزولة تماماً