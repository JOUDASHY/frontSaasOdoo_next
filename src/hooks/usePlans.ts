import { useState, useCallback } from 'react';
import api from '@/lib/api';

export interface Plan {
    id: number;
    name: string;
    max_users: number;
    price: string;
    allowed_modules?: string[];
    max_instances: number;
    storage_limit_gb: number;
}

export function usePlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlans = useCallback(async () => {
        try {
            const res = await api.get("/plans/");
            setPlans(res.data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch plans", err);
            setError("Impossible de charger les plans.");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        plans,
        loading,
        error,
        fetchPlans
    };
}
