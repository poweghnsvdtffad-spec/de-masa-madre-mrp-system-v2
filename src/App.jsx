import React, { useState } from 'react';
import { Shell } from './components/layout/Shell';
import { AppProvider } from './store/AppContext';
import { Dashboard } from './components/views/Dashboard';
import { OrdersView } from './components/views/OrdersView';
import { ProductionView } from './components/views/ProductionView';
import { InventoryView } from './components/views/InventoryView';
import { AssistantWidget } from './components/Assistant/AssistantWidget';
import './styles/variables.css';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
      case 'orders': return <OrdersView />;
      case 'production': return <ProductionView />;
      case 'inventory': return <InventoryView />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <AppProvider>
      <Shell onViewChange={setCurrentView} currentView={currentView}>
        {renderView()}
      </Shell>
      <AssistantWidget />
    </AppProvider>
  );
}

export default App;
