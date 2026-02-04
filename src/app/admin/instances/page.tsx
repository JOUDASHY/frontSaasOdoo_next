"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";

interface OdooInstance {
    id: number;
    name: string;
    client_company: string;
    subscription_plan: string;
    domain: string;
    port: number;
    status: string;
    status_display: string;
    db_name: string;
    odoo_version: string;
    created_at: string;
}

export default function AdminInstances() {
    const [instances, setInstances] = useState<OdooInstance[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const router = useRouter();

    const fetchInstances = useCallback(async () => {
        try {
            const res = await api.get("/instances/");
            setInstances(res.data);
        } catch (e) {
            console.error("Failed to fetch instances", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await api.get("/me/");
                if (!res.data.is_staff) {
                    router.push("/dashboard");
                    return;
                }
                fetchInstances();
            } catch (e) {
                router.push("/login");
            }
        };
        checkAdmin();
    }, [fetchInstances, router]);

    const handleAction = async (id: number, action: string) => {
        const confirmMsg = action === 'DELETE'
            ? "Êtes-vous sûr de vouloir supprimer cette instance ? Cette action est irréversible."
            : `Voulez-vous vraiment ${action.toLowerCase()} cette instance ?`;

        if (!confirm(confirmMsg)) return;

        setActionLoading(id);
        try {
            const endpoint = action.toLowerCase() === 'delete' ? 'remove' : action.toLowerCase();
            await api.post(`/instances/${id}/${endpoint}/`);
            await fetchInstances();
        } catch (e: any) {
            console.error(`Action ${action} failed`, e);
            alert(`Erreur lors de l'action ${action}: ${e.response?.data?.error || "Une erreur est survenue"}`);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'RUNNING': return 'success';
            case 'STOPPED': return 'neutral';
            case 'ERROR': return 'error';
            case 'DEPLOYING': return 'warning';
            default: return 'info';
        }
    };

    const filteredInstances = instances.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.client_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.db_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Gestion des <span className="text-primary">Instances</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Supervision globale de l'infrastructure Odoo.</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 group-focus-within:text-primary transition-colors">🔍</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Filtrer par nom, client ou DB..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total', value: instances.length, icon: '🌩️', color: 'slate' },
                    { label: 'En ligne', value: instances.filter(i => i.status === 'RUNNING').length, icon: '✅', color: 'emerald' },
                    { label: 'En cours', value: instances.filter(i => ['CREATED', 'DEPLOYING'].includes(i.status)).length, icon: '⏳', color: 'amber' },
                    { label: 'Erreurs', value: instances.filter(i => i.status === 'ERROR').length, icon: '🛑', color: 'rose' },
                ].map((stat, i) => (
                    <Card key={i} className="hover:border-primary/20 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-black dark:text-white leading-none">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100 dark:border-slate-800`}>
                                {stat.icon}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Table */}
            <DataTable
                data={filteredInstances}
                loading={loading}
                emptyMessage="Aucun résultat ne correspond à votre recherche."
                columns={[
                    {
                        header: "Instance & Version",
                        cell: (inst: OdooInstance) => (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-sm border border-primary/20">
                                    v{inst.odoo_version}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">{inst.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-tighter">ID: {inst.id} • DB: {inst.db_name}</p>
                                </div>
                            </div>
                        )
                    },
                    {
                        header: "Client & Plan",
                        cell: (inst: OdooInstance) => (
                            <div className="flex flex-col gap-1.5">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{inst.client_company}</p>
                                <Badge variant="primary" className="w-fit text-[9px] py-0 px-2 uppercase tracking-widest font-black">
                                    {inst.subscription_plan}
                                </Badge>
                            </div>
                        )
                    },
                    {
                        header: "Infrastructure",
                        cell: (inst: OdooInstance) => (
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-black text-primary/70 dark:text-primary-light/70 flex items-center gap-2 font-mono">
                                    <span className="opacity-50">http://</span>{inst.domain}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-2 uppercase tracking-widest">
                                    Port: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-black">{inst.port}</span>
                                </p>
                            </div>
                        )
                    },
                    {
                        header: "État",
                        cell: (inst: OdooInstance) => (
                            <Badge variant={getStatusVariant(inst.status)}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 inline-block ${inst.status === 'RUNNING' ? 'bg-emerald-500' :
                                    inst.status === 'ERROR' ? 'bg-rose-500' : 'bg-current animate-pulse'
                                    }`} />
                                {inst.status_display}
                            </Badge>
                        )
                    },
                    {
                        header: "Actions",
                        align: "right",
                        cell: (inst: OdooInstance) => (
                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); window.open(`http://localhost:${inst.port}`, '_blank'); }}
                                    className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    🌐
                                </Button>
                                <div className="relative group/actions">
                                    <Button variant="outline" size="sm" className="h-9 py-0 font-black text-[10px] tracking-widest hover:border-primary/50 transition-colors">
                                        ACTIONS
                                    </Button>
                                    <div className="absolute right-0 top-full mt-1 hidden group-hover/actions:block z-50 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 py-2 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden before:content-[''] before:absolute before:inset-x-0 before:bottom-full before:h-2 before:bg-transparent">
                                        <button onClick={(e) => { e.stopPropagation(); handleAction(inst.id, 'START'); }} className="w-full text-left px-5 py-2.5 text-[10px] uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 font-black transition-colors">▶ Démarrer</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleAction(inst.id, 'STOP'); }} className="w-full text-left px-5 py-2.5 text-[10px] uppercase tracking-widest text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-black transition-colors">⏸ Arrêter</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleAction(inst.id, 'RESTART'); }} className="w-full text-left px-5 py-2.5 text-[10px] uppercase tracking-widest text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 font-black transition-colors">🔄 Redémarrer</button>
                                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                                        <button onClick={(e) => { e.stopPropagation(); handleAction(inst.id, 'DELETE'); }} className="w-full text-left px-5 py-2.5 text-[10px] uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-black transition-colors">🗑️ Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]}
            />
        </div>
    );
}
