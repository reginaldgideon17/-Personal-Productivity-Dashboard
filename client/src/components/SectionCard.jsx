export default function SectionCard({ title, action, children, className = '' }) {
  return (
    <section className={`section-card ${className}`}>
      <div className="section-card-heading">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
