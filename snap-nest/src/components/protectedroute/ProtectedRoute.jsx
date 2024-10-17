import { Navigate } from 'react-router-dom';
import { useAuth } from '../../state/authcontext/AuthContext';
import PropTypes from 'prop-types';

function ProtectedRoute({ children }) {
  const { userLoggedIn } = useAuth();

  if (userLoggedIn) {
    return <Navigate to="/main" />;
  }

  return children;
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
