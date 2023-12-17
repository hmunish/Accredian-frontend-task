import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utility/config";
import {
  getLocalStorageAuthToken,
  removeLocalStorageAuthToken,
  setLocalStorageAuthToken,
} from "../../utility/helper";

const initialState = {
  isLoading: false,
  isError: null,
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

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  // reducers: {
  //   updateAuthorization(state, action) {
  //     state.isLoading = false;
  //     state.isError = null;
  //     state.isAuthorized = true;
  //     state.userAuthToken = action.payload.authorization;
  //     state.profile = action.payload.user;
  //     axios.defaults.headers.common.Authorization = state.userAuthToken;
  //     setLocalStorageAuthToken(state.userAuthToken);
  //   },
  //   removeAuthorization(state) {
  //     removeLocalStorageAuthToken();
  //     axios.defaults.headers.common.Authorization = undefined;
  //     state.isLoading = false;
  //     state.isError = null;
  //     state.isAuthorized = false;
  //     state.userAuthToken = getLocalStorageAuthToken();
  //     state.profile = {};
  //   },
  // },
  extraReducers: (builder) => {
    builder.addCase(authorizeUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = null;
      state.isAuthorized = true;
      state.profile = action.payload;
    });
    builder.addCase(authorizeUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authorizeUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthorized = false;
      state.isError = action.payload;
    });
  },
});

// export const { updateAuthorization, removeAuthorization } = userSlice.actions;
export default userSlice.reducer;
