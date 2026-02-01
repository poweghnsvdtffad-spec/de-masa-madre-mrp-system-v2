import React, { useState } from 'react';
import { Menu, X, Package, ClipboardList, ChefHat, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/layout.css';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Tablero', icon: BarChart3 },
    { id: 'orders', label: 'Pedidos', icon: ClipboardList },
    { id: 'production', label: 'Producción', icon: ChefHat },
    { id: 'inventory', label: 'Insumos', icon: Package },
];

export const Shell = ({ children, currentView, onViewChange }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="app-shell">
            <header className="mobile-header">
                <h1 className="brand-title text-gradient">
                    De Masa Madre
                </h1>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="menu-toggle"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 40,
                            backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
                            paddingTop: '80px', paddingLeft: '24px', paddingRight: '24px',
                            display: 'flex', flexDirection: 'column', gap: '16px'
                        }}
                    >
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onViewChange(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                style={{ fontSize: '1.125rem', padding: '16px' }}
                            >
                                <item.icon size={24} className="nav-icon" />
                                {item.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="brand-title text-gradient">
                        De Masa Madre
                    </h1>
                    <p className="brand-subtitle">Sistema de Gestión</p>
                </div>

                <nav className="nav-menu">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                        >
                            <item.icon size={20} className="nav-icon" />
                            {item.label}
                            {currentView === item.id && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="active-indicator"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="system-status">
                    <div className="status-card">
                        <p className="status-label">Estado del Sistema</p>
                        <div className="status-dot-row">
                            <div className="status-dot" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>En línea</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
