import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { plausibleBootstrap } from "lib/analytics";
import "lib/styles/global/index.scss";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import App from "./App";

plausibleBootstrap();

const rootElement = document.getElementById("root");
const root = createRoot(rootElement as HTMLElement);

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// @ts-ignore: config param is optional
serviceWorkerRegistration.register();
