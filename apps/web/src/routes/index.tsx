import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useAuth } from '../hooks';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();

  const logoutUser = () => {
    logout();
    navigate({ to: '/login' });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
      {tokens ? (
        <>
          <p className="mb-4">You are logged in. Access Token:</p>
          <code className="bg-white p-2 rounded shadow break-words">{tokens.accessToken}</code>
          <button
            onClick={logoutUser}
            className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-gray-600">You are not logged in.</p>
      )}
    </div>
  );
};