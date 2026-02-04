"use client";

import React from 'react';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    className?: string;
    onRowClick?: (item: T) => void;
}

/**
 * Premium Data Table Component
 * Features: Glassmorphism headers, smooth hover effects, responsive design,
 * and high-contrast dark mode support.
 */
export function DataTable<T extends { id?: string | number }>({
    columns,
    data,
    loading = false,
    emptyMessage = "Aucune donnée trouvée.",
    className = "",
    onRowClick
}: DataTableProps<T>) {
    return (
        <div className={`w-full overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-sm shadow-2xl shadow-slate-200/40 dark:shadow-none ${className}`}>
            <div className="overflow-x-auto relative custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/60">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                                >
                                    <span className="relative inline-block">
                                        {col.header}
                                        <span className="absolute -bottom-1 left-0 w-1/3 h-[2px] bg-primary/30 rounded-full" />
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative w-16 h-16">
                                            <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <div className="absolute inset-2 border-4 border-primary/40 border-b-transparent rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]"></div>
                                        </div>
                                        <p className="mt-6 text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronisation...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-3xl mb-4 grayscale opacity-50">
                                            📁
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">{emptyMessage}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Vérifiez vos filtres ou réessayez plus tard</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((item, rowIndex) => (
                                <tr
                                    key={item.id}
                                    onClick={() => onRowClick?.(item)}
                                    className={`
                                        group transition-all duration-500
                                        ${onRowClick ? 'cursor-pointer' : ''}
                                        hover:bg-slate-50/50 dark:hover:bg-primary/5
                                        animate-in fade-in slide-in-from-bottom-4 duration-700
                                    `}
                                    style={{ animationDelay: `${rowIndex * 50}ms`, animationFillMode: 'both' }}
                                >
                                    {columns.map((col, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={`px-6 py-6 transition-all duration-500 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                                        >
                                            <div className="transition-transform duration-500 group-hover:translate-x-1">
                                                {col.cell ? col.cell(item) : (item[col.accessorKey!] as React.ReactNode)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Table Footer / Info bar */}
            {!loading && data.length > 0 && (
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {data.length} Entrées affichées
                    </span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary/40" />
                        <div className="w-1 h-1 rounded-full bg-primary/20" />
                        <div className="w-1 h-1 rounded-full bg-primary/10" />
                    </div>
                </div>
            )}
        </div>
    );
}
