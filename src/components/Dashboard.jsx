
import React, { useEffect, useState } from 'react';
import { KPICard } from './KPICard';
import { getMetrics } from '../data/metrics';
import './Dashboard.css';

export function Dashboard() {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        // Simulate async data fetch
        const data = getMetrics();
        setMetrics(data);
    }, []);

    if (!metrics) return <div>Cargando dashboard...</div>;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>De Masa Madre - MRP Dashboard</h1>
                <p>Control de producción en tiempo real</p>
            </header>

            <div className="kpi-grid">
                <KPICard
                    title="Rotación de Inventario"
                    value={metrics.inventoryTurnover}
                    unit="x"
                    status={metrics.inventoryTurnover > 10 ? 'good' : 'warning'}
                    description="Velocidad de renovación de stock"
                />
                <KPICard
                    title="Tasa de Desperdicio"
                    value={metrics.wasteRate}
                    unit="%"
                    status={metrics.wasteRate < 2 ? 'good' : 'danger'}
                    description="Porcentaje de material perdido"
                />
                <KPICard
                    title="Quiebre de Stock"
                    value={metrics.stockoutRate}
                    unit="%"
                    status={metrics.stockoutRate === '0.0' ? 'good' : 'danger'}
                    description="Riesgo de desabastecimiento"
                />
                <KPICard
                    title="Cumplimiento Plan"
                    value={metrics.scheduleAdherence}
                    unit="%"
                    status={metrics.scheduleAdherence >= 90 ? 'good' : 'warning'}
                    description="Órdenes completadas a tiempo"
                />
                <KPICard
                    title="Variación Costo"
                    value={metrics.costVariance}
                    unit="%"
                    status={metrics.costVariance < 2 ? 'good' : 'warning'}
                    description="Desviación del costo estándar"
                />
            </div>
        </div>
    );
}
