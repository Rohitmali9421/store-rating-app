import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  isError: false,
  isLoading: false,
  message: '',
};

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/auth/login', userData);
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/auth/register', userData);
        if (response.data) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      } catch (error) {
        const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message;
        return thunkAPI.rejectWithValue(message);
      }
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async (passwordData, thunkAPI) => {
    try {
        const response = await api.put('/auth/update-password', passwordData); 
        return response.data.message || 'Password updated successfully!';
    } catch (error) {
        const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
    },
    // New reducer to clear messages
    clearAuthState: (state) => {
        state.isError = false;
        state.isLoading = false;
        state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Signup Cases
      .addCase(signup.pending, (state) => { state.isLoading = true; })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isError = false;
        state.message = '';
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // NEW CASES FOR PASSWORD UPDATE
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.message = '';
        state.isError = false;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload; // Success message
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Error message
      });
  },
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;