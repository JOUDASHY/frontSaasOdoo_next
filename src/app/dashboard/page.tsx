"use client";

import { useEffect, useState } from "react";
import { useInstances } from "@/hooks/useInstances";
import { usePlans } from "@/hooks/usePlans";
import { Card, CardContent } from "@/components/ui/Card";
import { PlanCard } from "@/components/dashboard/PlanCard";
import { DeploymentForm } from "@/components/dashboard/DeploymentForm";
import { InstanceRow } from "@/components/dashboard/InstanceRow";
import { Button } from "@/components/ui/Button";

export default function Dashboard() {
    const {
        instances,
        loading: loadingInstances,
        fetchInstances,
        performAction,
        createInstance
    } = useInstances();

    const {
        plans,
        loading: loadingPlans,
        fetchPlans
    } = usePlans();

    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user_info");
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
        }

        fetchInstances();
        fetchPlans();

        const interval = setInterval(fetchInstances, 5000);
        return () => clearInterval(interval);
    }, [fetchInstances, fetchPlans]);

    const handleInstanceAction = async (id: number, action: string) => {
        const result = await performAction(id, action);
        if (!result.success) {
            alert(result.error);
        }
    };

    const stats = {
        running: instances.filter(i => i.status === 'RUNNING').length,
        deploying: instances.filter(i => ['CREATED', 'PROGRESS', 'DEPLOYING'].includes(i.status)).length,
        total: instances.length
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Top Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-subtle-pulse" />
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-primary-dark/20 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            Bonjour, <span className="text-primary-light italic">{userInfo?.username || "Cher Client"}</span> 
                        </h1>
                        <p className="text-slate-400 text-lg font-medium max-w-xl">
                            Heureux de vous revoir. Votre infrastructure Odoo est stable et {stats.running > 0 ? "opérationnelle" : "prête à être lancée"}.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl min-w-[120px] text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Instances</p>
                            <p className="text-3xl font-black text-white">{stats.total}</p>
                        </div>
                        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 p-5 rounded-2xl min-w-[120px] text-center">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">En Ligne</p>
                            <p className="text-3xl font-black text-emerald-500">{stats.running}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Mes Instances Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
                                Mes Instances <span className="ml-3 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">{instances.length}</span>
                            </h2>
                            <Button variant="ghost" size="sm" onClick={() => fetchInstances()} className="text-[10px] font-black tracking-widest uppercase">
                                Rafraîchir 🔄
                            </Button>
                        </div>

                        <Card className="shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-none overflow-hidden">
                            <CardContent className="p-0">
                                {loadingInstances && instances.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold animate-pulse text-sm">Initialisation des services...</p>
                                    </div>
                                ) : instances.length === 0 ? (
                                    <div className="p-16 text-center space-y-6">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner text-4xl">
                                            🌩️
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Aucune instance active</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto font-medium">
                                                Propulsez votre entreprise en déployant votre première structure Odoo maintenant.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {instances.map((inst) => (
                                            <InstanceRow
                                                key={inst.id}
                                                instance={inst}
                                                onAction={handleInstanceAction}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Plans Selection Section */}
                    <section>
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Nos Offres Cloud</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Choisissez un plan adapté à votre croissance.</p>
                        </div>

                        {loadingPlans ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {plans.map(plan => (
                                    <PlanCard key={plan.id} plan={plan} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-10">
                    <DeploymentForm onCreate={createInstance} />

                    {/* Quick Stats/Tip Card */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-none shadow-xl">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-primary/20">
                                    💡
                                </div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Conseil Pro</span>
                            </div>
                            <h4 className="text-lg font-black text-white tracking-tight">Maximisez vos performances</h4>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                Utilisez des instances séparées pour vos environnements de test et de production afin de garantir une stabilité maximale.
                            </p>
                            <Button variant="outline" size="sm" className="w-full mt-4 border-slate-700 text-white hover:bg-slate-700 font-bold">
                                En savoir plus ↗
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Support Card */}
                    <Card className="bg-emerald-500/5 border border-emerald-500/10 shadow-none">
                        <CardContent className="p-8 text-center space-y-4">
                            <h4 className="font-black text-slate-800 dark:text-white">Besoin d'aide technique ?</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                                Nos ingénieurs sont disponibles pour vous aider dans votre configuration.
                            </p>
                            <Button className="w-full bg-slate-900 dark:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest">
                                Ouvrir un ticket 💬
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
