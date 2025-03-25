import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
    _id: string;
    nombre: string;
    email: string;
    tipo: "alumno" | "profesor" | "admin";
}

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        console.log("📦 Token en fetchUsers:", token);
        const response = await axios.get<User[]>("http://localhost:5001/api/users", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("❌ Error en fetchUsers:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.msg || "Error al obtener usuarios");
    }
});

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
      try {
        await axios.delete(`http://localhost:5001/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return id;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.msg || "Error al eliminar usuario");
      }
    }
  );
  

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (
      {
        id,
        updatedData,
        token,
      }: { id: string; updatedData: Partial<User>; token: string },
      { rejectWithValue }
    ) => {
      try {
        const response = await axios.put(
          `http://localhost:5001/api/users/${id}`,
          updatedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.msg || "Error al actualizar usuario");
      }
    }
  );
  

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {}, 
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.users = state.users.map((user) =>
                    user._id === action.payload._id ? action.payload : user
                );
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default userSlice.reducer;
