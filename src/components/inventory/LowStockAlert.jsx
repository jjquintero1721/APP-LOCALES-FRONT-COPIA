import './LowStockAlert.css';

const LowStockAlert = ({ alerts = [], onViewItem }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="low-stock-alert">
      <div className="alert-header">
        <div className="alert-icon">
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
        <div className="alert-title">
          <strong>Alertas de Stock Bajo</strong>
          <span className="alert-count">{alerts.length} {alerts.length === 1 ? 'ítem' : 'ítems'}</span>
        </div>
      </div>

      <div className="alert-items">
        {alerts.slice(0, 5).map((item) => (
          <div key={item.id} className="alert-item" onClick={() => onViewItem && onViewItem(item)}>
            <div className="alert-item-info">
              <div className="alert-item-name">{item.name}</div>
              <div className="alert-item-details">
                <span className="stock-info">
                  Stock: <strong>{item.quantity_in_stock}</strong> {item.unit_of_measure}
                </span>
                <span className="min-stock-info">
                  Mínimo: <strong>{item.min_stock}</strong>
                </span>
              </div>
            </div>
            <div className="alert-item-action">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 5 && (
        <div className="alert-footer">
          <span className="more-items">+{alerts.length - 5} ítems más con stock bajo</span>
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;
