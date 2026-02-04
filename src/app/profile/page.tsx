"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchUser = useCallback(async () => {
        try {
            const res = await api.get("/me/");
            const userData = res.data;
            setUser(userData);
            localStorage.setItem("user_info", JSON.stringify(userData));
        } catch (e) {
            console.error("Failed to fetch user", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user_info");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setLoading(false);
        }
        fetchUser();
    }, [fetchUser]);

    const handleSave = async () => {
        setSaving(true);
        // Simuler une sauvegarde ou implémenter l'appel API patch /me/
        setTimeout(() => setSaving(false), 1000);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Mon <span className="text-primary italic">Profil</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Gérez vos informations personnelles et préférences de sécurité.
                    </p>
                </div>
                <Badge variant="primary" className="mb-1 py-1 px-4 text-[10px] font-black tracking-widest uppercase">
                    Compte Vérifié
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Avatar & Summary Card */}
                <div className="lg:col-span-1">
                    <Card className="text-center overflow-visible mt-12 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <CardContent className="pt-0 pb-8 px-8">
                            <div className="relative -mt-12 mx-auto w-24 h-24 mb-6 group">
                                <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                                <div className="relative w-24 h-24 bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-950 rounded-full flex items-center justify-center text-4xl font-black text-primary shadow-xl">
                                    {user?.username[0].toUpperCase()}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg shadow-lg flex items-center justify-center text-xs hover:scale-110 transition-transform">
                                    📸
                                </button>
                            </div>

                            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-2">{user?.username}</h2>
                            <p className="text-sm text-slate-500 mb-4 font-medium">{user?.email}</p>

                            <Badge variant={user?.role === 'admin' ? 'primary' : 'success'} className="px-4">
                                {user?.role.toUpperCase()}
                            </Badge>

                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-wider">Membre depuis</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-bold">2026</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-wider">Instances</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-bold">Active</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <Card className="bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <CardHeader
                            title="Informations du Compte"
                            subtitle="Vos coordonnées de facturation et de contact"
                        />
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Nom d'utilisateur</label>
                                    <input
                                        type="text"
                                        readOnly
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-400 cursor-not-allowed font-medium text-sm"
                                        value={user?.username || ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Email Principal</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white text-sm"
                                        defaultValue={user?.email || ""}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Notifications</label>
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        📧
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold dark:text-white">Alertes de Facturation</p>
                                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">Recevoir les factures et reçus par email.</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    isLoading={saving}
                                    className="px-8 font-bold"
                                >
                                    Sauvegarder les changements
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Section */}
                    <div className="mt-8 p-8 bg-rose-50/50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-xl shadow-lg shadow-rose-500/20">
                                🔐
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Sécurité du Compte</h4>
                                <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">Dernière modification du mot de passe: Il y a 3 mois</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="font-bold border-rose-200 text-rose-700 hover:bg-rose-50">
                            Changer le mot de passe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
