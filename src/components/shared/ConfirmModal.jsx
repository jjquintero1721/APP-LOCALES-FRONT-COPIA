import './ConfirmModal.css';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmType = 'primary', // 'primary' | 'danger' | 'warning'
  countdown = 0,
  onConfirm,
  onCancel,
  isLoading = false,
  children,
}) => {
  if (!isOpen) return null;

  const getConfirmButtonClass = () => {
    switch (confirmType) {
      case 'danger':
        return 'btn btn-danger';
      case 'warning':
        return 'btn btn-warning';
      default:
        return 'btn btn-primary';
    }
  };

  const getIconColor = () => {
    switch (confirmType) {
      case 'danger':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h3 className="confirm-modal-title" style={{ color: getIconColor() }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ width: '24px', height: '24px' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {title}
          </h3>
        </div>

        <div className="confirm-modal-body">
          {typeof message === 'string' ? <p>{message}</p> : message}

          {children}

          {countdown > 0 && (
            <p className="countdown-message">
              Espera <span className="countdown-badge">{countdown}</span> segundos para
              confirmar.
            </p>
          )}
        </div>

        <div className="confirm-modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={getConfirmButtonClass()}
            onClick={onConfirm}
            disabled={isLoading || countdown > 0}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
