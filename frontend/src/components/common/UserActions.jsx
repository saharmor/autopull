import React from 'react';

export default function UserActions({ user, logout }) {
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-8 mt-2 md:mt-0 md:ml-auto">
      <div className="flex items-center space-x-4">
        {user.avatar_url && (
          <img 
            src={user.avatar_url} 
            alt="User avatar" 
            className="rounded-full border-2 border-primary-300" style={{ height: '80px', width: '80px' }}
          />
        )}
        <span className="text-lg font-medium text-primary-100">
          {user.github_username}
        </span>
      </div>
      <button
        onClick={logout}
        className="text-xs font-medium text-primary-100 hover:text-white px-3 py-1 rounded-md hover:bg-primary-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
