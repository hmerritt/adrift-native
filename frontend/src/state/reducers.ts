import { combineReducers } from "redux";

import count from "./slices/count/countReducer";

const rootReducer = combineReducers({
	count,
});

export default rootReducer;
