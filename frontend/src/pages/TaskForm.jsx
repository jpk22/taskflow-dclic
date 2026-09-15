import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const emptyForm = {
  title: "",
  description: "",
  due_date: "",
  status: "a_faire",
  category_id: "",
};

export default function TaskForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.data || data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/tasks/${id}`).then(({ data }) => {
      const task = data.data || data;
      setForm({
        title: task.title || "",
        description: task.description || "",
        due_date: task.due_date || "",
        status: task.status || "a_faire",
        category_id: task.category_id || "",
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (isEdit) {
        await api.put(`/tasks/${id}`, form);
      } else {
        await api.post("/tasks", form);
      }
      navigate("/tasks");
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p className="text-muted">Chargement...</p></div>;

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <h1 className="h4 mb-4">{isEdit ? "Modifier la tâche" : "Nouvelle tâche"}</h1>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Titre</label>
          <input
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            value={form.title}
            onChange={handleChange("title")}
            required
          />
          {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={3}
            value={form.description}
            onChange={handleChange("description")}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Date d'échéance</label>
            <input
              type="date"
              className="form-control"
              value={form.due_date}
              onChange={handleChange("due_date")}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Catégorie</label>
            <select className="form-select" value={form.category_id} onChange={handleChange("category_id")}>
              <option value="">Aucune</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Statut</label>
          <select className="form-select" value={form.status} onChange={handleChange("status")}>
            <option value="a_faire">À faire</option>
            <option value="en_cours">En cours</option>
            <option value="terminee">Terminée</option>
          </select>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-dark" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/tasks")}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
