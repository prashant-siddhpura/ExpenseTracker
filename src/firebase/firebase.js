import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDwbel-n_tYRE44D4E6wSYlXbQBNBGXsmI",
    authDomain: "expensetracker-4475a.firebaseapp.com",
    projectId: "expensetracker-4475a",
    storageBucket: "expensetracker-4475a.firebasestorage.app",
    messagingSenderId: "127625897611",
    appId: "1:127625897611:web:90ca48eb5d05a636d5968e",
    measurementId: "G-RE1XLGPEDF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);