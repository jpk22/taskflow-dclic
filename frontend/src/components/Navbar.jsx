import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          TaskFlow
        </Link>
        <div className="navbar-nav me-auto">
          <Link className="nav-link" to="/dashboard">Tableau de bord</Link>
          <Link className="nav-link" to="/tasks">Tâches</Link>
          <Link className="nav-link" to="/categories">Catégories</Link>
        </div>
        <div className="d-flex align-items-center">
          <span className="text-light me-3">{user.name}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
