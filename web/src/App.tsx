import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>;
  if (!user) return <Auth />;
  return <Dashboard />;
}

function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}

export default App;
