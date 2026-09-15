import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (categoryId) params.category_id = categoryId;
    if (search) params.search = search;
    api
      .get("/tasks", { params })
      .then(({ data }) => setTasks(data.data || data))
      .finally(() => setLoading(false));
  }, [status, categoryId, search]);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.data || data));
  }, []);

  useEffect(() => {
    // Debounce so we don't fire a request on every keystroke of the search field.
    const id = setTimeout(fetchTasks, 300);
    return () => clearTimeout(id);
  }, [fetchTasks]);

  const handleStatusChange = async (task, nextStatus) => {
    // Optimistic update so the badge reacts immediately, then confirm with the API.
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    try {
      await api.put(`/tasks/${task.id}`, { status: nextStatus });
    } catch {
      fetchTasks(); // roll back to server state if the update failed
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Supprimer la tâche "${task.title}" ?`)) return;
    await api.delete(`/tasks/${task.id}`);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Mes tâches</h1>
        <Link to="/tasks/new" className="btn btn-dark">
          + Nouvelle tâche
        </Link>
      </div>

      <div className="row g-2 mb-4">
        <div className="col-md-3">
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="a_faire">À faire</option>
            <option value="en_cours">En cours</option>
            <option value="terminee">Terminée</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Rechercher par mot-clé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="text-muted">Chargement...</p>}
      {!loading && tasks.length === 0 && (
        <p className="text-muted">Aucune tâche ne correspond à ces critères.</p>
      )}
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
      ))}
    </div>
  );
}
