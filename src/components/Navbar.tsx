"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface UserInfo {
    username: string;
    email: string;
    role: string;
}

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user_info");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_info");
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-30 w-full bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
            <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
                {/* Brand - Hidden on small screens if sidebar is visible, but good here */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                        J
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tighter dark:text-white leading-none">
                            JOUNAID <span className="text-primary italic">SAAS</span>
                        </span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-none mt-1">
                            Enterprise 2026
                        </span>
                    </div>
                </Link>

                {/* Search Placeholder / Status Icons (New) */}
                <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-1.5 w-96 border border-transparent focus-within:border-primary/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <span className="text-slate-400 mr-3 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Rechercher une instance, un client..."
                        className="bg-transparent border-none outline-none text-xs font-medium dark:text-slate-300 w-full"
                    />
                    <span className="text-[10px] font-black text-slate-400 ml-2 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">⌘K</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status Indicators */}
                    <div className="hidden sm:flex items-center gap-2 mr-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Status: Operational" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational</span>
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">
                                    {user.username}
                                </span>
                                <BadgeRole role={user.role} />
                            </div>

                            <button className="relative group">
                                <div className="absolute -inset-1 bg-primary rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
                                <div className="relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-primary/50 transition-colors overflow-hidden">
                                    <span className="text-sm font-black text-primary">
                                        {user?.username ? user.username[0].toUpperCase() : "?"}
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

function BadgeRole({ role }: { role: string }) {
    if (role === 'admin') {
        return (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded-lg uppercase tracking-wider">
                Administrator
            </span>
        );
    }
    return (
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-lg uppercase tracking-wider">
            Client Account
        </span>
    );
}
