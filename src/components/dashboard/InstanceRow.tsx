import React from 'react';
import { OdooInstance } from '@/hooks/useInstances';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface InstanceRowProps {
    instance: OdooInstance;
    onAction: (id: number, action: string) => void;
}

export const InstanceRow = ({ instance, onAction }: InstanceRowProps) => {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'RUNNING': return 'success';
            case 'STOPPED': return 'neutral';
            case 'ERROR': return 'error';
            case 'DEPLOYING': return 'warning';
            default: return 'info';
        }
    };

    const isDeploying = ['CREATED', 'PROGRESS', 'DEPLOYING'].includes(instance.status);

    return (
        <div className="group p-5 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all border-b border-slate-50 dark:border-slate-800 last:border-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                    <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900`}>
                            {instance.odoo_version === '18.0' ? '🚀' : '🌩️'}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${instance.status === 'RUNNING' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                            instance.status === 'ERROR' ? 'bg-rose-500' :
                                isDeploying ? 'bg-amber-400 animate-pulse' : 'bg-slate-400'
                            }`} />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">
                                {instance.name}
                            </h4>
                            <Badge variant={getStatusVariant(instance.status)} className="text-[9px] py-0 px-2 uppercase tracking-widest font-black">
                                {instance.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Port: <span className="text-primary">{instance.port}</span></span>
                            <span className="opacity-30">•</span>
                            <span>v{instance.odoo_version}</span>
                            <span className="opacity-30">•</span>
                            <span className="text-slate-400">DB: {instance.db_name}</span>
                        </div>
                        {instance.admin_password && (
                            <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                                    🔑 Admin:
                                </span>
                                <code className="text-[10px] font-mono font-bold text-amber-900 dark:text-amber-300 bg-white dark:bg-slate-900 px-2 py-1 rounded">
                                    {instance.admin_password}
                                </code>
                                <button
                                    onClick={() => {
                                        if (instance.admin_password) {
                                            navigator.clipboard.writeText(instance.admin_password);
                                            alert('Mot de passe copié !');
                                        }
                                    }}
                                    className="text-[10px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                                    title="Copier le mot de passe"
                                >
                                    📋
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        {instance.status === 'STOPPED' || instance.status === 'ERROR' ? (
                            <button
                                onClick={() => onAction(instance.id, 'START')}
                                className="p-2 text-emerald-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                                title="Démarrer"
                            >
                                ▶
                            </button>
                        ) : (
                            <button
                                onClick={() => onAction(instance.id, 'STOP')}
                                className="p-2 text-amber-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                                title="Arrêter"
                            >
                                ⏸
                            </button>
                        )}
                        <button
                            onClick={() => onAction(instance.id, 'RESTART')}
                            className="p-2 text-sky-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                            title="Redémarrer"
                        >
                            🔄
                        </button>
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => window.open(`http://localhost:${instance.port}`, '_blank')}
                        className="px-6 font-black tracking-widest text-[10px] uppercase shadow-lg shadow-primary/20"
                    >
                        Accéder ↗
                    </Button>
                </div>
            </div>
        </div>
    );
};
