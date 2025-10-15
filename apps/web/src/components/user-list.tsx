import React from 'react';

import { UserEntity } from '@/shared/types';

type UserListProps = {
  users: UserEntity[];
  loading: boolean;
}

export const UserList: React.FC<UserListProps> = ({ users = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl border border-gray-200 bg-gray-100 overflow-hidden relative"
          >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
            <span className="text-sm text-gray-400">#{user.id.slice(0, 6)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
