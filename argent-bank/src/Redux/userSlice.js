import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3001/api/v1/user";

// Action asynchrone pour la connexion de l'utilisateur
export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      return response.data.body; // Retourne les données de l'utilisateur connecté et le token JWT
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Rejet avec les données de l'erreur
    }
  }
);

// Action asynchrone pour récupérer le profil de l'utilisateur
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await axios.post(
        `${API_URL}/profile`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.body;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Action asynchrone pour mettre à jour le profil de l'utilisateur
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await axios.put(`${API_URL}/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.body;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // État initial de l'utilisateur (non connecté)
    token: localStorage.getItem('token') || null, // Token JWT initialisé depuis localStorage
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem('token'); // Supprime le token de localStorage lors de la déconnexion
    },
  },
  extraReducers: (builder) => {
    // Gestion des différents états des actions asynchrones
    builder
      // Gestion du login
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Login fulfilled: ", action.payload); // Journal ici
        state.status = "succeeded";
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token); // Stocke le token dans localStorage lors de la connexion
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.log("Login rejected: ", action.payload); // Journal ici
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
      })

      // Gestion du fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Fetch user profile failed";
      })

      // Gestion de updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Update user profile failed";
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
