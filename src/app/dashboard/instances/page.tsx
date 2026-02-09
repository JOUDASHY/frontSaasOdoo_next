"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface OdooInstance {
  id: number;
  name: string;
  subscription_plan: string;
  domain: string;
  port: number;
  status: string;
  status_display: string;
  db_name: string;
  odoo_version: string;
  created_at: string;
}

const statusClasses: Record<string, string> = {
  RUNNING: "bg-emerald-100 text-emerald-700",
  STOPPED: "bg-slate-100 text-slate-700",
  ERROR: "bg-rose-100 text-rose-700",
  DEPLOYING: "bg-amber-100 text-amber-700",
};

export default function ClientInstancesPage() {
  const [instances, setInstances] = useState<OdooInstance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        const res = await api.get("/instances/");
        setInstances(res.data);
      } catch (e) {
        console.error("Failed to fetch client instances", e);
      } finally {
        setLoading(false);
      }
    };

    fetchInstances();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Chargement de vos instances Odoo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Mes <span className="text-primary">Instances Odoo</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Visualisez vos environnements Odoo déployés depuis votre abonnement.
            </p>
          </div>
        </div>

        {instances.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Vous n&apos;avez pas encore d&apos;instance Odoo déployée.
            </p>
            <p className="text-xs text-slate-400">
              Créez d&apos;abord un abonnement actif, puis déployez une instance depuis votre tableau de bord.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instances.map((inst) => (
              <div
                key={inst.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Instance #{inst.id}
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {inst.name}
                    </h2>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        statusClasses[inst.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {inst.status_display}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Plan: {inst.subscription_plan}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      URL
                    </span>
                    <button
                      type="button"
                      onClick={() => window.open(`http://localhost:${inst.port}`, "_blank")}
                      className="text-[11px] font-semibold text-primary hover:text-primary-dark underline-offset-2 hover:underline"
                    >
                      Ouvrir dans un nouvel onglet
                    </button>
                  </div>
                  <p className="font-mono text-xs text-primary dark:text-primary-light break-all">
                    http://{inst.domain} (port {inst.port})
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                        Version Odoo
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        v{inst.odoo_version}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                        Base de données
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {inst.db_name}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-slate-400">
                    Créée le{" "}
                    <span className="font-semibold text-slate-600 dark:text-slate-200">
                      {new Date(inst.created_at).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

