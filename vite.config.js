// import { defineConfig } from 'vite';

// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   base: '', // Set this to your repository name
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure this matches your dev server port
    open: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Ensure .jsx is recognized
  },
});