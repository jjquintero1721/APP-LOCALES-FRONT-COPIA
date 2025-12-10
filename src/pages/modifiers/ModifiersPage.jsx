/**
 * Página principal de Modificadores
 * Gestiona grupos de modificadores y sus modificadores individuales
 */
import React, { useState } from 'react';
import  useAuthStore  from '../../store/authStore';
import { useModifierGroups } from '../../hooks/modifiers/useModifierGroups';
import { useModifiers } from '../../hooks/modifiers/useModifiers';
import CreateModifierGroupModal from '../../components/modifiers/CreateModifierGroupModal';
import EditModifierGroupModal from '../../components/modifiers/EditModifierGroupModal';
import CreateModifierModal from '../../components/modifiers/CreateModifierModal';
import EditModifierModal from '../../components/modifiers/EditModifierModal';
import ModifierDetailsModal from '../../components/modifiers/ModifierDetailsModal';
import ConfirmModal from '../../components/shared/ConfirmModal';
import './ModifiersPage.css';

const ModifiersPage = () => {
  const { user } = useAuthStore();
  const { modifierGroups, isLoading: isLoadingGroups, createGroup, updateGroup } = useModifierGroups();

  // Estados de UI
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedModifier, setSelectedModifier] = useState(null);

  // Estados de modales - Grupos
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);

  // Estados de modales - Modificadores
  const [isCreateModifierModalOpen, setIsCreateModifierModalOpen] = useState(false);
  const [isEditModifierModalOpen, setIsEditModifierModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Permisos
  const canManage = user?.role === 'owner' || user?.role === 'admin' || user?.role === 'cook';

  // Handlers - Grupos
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleEditGroup = (group, e) => {
    e.stopPropagation();
    setSelectedGroup(group);
    setIsEditGroupModalOpen(true);
  };

  // Handlers - Modificadores
  const handleViewModifier = (modifier) => {
    setSelectedModifier(modifier);
    setIsDetailsModalOpen(true);
  };

  const handleEditModifier = (modifier) => {
    setSelectedModifier(modifier);
    setIsEditModifierModalOpen(true);
  };

  const handleCreateModifierClick = () => {
    if (!selectedGroup) {
      return;
    }
    setIsCreateModifierModalOpen(true);
  };

  return (
    <div className="modifiers-page">
      {/* Header */}
      <div className="modifiers-header">
        <div className="header-content">
          <h1 className="page-title">Modificadores</h1>
          <p className="page-subtitle">
            Gestiona grupos y modificadores para personalizar tus productos
          </p>
        </div>
        {canManage && (
          <button onClick={() => setIsCreateGroupModalOpen(true)} className="btn-create-group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Crear Grupo
          </button>
        )}
      </div>

      <div className="modifiers-content">
        {/* Panel izquierdo - Grupos */}
        <div className="groups-panel">
          <div className="panel-header">
            <h2>Grupos de Modificadores</h2>
            <span className="count-badge">
              {modifierGroups?.length || 0}
            </span>
          </div>

          {isLoadingGroups ? (
            <div className="loading-state">
              <div className="spinner-small"></div>
              <p>Cargando grupos...</p>
            </div>
          ) : modifierGroups && modifierGroups.length > 0 ? (
            <div className="groups-list">
              {modifierGroups.map((group) => (
                <div
                  key={group.id}
                  className={`group-card ${selectedGroup?.id === group.id ? 'selected' : ''} ${!group.is_active ? 'inactive' : ''}`}
                  onClick={() => handleSelectGroup(group)}
                >
                  <div className="group-header">
                    <h3>{group.name}</h3>
                    <div className="group-badges">
                      {group.is_required && (
                        <span className="badge required" title="Obligatorio">REQ</span>
                      )}
                      {group.allow_multiple && (
                        <span className="badge multiple" title="Selección múltiple">MULTI</span>
                      )}
                      {!group.is_active && (
                        <span className="badge inactive">INACTIVO</span>
                      )}
                    </div>
                  </div>

                  {group.description && (
                    <p className="group-description">{group.description}</p>
                  )}

                  <div className="group-footer">
                    <span className="modifier-count">
                      {group.modifiers_count || 0} modificador{group.modifiers_count !== 1 ? 'es' : ''}
                    </span>
                    {canManage && (
                      <button
                        className="btn-edit-group"
                        onClick={(e) => handleEditGroup(group, e)}
                        title="Editar grupo"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay grupos de modificadores</p>
              {canManage && (
                <button onClick={() => setIsCreateGroupModalOpen(true)} className="btn-create-first">
                  Crear primer grupo
                </button>
              )}
            </div>
          )}
        </div>

        {/* Panel derecho - Modificadores del grupo seleccionado */}
        <div className="modifiers-panel">
          {selectedGroup ? (
            <ModifiersSection
              group={selectedGroup}
              canManage={canManage}
              onCreateClick={handleCreateModifierClick}
              onView={handleViewModifier}
              onEdit={handleEditModifier}
            />
          ) : (
            <div className="no-selection-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3>Selecciona un grupo</h3>
              <p>Selecciona un grupo de la izquierda para ver y gestionar sus modificadores</p>
            </div>
          )}
        </div>
      </div>

      {/* Modales - Grupos */}
      <CreateModifierGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />

      <EditModifierGroupModal
        isOpen={isEditGroupModalOpen}
        onClose={() => {
          setIsEditGroupModalOpen(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
      />

      {/* Modales - Modificadores */}
      <CreateModifierModal
        isOpen={isCreateModifierModalOpen}
        onClose={() => setIsCreateModifierModalOpen(false)}
        groupId={selectedGroup?.id}
      />

      <EditModifierModal
        isOpen={isEditModifierModalOpen}
        onClose={() => {
          setIsEditModifierModalOpen(false);
          setSelectedModifier(null);
        }}
        modifier={selectedModifier}
      />

      <ModifierDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedModifier(null);
        }}
        modifier={selectedModifier}
      />
    </div>
  );
};

/**
 * Sección de modificadores de un grupo
 */
const ModifiersSection = ({ group, canManage, onCreateClick, onView, onEdit }) => {
  const { modifiers, isLoading } = useModifiers(group.id, false);

  return (
    <>
      <div className="panel-header">
        <div>
          <h2>{group.name}</h2>
          <span className="group-subtitle">Modificadores de este grupo</span>
        </div>
        {canManage && (
          <button onClick={onCreateClick} className="btn-create-modifier">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Crear Modificador
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner-small"></div>
          <p>Cargando modificadores...</p>
        </div>
      ) : modifiers && modifiers.length > 0 ? (
        <div className="modifiers-list">
          {modifiers.map((modifier) => (
            <div
              key={modifier.id}
              className={`modifier-card ${!modifier.is_active ? 'inactive' : ''}`}
            >
              <div className="modifier-header">
                <h3>{modifier.name}</h3>
                {!modifier.is_active && (
                  <span className="badge inactive">INACTIVO</span>
                )}
              </div>

              {modifier.description && (
                <p className="modifier-description">{modifier.description}</p>
              )}

              <div className="modifier-info">
                <div className="info-row">
                  <span className="info-label">Precio extra:</span>
                  <span className="info-value price">${parseFloat(modifier.price_extra).toFixed(2)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ítems:</span>
                  <span className="info-value">{modifier.items_count || 0}</span>
                </div>
              </div>

              <div className="modifier-actions">
                <button
                  onClick={() => onView(modifier)}
                  className="btn-action view"
                  title="Ver detalles"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Ver
                </button>
                {canManage && (
                  <button
                    onClick={() => onEdit(modifier)}
                    className="btn-action edit"
                    title="Editar"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No hay modificadores en este grupo</p>
          {canManage && (
            <button onClick={onCreateClick} className="btn-create-first">
              Crear primer modificador
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ModifiersPage;
