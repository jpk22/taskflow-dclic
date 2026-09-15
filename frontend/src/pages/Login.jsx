import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate("/dashboard");
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card mt-5">
        <div className="card-body p-4">
          <h1 className="h4 mb-4 text-center">Connexion</h1>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <p className="text-center text-muted mt-3 mb-0">
            Pas encore de compte ? <Link to="/register">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
