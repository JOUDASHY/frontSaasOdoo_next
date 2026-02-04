import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plan } from '@/hooks/usePlans';

export const PlanCard = ({ plan, onSelect }: { plan: Plan, onSelect?: (id: number) => void }) => (
    <Card className="group relative overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[420px] flex flex-col">
        {plan.name.toLowerCase().includes('enterprise') && (
            <div className="absolute top-0 right-0 p-4">
                <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-primary/30 animate-pulse">
                    Populaire
                </span>
            </div>
        )}

        <CardContent className="p-8 flex flex-col flex-1">
            <div className="mb-8">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 group-hover:text-primary transition-colors">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{plan.price}€</span>
                    <span className="text-slate-500 font-bold text-sm tracking-tight">/ mois</span>
                </div>
            </div>

            <div className="space-y-4 mb-10 flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-2">Inclus dans l'offre</p>
                <div className="space-y-3">
                    <FeatureItem label={`Jusqu'à ${plan.max_users} utilisateurs`} />
                    <FeatureItem label={`${plan.storage_limit_gb} Go de stockage SSD`} />
                    <FeatureItem label={`${plan.max_instances} instance${plan.max_instances > 1 ? 's' : ''} Odoo Cloud`} />
                    <FeatureItem label="Support prioritaire 24/7" />
                </div>
            </div>

            <Button
                variant={plan.name.toLowerCase().includes('enterprise') ? 'primary' : 'outline'}
                className="w-full py-6 font-black tracking-widest uppercase text-xs active:scale-95 group-hover:shadow-lg transition-all"
            >
                Sélectionner
            </Button>
        </CardContent>
    </Card>
);

const FeatureItem = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <svg className="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 tracking-tight">{label}</span>
    </div>
);
