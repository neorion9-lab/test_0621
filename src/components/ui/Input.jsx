export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col mb-4 w-full ${className}`}>
      {label && <label className="label">{label}</label>}
      <input className="input-field" style={error ? { borderColor: 'var(--danger)' } : {}} {...props} />
      {error && <span className="mt-1" style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}
