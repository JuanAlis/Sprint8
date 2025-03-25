import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./useSlice"; 
import authReducer from "./authSlice"; 

const store = configureStore({
    reducer: {
        auth: authReducer, 
        users: userReducer, 
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
