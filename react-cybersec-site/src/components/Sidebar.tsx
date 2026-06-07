import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NavigationItem } from '../types';

const NAV_ITEMS: NavigationItem[] = [
  { id: 'terminal', label: 'Terminal', icon: '⌂', path: '/' },
  { id: 'redteam', label: 'RedTeam', icon: '⚔', path: '/redteam' },
  { id: 'blueteam', label: 'BlueTeam', icon: '🛡', path: '/blueteam' },
  { id: 'web-analysis', label: 'Web Analysis', icon: '🌐', path: '/web-analysis' },
  { id: 'malware-analysis', label: 'Malware Chat', icon: '☣', path: '/malware-analysis' },
  { id: 'file-analysis', label: 'File Analysis', icon: '📁', path: '/file-analysis' },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();

  const getActiveClass = (path: string): string => {
    if (path === '/' && location.pathname === '/') return 'active';
    if (path !== '/' && location.pathname.startsWith(path)) return 'active';
    return '';
  };

  return (
    <nav className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">NAVIGATION</div>
      </div>
      <ul className="nav-items">
        {NAV_ITEMS.map(item => (
          <li key={item.id} className={`nav-item ${getActiveClass(item.path)}`}>
            <span className="nav-icon">{item.icon}</span>
            <NavLink to={item.path} className="nav-text">
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
