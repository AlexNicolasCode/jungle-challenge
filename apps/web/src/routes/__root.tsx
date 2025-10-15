import { createRootRoute, Link, Outlet, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
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
      <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
                <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <NavigationMenuLink asChild>
                        <Link to="/">Home</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                        <Link to="/tasks/create">Create Task</Link>
                    </NavigationMenuLink>
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink onClick={logout}>
                    Logout
                </NavigationMenuLink>
            </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
  }

  const renderUnauthenticatedTopBar = () => {
    return (
      <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <NavigationMenuLink asChild>
                        <Link to="/login">Login</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                        <Link to="/register">Register</Link>
                    </NavigationMenuLink>
                </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
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
