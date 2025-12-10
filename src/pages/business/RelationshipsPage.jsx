import { useState } from 'react';
import { useRelationships } from '../../hooks/business/useRelationships';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CreateRelationshipModal from '../../components/business/CreateRelationshipModal';
import RelationshipDetailsModal from '../../components/business/RelationshipDetailsModal';
import ConfirmModal from '../../components/shared/ConfirmModal';
import './RelationshipsPage.css';

const RelationshipsPage = () => {
  const {
    activeRelationships,
    pendingRequests,
    isLoadingActive,
    isLoadingPending,
    canManage,
    acceptRelationship,
    isAcceptingRelationship,
    rejectRelationship,
    isRejectingRelationship,
  } = useRelationships();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'accept'|'reject', id: number }

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
      active: { text: 'Activa', className: 'badge-success' },
      rejected: { text: 'Rechazada', className: 'badge-danger' },
    };

    const badge = badges[status] || { text: status, className: 'badge-secondary' };

    return <span className={`badge ${badge.className}`}>{badge.text}</span>;
  };

  const handleViewDetails = (relationship) => {
    setSelectedRelationship(relationship);
    setShowDetailsModal(true);
  };

  const handleAccept = (relationshipId) => {
    setConfirmAction({ type: 'accept', id: relationshipId });
  };

  const handleReject = (relationshipId) => {
    setConfirmAction({ type: 'reject', id: relationshipId });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'accept') {
      acceptRelationship(confirmAction.id, {
        onSuccess: () => setConfirmAction(null),
      });
    } else if (confirmAction.type === 'reject') {
      rejectRelationship(confirmAction.id, {
        onSuccess: () => setConfirmAction(null),
      });
    }
  };

  // Access control: Only OWNER can access this page
  if (!canManage) {
    return (
      <div className="relationships-page">
        <div className="access-denied">
          <i className="icon">🔒</i>
          <h2>Acceso Denegado</h2>
          <p>
            Solo los propietarios (OWNER) pueden gestionar las relaciones entre
            negocios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relationships-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Relaciones entre Negocios</h1>
          <p className="page-description">
            Gestiona las relaciones con otros negocios para habilitar traslados de
            inventario
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="icon">➕</i>
          Nueva Solicitud
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Relaciones Activas
          {activeRelationships.length > 0 && (
            <span className="tab-count">{activeRelationships.length}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Solicitudes Pendientes
          {pendingRequests.length > 0 && (
            <span className="tab-count">{pendingRequests.length}</span>
          )}
        </button>
      </div>

      {/* Active Relationships Tab */}
      {activeTab === 'active' && (
        <div className="tab-content">
          {isLoadingActive ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando relaciones activas...</p>
            </div>
          ) : activeRelationships.length === 0 ? (
            <div className="empty-state">
              <i className="icon">🤝</i>
              <h3>No hay relaciones activas</h3>
              <p>
                Envía una solicitud a otro negocio para comenzar a realizar
                traslados de inventario.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Enviar Solicitud
              </button>
            </div>
          ) : (
            <div className="relationships-grid">
              {activeRelationships.map((relationship) => (
                <div key={relationship.id} className="relationship-card">
                  <div className="card-header">
                    <div className="business-info">
                      <h3>
                        {relationship.requester_business_name ===
                        relationship.target_business_name
                          ? relationship.requester_business_name
                          : `${relationship.requester_business_name} ↔ ${relationship.target_business_name}`}
                      </h3>
                      {getStatusBadge(relationship.status)}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">Fecha de Activación:</span>
                      <span className="value">
                        {formatDate(relationship.updated_at)}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleViewDetails(relationship)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Requests Tab */}
      {activeTab === 'pending' && (
        <div className="tab-content">
          {isLoadingPending ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando solicitudes pendientes...</p>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="empty-state">
              <i className="icon">📬</i>
              <h3>No hay solicitudes pendientes</h3>
              <p>No tienes solicitudes de relación pendientes por revisar.</p>
            </div>
          ) : (
            <div className="relationships-grid">
              {pendingRequests.map((relationship) => (
                <div key={relationship.id} className="relationship-card pending">
                  <div className="card-header">
                    <div className="business-info">
                      <h3>{relationship.requester_business_name}</h3>
                      {getStatusBadge(relationship.status)}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">Solicitado el:</span>
                      <span className="value">
                        {formatDate(relationship.created_at)}
                      </span>
                    </div>

                    <div className="info-banner warning">
                      <i className="icon">📨</i>
                      <p>
                        Este negocio quiere establecer una relación contigo para
                        poder realizar traslados de inventario.
                      </p>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleViewDetails(relationship)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleAccept(relationship.id)}
                      disabled={isAcceptingRelationship}
                    >
                      ✓ Aceptar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(relationship.id)}
                      disabled={isRejectingRelationship}
                    >
                      ✕ Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateRelationshipModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <RelationshipDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        relationship={selectedRelationship}
      />

      <ConfirmModal
        isOpen={!!confirmAction}
        title={
          confirmAction?.type === 'accept'
            ? 'Confirmar Aceptación'
            : 'Confirmar Rechazo'
        }
        message={
          confirmAction?.type === 'accept'
            ? '¿Estás seguro de que deseas aceptar esta solicitud de relación? Esto permitirá realizar traslados de inventario con este negocio.'
            : '¿Estás seguro de que deseas rechazar esta solicitud de relación?'
        }
        confirmText={confirmAction?.type === 'accept' ? 'Aceptar' : 'Rechazar'}
        confirmType={confirmAction?.type === 'accept' ? 'primary' : 'danger'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
        isLoading={isAcceptingRelationship || isRejectingRelationship}
      />
    </div>
  );
};

export default RelationshipsPage;
