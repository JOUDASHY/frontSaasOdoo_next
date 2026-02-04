"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Card, CardContent } from "@/components/ui/Card";

interface Client {
    id: number;
    company_name: string;
    phone: string;
    address: string;
    created_at: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
    active_subscription: {
        plan_name: string;
        status: string;
    } | null;
}

export default function AdminClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
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
            fetchClients();
        } catch (e) {
            router.push("/login");
        }
    };

    const fetchClients = async () => {
        try {
            const res = await api.get("/clients/");
            setClients(res.data);
        } catch (e) {
            console.error("Failed to fetch clients", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Répertoire des <span className="text-primary">Clients</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez vos relations clients et leurs souscriptions.</p>
            </div>

            <DataTable
                data={clients}
                loading={loading}
                emptyMessage="Aucun client n'est encore enregistré."
                columns={[
                    {
                        header: "Société",
                        cell: (client) => (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shadow-inner">
                                    🏢
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{client.company_name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: CLN-{client.id}</p>
                                </div>
                            </div>
                        )
                    },
                    {
                        header: "Utilisateur & Email",
                        cell: (client) => (
                            <div className="flex flex-col">
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{client.user.username}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{client.user.email}</p>
                            </div>
                        )
                    },
                    {
                        header: "Contact",
                        cell: (client) => (
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                📞 {client.phone}
                            </p>
                        )
                    },
                    {
                        header: "Abonnement",
                        cell: (client) => (
                            client.active_subscription ? (
                                <div className="flex flex-col gap-1">
                                    <span className="text-primary dark:text-primary-light font-black text-xs uppercase tracking-tight">{client.active_subscription.plan_name}</span>
                                    <Badge variant="success" className="w-fit text-[8px] py-0 px-1 uppercase font-black">
                                        {client.active_subscription.status}
                                    </Badge>
                                </div>
                            ) : (
                                <Badge variant="error" className="w-fit text-[8px] py-0 px-1 uppercase font-black">
                                    Inactif
                                </Badge>
                            )
                        )
                    },
                    {
                        header: "Depuis le",
                        cell: (client) => (
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                {new Date(client.created_at).toLocaleDateString()}
                            </p>
                        )
                    }
                ]}
            />
        </div>
    );
}
