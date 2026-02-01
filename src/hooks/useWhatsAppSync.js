import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';

export const useWhatsAppSync = () => {
    const [incomingOrders, setIncomingOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchIncoming = async () => {
        try {
            const res = await fetch(`${API_BASE}/incoming`);
            const data = await res.json();
            setIncomingOrders(data);
        } catch (err) {
            console.error("Failed to sync WhatsApp orders", err);
        }
    };

    useEffect(() => {
        fetchIncoming();
        const interval = setInterval(fetchIncoming, 10000);
        return () => clearInterval(interval);
    }, []);

    const performAction = async (id, action) => {
        setLoading(true);
        try {
            await fetch(`${API_BASE}/review-action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action })
            });
            await fetchIncoming();
        } catch (err) {
            console.error(`Failed to ${action} order`, err);
        } finally {
            setLoading(false);
        }
    };

    return { incomingOrders, loading, approveOrder: (id) => performAction(id, 'approve'), dismissOrder: (id) => performAction(id, 'dismiss') };
};
