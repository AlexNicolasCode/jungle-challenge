import { createRootRoute, Link, Outlet, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';

import { useAuth, useNotification } from '../hooks';

const RootLayout = () => {
    const { isAuthenticated, logout } = useAuth();
    const { renderNotifications } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: '/login' });
            return
        }
    }, [isAuthenticated])

  const renderAuthenticatedTopBar = () => {
    return (
      <>
        <Link to="/" className="[&.active]:font-bold">
        Home
        </Link>
        <Link to="/tasks/create" className="[&.active]:font-bold">
          Create Task
        </Link>
        <button onClick={() => {
            logout();
            navigate({ to: '/login' });
        }} className="[&.active]:font-bold">
          Logout
        </button>
      </>
    )
  }

  const renderUnauthenticatedTopBar = () => {
    return (
      <>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>
        <Link to="/register" className="[&.active]:font-bold">
          SignUp
        </Link>
      </>
    )
  }

  const renderTopBar = () => {
    if (isAuthenticated) {
      return renderAuthenticatedTopBar();
    }
    return renderUnauthenticatedTopBar();
  }

  return (
    <>
        <div className="p-2 flex gap-2">
        {renderTopBar()}
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
        {renderNotifications()}
    </>
  );
}

export const Route = createRootRoute({ component: RootLayout })
