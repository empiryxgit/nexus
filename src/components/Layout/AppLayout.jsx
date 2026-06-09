import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NexiDrawer from '../Nexi/NexiDrawer';

export default function AppLayout() {
  const contentStyle = {
    marginLeft: 'var(--sidebar-width)',
    marginTop: 'var(--topbar-height)',
    minHeight: 'calc(100vh - var(--topbar-height))',
    padding: 'var(--space-8)',
    transition: 'margin-left var(--duration-slow) var(--ease-out)',
  };

  return (
    <div id="app-layout">
      <Sidebar />
      <Topbar />
      <main style={contentStyle}>
        <Outlet />
      </main>
      <NexiDrawer />
    </div>
  );
}
