import { useState, useEffect } from 'react';
import { authService } from './services/api';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (isLogin) {
        response = await authService.login(formData.email, formData.password);
      } else {
        response = await authService.register(
          formData.name,
          formData.email,
          formData.password
        );
      }

      setSuccess(response.message || 'Operación exitosa');
      setIsAuthenticated(true);
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setError(
        err.response?.data?.error || 'Error al procesar la solicitud'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setSuccess('Sesión cerrada correctamente');
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Bienvenido!
            </h2>
            <p className="text-gray-600 mb-6">
              Has iniciado sesión correctamente
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? 'Ingresa a tu cuenta'
              : 'Crea una nueva cuenta'}
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ name: '', email: '', password: '' });
              setError('');
              setSuccess('');
            }}
            className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isLogin
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Procesando...'
              : isLogin
              ? 'Iniciar Sesión'
              : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
