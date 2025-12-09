import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import './AuthCard.css';

const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { login, register, isLoading, loginError, registerError } = useAuth();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    full_name: '',
    business_name: '',
  });

  const handleSwitch = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(loginData);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    await register(registerData);
  };

  return (
    <div className="auth-container">
      {/* Background decorations */}
      <div className="auth-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Auth Card */}
      <div className="auth-card-container">
        <div className={`auth-card ${isAnimating ? 'animating' : ''} ${!isLogin ? 'show-register' : 'show-login'}`}>
          
          {/* Login Form */}
          {isLogin && (
            <div className="auth-content">
              <div className="card-header">
                <h1 className="card-title">Bienvenido</h1>
                <p className="card-subtitle">Inicia sesión en tu negocio</p>
              </div>

              {loginError && (
                <div className="error-alert">
                  <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{loginError.response?.data?.detail || 'Error al iniciar sesión'}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="form-input"
                    placeholder="tu@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password" className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="form-input"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-spinner">
                      <svg className="spinner" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                      </svg>
                      Ingresando...
                    </span>
                  ) : (
                    <>
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Ingresar
                    </>
                  )}
                </button>
              </form>

              <div className="card-footer">
                <p>¿No tienes cuenta?</p>
                <button 
                  onClick={handleSwitch} 
                  className="link-button"
                  disabled={isAnimating}
                >
                  Regístrate aquí
                </button>
              </div>
            </div>
          )}

          {/* Register Form */}
          {!isLogin && (
            <div className="auth-content">
              <div className="card-header">
                <h1 className="card-title">Crear Cuenta</h1>
                <p className="card-subtitle">Registra tu negocio</p>
              </div>

              {registerError && (
                <div className="error-alert">
                  <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{registerError.response?.data?.detail || 'Error al registrar'}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="business_name" className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Nombre del Negocio
                  </label>
                  <input
                    type="text"
                    id="business_name"
                    name="business_name"
                    value={registerData.business_name}
                    onChange={handleRegisterChange}
                    className="form-input"
                    placeholder="Mi Cafetería"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="full_name" className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={registerData.full_name}
                    onChange={handleRegisterChange}
                    className="form-input"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-email" className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="form-input"
                    placeholder="tu@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-password" className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="form-input"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-spinner">
                      <svg className="spinner" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                      </svg>
                      Registrando...
                    </span>
                  ) : (
                    <>
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Registrar
                    </>
                  )}
                </button>
              </form>

              <div className="card-footer">
                <p>¿Ya tienes cuenta?</p>
                <button 
                  onClick={handleSwitch} 
                  className="link-button"
                  disabled={isAnimating}
                >
                  Inicia sesión aquí
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;