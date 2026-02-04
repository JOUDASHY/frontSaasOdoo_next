"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

interface Subscription {
    id: number;
    plan_name: string;
    plan_price: string;
    status: string;
    total_paid?: string | number;
    amount_due?: string | number;
}

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const subscriptionId = searchParams.get("subscription");

    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [stripeLoading, setStripeLoading] = useState(false);

    useEffect(() => {
        if (subscriptionId) {
            fetchSubscription();
        } else {
            // Try to get pending subscription
            fetchPendingSubscription();
        }
    }, [subscriptionId]);

    const fetchSubscription = async () => {
        try {
            const res = await api.get(`/subscriptions/${subscriptionId}/`);
            const sub: Subscription = res.data;
            setSubscription(sub);
            const remaining = Number(sub.amount_due);
            setAmount(
                !isNaN(remaining) && remaining > 0
                    ? remaining.toString()
                    : sub.plan_price
            );
            setLoading(false);
        } catch (e) {
            console.error("Failed to fetch subscription", e);
            setLoading(false);
        }
    };

    const fetchPendingSubscription = async () => {
        try {
            const res = await api.get("/subscriptions/");
            const pendingSub: Subscription | undefined = res.data.find((s: Subscription) => s.status === "PENDING");
            if (pendingSub) {
                setSubscription(pendingSub);
                const remaining = Number(pendingSub.amount_due);
                setAmount(
                    !isNaN(remaining) && remaining > 0
                        ? remaining.toString()
                        : pendingSub.plan_price
                );
            }
            setLoading(false);
        } catch (e) {
            console.error("Failed to fetch subscriptions", e);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subscription || !amount) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        setSubmitting(true);
        try {
            await api.post("/payments/", {
                subscription: subscription.id,
                amount: parseFloat(amount),
                method: "MANUAL",
                status: "PENDING",
            });
            alert("Paiement enregistré ! En attente de validation par l'administrateur.");
            router.push("/dashboard/subscription");
        } catch (e: any) {
            console.error("Payment failed", e);
            alert(e.response?.data?.detail || "Erreur lors de l'enregistrement du paiement. Veuillez réessayer.");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePayWithStripe = async () => {
        if (!subscription || !amount || parseFloat(amount) <= 0) {
            alert("Veuillez saisir un montant valide.");
            return;
        }

        setStripeLoading(true);
        try {
            const res = await api.post("/payments/create-stripe-checkout/", {
                subscription_id: subscription.id,
                amount: parseFloat(amount),
            });
            const url = res.data?.url;
            if (url) {
                window.location.href = url;
                return;
            }
            throw new Error("No redirect URL");
        } catch (e: any) {
            console.error("Stripe checkout failed", e);
            const msg = e.response?.data?.detail || e.response?.data?.url === undefined
                ? "Impossible de créer la session Stripe. Vérifiez la configuration (STRIPE_SECRET_KEY)."
                : "Erreur Stripe. Veuillez réessayer.";
            alert(msg);
        } finally {
            setStripeLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Chargement...</div>;

    if (!subscription) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-gray-500 mb-6">Aucun abonnement en attente de paiement.</p>
                        <button
                            onClick={() => router.push("/dashboard/subscription")}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all"
                        >
                            Retour à l'abonnement
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    💳 Paiement
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="bg-primary p-6 text-white">
                        <h2 className="text-xl font-bold">Plan: {subscription.plan_name}</h2>
                        <p className="text-sm opacity-90 mt-1">Montant à payer selon votre plan</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Montant (€)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="0.00"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Montant suggéré:{" "}
                                {Number(subscription.amount_due) > 0
                                    ? `${Number(subscription.amount_due).toFixed(2)} € (reste à payer)`
                                    : `${subscription.plan_price} €`}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 mb-6">
                            <button
                                type="button"
                                onClick={handlePayWithStripe}
                                disabled={stripeLoading || !amount || parseFloat(amount) <= 0}
                                className="w-full py-4 rounded-xl font-bold bg-[#635bff] hover:bg-[#5046e5] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {stripeLoading ? (
                                    "Redirection vers Stripe..."
                                ) : (
                                    <>
                                        <span>💳</span> Payer avec Stripe
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-500">— ou —</p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                ⚠️ <strong>Paiement manuel:</strong> Enregistrez le montant ci-dessous pour validation par l'administrateur.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !amount}
                                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Enregistrement..." : "Enregistrer (manuel)"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
