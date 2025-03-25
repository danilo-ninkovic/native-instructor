import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const checkName = createAsyncThunk(
  "urer/checkName",
  async (name, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      }
      const { data } = await axios.post("api/users/login", { name }, config)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message || "somethin went wrong with check User"
      )
    }
  }
)

// Definisanje slice-a
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    checkedUser: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkName.pending, (state) => {
        state.loading = true
      })
      .addCase(checkName.fulfilled, (state, action) => {
        state.loading = false
        state.checkedUser = action.payload
      })
    addCase(checkName.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  },
})

export default userSlice.reducer
