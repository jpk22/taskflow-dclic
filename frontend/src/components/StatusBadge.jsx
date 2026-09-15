const LABELS = {
  a_faire: "À faire",
  en_cours: "En cours",
  terminee: "Terminée",
};

const CLASSES = {
  a_faire: "bg-secondary",
  en_cours: "bg-warning text-dark",
  terminee: "bg-success",
};

// Clicking the badge cycles to the next status (à faire -> en cours -> terminée -> à faire).
// This matches the "click the badge to change status" interaction from the wireframes.
const NEXT_STATUS = {
  a_faire: "en_cours",
  en_cours: "terminee",
  terminee: "a_faire",
};

export default function StatusBadge({ status, onClick, clickable = true }) {
  return (
    <span
      className={`badge ${CLASSES[status] || "bg-secondary"} ${clickable ? "cursor-pointer" : ""}`}
      style={clickable ? { cursor: "pointer" } : undefined}
      role={clickable ? "button" : undefined}
      title={clickable ? "Cliquer pour changer le statut" : undefined}
      onClick={clickable && onClick ? () => onClick(NEXT_STATUS[status] || "a_faire") : undefined}
    >
      {LABELS[status] || status}
    </span>
  );
}
