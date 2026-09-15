import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function TaskCard({ task, onStatusChange, onDelete }) {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-start">
        <div>
          <h5 className="card-title mb-1">{task.title}</h5>
          {task.description && (
            <p className="card-text text-muted mb-1">{task.description}</p>
          )}
          <div className="d-flex align-items-center gap-2">
            <StatusBadge status={task.status} onClick={(next) => onStatusChange(task, next)} />
            {task.category && (
              <span className="badge bg-light text-dark border">{task.category.name}</span>
            )}
            {task.due_date && (
              <small className="text-muted">Échéance : {task.due_date}</small>
            )}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/tasks/${task.id}/edit`} className="btn btn-sm btn-outline-secondary">
            Modifier
          </Link>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task)}>
            Suppr.
          </button>
        </div>
      </div>
    </div>
  );
}
