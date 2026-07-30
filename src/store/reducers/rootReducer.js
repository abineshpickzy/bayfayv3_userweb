import {combineReducers} from "redux";
import cartReducer from "./cartReducer";
import globalReducer from "./globalReducer";
import productsReducer from "./productsReducer";
import authReducer from "./authReducer";
import shopsReducer from "./shopsReducer";
import orderReducer from "./orderReducer";
import razorReducer from './razorReducer';
import trackOrderReducer from "./trackOrderReducer";
import ordersHistoryReducer from './ordersHistoryReducer';

const rootReducer = combineReducers({
    cartReducer,
    globalReducer,
    productsReducer,
    authReducer,
    shopsReducer,
    orderReducer,
    razorReducer,
    trackOrderReducer,
    ordersHistoryReducer
});

export default rootReducer;
