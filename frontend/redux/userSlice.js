import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

import BASE_URL from "../utils/config"

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

      console.log(data)

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
      .addCase(checkName.pending, (state) => {
        state.loading = true
      })
      .addCase(checkName.fulfilled, (state, action) => {
        state.loading = false
        state.checkedUser = action.payload // Postavite podatke korisnika
      })
      .addCase(checkName.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload // Postavite grešku
      })
  },
})

export default userSlice.reducer
