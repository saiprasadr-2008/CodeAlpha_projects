import type { ReactNode } from 'react';
import { ArrowRight, Inbox } from 'lucide-react';

export function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="heading-actions">{actions}</div>}</div>;
}

export function EmptyState({ title, description, action, icon }: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) {
  return <div className="empty-state"><div className="empty-state-icon">{icon ?? <Inbox size={19} />}</div><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function TextLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button className="panel-action" onClick={onClick}>{children}<ArrowRight size={13} /></button>;
}
