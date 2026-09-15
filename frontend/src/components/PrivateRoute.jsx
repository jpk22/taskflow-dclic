import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any route element with <PrivateRoute> to require authentication.
// Example: <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
