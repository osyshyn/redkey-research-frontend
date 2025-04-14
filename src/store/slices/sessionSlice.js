import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSessionsAPI, changeSessionStatusAPI } from '../../api/sessionApi';

export const getSessions = createAsyncThunk(
  'session/getSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSessionsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeSessionStatus = createAsyncThunk(
  'session/changeSessionStatus',
  async ({ sessionId, sessionNewStatus }, { rejectWithValue }) => {
    try {
      const response = await changeSessionStatusAPI(
        sessionId,
        sessionNewStatus
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const sessionsSlice = createSlice({
  name: 'session',
  initialState: {
    sessions: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changeSessionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeSessionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSession = action.payload;
        const index = state.sessions.findIndex(
          (session) => session.id === updatedSession.id
        );
        if (index !== -1) {
          state.sessions[index] = updatedSession;
        }
      })
      .addCase(changeSessionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = sessionsSlice.actions;
export default sessionsSlice.reducer;
