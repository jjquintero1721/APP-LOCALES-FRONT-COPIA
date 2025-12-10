import { useState } from 'react';
import { useOutgoingTransfers, useIncomingTransfers } from '../../hooks/inventory/useTransfers';
import { useTransfers } from '../../hooks/inventory/useTransfers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CreateTransferModal from '../../components/inventory/CreateTransferModal';
import TransferDetailsModal from '../../components/inventory/TransferDetailsModal';
import './TransfersPage.css';

const TransfersPage = () => {
  const [activeTab, setActiveTab] = useState('outgoing'); // 'outgoing' | 'incoming'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed' | 'cancelled' | 'rejected'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState(null);

  const {
    outgoingTransfers,
    isLoading: isLoadingOutgoing,
    refetch: refetchOutgoing,
  } = useOutgoingTransfers(statusFilter === 'all' ? null : statusFilter);

  const {
    incomingTransfers,
    isLoading: isLoadingIncoming,
    refetch: refetchIncoming,
  } = useIncomingTransfers(statusFilter === 'all' ? null : statusFilter);

  const {
    acceptTransfer,
    isAcceptingTransfer,
    rejectTransfer,
    isRejectingTransfer,
    cancelTransfer,
    isCancellingTransfer,
    canManage,
  } = useTransfers();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), "dd 'de' MMM, yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', className: 'badge-warning' },
      completed: { text: 'Completado', className: 'badge-success' },
      cancelled: { text: 'Cancelado', className: 'badge-secondary' },
      rejected: { text: 'Rechazado', className: 'badge-danger' },
    };

    const badge = badges[status] || {
      text: status,
      className: 'badge-secondary',
    };

    return <span className={`badge ${badge.className}`}>{badge.text}</span>;
  };

  const handleViewDetails = (transferId) => {
    setSelectedTransferId(transferId);
  };

  const handleAcceptTransfer = () => {
    if (!selectedTransferId) return;

    acceptTransfer(selectedTransferId, {
      onSuccess: () => {
        setSelectedTransferId(null);
        refetchIncoming();
        refetchOutgoing();
      },
    });
  };

  const handleRejectTransfer = () => {
    if (!selectedTransferId) return;

    rejectTransfer(selectedTransferId, {
      onSuccess: () => {
        setSelectedTransferId(null);
        refetchIncoming();
        refetchOutgoing();
      },
    });
  };

  const handleCancelTransfer = () => {
    if (!selectedTransferId) return;

    cancelTransfer(selectedTransferId, {
      onSuccess: () => {
        setSelectedTransferId(null);
        refetchIncoming();
        refetchOutgoing();
      },
    });
  };

  const handleCloseDetailsModal = () => {
    setSelectedTransferId(null);
  };

  const currentTransfers =
    activeTab === 'outgoing' ? outgoingTransfers : incomingTransfers;
  const isLoading = activeTab === 'outgoing' ? isLoadingOutgoing : isLoadingIncoming;

  // Count pending transfers for each tab
  const pendingOutgoingCount = outgoingTransfers.filter(
    (t) => t.status === 'pending'
  ).length;
  const pendingIncomingCount = incomingTransfers.filter(
    (t) => t.status === 'pending'
  ).length;

  return (
    <div className="transfers-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Traslados de Inventario</h1>
          <p className="page-description">
            Gestiona los traslados de inventario entre negocios relacionados
          </p>
        </div>
        {canManage && (
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="icon">➕</i>
            Nuevo Traslado
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('outgoing')}
        >
          Enviados
          {pendingOutgoingCount > 0 && (
            <span className="tab-count">{pendingOutgoingCount}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          Recibidos
          {pendingIncomingCount > 0 && (
            <span className="tab-count">{pendingIncomingCount}</span>
          )}
        </button>
      </div>

      {/* Status Filter */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="statusFilter">Filtrar por Estado:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
            <option value="cancelled">Cancelados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>
      </div>

      {/* Transfers List */}
      <div className="tab-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando traslados...</p>
          </div>
        ) : currentTransfers.length === 0 ? (
          <div className="empty-state">
            <i className="icon">📦</i>
            <h3>
              No hay traslados {activeTab === 'outgoing' ? 'enviados' : 'recibidos'}
            </h3>
            <p>
              {activeTab === 'outgoing'
                ? 'Crea un nuevo traslado para enviar productos a otro negocio.'
                : 'No has recibido traslados de otros negocios.'}
            </p>
            {canManage && activeTab === 'outgoing' && (
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Crear Traslado
              </button>
            )}
          </div>
        ) : (
          <div className="transfers-grid">
            {currentTransfers.map((transfer) => (
              <div
                key={transfer.id}
                className={`transfer-card ${
                  transfer.status === 'pending' ? 'pending' : ''
                }`}
              >
                <div className="card-header">
                  <div className="transfer-info">
                    <h3>
                      {activeTab === 'outgoing'
                        ? `→ ${transfer.to_business_name}`
                        : `← ${transfer.from_business_name}`}
                    </h3>
                    {getStatusBadge(transfer.status)}
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Fecha:</span>
                    <span className="value">{formatDate(transfer.created_at)}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Ítems:</span>
                    <span className="value">{transfer.items_count} ítems</span>
                  </div>

                  {transfer.completed_at && (
                    <div className="info-row">
                      <span className="label">Completado:</span>
                      <span className="value">
                        {formatDate(transfer.completed_at)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewDetails(transfer.id)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTransferModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          refetchOutgoing();
        }}
      />

      <TransferDetailsModal
        isOpen={!!selectedTransferId}
        onClose={handleCloseDetailsModal}
        transferId={selectedTransferId}
        onAccept={handleAcceptTransfer}
        onReject={handleRejectTransfer}
        onCancel={handleCancelTransfer}
      />
    </div>
  );
};

export default TransfersPage;
