import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HIERARCHY = { user: 0, agent: 1, admin: 2, superadmin: 3 };

interface Props {
  children: React.ReactNode;
  role?: 'user' | 'agent' | 'admin' | 'superadmin';
}

export default function ProtectedRoute({ children, role = 'user' }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" /></div>;

  if (!user) return <Navigate to="/" replace />;

  const userLevel = ROLE_HIERARCHY[user.role as keyof typeof ROLE_HIERARCHY] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[role];

  if (userLevel < requiredLevel) return <Navigate to="/" replace />;

  return <>{children}</>;
}
