import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerSW, showUpdateAvailable } from "./lib/serviceWorker";
import { initPerformanceMonitoring } from "./lib/performance";

// Initialize performance monitoring
initPerformanceMonitoring({
  enableLogging: process.env.NODE_ENV === 'development',
  enableAnalytics: process.env.NODE_ENV === 'production',
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
});

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for offline support
registerSW({
  onSuccess: (registration) => {
    console.log('Service worker registered successfully');
  },
  onUpdate: (registration) => {
    console.log('New app version available');
    showUpdateAvailable();
  },
  onOffline: () => {
    console.log('App is running in offline mode');
  },
  onOnline: () => {
    console.log('App is back online');
  },
});
