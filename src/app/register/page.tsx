"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        company_name: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/register/", formData);

            const loginRes = await api.post("/token/", {
                username: formData.username,
                password: formData.password,
            });

            localStorage.setItem("access_token", loginRes.data.access);
            localStorage.setItem("refresh_token", loginRes.data.refresh);

            const meRes = await api.get("/me/");
            localStorage.setItem("user_info", JSON.stringify(meRes.data));

            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            if (err.response?.data) {
                const data = err.response.data;
                const firstError = Object.values(data)[0];
                setError(Array.isArray(firstError) ? firstError[0] : "Erreur lors de l'inscription");
            } else {
                setError("Une erreur est survenue lors de l'inscription.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side: Branding & Info (Matching Login) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center brightness-50"
                    style={{ backgroundImage: "url('/bg-login.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-primary/20" />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <Link href="/" className="flex items-center gap-3 w-fit group">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-extrabold shadow-2xl shadow-primary/50 group-hover:scale-105 transition-transform">
                            J
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white uppercase">
                            SysCOMD <span className="text-primary-light">SaaS</span>
                        </span>
                    </Link>

                    <div className="max-w-md">
                        <div className="w-16 h-1 w-primary bg-primary mb-6" />
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                            L'avenir de la gestion <span className="text-primary-light">d'entreprise</span> commence ici.
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Rejoignez des centaines de leaders qui font confiance à SysCOMD SaaS pour propulser leur croissance avec la puissance d'Odoo.
                        </p>

                        <div className="mt-10 space-y-4">
                            {[
                                "Déploiement instantané",
                                "Infrastructure isolée et sécurisée",
                                "Support premium 24/7",
                                "Évolutivité sans limites"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-slate-500 text-sm font-medium">
                        © 2026 SysCOMD Enterprise Solutions. Tous droits réservés.
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-[#020617]">
                <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-primary/30">
                            J
                        </div>
                        <span className="text-xl font-black tracking-tight dark:text-white uppercase">
                            SysCOMD <span className="text-primary">SaaS</span>
                        </span>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl mb-3">
                            Lancez-vous 🚀
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Créez votre compte et configurez votre premier environnement en quelques secondes.
                        </p>
                    </div>

                    <Card className="shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                        <CardContent className="p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                            Nom d'utilisateur
                                        </label>
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="johndoe"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                            Email Professionnel
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@company.com"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                        Nom de l'Entreprise
                                    </label>
                                    <input
                                        name="company_name"
                                        type="text"
                                        required
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        placeholder="ACME Corp SA"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                        Numéro de Téléphone
                                    </label>
                                    <input
                                        name="phone"
                                        type="text"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+33 6 00 00 00 00"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                        Définir un mot de passe
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white text-sm"
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl animate-in shake duration-500">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    className="w-full py-4 text-base font-bold tracking-wide"
                                >
                                    Créer mon Compte Enterprise
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Vous avez déjà un compte ?{" "}
                        <Link href="/login" className="font-bold text-primary hover:text-primary-light transition-colors underline underline-offset-4 decoration-primary/20">
                            Connectez-vous ici
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
