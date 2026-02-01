import React from 'react';
import { Shell } from './components/layout/Shell';
import { Dashboard } from './components/views/Dashboard';
import { OrdersView } from './components/views/OrdersView';
import { ProductionView } from './components/views/ProductionView';
import { InventoryView } from './components/views/InventoryView';
import { AssistantWidget } from './components/Assistant/AssistantWidget';
import { useState } from 'react';

function App() {
    const [currentView, setCurrentView] = useState('dashboard');

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <Dashboard />;
            case 'orders': return <OrdersView />;
            case 'production': return <ProductionView />;
            case 'inventory': return <InventoryView />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="app-container">
            <Shell currentView={currentView} onViewChange={setCurrentView}>
                {renderContent()}
            </Shell>
            <AssistantWidget />
        </div>
    );
}

export default App;
