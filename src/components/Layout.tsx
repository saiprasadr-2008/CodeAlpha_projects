import type { ReactNode } from 'react';
import { useState } from 'react';
import { BarChart3, BookOpen, Brain, ChevronRight, CircleHelp, Command, Compass, Home, Menu, Settings2, Sparkles, X } from 'lucide-react';
import type { Notice, PageId } from '../App';

type Props = {
  page: PageId;
  onNavigate: (page: PageId) => void;
  points: number;
  notice: Notice | null;
  onDismissNotice: () => void;
  children: ReactNode;
};

const navigation: { id: PageId; label: string; icon: typeof Home; group?: string }[] = [
  { id: 'dashboard', label: 'Overview', icon: Home, group: 'WORKSPACE' },
  { id: 'library', label: 'My library', icon: BookOpen },
  { id: 'study', label: 'Study session', icon: Brain, group: 'LEARN' },
  { id: 'quiz', label: 'Quick quiz', icon: Sparkles },
  { id: 'analytics', label: 'Progress', icon: BarChart3, group: 'INSIGHTS' },
];

const pageTitles: Record<PageId, string> = {
  dashboard: 'Your learning space', library: 'Flashcard library', study: 'Study session', quiz: 'Quick quiz', analytics: 'Progress & insights', settings: 'Your preferences',
};

export function Layout({ page, onNavigate, points, notice, onDismissNotice, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (id: PageId) => {
    onNavigate(id);
    setMenuOpen(false);
  };
  const navContent = (mobile = false) => navigation.map((item, index) => {
    const Previous = navigation[index - 1];
    const showGroup = item.group && (!Previous || item.group !== Previous.group);
    return (
      <div key={item.id}>
        {showGroup && <div className={`nav-group ${mobile ? 'mobile-only' : ''}`}>{item.group}</div>}
        <button className={`nav-link ${page === item.id ? 'active' : ''}`} onClick={() => go(item.id)} aria-current={page === item.id ? 'page' : undefined}>
          <item.icon size={18} strokeWidth={1.8} /><span>{item.label}</span>{item.id === 'study' && <span className="nav-dot" />}
        </button>
      </div>
    );
  });

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <button className="brand lockup" onClick={() => go('dashboard')} aria-label="RecallQuest home">
          <span className="brand-mark"><Compass size={21} strokeWidth={2.1} /><i /></span>
          <span className="brand-copy"><strong>recall<span>quest</span></strong><small>STUDY STUDIO</small></span>
        </button>
        <div className="sidebar-rule" />
        <nav aria-label="Main navigation" className="sidebar-nav">{navContent()}</nav>
        <div className="sidebar-spacer" />
        <div className="streak-card">
          <div className="streak-top"><span className="streak-flame">✦</span><span>YOUR MOMENTUM</span><span className="streak-value">{points.toLocaleString()} <small>XP</small></span></div>
          <div className="streak-track"><span style={{ width: `${Math.min(100, points % 100)}%` }} /></div>
          <p>Every small session adds up.</p>
        </div>
        <button className={`nav-link settings-link ${page === 'settings' ? 'active' : ''}`} onClick={() => go('settings')}><Settings2 size={18} /><span>Settings</span></button>
        <div className="profile-mini"><div className="avatar">RQ</div><div><strong>Curious learner</strong><small>Local profile</small></div><ChevronRight size={15} className="profile-arrow" /></div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
            <div className="breadcrumb"><span>RecallQuest</span><ChevronRight size={14} /><strong>{pageTitles[page]}</strong></div>
          </div>
          <div className="topbar-right"><div className="date-pill"><span className="online-dot" /> Learning locally</div><button className="icon-button help-button" title="Every review is saved on this device"><CircleHelp size={18} /></button><div className="avatar top-avatar">RQ</div></div>
        </header>
        <div className="page-container">{children}</div>
      </main>

      {menuOpen && <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)}>
        <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
          <div className="drawer-head"><div className="brand lockup"><span className="brand-mark"><Compass size={20} /><i /></span><span className="brand-copy"><strong>recall<span>quest</span></strong><small>STUDY STUDIO</small></span></div><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
          <nav aria-label="Mobile navigation">{navContent(true)}<button className={`nav-link ${page === 'settings' ? 'active' : ''}`} onClick={() => go('settings')}><Settings2 size={18} /><span>Settings</span></button></nav>
          <div className="drawer-tip"><Command size={15} /><span>Your progress stays on this device.</span></div>
        </aside>
      </div>}

      {notice && <div className={`toast ${notice.tone === 'error' ? 'toast-error' : ''}`} role="status"><span className="toast-check">{notice.tone === 'error' ? '!' : '✓'}</span><span>{notice.message}</span><button onClick={onDismissNotice} aria-label="Dismiss notification"><X size={15} /></button></div>}
    </div>
  );
}
