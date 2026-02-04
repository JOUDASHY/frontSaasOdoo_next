"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";

interface Subscription {
    id: number;
    client: number;
    plan: number;
    start_date: string;
    end_date: string | null;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
    auto_renew: boolean;
    billing_cycle: 'MONTHLY' | 'YEARLY';
    next_billing_date: string | null;
    client_company: string;
    plan_name: string;
    plan_price: string;
    is_active_status: boolean;
}

interface ClientProfile {
    id: number;
    company_name: string;
    user: {
        username: string;
    }
}

interface Plan {
    id: number;
    name: string;
    price: string;
}

export default function AdminSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null as number | null,
        client: "",
        plan: "",
        end_date: "",
        status: "ACTIVE",
        auto_renew: true,
        billing_cycle: "MONTHLY"
    });
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
            fetchData();
        } catch (e) {
            router.push("/login");
        }
    };

    const fetchData = async () => {
        try {
            const [subRes, clientRes, planRes] = await Promise.all([
                api.get("/subscriptions/"),
                api.get("/clients/"),
                api.get("/plans/")
            ]);
            setSubscriptions(subRes.data);
            setClients(clientRes.data);
            setPlans(planRes.data);
        } catch (e) {
            console.error("Failed to fetch data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/subscriptions/${formData.id}/`, formData);
            } else {
                await api.post("/subscriptions/", formData);
            }
            setShowModal(false);
            fetchData();
            resetForm();
        } catch (e: any) {
            alert("Erreur: " + JSON.stringify(e.response?.data || e.message));
        }
    };

    const openEdit = (sub: Subscription) => {
        setFormData({
            id: sub.id,
            client: sub.client.toString(),
            plan: sub.plan.toString(),
            end_date: sub.end_date || "",
            status: sub.status,
            auto_renew: sub.auto_renew,
            billing_cycle: sub.billing_cycle
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            id: null,
            client: "",
            plan: "",
            end_date: "",
            status: "ACTIVE",
            auto_renew: true,
            billing_cycle: "MONTHLY"
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Gestion des <span className="text-primary">Abonnements</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Supervisez les cycles de facturation et les accès clients.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-primary hover:bg-primary-light text-white font-black py-3 px-8 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 text-xs tracking-widest uppercase"
                >
                    + Nouvel Abonnement
                </Button>
            </div>

            <DataTable
                data={subscriptions}
                loading={loading}
                emptyMessage="Aucun abonnement trouvé."
                columns={[
                    {
                        header: "Client",
                        cell: (sub) => (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shadow-inner">
                                    🏢
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{sub.client_company}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: SUB-{sub.id}</p>
                                </div>
                            </div>
                        )
                    },
                    {
                        header: "Plan & Tarif",
                        cell: (sub) => (
                            <div className="flex flex-col">
                                <span className="text-primary dark:text-primary-light font-black text-xs uppercase tracking-tight">{sub.plan_name}</span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sub.plan_price} € / mois</p>
                            </div>
                        )
                    },
                    {
                        header: "Facturation",
                        cell: (sub) => (
                            <div className="flex flex-col gap-1">
                                <Badge variant="neutral" className="w-fit text-[8px] py-0 px-1 uppercase font-black">
                                    {sub.billing_cycle}
                                </Badge>
                                {sub.auto_renew && (
                                    <span className="text-[9px] text-emerald-500 font-black uppercase tracking-tighter">Auto-Renewal ✓</span>
                                )}
                            </div>
                        )
                    },
                    {
                        header: "Statut",
                        cell: (sub) => (
                            <Badge variant={sub.status === 'ACTIVE' ? 'success' : sub.status === 'SUSPENDED' ? 'warning' : 'error'}>
                                {sub.status}
                            </Badge>
                        )
                    },
                    {
                        header: "Fin d'abonnement",
                        cell: (sub) => (
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : (
                                    <span className="text-emerald-500/60">Illimité</span>
                                )}
                            </p>
                        )
                    },
                    {
                        header: "Actions",
                        align: "right",
                        cell: (sub) => (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEdit(sub)}
                                className="text-[10px] font-black tracking-widest px-4 active:scale-95 transition-transform"
                            >
                                MODIFIER
                            </Button>
                        )
                    }
                ]}
            />

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                            {isEditing ? "Modifier l'Abonnement" : "Nouvel Abonnement"}
                        </h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
                                <select
                                    required
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    disabled={isEditing}
                                >
                                    <option value="">Sélectionner un client</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.company_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan</label>
                                <select
                                    required
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={formData.plan}
                                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                                >
                                    <option value="">Sélectionner un plan</option>
                                    {plans.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.price} €)</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cycle</label>
                                    <select
                                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={formData.billing_cycle}
                                        onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value as any })}
                                    >
                                        <option value="MONTHLY">Mensuel</option>
                                        <option value="YEARLY">Annuel</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                                    <select
                                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                    <option value="PENDING">En attente</option>
                                    <option value="ACTIVE">Actif</option>
                                    <option value="SUSPENDED">Suspendu</option>
                                    <option value="EXPIRED">Expiré</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date d'expiration (End Date)</label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="auto_renew"
                                    checked={formData.auto_renew}
                                    onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                                    className="w-4 h-4 accent-primary"
                                />
                                <label htmlFor="auto_renew" className="text-sm font-medium text-gray-700 dark:text-gray-300">Renouvellement automatique</label>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    {isEditing ? "Enregistrer" : "Créer"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold rounded-xl"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
