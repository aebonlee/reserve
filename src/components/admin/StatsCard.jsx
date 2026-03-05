const StatsCard = ({ icon, label, value, color = 'blue' }) => {
  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-info">
        <span className="stats-card-value">{value}</span>
        <span className="stats-card-label">{label}</span>
      </div>
    </div>
  );
};

export default StatsCard;
