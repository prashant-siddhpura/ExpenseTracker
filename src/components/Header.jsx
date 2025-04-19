// // src/components/Header.js
// import React, { useState, useEffect, useContext } from "react";
// import { GlobalContext } from "../context/GlobalState";
// import { auth } from "../firebase/firebase";

// export const Header = () => {
//   const currentUser = auth.currentUser;
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     return localStorage.getItem("darkMode") === "true";
//   });

//   // Update date every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDate(new Date());
//     }, 60000); // Update every minute instead of every second
//     return () => clearInterval(timer);
//   }, []);

//   // Handle dark mode toggle and persistence
//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//     localStorage.setItem("darkMode", isDarkMode);
//   }, [isDarkMode]);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       // Optionally redirect to login or update app state (handled by App.js)
//       console.log("User logged out");
//     } catch (error) {
//       console.error("Logout error:", error.message);
//     }
//   };


//   const formattedDate = currentDate.toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return (
//     <header
//       className= "text-white shadow-lg w-full"
//       style={{ zIndex: 20 }} // Increase z-index to be above sidebar (z-index: 10)
//     >
//       <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//         <h1
//           style={{ color: "#ffffff" }}
//           className="text-2xl font-semibold tracking-tight"
//         >
//           Expense Tracker
//         </h1>
//         <div className="flex items-center space-x-4">
//           {currentUser && (
//             <span className="text-sm font-medium">
//               Welcome, {currentUser.displayName || currentUser.email}
//             </span>
//           )}
//           <span className="text-sm font-medium">{formattedDate}</span>
//           <button
//             onClick={() => setIsDarkMode(!isDarkMode)}
//             className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
//             aria-label="Toggle dark mode"
//           >
//             {isDarkMode ? (
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//                 />
//               </svg>
//             )}
//           </button>
//           <span className="text-sm font-medium">
//             {isDarkMode ? "<- Dark Mode" : "<- Light Mode"}
//           </span>

//           {currentUser && (
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 hover:bg-red-600 text-white font-medium  rounded-md transition-colors focus:outline-none"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };


// src/components/Header.js
import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { auth } from '../firebase/firebase';

export const Header = () => {
  const { userSettings } = useContext(GlobalContext);
  const currentUser = auth.currentUser;
  const [displayName, setDisplayName] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Set display name and photo from userSettings
  useEffect(() => {
    if (userSettings) {
      setDisplayName(userSettings.display_name || (currentUser?.displayName || currentUser?.email || 'Guest'));
      setPhotoPreview(userSettings.photo ? `data:image/jpeg;base64,${userSettings.photo}` : '');
    } else if (currentUser) {
      setDisplayName(currentUser.displayName || currentUser.email || 'Guest');
    }
  }, [userSettings, currentUser]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out');
      // Optionally redirect to login or update app state (handled by App.js)
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <header
      className="text-white shadow-lg w-full"
      style={{ zIndex: 20, position: 'fixed', top: 0, left: 0 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-600"
            />
          )}
          <span className="text-sm font-medium">{displayName}</span>
          <h1 className="text-2xl font-semibold tracking-tight">Expense Tracker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">{formattedDate}</span>
          {currentUser && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-md transition-colors focus:outline-none"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};