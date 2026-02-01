import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { AlertCircle, ArrowRight, CheckCircle2, DollarSign, Package } from 'lucide-react';
import '../../styles/layout.css'; 

const StatCard = ({ label, value, icon: Icon, colorClass, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between"
    >
        <div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon size={24} />
        </div>
    </motion.div>
);

const OrderChart = ({ orders }) => {
    const [view, setView] = React.useState('WEEK'); 

    const chartData = React.useMemo(() => {
        if (view === 'DAILY') {
            return [
                { label: 'Lun', value: 12 }, { label: 'Mar', value: 19 },
                { label: 'Mie', value: 15 }, { label: 'Jue', value: 22 },
                { label: 'Vie', value: 30 }, { label: 'Sab', value: 25 }, { label: 'Dom', value: 10 }
            ];
        }
        if (view === 'WEEK') {
            return [
                { label: 'Sem 1', value: 85 }, { label: 'Sem 2', value: 110 },
                { label: 'Sem 3', value: 95 }, { label: 'Sem 4', value: 140 }
            ];
        }
        return [
            { label: 'Ene', value: 450 }, { label: 'Feb', value: 520 },
            { label: 'Mar', value: 480 }, { label: 'Abr', value: 600 }
        ];
    }, [view]);

    const maxValue = Math.max(...chartData.map(d => d.value));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 col-span-full"
        >
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Volumen de Pedidos</h3>
                    <p className="text-slate-400 text-sm mt-1">Comparativa de actividad temporal</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['DAILY', 'WEEK', 'MONTH'].map(v => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {v === 'DAILY' ? 'Día' : v === 'WEEK' ? 'Semana' : 'Mes'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between h-48 gap-4 px-2">
                {chartData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                        <div className="relative w-full flex justify-center items-end h-full">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.value / maxValue) * 100}%` }}
                                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                                className="w-full max-w-[40px] bg-gradient-to-t from-rose-600 to-orange-400 rounded-t-xl relative group-hover:from-rose-500 group-hover:to-orange-300 transition-colors"
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {data.value}
                                </div>
                            </motion.div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export const Dashboard = ({ onViewChange }) => {
    const { orders, productionNeeds, materialsNeeded, resources, loading, products } = useApp();

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-slate-400">Cargando sistema...</div>;
    }

    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const inProduction = orders.filter(o => o.status === 'PRODUCTION').length;
    const totalUnitsToBake = Object.values(productionNeeds).reduce((a, b) => a + b, 0);

    const alerts = resources.filter(res => {
        const safety = res.safety_stock || 0;
        const neededForProduction = materialsNeeded[res.id] || 0;
        return res.stock <= safety || res.stock < neededForProduction;
    }).map(res => ({
        resource: res,
        needed: materialsNeeded[res.id] || 0,
        isCritical: res.stock <= (res.safety_stock || 0)
    }));

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Hola, Panadero 👋</h2>
                    <p className="text-slate-500 mt-2">Esto es lo que tenés para hoy.</p>
                </div>
                <button
                    onClick={() => onViewChange('orders')}
                    className="hidden sm:flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors"
                >
                    Ver todos los pedidos <ArrowRight size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Pedidos Pendientes"
                    value={pendingOrders}
                    icon={AlertCircle}
                    colorClass="bg-orange-50 text-orange-600"
                    delay={0.0}
                />
                <StatCard
                    label="En Producción"
                    value={inProduction}
                    icon={CheckCircle2}
                    colorClass="bg-blue-50 text-blue-600"
                    delay={0.1}
                />
                <StatCard
                    label="Unidades a Hornear"
                    value={totalUnitsToBake}
                    icon={CheckCircle2} 
                    colorClass="bg-rose-50 text-rose-600"
                    delay={0.2}
                />
                <StatCard
                    label="Alertas de Stock"
                    value={alerts.length}
                    icon={AlertCircle}
                    colorClass={alerts.length > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}
                    delay={0.3}
                />
            </div>

            <OrderChart orders={orders} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Demanda Activa</h3>
                        <button onClick={() => onViewChange('production')} className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Package size={18} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(productionNeeds).length === 0 ? (
                            <p className="text-slate-400 text-sm">No hay producción pendiente.</p>
                        ) : (
                            Object.entries(productionNeeds).map(([prodId, qty]) => {
                                const product = products.find(p => p.id === prodId);
                                if (!product) return null;
                                return (
                                    <div key={prodId} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg">
                                                🍞
                                            </div>
                                            <span className="font-medium text-slate-700">{product.name}</span>
                                        </div>
                                        <span className="font-bold text-lg text-slate-900">{qty} u.</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Stock Crítico</h3>
                        <div className={alerts.length > 0 ? "text-red-500" : "text-slate-300"}>
                            <AlertCircle size={22} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {alerts.length > 0 ? (
                            alerts.map((alert) => (
                                <div key={alert.resource.id} className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-4">
                                    <AlertCircle className="text-red-500 shrink-0" />
                                    <div>
                                        <p className="text-red-800 font-semibold text-sm">
                                            Faltante: {alert.resource.name}
                                        </p>
                                        <p className="text-red-600 text-xs">
                                            Necesitás {alert.needed.toFixed(2)} {alert.resource.unit}, tenés {alert.resource.stock} {alert.resource.unit}.
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-slate-400 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                                <CheckCircle2 size={32} className="mb-2 text-emerald-400" />
                                <p className="text-sm text-slate-400">Todo en orden por ahora.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden"
            >
                <h3 className="text-lg font-bold text-slate-800 mb-6 px-2">Historial Reciente</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                                <th className="px-4 py-3">Cliente</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3 text-right">Items</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id} className="text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-4 font-semibold text-slate-800">{order.customer}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' :
                                            order.status === 'PRODUCTION' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-400">{order.date}</td>
                                    <td className="px-4 py-4 text-right font-medium">{order.items.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

        </div>
    );
};
