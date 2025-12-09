import { useUsers } from '../../hooks/users/useUsers';
import './UsersTable.css';

const UsersTable = () => {
  const { users, isLoading, error, deleteUser } = useUsers();

  const handleDelete = (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      deleteUser(userId);
    }
  };

  if (isLoading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        Error al cargar usuarios: {error.message}
      </div>
    );
  }

  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge badge-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`status ${user.is_active ? 'active' : 'inactive'}`}
                  >
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn-action btn-edit">Editar</button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
