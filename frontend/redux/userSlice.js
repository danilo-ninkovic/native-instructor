import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

import BASE_URL from "../utils/config"

//reusable function for .addCase-s
const handleAsyncActions = (builder, action, stateKey) => {
  builder
    .addCase(action.pending, (state) => {
      state.loading = true //loading
    })
    .addCase(action.fulfilled, (state, action) => {
      state.loading = false
      state[stateKey] = action.payload //state data for stateKey
    })
    .addCase(action.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload //state error
    })
}

export const checkName = createAsyncThunk(
  "user/checkName",
  async (name, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      }
      const { data } = await axios.post(
        `${BASE_URL}/api/users/login`,
        { name },
        config
      )

      console.log("user/checkName", data)

      return data
    } catch (error) {
      console.log(error)

      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message || "Something went wrong"
      )
    }
  }
)

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    checkedUser: null,
    error: null,
  },
  reducers: {
    // Ovdje možete dodati druge obične akcije ako želite
  },
  extraReducers: (builder) => {
    builder
    handleAsyncActions(builder, checkName, "checkedUser")
  },
})

export default userSlice.reducer
