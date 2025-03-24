import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./useSlice"; // Importa tu userSlice
import authReducer from "./authSlice"; // Importa el nuevo authSlice

const store = configureStore({
    reducer: {
        auth: authReducer, // Maneja la autenticación (login, token, perfil)
        users: userReducer, // Maneja el CRUD de usuarios
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
