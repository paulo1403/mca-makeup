"use client";
import { useEffect, useState } from "react";

export default function PushSubscribe() {
  const [supported, setSupported] = useState(false);
  const [checkedSupport, setCheckedSupport] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const isSupported = "serviceWorker" in navigator && "PushManager" in window;
    setSupported(isSupported);

    // Check if already subscribed
    (async () => {
      if (isSupported) {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          const sub = reg ? await reg.pushManager.getSubscription() : null;
          setSubscribed(Boolean(sub));
        } catch (e) {
          console.error("Error checking subscription", e);
        }
      }
      setCheckedSupport(true);
    })();
  }, []);

  const registerAndSubscribe = async () => {
    try {
      console.log("aea");
      const reg = await navigator.serviceWorker.register("/sw.js");
      const vapidRes = await fetch("/api/push/public-key");
      const { publicKey } = await vapidRes.json();

      const converted = urlBase64ToUint8Array(publicKey);
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: converted,
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setSubscribed(true);
    } catch (err) {
      console.error("Subscription failed", err);
    }
  };

  // Debug: try to register SW and report result
  const debugRegisterSW = async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      alert("Service worker registrado: " + (reg?.scope || "ok"));
    } catch (err) {
      alert(
        "Error registrando service worker: " + (err as any)?.message ||
          String(err)
      );
      console.error(err);
    }
  };

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // While we are checking support, don't show anything
  if (!checkedSupport) return null;

  // Show an informative message if push is not supported in this browser
  if (!supported) {
    return (
      <div className="text-xs text-gray-500">
        Notificaciones push no soportadas en este navegador
      </div>
    );
  }

  return (
    <div>
      {subscribed ? (
        <p className="text-sm text-black">Suscrito a notificaciones push</p>
      ) : (
        <button
          onClick={registerAndSubscribe}
          className="btn text-black text-sm"
        >
          Activar notificaciones push
        </button>
      )}

      <div className="mt-2">
        <button
          onClick={debugRegisterSW}
          className="text-xs text-gray-500 underline"
        >
          Probar registro de Service Worker
        </button>
      </div>
    </div>
  );
}
