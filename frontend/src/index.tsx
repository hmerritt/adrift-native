import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";

import store from "store";
import "styles/global/index.scss";
import { injectGlobalLog, versionLog } from "utils";

injectGlobalLog();
versionLog();

const rootElement = document.getElementById("root");
const root = createRoot(rootElement as HTMLElement);

root.render(
	<StrictMode>
		<Provider store={store}>
			<HashRouter basename={"/"}>
				<App />
			</HashRouter>
		</Provider>
	</StrictMode>
);
