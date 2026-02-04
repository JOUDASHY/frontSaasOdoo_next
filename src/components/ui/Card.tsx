import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card = ({ children, className = "", onClick }: CardProps) => (
    <div
        onClick={onClick}
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-all duration-300 ${className}`}
    >
        {children}
    </div>
);

export const CardHeader = ({ title, subtitle, icon }: { title: string, subtitle?: string, icon?: React.ReactNode }) => (
    <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-start justify-between">
        <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-2 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{subtitle}</p>}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
    </div>
);

export const CardContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-8 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 ${className}`}>
        {children}
    </div>
);
