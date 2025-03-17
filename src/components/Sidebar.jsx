// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold text-white">Menu</h2>
      </div>
      <nav>
        <ul>
          <li>
            <Link
              to="/"
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors block text-white"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/monthly"
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors block text-white"
            >
              Monthly Report
            </Link>
          </li>
          <li>
            <Link
              to="/add-transaction"
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors block text-white"
            >
              Add Transaction
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors block text-white"
            >
              History
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};