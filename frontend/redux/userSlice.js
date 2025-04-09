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
          : error.message || "Something went wrong on check Name"
      )
    }
  }
)

export const login = createAsyncThunk(
  //from component login({name , password})
  "user/login",
  async (user, { rejectWithValue }) => {
    const { name, password } = user
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      }
      const { data } = await axios.post(
        `${BASE_URL}/api/users/login/password`,
        { name, password },
        config
      )
      console.log("user/login", data)
      //set data to native DB , (token & otherData)
      /*like this - localStorage.setItem("userInfo", JSON.stringify(data))
      zapravo najbolje to postaviti u Login screenu da ne bude u ovom fajlu
      */

      return data
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message || "Something went wrong on loging User"
      )
    }
  }
)

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    checkedUser: null,
    userInfo: null,
    error: null,
  },
  reducers: {
    // Ovdje dodati logout ili drugu sync fukciju
  },
  extraReducers: (builder) => {
    builder
    handleAsyncActions(builder, checkName, "checkedUser")
    handleAsyncActions(builder, login, "userInfo")
  },
})

export default userSlice.reducer
