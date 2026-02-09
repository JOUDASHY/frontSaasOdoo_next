"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/token/", { username, password });
            const data = res.data;

            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            const meRes = await api.get("/me/");
            const userData = meRes.data;
            localStorage.setItem("user_info", JSON.stringify(userData));

            if (userData.is_staff) {
                router.push("/admin/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                setError("Identifiants incorrects. Veuillez réessayer.");
            } else {
                setError("Une erreur est survenue lors de la connexion.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("DEBUG: Google Token Response:", tokenResponse);
            // Nettoyage préventif
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            setLoading(true);
            setError("");
            try {
                console.log("DEBUG: Sending to Backend: http://localhost:8000/api/auth/google/");
                const res = await api.post("/auth/google/", {
                    access_token: tokenResponse.access_token
                });

                console.log("DEBUG: Backend Response:", res.data);
                const data = res.data;
                localStorage.setItem("access_token", data.access_token || data.access);
                localStorage.setItem("refresh_token", data.refresh_token || data.refresh);

                const meRes = await api.get("/me/");
                const userData = meRes.data;
                console.log("DEBUG: User Data:", userData);
                localStorage.setItem("user_info", JSON.stringify(userData));

                if (userData.is_staff) {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/dashboard");
                }
            } catch (err: any) {
                console.error("DEBUG: Backend Error Details:", err.response?.data || err.message);
                const errorMsg = JSON.stringify(err.response?.data) || err.message;
                alert("ERREUR BACKEND: " + errorMsg);
                setError("La connexion avec Google a échoué: " + errorMsg);
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error("DEBUG: Google OAuth Error:", error);
            alert("ERREUR GOOGLE: " + JSON.stringify(error));
            setError("Erreur lors de l'authentification Google.");
        }
    });

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
                        <Image
                            src="/syscomad-logo.png"
                            alt="SYSCOMAD"
                            width={180}
                            height={48}
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="max-w-md">
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 mt-auto">
                            Propulsez votre entreprise avec le meilleur de <span className="text-primary-light">Odoo</span>.
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Solutions SaaS Cloud haute performance pour une gestion d'entreprise sans limites.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
                        <span>© 2026 SysCOMD SaaS</span>
                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                        <span>Support Prioritaire</span>
                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                        <span>Enterprise Ready</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-[#020617]">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <Image
                            src="/syscomad-logo.png"
                            alt="SYSCOMAD"
                            width={160}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl mb-3">
                            Bon retour ! 
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Accédez à votre espace sécurisé et gérez vos instances.
                        </p>
                    </div>

                    <Card className="shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                        <CardContent className="p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Nom d'utilisateur
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="votre_nom"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white text-sm"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                            Mot de passe
                                        </label>
                                        <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-light transition-colors">
                                            Oublié ?
                                        </Link>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                    Se connecter au Portail
                                </Button>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white dark:bg-[#020617] px-4 text-slate-500 font-bold">Ou continuer avec</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleGoogleLogin()}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold text-slate-700 dark:text-white text-sm shadow-sm"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Se connecter avec Google
                                </button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Pas encore membre ?{" "}
                        <Link href="/register" className="font-bold text-primary hover:text-primary-light transition-colors underline underline-offset-4 decoration-primary/20">
                            Créez votre compte maintenant
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
