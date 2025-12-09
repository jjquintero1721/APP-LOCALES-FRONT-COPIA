import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import './EmployeeModal.css';

const CreateEmployeeModal = ({ isOpen, onClose, onCreateEmployee, isCreating }) => {
  const { user } = useAuthStore();
  const [generatePassword, setGeneratePassword] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const employeeData = {
      email: data.email,
      full_name: data.full_name,
      phone: data.phone || null,
      document: data.document || null,
      role: data.role,
    };

    // Solo enviar contraseña si el usuario decidió establecerla manualmente
    if (!generatePassword && data.password) {
      employeeData.password = data.password;
    }

    onCreateEmployee(employeeData);
    reset();
    setGeneratePassword(true);
  };

  const handleClose = () => {
    reset();
    setGeneratePassword(true);
    onClose();
  };

  if (!isOpen) return null;

  // Determinar qué roles puede crear el usuario actual
  const availableRoles = user?.role === 'owner'
    ? ['admin', 'cashier', 'waiter', 'cook']
    : ['cashier', 'waiter', 'cook'];

  const roleLabels = {
    admin: 'Administrador',
    cashier: 'Cajero',
    waiter: 'Mesero',
    cook: 'Cocinero',
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agregar Nuevo Empleado</h2>
          <button className="modal-close" onClick={handleClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="full_name">
                Nombre Completo <span className="required">*</span>
              </label>
              <input
                id="full_name"
                type="text"
                {...register('full_name', {
                  required: 'El nombre completo es requerido',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres',
                  },
                })}
                className={errors.full_name ? 'input-error' : ''}
                placeholder="Ej: Juan Pérez"
              />
              {errors.full_name && (
                <span className="error-message">{errors.full_name.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                className={errors.email ? 'input-error' : ''}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: 'Teléfono inválido',
                  },
                })}
                className={errors.phone ? 'input-error' : ''}
                placeholder="Ej: +57 300 123 4567"
              />
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="document">Documento (Cédula)</label>
              <input
                id="document"
                type="text"
                {...register('document')}
                placeholder="Ej: 1234567890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">
                Rol <span className="required">*</span>
              </label>
              <select
                id="role"
                {...register('role', {
                  required: 'El rol es requerido',
                })}
                className={errors.role ? 'input-error' : ''}
              >
                <option value="">Seleccione un rol</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
              {errors.role && (
                <span className="error-message">{errors.role.message}</span>
              )}
            </div>

            <div className="form-group full-width">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="generatePassword"
                  checked={generatePassword}
                  onChange={(e) => setGeneratePassword(e.target.checked)}
                />
                <label htmlFor="generatePassword">
                  Generar contraseña automáticamente
                </label>
              </div>
            </div>

            {!generatePassword && (
              <div className="form-group full-width">
                <label htmlFor="password">
                  Contraseña <span className="required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: !generatePassword ? 'La contraseña es requerida' : false,
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres',
                    },
                  })}
                  className={errors.password ? 'input-error' : ''}
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.password && (
                  <span className="error-message">{errors.password.message}</span>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreating}
            >
              {isCreating ? 'Creando...' : 'Crear Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
