import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { dataAdapter } from '../services/dataAdapter';
import { calculateProductionNeeds, calculateMaterialRequirements } from '../domain/mrp';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [recipes, setRecipes] = useState({});
    const [orders, setOrders] = useState([]);
    const [resources, setResources] = useState([]);

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                const [p, r, o, res] = await Promise.all([
                    dataAdapter.getProducts(),
                    dataAdapter.getRecipes(),
                    dataAdapter.getOrders(),
                    dataAdapter.getResources()
                ]);
                setProducts(p);
                setRecipes(r);
                setOrders(o);
                setResources(res);
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    // Derived State (MRP Logic)
    const productionNeeds = useMemo(() => {
        return calculateProductionNeeds(orders);
    }, [orders]);

    const materialsNeeded = useMemo(() => {
        return calculateMaterialRequirements(productionNeeds, recipes);
    }, [productionNeeds, recipes]);

    // Actions
    const addOrder = async (newOrder) => {
        // Optimistic update - Prepend to show at top
        setOrders(prev => [newOrder, ...prev]);
        await dataAdapter.saveOrder(newOrder); // In real app, handle error/rollback
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const getProductById = (id) => products.find(p => p.id === id);
    const getResourceById = (id) => resources.find(r => r.id === id);

    const value = {
        loading,
        products,
        recipes,
        orders,
        resources,
        // Derived
        productionNeeds,
        materialsNeeded,
        // Actions
        addOrder,
        updateOrderStatus,
        getProductById,
        getResourceById
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
