import StaggerCard from './animation/StaggerCard';

const CREDENTIALS = [
  { label: 'Experience', value: '10+ Years' },
  { label: 'Java', value: 'OCP SE 11' },
  { label: 'Kubernetes', value: 'CKAD · CKA' },
  { label: 'AWS', value: 'SA Pro · Dev' },
  { label: 'Agentic AI', value: 'Harness Eng.' },
];

export default function CredentialStrip() {
  return (
    <div className="cred-strip">
      <div className="cred-grid">
        {CREDENTIALS.map((c, i) => (
          <StaggerCard key={c.label} index={i} className="cred-cell">
            <div className="cred-label">{c.label}</div>
            <div className="cred-value">{c.value}</div>
          </StaggerCard>
        ))}
      </div>
    </div>
  );
}
