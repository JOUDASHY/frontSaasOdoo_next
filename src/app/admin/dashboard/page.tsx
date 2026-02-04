"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";

interface KPI {
    total_clients: number;
    total_instances: number;
    active_plans: number;
    revenue: number;
    growth: string;
    load?: number;
}

export default function AdminDashboard() {
    const [kpi, setKpi] = useState<KPI>({
        total_clients: 0,
        total_instances: 0,
        active_plans: 0,
        revenue: 0,
        growth: "+14.2%",
        load: 24
    });
    const [recentInstances, setRecentInstances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchAdminData = useCallback(async () => {
        try {
            const [instRes, clientRes, plansRes] = await Promise.all([
                api.get("/instances/"),
                api.get("/clients/"),
                api.get("/plans/"),
            ]);

            const instances = instRes.data;
            const clients = clientRes.data;
            const plans = plansRes.data;

            setRecentInstances(instances.slice(0, 6));
            setKpi(prev => ({
                ...prev,
                total_clients: clients.length,
                total_instances: instances.length,
                active_plans: plans.length,
                revenue: instances.length * 49.00
            }));

        } catch (e) {
            console.error("Failed to load admin data", e);
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
                fetchAdminData();
            } catch (e) {
                router.push("/login");
            }
        };
        checkAdmin();
    }, [fetchAdminData, router]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Admin Welcome & Global Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Shield <span className="text-primary italic">Admin</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Centre de contrôle de l'infrastructure SaaS Odoo. Système à jour et sécurisé.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <Badge variant="success" className="py-1 px-4">Cloud Active 🟢</Badge>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                    <span className="text-xs font-black text-slate-400 px-2 tracking-widest uppercase">System Load: {kpi.load}%</span>
                </div>
            </div>

            {/* KPI Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Croissance Clients', value: kpi.total_clients, trend: kpi.growth, color: 'primary', icon: '👥' },
                    { label: 'Environnements Odoo', value: kpi.total_instances, trend: '+3 new', color: 'emerald', icon: '📦' },
                    { label: 'Offres Commerciales', value: kpi.active_plans, trend: 'Stable', color: 'amber', icon: '📝' },
                    { label: 'Prévisionnel MRR', value: `${kpi.revenue.toFixed(0)}€`, trend: '+220€', color: 'rose', icon: '💎' },
                ].map((stat, i) => (
                    <Card key={i} className="group hover:border-primary/30 transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
                                    {stat.icon}
                                </div>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                                    } uppercase tracking-widest`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>

                            {/* Visual Asset (Directly visible Red micro-chart) */}
                            <div className="mt-6 flex items-end gap-1 h-8">
                                {[30, 45, 25, 60, 40, 75, 50].map((h, idx) => (
                                    <div key={idx} className="flex-1 bg-red-600 rounded-t-sm" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Sub-Layout: Activity & Management */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Recent Deployments Table */}
                <div className="lg:col-span-8">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden h-full">
                        <div className="px-8 py-6 flex justify-between items-center bg-white dark:bg-slate-900 relative z-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Activités Récentes</h3>
                                <p className="text-xs text-slate-500 font-medium">Derniers déploiements d'instances client</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/instances')}>Voir Tout ↗</Button>
                        </div>
                        <CardContent className="p-0">
                            <DataTable
                                data={recentInstances}
                                loading={loading}
                                className="border-none shadow-none bg-transparent rounded-none"
                                columns={[
                                    {
                                        header: "Client & Instance",
                                        cell: (inst) => (
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{inst.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{inst.client_company}</span>
                                            </div>
                                        )
                                    },
                                    {
                                        header: "Version",
                                        cell: (inst) => (
                                            <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                Odoo v{inst.odoo_version}
                                            </span>
                                        )
                                    },
                                    {
                                        header: "État",
                                        cell: (inst) => (
                                            <Badge variant={inst.status === 'RUNNING' ? 'success' : 'warning'}>
                                                {inst.status}
                                            </Badge>
                                        )
                                    },
                                    {
                                        header: "Action",
                                        align: "right",
                                        cell: (inst) => (
                                            <Button variant="outline" size="sm" onClick={() => router.push('/admin/instances')} className="text-[10px] font-black tracking-widest px-4 active:scale-95 transition-transform">
                                                MONITOR
                                            </Button>
                                        )
                                    }
                                ]}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* System Tasks & Health */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Server Health Card */}
                    <Card className="bg-slate-900 border-none shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm pointer-events-none">
                            <div className="w-20 h-20 bg-primary rounded-full animate-pulse" />
                        </div>
                        <CardContent className="p-8 space-y-6 relative z-10">
                            <h4 className="text-white font-black text-lg tracking-tight">Santé Infrastructure</h4>

                            <div className="space-y-4">
                                {[
                                    { label: 'CPU Usage', val: 12 },
                                    { label: 'RAM Usage', val: 38 },
                                    { label: 'Storage', val: 64 },
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>{item.label}</span>
                                            <span className="text-white">{item.val}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${item.val > 70 ? 'bg-rose-500' : item.val > 40 ? 'bg-amber-500' : 'bg-primary'
                                                    }`}
                                                style={{ width: `${item.val}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-[10px] tracking-widest uppercase">
                                Diagnostic Complet
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pending Tasks */}
                    <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
                        <CardContent className="p-8">
                            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-[10px]">Actions en attente</h4>
                            <div className="space-y-4">
                                {[
                                    { msg: 'Mise à jour v18 disponible', icon: '🚀', time: 'Il y a 2h' },
                                    { msg: '3 nouvelles demandes support', icon: '🎫', time: 'Il y a 5h' },
                                    { msg: 'Renouvellement SSL SSL', icon: '🔐', time: 'Demain' },
                                ].map((task, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                                            {task.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{task.msg}</p>
                                            <p className="text-[10px] text-slate-500 font-bold">{task.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
