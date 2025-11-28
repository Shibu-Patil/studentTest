import { configureStore } from '@reduxjs/toolkit'
import studentReducer from "../slice/slice"
export const store = configureStore({
  reducer: {
    student:studentReducer
  },
})