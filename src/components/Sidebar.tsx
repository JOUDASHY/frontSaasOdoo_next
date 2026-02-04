"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
    isAdmin?: boolean;
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
    const pathname = usePathname();

    const clientLinks = [
        {
            name: "Tableau de Bord", href: "/dashboard", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            )
        },
        {
            name: "Mes Offres", href: "/dashboard/plans", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            )
        },
        {
            name: "Ma Souscription", href: "/dashboard/subscription", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            )
        },
        {
            name: "Facturation", href: "/dashboard/billing", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            )
        },
    ];

    const adminLinks = [
        {
            name: "Overview", href: "/admin/dashboard", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            )
        },
        {
            name: "Clients", href: "/admin/clients", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )
        },
        {
            name: "Instances Odoo", href: "/admin/instances", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
            )
        },
        {
            name: "Plans & Tarifs", href: "/admin/plans", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            )
        },
        {
            name: "Souscriptions", href: "/admin/subscriptions", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            )
        },
        {
            name: "Paiements", href: "/admin/payments", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            )
        },
    ];

    const links = isAdmin ? adminLinks : clientLinks;

    const linkClass = (href: string) => {
        const isActive = pathname === href;
        return `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "text-slate-500 hover:text-primary hover:bg-primary/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50"
            }`;
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-72 transition-transform -translate-x-full sm:translate-x-0 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <div className="flex flex-col h-full px-6 py-8">
                {/* Logo Area */}
                <div className="flex items-center gap-4 mb-12 px-2">
                    <img
                        src="/syscomad-logo.png"
                        alt="SYSCOMAD"
                        className="h-14 w-auto object-contain"
                    />
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {isAdmin ? "Admin Panel" : "Portail Client"}
                        </span>
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-1">
                    <div>
                        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            Menu Principal
                        </p>
                        <nav className="space-y-1.5">
                            {links.map((link) => (
                                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                                    <div className={`transition-transform duration-300 group-hover:scale-110`}>
                                        {link.icon}
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">{link.name}</span>
                                    {pathname === link.href && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            Préférences
                        </p>
                        <nav className="space-y-1.5">
                            <Link href="/profile" className={linkClass("/profile")}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                <span className="text-sm font-bold tracking-tight">Mon Compte</span>
                            </Link>
                            <Link href="/settings" className={linkClass("/settings")}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span className="text-sm font-bold tracking-tight">Configuration</span>
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Bottom Card */}
                <div className="mt-auto pt-8">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-primary-dark shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors" />
                        <p className="relative z-10 text-white font-black text-sm mb-2">Besoin d'aide ?</p>
                        <p className="relative z-10 text-white/60 text-[10px] leading-relaxed mb-4 font-medium">Nos experts sont à votre disposition 24/7 pour vous accompagner.</p>
                        <Link href="mailto:support@jounaid-saas.com">
                            <Button size="sm" className="w-full bg-white text-primary hover:bg-slate-100 font-black text-[10px] tracking-widest uppercase">
                                Contacter Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}
