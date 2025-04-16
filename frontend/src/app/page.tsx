'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-2xl font-semibold mb-2">You are being redirected...</h1>
      <p className="text-lg text-muted-foreground">Greetings from the CyberScope team 👋</p>
      <span>CyberScope uses the IP2Location LITE database for <a href="https://lite.ip2location.com">IP geolocation</a>.</span>
    </div>
  );
}