import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../state/authcontext/AuthContext';
import PropTypes from 'prop-types';

function ProtectedRoute({ children }) {
  const { userLoggedIn } = useAuth();
  const location = useLocation();

  if (!userLoggedIn && location.pathname !== '/') {
    return <Navigate to="/" />;
  }

  if (userLoggedIn && location.pathname === '/') {
    return <Navigate to="/main" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;