"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Minimal Navbar for Landing */}
      <nav className="fixed top-0 w-full z-50 px-8 h-20 flex items-center justify-between backdrop-blur-md border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <img
            src="/syscomad-logo.png"
            alt="SYSCOMAD"
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-400">
          <a href="#features" className="hover:text-primary transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Tarification</a>
          <a href="https://odoo.com" target="_blank" className="hover:text-primary transition-colors">Infrastructure</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors pr-4 border-r border-slate-200 dark:border-slate-800">
            Connexion
          </Link>
          <Link href="/register">
            <Button size="sm" className="font-bold">
              Essai Gratuit
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-8 overflow-hidden">
          {/* Abstract Background Decor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-subtle-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-dark/10 rounded-full blur-[100px] animate-subtle-pulse delay-700" />
          </div>

          <div className="max-w-6xl mx-auto text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                🚀 SYSCOMAD Enterprise 2026
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Simplifiez <span className="text-primary italic">Odoo</span>,<br />
                boostez votre <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Croissance</span>.
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium">
                Déployez, gérez et scalez vos environnements Odoo sur une infrastructure Cloud haute disponibilité. Sécurité maximale, latence minimale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button size="lg" className="px-10 h-16 text-lg font-bold shadow-2xl shadow-primary/30 active:scale-95">
                    Lancer mon Odoo 🚀
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-10 h-16 text-lg font-bold">
                  Voir la Démo
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 grayscale opacity-50">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Trusted in Odoo v16, v17, v18</span>
              </div>
            </div>

            {/* Hero Image/Mockup */}
            <div className="flex-1 animate-in fade-in zoom-in-95 duration-1000 delay-300">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl transform lg:rotate-2 group-hover:rotate-0 transition-transform duration-700">
                  {/* Mockup Dashboard Content */}
                  <div className="aspect-video bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden flex flex-col">
                    <div className="h-8 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-1.5 grayscale">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-primary/5 rounded-xl border border-primary/10 animate-pulse" />
                        <div className="h-24 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
                      </div>
                      <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / Social Proof */}
        <section className="py-20 bg-white/50 dark:bg-slate-950/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest">
              <div className="hover:text-primary transition-colors">⚡ Ultra Fast</div>
              <div className="hover:text-primary transition-colors">🛡️ Bank Security</div>
              <div className="hover:text-primary transition-colors">☁️ Native Cloud</div>
              <div className="hover:text-primary transition-colors">💎 Premium Support</div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 px-8 text-center text-slate-500 text-xs">
        <p className="font-bold">© 2026 SYSCOMAD. Tous droits réservés.</p>
        <p className="mt-2 font-medium opacity-50">Solution architecturée pour la haute performance.</p>
      </footer>
    </div>
  );
}
