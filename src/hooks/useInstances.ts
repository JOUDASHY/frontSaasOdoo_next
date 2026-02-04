import { useState, useCallback } from 'react';
import api from '@/lib/api';

export interface OdooInstance {
    id: number;
    name: string;
    domain: string;
    port: number;
    status: 'CREATED' | 'DEPLOYING' | 'RUNNING' | 'STOPPED' | 'ERROR';
    status_display?: string;
    created_at: string;
    admin_password?: string;
    odoo_version?: string;
    db_name?: string;
}

export function useInstances() {
    const [instances, setInstances] = useState<OdooInstance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInstances = useCallback(async () => {
        try {
            const res = await api.get('/instances/');
            setInstances(res.data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch instances", err);
            setError("Impossible de charger les instances.");
        } finally {
            setLoading(false);
        }
    }, []);

    const performAction = async (id: number, action: string) => {
        try {
            const endpoint = action.toLowerCase() === 'delete' ? 'remove' : action.toLowerCase();
            await api.post(`/instances/${id}/${endpoint}/`);
            await fetchInstances();
            return { success: true };
        } catch (err: any) {
            const msg = err.response?.data?.error || "Action échouée";
            return { success: false, error: msg };
        }
    };

    const createInstance = async (name: string) => {
        try {
            await api.post("/instances/", {
                name,
                domain: `${name}.localhost`, // Dev default
            });
            await fetchInstances();
            return { success: true };
        } catch (err: any) {
            const msg = err.response?.data?.detail || err.response?.data?.error || "Erreur de création";
            return { success: false, error: msg };
        }
    };

    return {
        instances,
        loading,
        error,
        fetchInstances,
        performAction,
        createInstance
    };
}
