import { useMemo } from 'react';
import './InventorySummary.css';

const InventorySummary = ({ inventoryItems = [], lowStockAlerts = [] }) => {
  // Calcular el valor total del inventario
  const totalValue = useMemo(() => {
    if (!inventoryItems) return 0;
    return inventoryItems.reduce((sum, item) => {
      const value = (parseFloat(item.quantity_in_stock) || 0) * (parseFloat(item.unit_price) || 0);
      return sum + value;
    }, 0);
  }, [inventoryItems]);

  // Contar ítems activos
  const activeItemsCount = useMemo(() => {
    if (!inventoryItems) return 0;
    return inventoryItems.filter(item => item.is_active).length;
  }, [inventoryItems]);

  // Número de alertas de stock bajo
  const alertsCount = lowStockAlerts?.length || 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="inventory-summary">
      <div className="summary-card">
        <div className="summary-icon money">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="summary-content">
          <div className="summary-label">Valor Total</div>
          <div className="summary-value">{formatCurrency(totalValue)}</div>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-icon items">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div className="summary-content">
          <div className="summary-label">Ítems Activos</div>
          <div className="summary-value">{activeItemsCount}</div>
        </div>
      </div>

      <div className="summary-card">
        <div className={`summary-icon alerts ${alertsCount > 0 ? 'has-alerts' : ''}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="summary-content">
          <div className="summary-label">Alertas de Stock</div>
          <div className={`summary-value ${alertsCount > 0 ? 'alert-value' : ''}`}>
            {alertsCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
