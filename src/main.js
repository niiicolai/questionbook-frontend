import './layout/layout.js';
import './router.js';

// Configure Content Security Policy
const serverUrl = import.meta.env.VITE_API_HOST;
const csp = `default-src 'self' https://cdn.tailwindcss.com; 
             style-src 'self' https://cdn.tailwindcss.com 'unsafe-inline'; 
             form-action 'self'; 
             connect-src 'self' ${serverUrl};
             img-src 'self' ${serverUrl} data:;`;
const meta = document.createElement('meta');
meta.httpEquiv = 'Content-Security-Policy';
meta.content = csp;
document.head.appendChild(meta);
