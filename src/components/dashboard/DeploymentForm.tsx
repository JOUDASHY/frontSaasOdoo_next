import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface DeploymentFormProps {
    onCreate: (name: string) => Promise<any>;
}

export const DeploymentForm = ({ onCreate }: DeploymentFormProps) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setLoading(true);
        setError(null);

        const result = await onCreate(name);
        if (result.success) {
            setName("");
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <Card className="shadow-2xl shadow-slate-200/50 dark:shadow-none border-none bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader
                title="Déploiement Rapide"
                subtitle="Configurez une nouvelle instance Odoo Cloud"
            />
            <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                            Nom de l'espace de travail
                        </label>
                        <div className="flex group relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="nom-domaine"
                                className="flex-1 w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-bold dark:text-white"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 opacity-50">
                                .jounaid.cloud
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-7 rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl shadow-primary/20"
                        isLoading={loading}
                        disabled={!name}
                    >
                        Créer mon Environnement ⚡
                    </Button>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase rounded-xl animate-in shake duration-500">
                            ⚠️ {error}
                        </div>
                    )}
                </form>

                <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold tracking-tight">Provisionnement en moins de 60s</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
