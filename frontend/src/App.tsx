import { Routes, Route } from "react-router-dom";

import { Home, NotFound } from "view/screens";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Home />} />

				{/* 404 */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
