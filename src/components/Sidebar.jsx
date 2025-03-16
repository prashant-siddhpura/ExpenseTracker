// src/components/Sidebar.js
import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const Sidebar = () => {
  const { setViewMode } = useContext(GlobalContext);

  return (
    <div className="sidebar">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold text-white">Menu</h2>
      </div>
      <nav>
        <ul>
          <li>
            <button
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors"
              onClick={() => setViewMode('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors"
              onClick={() => setViewMode('monthly')}
            >
              Monthly Report
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};