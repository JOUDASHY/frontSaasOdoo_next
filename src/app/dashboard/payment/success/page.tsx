"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!sessionId) {
            router.replace("/dashboard/subscription");
            return;
        }
        const t = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) {
                    clearInterval(t);
                    router.replace("/dashboard/subscription");
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [sessionId, router]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-700">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Paiement réussi
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Votre abonnement a été activé. Redirection vers votre espace...
                </p>
                <p className="text-sm text-gray-500">
                    Redirection dans {countdown} seconde{countdown !== 1 ? "s" : ""}.
                </p>
                <button
                    onClick={() => router.replace("/dashboard/subscription")}
                    className="mt-6 text-primary font-bold hover:underline"
                >
                    Aller à mon abonnement
                </button>
            </div>
        </div>
    );
}
