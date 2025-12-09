import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import './EmployeeModal.css';

const EditEmployeeModal = ({ isOpen, onClose, employee, onUpdateEmployee, isUpdating }) => {
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (employee) {
      reset({
        full_name: employee.full_name,
        email: employee.email,
        phone: employee.phone || '',
        role: employee.role,
        is_active: employee.is_active,
      });
    }
  }, [employee, reset]);

  const onSubmit = (data) => {
    const updateData = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      role: data.role,
      is_active: data.is_active,
    };

    onUpdateEmployee({ employeeId: employee.id, employeeData: updateData });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !employee) return null;

  // Determinar qué roles puede asignar el usuario actual
  const availableRoles = user?.role === 'owner'
    ? ['admin', 'cashier', 'waiter', 'cook']
    : ['cashier', 'waiter', 'cook'];

  const roleLabels = {
    admin: 'Administrador',
    cashier: 'Cajero',
    waiter: 'Mesero',
    cook: 'Cocinero',
  };

  // Verificar si el usuario actual está editando su propio perfil
  const isEditingSelf = user?.id === employee.id;

  // Verificar si el empleado es un owner
  const isEmployeeOwner = employee.role === 'owner';

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Empleado</h2>
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
              />
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
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
                disabled={isEditingSelf || isEmployeeOwner}
              >
                {isEmployeeOwner && (
                  <option value="owner">Propietario</option>
                )}
                {!isEmployeeOwner && availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
              {errors.role && (
                <span className="error-message">{errors.role.message}</span>
              )}
              {isEditingSelf && (
                <span className="info-message">No puedes cambiar tu propio rol</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="is_active">Estado</label>
              <select
                id="is_active"
                {...register('is_active')}
              >
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isUpdating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
