"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/password-reset/", { email });
            setSuccess(true);
        } catch (err: any) {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side: Branding & Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center brightness-50"
                    style={{ backgroundImage: "url('/bg-login.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-primary/20" />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-extrabold shadow-2xl shadow-primary/50">
                            J
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white uppercase">
                            SysCOMD <span className="text-primary-light">SaaS</span>
                        </span>
                    </div>

                    <div className="max-w-md">
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 mt-auto">
                            Récupération de compte sécurisée
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Nous vous enverrons un lien de réinitialisation par email.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
                        <span>© 2026 SysCOMD SaaS</span>
                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                        <span>Support Prioritaire</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-[#020617]">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-primary/30">
                            J
                        </div>
                        <span className="text-xl font-black tracking-tight dark:text-white uppercase transition-colors">
                            SysCOMD <span className="text-primary">SaaS</span>
                        </span>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl mb-3">
                            Mot de passe oublié ? 🔐
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Entrez votre email pour recevoir un lien de réinitialisation.
                        </p>
                    </div>

                    <Card className="shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                        <CardContent className="p-8">
                            {success ? (
                                <div className="space-y-6 text-center">
                                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto">
                                        <span className="text-3xl">✉️</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                            Email envoyé !
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
                                            Vérifiez également vos spams.
                                        </p>
                                    </div>
                                    <Link href="/login">
                                        <Button className="w-full">
                                            Retour à la connexion
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Adresse email
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white text-sm"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl">
                                            ⚠️ {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        isLoading={loading}
                                        className="w-full py-4 text-base font-bold tracking-wide"
                                    >
                                        Envoyer le lien de réinitialisation
                                    </Button>

                                    <div className="text-center">
                                        <Link
                                            href="/login"
                                            className="text-sm font-bold text-primary hover:text-primary-light transition-colors"
                                        >
                                            ← Retour à la connexion
                                        </Link>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
