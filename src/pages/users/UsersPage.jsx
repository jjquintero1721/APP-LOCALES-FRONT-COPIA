import UsersTable from '../../components/users/UsersTable';
import './UsersPage.css';

const UsersPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Usuarios</h1>
        <button className="btn btn-primary">
          Nuevo Usuario
        </button>
      </div>

      <div className="page-content">
        <UsersTable />
      </div>
    </div>
  );
};

export default UsersPage;
