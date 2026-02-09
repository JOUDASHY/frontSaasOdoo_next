"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Subscription {
    id: number;
    plan_name: string;
    plan_price: string;
    status: string;
    start_date: string;
    end_date: string | null;
    auto_renew: boolean;
    billing_cycle: string;
    next_billing_date: string | null;
    is_active_status: boolean;
    total_paid?: string | number;
    amount_due?: string | number;
    plan_allowed_modules?: string[];
}

interface Plan {
    id: number;
    name: string;
    price: string;
    max_users: number;
    storage_limit_gb: number;
    max_instances: number;
    allowed_modules: string[];
}

export default function ClientSubscription() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subRes, plansRes] = await Promise.all([
                api.get("/subscriptions/"),
                api.get("/plans/")
            ]);

            // The API returns a list, find the active or pending one
            const activeSub = subRes.data.find((s: Subscription) => s.status === 'ACTIVE') 
                || subRes.data.find((s: Subscription) => s.status === 'PENDING')
                || subRes.data[0];
            setSubscription(activeSub);
            setPlans(plansRes.data);
        } catch (e) {
            console.error("Failed to fetch subscription data", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Chargement...</div>;

    const currentPlanDetails = plans.find(p => p.name === subscription?.plan_name);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    📋 Mon Abonnement
                </h1>

                {subscription ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Current Plan Card */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-primary/20">
                                <div className="bg-primary p-4 text-white">
                                    <h2 className="text-lg font-bold">Plan Actuel</h2>
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{subscription.plan_name}</h3>
                                            <p className="text-primary font-bold text-xl mt-1">{subscription.plan_price} € <span className="text-sm font-normal text-gray-500">/ {subscription.billing_cycle.toLowerCase()}</span></p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                            subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                                            subscription.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {subscription.status === 'PENDING' ? 'EN ATTENTE DE PAIEMENT' : subscription.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100 dark:border-gray-700">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date de début</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{new Date(subscription.start_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Prochaine facturation</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString() : "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Renouvellement</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{subscription.auto_renew ? "Automatique" : "Manuel"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total payé</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {(Number(subscription.total_paid) || 0).toFixed(2)} €
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Reste à payer</p>
                                            <p className={`font-semibold ${Number(subscription.amount_due) > 0
                                                ? "text-red-600 dark:text-red-400"
                                                : "text-emerald-600 dark:text-emerald-400"
                                            }`}>
                                                {(Number(subscription.amount_due) || 0).toFixed(2)} €
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-4">
                                        {subscription.status === 'PENDING' ? (
                                            <Link href={`/dashboard/payment?subscription=${subscription.id}`} className="flex-1">
                                                <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors">
                                                    💳 Effectuer le Paiement
                                                </button>
                                            </Link>
                                        ) : (
                                            <>
                                                <Link href="/dashboard/plans" className="flex-1">
                                                    <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors">
                                                        Changer de Plan
                                                    </button>
                                                </Link>
                                                <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                                                    Résilier
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Limits / Usage */}
                            {currentPlanDetails && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Inclus dans votre offre</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <span className="text-2xl">👥</span>
                                            <div>
                                                <p className="text-xs text-gray-500">Utilisateurs</p>
                                                <p className="font-bold text-gray-900 dark:text-white">{currentPlanDetails.max_users} max</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <span className="text-2xl">📦</span>
                                            <div>
                                                <p className="text-xs text-gray-500">Stockage</p>
                                                <p className="font-bold text-gray-900 dark:text-white">{currentPlanDetails.storage_limit_gb} GB</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <span className="text-2xl">🚀</span>
                                            <div>
                                                <p className="text-xs text-gray-500">Instances</p>
                                                <p className="font-bold text-gray-900 dark:text-white">{currentPlanDetails.max_instances} max</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <span className="text-2xl">🧩</span>
                                            <div>
                                                <p className="text-xs text-gray-500">Nb. de modules autorisés</p>
                                                <p className="font-bold text-gray-900 dark:text-white">{currentPlanDetails.allowed_modules.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {subscription?.plan_allowed_modules && subscription.plan_allowed_modules.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Liste des modules autorisés</p>
                                            <div className="flex flex-wrap gap-2">
                                                {subscription.plan_allowed_modules.map((m) => (
                                                    <span
                                                        key={m}
                                                        className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                                    >
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar info */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-primary to-primary-light p-6 rounded-2xl shadow-xl text-white">
                                <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
                                <p className="text-sm opacity-90 mb-4">Notre support est disponible 24/7 pour vous accompagner dans la gestion de votre infrastructure Odoo.</p>
                                <button className="w-full bg-white text-primary font-bold py-2 rounded-lg text-sm">Contacter le support</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-gray-500 mb-6">Vous n'avez pas d'abonnement actif pour le moment.</p>
                        <Link href="/dashboard/plans" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all">
                            Découvrir nos offres
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
