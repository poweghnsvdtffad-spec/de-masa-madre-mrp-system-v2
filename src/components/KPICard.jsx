
import React from 'react';
import './KPICard.css';

export function KPICard({ title, value, unit, status, description }) {
    const statusClass = status ? `kpi-card--${status}` : '';

    return (
        <div className={`kpi-card ${statusClass}`}>
            <h3 className="kpi-title">{title}</h3>
            <div className="kpi-value-container">
                <span className="kpi-value">{value}</span>
                {unit && <span className="kpi-unit">{unit}</span>}
            </div>
            {description && <p className="kpi-description">{description}</p>}
        </div>
    );
}
