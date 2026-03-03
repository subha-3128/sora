import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV && "serviceWorker" in navigator) {
	navigator.serviceWorker.getRegistrations().then((registrations) => {
		registrations.forEach((registration) => {
			registration.unregister();
		});
	});

	if ("caches" in window) {
		caches.keys().then((keys) => {
			keys.forEach((key) => caches.delete(key));
		});
	}
}

if (import.meta.env.PROD) {
	const swScript = document.createElement("script");
	swScript.src = "/register-sw.js";
	document.body.appendChild(swScript);
}

createRoot(document.getElementById("root")!).render(<App />);
