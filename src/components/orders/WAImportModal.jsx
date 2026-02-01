import React, { useState, useEffect } from 'react';
import { X, ClipboardPaste, Check, AlertCircle } from 'lucide-react';
import { parseWAMessage } from '../../services/waParser';
import { useApp } from '../../store/AppContext';

export const WAImportModal = ({ onClose, onImport }) => {
    const { products } = useApp();
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (text.trim()) {
            const parsed = parseWAMessage(text, products);
            setResult(parsed);
        } else {
            setResult(null);
        }
    }, [text, products]);

    const handleConfirm = () => {
        if (result && result.isValid) {
            onImport({
                id: `wa-${Date.now()}`,
                customer: result.customer,
                items: result.items,
                status: 'PENDING',
                date: new Date().toISOString().split('T')[0],
                source: 'WhatsApp'
            });
            onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)', backdropBlur: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
            <div className="card-premium" style={{ width: '500px', maxWidth: '90vw', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 800 }}>Importar desde WhatsApp</h2>
                    <X size={24} cursor="pointer" onClick={onClose} />
                </div>

                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                    Pegá el mensaje del cliente tal cual lo recibiste:
                </p>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ej: Hola! Soy Ana, quiero 2 foccacias por favor..."
                    style={{
                        width: '100%', height: '120px', padding: '1rem',
                        borderRadius: '12px', border: '1px solid #e2e8f0',
                        fontSize: '0.875rem', outline: 'none', marginBottom: '1.5rem',
                        resize: 'none'
                    }}
                />

                {result && (
                    <div style={{ 
                        background: result.isValid ? '#f0fdf4' : '#fff1f2',
                        padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {result.isValid ? (
                                <Check size={18} color="#15803d" />
                            ) : (
                                <AlertCircle size={18} color="#e11d48" />
                            )}
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                {result.isValid ? 'Pedido Detectado' : 'No se detectaron productos'}
                            </span>
                        </div>
                        
                        {result.isValid && (
                            <div style={{ fontSize: '0.875rem', color: '#334155' }}>
                                <div style={{ marginBottom: '0.25rem' }}><strong>Cliente</strong>: {result.customer}</div>
                                {result.items.map((item, idx) => (
                                    <div key={idx}>• {item.quantity}x {item.name}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        style={{ flex: 1, border: '1px solid #e2e8f0', background: 'white', padding: '0.75rem', borderRadius: '10px' }}
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-premium" 
                        style={{ flex: 1, opacity: result?.isValid ? 1 : 0.5 }}
                        disabled={!result?.isValid}
                        onClick={handleConfirm}
                    >
                        Confirmar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};
