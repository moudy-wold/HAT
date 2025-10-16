import { updateTokenToBackend } from "@/api/notifications";
import useStore from "@/store/useStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

// إعداد عرض الإشعارات داخل التطبيق
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// دالة للحصول على التوكن وإرساله للسيرفر
async function getNotificationToken(t: any) {
  try {
    const messagingInstance = getMessaging(getApp());

    // طلب إذن المستخدم
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("تم رفض إذن الإشعارات");
      return;
    }

    // الحصول على توكن FCM
    const fcmToken = await getToken(messagingInstance);
    console.log("FCM Token:", fcmToken);

    // إرسال التوكن للسيرفر
    await updateTokenToBackend(fcmToken);

    // استقبال الإشعارات عندما يكون التطبيق مفتوح
    onMessage(messagingInstance, async (remoteMessage) => {
      console.log("📩 إشعار أثناء تشغيل التطبيق:", remoteMessage);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: t(remoteMessage.notification?.title) || "إشعار جديد",
          body: remoteMessage.notification?.body || "لديك رسالة جديدة",
          sound: "default",
          data: remoteMessage.data,
        },
        trigger: null,
      });
    });
  } catch (error) {
    console.error("❌ خطأ في getNotificationToken:", error);
  }
}

export default function GlobalNotifications(t: any) {
  const router = useRouter();
  const { set_notification_length_context } = useStore();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // دالة للتحقق من حالة تسجيل الدخول من AsyncStorage
  const checkLoginStatus = async () => {
    try {
      const login = await AsyncStorage.getItem("isLogend");

      const isLoggedIn = login === "true";

      // تحديث الحالة فقط إذا تغيرت لتجنب استدعاءات متكررة
      if (isLoggedIn !== isUserLoggedIn) {
        setIsUserLoggedIn(isLoggedIn);

        if (isLoggedIn) {
          console.log("✅ المستخدم سجل الدخول - تفعيل الإشعارات");
          getNotificationToken(t);
        } else {
          console.log("🔒 المستخدم خرج من الحساب - إيقاف الإشعارات");
        }
      }
    } catch (error) {
      console.error("❌ خطأ في قراءة حالة تسجيل الدخول:", error);
    }
  };

  useEffect(() => {
    // التحقق الأولي من حالة تسجيل الدخول
    checkLoginStatus();

    // فحص دوري كل 5 ثوانٍ للتحقق من تغيير حالة تسجيل الدخول
    const interval = setInterval(checkLoginStatus, 5000);

    // التعامل مع النقر على الإشعار
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log("📲 تم النقر على الإشعار:", data);

        if (data?.path) {
          // توجيه المستخدم للصفحة المطلوبة
          (router.push as any)(data.path);
          console.log("🚀 تم التوجيه إلى:", data.path);
        }
      }
    );

    // معالجة الإشعارات في الخلفية - يتم تفعيلها خارج useEffect
    // setBackgroundMessageHandler يجب تفعيلها في أعلى مستوى
    console.log("� تم إعداد نظام الإشعارات");

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [isUserLoggedIn]);

  return <View />;
}
