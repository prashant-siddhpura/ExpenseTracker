// // src/components/Sidebar.js
// import React from 'react';
// import { Link } from 'react-router-dom';

// export const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <div className="mb-8 text-center">
//         <h2 className="text-xl font-semibold text-white">Menu</h2>
//       </div>
//       <nav>
//         <ul>
//           <li>
//             <Link
//               to="/"
//               className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors block text-white"
//             >
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/monthly"
//               className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors block text-white"
//             >
//               Monthly Report
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/budget"
//               className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors block text-white"
//             >
//               Budget Management
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/add-transaction"
//               className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors block text-white"
//             >
//               Add Transaction
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/history"
//               className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded transition-colors block text-white"
//             >
//               History
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
              <button>Home</button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
              <button>History</button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-transaction" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
              <button>Add Transaction</button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/budget" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
              <button>Budget</button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/monthly" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
              <button>Monthly Report</button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
              <button>Profile</button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/group-expenses" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
              <button>Group Splitting</button>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};