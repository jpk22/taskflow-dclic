import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // category being edited, or {} for a new one
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = () => {
    setLoading(true);
    api
      .get("/categories")
      .then(({ data }) => setCategories(data.data || data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCategories, []);

  const openNew = () => {
    setEditing({});
    setName("");
    setError("");
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing.id) {
        await api.put(`/categories/${editing.id}`, { name });
      } else {
        await api.post("/categories", { name });
      }
      setEditing(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Impossible d'enregistrer la catégorie.");
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Supprimer la catégorie "${cat.name}" ?`)) return;
    await api.delete(`/categories/${cat.id}`);
    fetchCategories();
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Mes catégories</h1>
        <button className="btn btn-dark" onClick={openNew}>
          + Nouvelle catégorie
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card p-3 mb-4">
          <label className="form-label">Nom de la catégorie</label>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            <button type="submit" className="btn btn-dark">Enregistrer</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(null)}>
              Annuler
            </button>
          </div>
          {error && <div className="text-danger small mt-2">{error}</div>}
        </form>
      )}

      {loading && <p className="text-muted">Chargement...</p>}
      {!loading && categories.length === 0 && (
        <p className="text-muted">Aucune catégorie pour le moment.</p>
      )}
      {categories.map((cat) => (
        <div key={cat.id} className="card mb-2">
          <div className="card-body d-flex justify-content-between align-items-center py-2">
            <span>{cat.name}</span>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(cat)}>
                Modifier
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat)}>
                Suppr.
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
