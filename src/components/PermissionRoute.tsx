import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth, Permission } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface PermissionRouteProps {
  children: React.ReactNode;
  permission: Permission;
  fallbackPath?: string;
}

export default function PermissionRoute({ children, permission, fallbackPath }: PermissionRouteProps) {
  const { isAuthenticated, hasPermission, user } = useAuth();
  const navigate = useNavigate();
  const [checkedRedirect, setCheckedRedirect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (!hasPermission(permission) && !checkedRedirect) {
      setCheckedRedirect(true);
      
      // Tentar redirecionar para o fallback ou buscar primeira rota com permissão
      if (fallbackPath) {
        navigate(fallbackPath, { replace: true });
      } else {
        // Lista de rotas alternativas em ordem de prioridade
        const alternativeRoutes = [
          { path: '/cash-management', permission: 'cash-management' as Permission },
          { path: '/marketplace-orders', permission: 'marketplace-orders' as Permission },
          { path: '/products', permission: 'products' as Permission },
          { path: '/sales', permission: 'sales' as Permission },
          { path: '/production', permission: 'production' as Permission },
          { path: '/settings', permission: 'settings' as Permission },
        ];

        const availableRoute = alternativeRoutes.find(route => 
          hasPermission(route.permission)
        );

        if (availableRoute) {
          navigate(availableRoute.path, { replace: true });
        } else {
          // Se não tiver permissão para nenhuma rota, mostrar mensagem de erro
          navigate('/no-permissions', { replace: true });
        }
      }
    }
  }, [isAuthenticated, hasPermission, permission, navigate, fallbackPath, checkedRedirect]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(permission)) {
    return null; // O useEffect cuidará do redirecionamento
  }

  return <>{children}</>;
}
