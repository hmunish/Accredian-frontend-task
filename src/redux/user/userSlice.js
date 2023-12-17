import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utility/config";
import {
  getLocalStorageAuthToken,
  removeLocalStorageAuthToken,
  setLocalStorageAuthToken,
} from "../../utility/helper";
import sanitize from "../../utility/sanitize";

const initialState = {
  isLoadingSignUp: false,
  isErrorSignUp: null,
  isSuccessSignUp: false,
  isLoadingLogin: false,
  isErrorLogin: null,
  isSuccessLogin: false,
  isAuthorized: false,
  userAuthToken: getLocalStorageAuthToken(),
};

export const authorizeUser = createAsyncThunk(
  "user/authorizeUser",
  async (_, thunkAPI) => {
    try {
      const { userAuthToken } = thunkAPI.getState().user;
      if (!userAuthToken) throw new Error("No authentication found");
      axios.defaults.headers.common.Authorization = userAuthToken;
      const response = await axios.get(`${API_URL}/user`);
      if (response.status === 200)
        return thunkAPI.fulfillWithValue(response.data);
      throw new Error("User not authorized");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const signup = createAsyncThunk(
  "onboard/signup",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const sanitizedUsername = sanitize(username);
      const sanitizedEmail = sanitize(email);
      const sanitizedPassword = sanitize(password);

      // Making request to create new user
      const response = await axios.post(`${API_URL}/user/sign-up`, {
        username: sanitizedUsername,
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      // Confirming if response code is 201(created) else throwing error
      if (response.status !== 201) throw new Error("Error creating user");

      // Resolving the function with success value
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data.message || error.message
      );
    }
  }
);

export const login = createAsyncThunk(
  "onboard/signin",
  async ({ email, password }, thunkAPI) => {
    try {
      const sanitizedEmail = sanitize(email);
      const sanitizedPassword = sanitize(password);

      // Making request to create new user
      const response = await axios.post(`${API_URL}/user/login`, {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      // Confirming if response code is 200(OK) else throwing error
      if (response.status !== 200) throw new Error("Error signing in the user");

      // Resolving the function with success value
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data.message || error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    removeAuthorization(state) {
      removeLocalStorageAuthToken();
      state.isLoading = false;
      state.isError = null;
      state.isAuthorized = false;
      state.userAuthToken = getLocalStorageAuthToken();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authorizeUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isError = null;
      state.isAuthorized = true;
    });
    builder.addCase(authorizeUser.rejected, (state) => {
      state.isAuthorized = false;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isSuccessSignUp = true;
      state.isErrorSignUp = null;
      state.isLoadingSignUp = false;
    });
    builder.addCase(signup.pending, (state) => {
      state.isLoadingSignUp = true;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isSuccessSignUp = false;
      state.isErrorSignUp = action.payload;
      state.isLoadingSignUp = false;
      state.isAuthorized = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isSuccessLogin = true;
      state.isErrorLogin = null;
      state.isLoadingLogin = false;
      state.isAuthorized = true;
      setLocalStorageAuthToken(action.payload.authorization);
    });
    builder.addCase(login.pending, (state) => {
      state.isLoadingLogin = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isSuccessLogin = false;
      state.isErrorLogin = action.payload;
      state.isLoadingLogin = false;
      state.isAuthorized = false;
    });
  },
});

export const { removeAuthorization } = userSlice.actions;
export default userSlice.reducer;
