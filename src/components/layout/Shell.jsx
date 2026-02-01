import React from 'react';
import { LayoutDashboard, ShoppingCart, Loader2, Package, History, Settings } from 'lucide-react';
import '../../styles/layout.css';
import '../../styles/variables.css';

export function Shell({ children, currentView, onViewChange }) {
    const navItems = [
        { id: 'dashboard', label: 'Tablero', icon: LayoutDashboard },
        { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
        { id: 'production', label: 'Producción', icon: Loader2 },
        { id: 'inventory', label: 'Insumos', icon: Package },
    ];

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand" style={{ padding: '0 1rem 2rem 1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e11d48' }}>DMADRE.MRP</h2>
                </div>
                <nav>
                    {navItems.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`nav-link ${currentView === item.id ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
