import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
    token: string | null;
    user: { _id: string; nombre: string; email: string; tipo: string } | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("token") || null,
    user: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:5001/api/auth/login", credentials);
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            return { token, user };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Error al iniciar sesión");
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (
        userData: { nombre: string; email: string; password: string; tipo: "alumno" | "profesor" },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post("http://localhost:5001/api/auth/register", userData);
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            return { token, user };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Error al registrarse");
        }
    }
);

export const fetchProfile = createAsyncThunk(
    "auth/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5001/api/auth/perfil", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.msg || "Error al obtener perfil");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: any }>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Registro
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ token: string; user: any }>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<any>) => {
                state.user = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
