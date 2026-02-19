import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { debugEnv } from "./config/api.ts";
import "./i18n";

// Debug environment on app startup
if (typeof window !== 'undefined') {
  console.log('🚀 HillSmart App Starting...');
  debugEnv();
}

// Error boundary for uncaught errors
window.addEventListener('error', (event) => {
  console.error('❌ Uncaught Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled Promise Rejection:', event.reason);
});

const root = document.getElementById("root");
if (!root) {
  console.error('❌ Root element not found!');
} else {
  createRoot(root).render(<App />);
}
