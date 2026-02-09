"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ConfirmModal from "@/components/ConfirmModal";

interface Payment {
    id: number;
    subscription: number;
    amount: string;
    payment_date: string;
    method: string;
    status: string;
    transaction_id: string | null;
    subscription_plan: string;
    client_company: string;
}

export default function AdminPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [pendingAction, setPendingAction] = useState<{ id: number; type: "validate" | "reject" } | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            const res = await api.get("/me/");
            if (!res.data.is_staff) {
                router.push("/dashboard");
                return;
            }
            fetchPayments();
        } catch (e) {
            router.push("/login");
        }
    };

    const fetchPayments = async () => {
        try {
            const res = await api.get("/payments/");
            setPayments(res.data);
        } catch (e) {
            console.error("Failed to fetch payments", e);
        } finally {
            setLoading(false);
        }
    };

    const openConfirm = (paymentId: number, type: "validate" | "reject") => {
        if (type === "validate") {
            setConfirmTitle("Valider le paiement");
            setConfirmMessage(
                "Êtes-vous sûr de vouloir valider ce paiement ?\n\n" +
                "L'abonnement associé pourra être activé si le montant total est suffisant."
            );
        } else {
            setConfirmTitle("Rejeter le paiement");
            setConfirmMessage(
                "Êtes-vous sûr de vouloir rejeter ce paiement ?\n\n" +
                "Le client sera considéré comme non payé pour ce montant."
            );
        }
        setPendingAction({ id: paymentId, type });
        setConfirmOpen(true);
    };

    const handleConfirmPayment = async () => {
        if (!pendingAction) return;
        const { id, type } = pendingAction;

        setConfirmLoading(true);
        try {
            const endpoint = type === "validate" ? "validate_payment" : "reject_payment";
            await api.post(`/payments/${id}/${endpoint}/`);
            await fetchPayments();
            setConfirmOpen(false);
            setPendingAction(null);
        } catch (e: any) {
            console.error(`Failed to ${type} payment`, e);
            alert(
                e.response?.data?.detail ||
                `Erreur lors de la ${type === "validate" ? "validation" : "rejection"} du paiement.`
            );
        } finally {
            setConfirmLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Chargement...</div>;

    const pendingPayments = payments.filter(p => p.status === "PENDING");
    const otherPayments = payments.filter(p => p.status !== "PENDING");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        💳 Gestion des Paiements
                    </h1>
                </div>

                {/* Pending Payments Section */}
                {pendingPayments.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            ⏳ Paiements en Attente ({pendingPayments.length})
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Client
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Plan
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Montant
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Méthode
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {pendingPayments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {payment.client_company}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {payment.subscription_plan}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {payment.amount} €
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {payment.method === "MANUAL" ? "Paiement Manuel" : payment.method}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {new Date(payment.payment_date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openConfirm(payment.id, "validate")}
                                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            ✅ Valider
                                                        </button>
                                                        <button
                                                            onClick={() => openConfirm(payment.id, "reject")}
                                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            ❌ Rejeter
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* All Payments Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        📋 Tous les Paiements
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Client
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Plan
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Montant
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Méthode
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Statut
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Transaction ID
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {otherPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                Aucun paiement
                                            </td>
                                        </tr>
                                    ) : (
                                        otherPayments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {payment.client_company}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {payment.subscription_plan}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {payment.amount} €
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {payment.method === "MANUAL" ? "Paiement Manuel" : payment.method}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                                                        payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                        payment.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                                        payment.status === 'REFUNDED' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {new Date(payment.payment_date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {payment.transaction_id || "-"}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal de confirmation pour validation / rejet */}
            <ConfirmModal
                open={confirmOpen}
                title={confirmTitle}
                message={confirmMessage}
                loading={confirmLoading}
                confirmLabel="Confirmer"
                cancelLabel="Annuler"
                onConfirm={handleConfirmPayment}
                onCancel={() => {
                    if (confirmLoading) return;
                    setConfirmOpen(false);
                    setPendingAction(null);
                }}
            />
        </div>
    );
}
