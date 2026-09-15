import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tasks")
      .then(({ data }) => setTasks(data.data || data))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    a_faire: tasks.filter((t) => t.status === "a_faire").length,
    en_cours: tasks.filter((t) => t.status === "en_cours").length,
    terminee: tasks.filter((t) => t.status === "terminee").length,
  };

  const upcoming = [...tasks]
    .filter((t) => t.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  return (
    <div className="container">
      <h1 className="h3 mb-4">Bonjour, {user?.name}</h1>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">À faire</h6>
              <p className="display-6 mb-0">{loading ? "…" : counts.a_faire}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">En cours</h6>
              <p className="display-6 mb-0">{loading ? "…" : counts.en_cours}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">Terminées</h6>
              <p className="display-6 mb-0">{loading ? "…" : counts.terminee}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Tâches à échéance proche</h5>
          {loading && <p className="text-muted">Chargement...</p>}
          {!loading && upcoming.length === 0 && (
            <p className="text-muted mb-0">Aucune tâche avec échéance pour le moment.</p>
          )}
          {upcoming.map((t) => (
            <div key={t.id} className="d-flex align-items-center gap-2 py-1">
              <StatusBadge status={t.status} clickable={false} />
              <span>{t.title}</span>
              <small className="text-muted ms-auto">{t.due_date}</small>
            </div>
          ))}
        </div>
      </div>

      <Link to="/tasks" className="btn btn-outline-dark">
        Voir toutes les tâches
      </Link>
    </div>
  );
}
