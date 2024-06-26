import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1/user';

// Action asynchrone pour la connexion de l'utilisateur
export const login = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      return response.data.body; // Retourne les données de l'utilisateur connecté et le token JWT
    } catch (error) {
      return rejectWithValue(error.response.data); // Rejet avec les données de l'erreur
    }
  }
);

// Action asynchrone pour récupérer le profil de l'utilisateur
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      const response = await axios.post(`${API_URL}/profile`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.body;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Action asynchrone pour mettre à jour le profil de l'utilisateur
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      const response = await axios.put(`${API_URL}/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.body;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null, // État initial de l'utilisateur (non connecté)
    token: null, // Token JWT
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Gestion du login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Login fulfilled: ", action.payload); // Journal ici
        state.status = 'succeeded';
        state.token = action.payload.token;
        // Assurez-vous de déclencher fetchUserProfile après avoir obtenu le token
      })
      .addCase(login.rejected, (state, action) => {
        console.log("Login rejected: ", action.payload); // Journal ici
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed';
      })
      // Gestion du fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Fetch user profile failed';
      })
      // Gestion de updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Update user profile failed';
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
