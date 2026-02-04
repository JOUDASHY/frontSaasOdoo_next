"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";

interface Plan {
    id?: number;
    name: string;
    price: string | number;
    max_users: number;
    storage_limit_gb: number;
    max_instances: number;
    allowed_modules: string[];
    is_active: boolean;
    created_at?: string;
}

export default function AdminPlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<Plan>({
        name: "",
        price: "0.00",
        max_users: 1,
        storage_limit_gb: 10,
        max_instances: 1,
        allowed_modules: [],
        is_active: true
    });
    const [showModal, setShowModal] = useState(false);
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
            fetchPlans();
        } catch (e) {
            console.error(e);
            router.push("/login");
        }
    };

    const fetchPlans = async () => {
        try {
            const res = await api.get("/plans/");
            setPlans(res.data);
        } catch (e) {
            console.error("Failed to fetch plans", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing
            ? `/plans/${currentPlan.id}/`
            : "/plans/";

        try {
            const res = isEditing
                ? await api.put(url, currentPlan)
                : await api.post(url, currentPlan);

            if (res.status === 200 || res.status === 201) {
                setShowModal(false);
                fetchPlans();
                resetForm();
            }
        } catch (e: any) {
            console.error("Save error", e);
            alert("Erreur lors de l'enregistrement: " + JSON.stringify(e.response?.data || e.message));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce plan ?")) return;

        try {
            await api.delete(`/plans/${id}/`);
            fetchPlans();
        } catch (e) {
            console.error("Delete error", e);
        }
    };

    const resetForm = () => {
        setCurrentPlan({
            name: "",
            price: "0.00",
            max_users: 1,
            storage_limit_gb: 10,
            max_instances: 1,
            allowed_modules: [],
            is_active: true
        });
        setIsEditing(false);
    };

    const openEdit = (plan: Plan) => {
        setCurrentPlan(plan);
        setIsEditing(true);
        setShowModal(true);
    };

    const toggleModule = (module: string) => {
        const modules = [...currentPlan.allowed_modules];
        if (modules.includes(module)) {
            setCurrentPlan({ ...currentPlan, allowed_modules: modules.filter(m => m !== module) });
        } else {
            setCurrentPlan({ ...currentPlan, allowed_modules: [...modules, module] });
        }
    };

    const availableModules = [
        "base", "web", "mail", "contacts", "calendar", "crm", "sale", "purchase",
        "stock", "account", "project", "hr", "helpdesk", "website", "mass_mailing",
        "documents", "sign", "voip", "knowledge", "studio"
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Gestion des <span className="text-primary">Plans</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Configurez vos offres commerciales et leurs limites techniques.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-primary hover:bg-primary-light text-white font-black py-3 px-8 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 text-xs tracking-widest uppercase"
                >
                    + Nouveau Plan
                </Button>
            </div>

            <DataTable
                data={plans}
                loading={loading}
                emptyMessage="Aucun plan configuré pour le moment."
                columns={[
                    {
                        header: "Offre",
                        cell: (plan: Plan) => (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shadow-inner">
                                    💎
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{plan.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: PLN-{plan.id}</p>
                                </div>
                            </div>
                        )
                    },
                    {
                        header: "Tarif Mensuel",
                        cell: (plan: Plan) => (
                            <p className="text-xl font-black text-primary dark:text-primary-light">
                                {plan.price} €
                            </p>
                        )
                    },
                    {
                        header: "Spécifications",
                        cell: (plan: Plan) => (
                            <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                <span>👤 {plan.max_users} Utilisateurs</span>
                                <span>Box {plan.storage_limit_gb} GB Stockage</span>
                                <span>🚀 {plan.max_instances} Instances</span>
                            </div>
                        )
                    },
                    {
                        header: "Modules",
                        cell: (plan: Plan) => (
                            <Badge variant="neutral" className="w-fit text-[8px] py-0 px-2 uppercase font-black">
                                {plan.allowed_modules.length} Modules inclus
                            </Badge>
                        )
                    },
                    {
                        header: "État",
                        cell: (plan: Plan) => (
                            <Badge variant={plan.is_active ? 'success' : 'error'}>
                                {plan.is_active ? 'Actif' : 'Inactif'}
                            </Badge>
                        )
                    },
                    {
                        header: "Actions",
                        align: "right",
                        cell: (plan: Plan) => (
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEdit(plan)}
                                    className="text-[10px] font-black tracking-widest px-4 active:scale-95"
                                >
                                    EDIT
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(plan.id!)}
                                    className="text-[10px] font-black tracking-widest px-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                >
                                    🗑️
                                </Button>
                            </div>
                        )
                    }
                ]}
            />

            {/* CRUD Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSave} className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {isEditing ? "Modifier le Plan" : "Nouveau Plan"}
                                </h2>
                                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">&times;</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du Plan</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={currentPlan.name}
                                        onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix Mensuel (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={currentPlan.price}
                                        onChange={(e) => setCurrentPlan({ ...currentPlan, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Utilisateurs</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={currentPlan.max_users}
                                        onChange={(e) => setCurrentPlan({ ...currentPlan, max_users: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stockage (GB)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={currentPlan.storage_limit_gb}
                                        onChange={(e) => setCurrentPlan({ ...currentPlan, storage_limit_gb: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instances Max</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={currentPlan.max_instances}
                                        onChange={(e) => setCurrentPlan({ ...currentPlan, max_instances: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modules Autorisés</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableModules.map(module => (
                                        <button
                                            key={module}
                                            type="button"
                                            onClick={() => toggleModule(module)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${currentPlan.allowed_modules.includes(module)
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {module}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-8">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={currentPlan.is_active}
                                    onChange={(e) => setCurrentPlan({ ...currentPlan, is_active: e.target.checked })}
                                    className="w-5 h-5 accent-primary"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan Actif</label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all"
                                >
                                    {isEditing ? "Mettre à jour" : "Créer le Plan"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold py-3 rounded-xl transition-colors"
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
