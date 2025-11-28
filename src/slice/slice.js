import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allAnswers: [],
  questions: [],
  loading: false,
  error: null,
  loggedUser: {
    name: null,
    email: null,
    id: null,
  },
  token: null,
};

// ---------------------- REGISTER STUDENT ----------------------
export const registerStudent = createAsyncThunk(
  "student/registerStudent",
  async ({ name, email, mobileNumber, batchCode }, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://backendtask-hin8.onrender.com/students", {
        name,
        email,
        mobileNumber,
        batchCode,
      });

      return {
        name: response.data.name,
        email: response.data.email,
        id: response.data.id || null,
        token: response.data.token || null,
      };
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || "Something went wrong!");
      }
      return rejectWithValue(err.message || "Server not reachable!");
    }
  }
);

// ---------------------- LOGIN STUDENT ----------------------
export const loginStudent = createAsyncThunk(
  "student/loginStudent",
  async ({ email, mobileNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://backendtask-hin8.onrender.com/students/login", {
        email,
        mobileNumber,
      });

      return {
        name: response.data.student.name,
        email: response.data.student.email,
        id: response.data.student.id || null,
        token: response.data.token || null,
      };
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || "Login failed!");
      }
      return rejectWithValue(err.message || "Server not reachable!");
    }
  }
);

// ---------------------- FETCH QUESTIONS ----------------------
export const fetchQuestions = createAsyncThunk(
  "student/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://backendtask-hin8.onrender.com/api/questions");
      return response.data.data; // assume API returns { data: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ---------------------- SUBMIT ALL RESPONSES ----------------------
export const submitAllResponses = createAsyncThunk(
  "student/submitAllResponses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().student;
      const { allAnswers, loggedUser } = state;

      if (!loggedUser?.id) return rejectWithValue("Student not logged in!");

      const payload = {
        studentId: loggedUser.id,
        responses: allAnswers.map((a) => ({
          questionId: a.questionId,
          response: a.answer || "",
        })),
      };

      const res = await axios.post(
        "https://backendtask-hin8.onrender.com/api/student-responses/multi",
        payload
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ---------------------- SLICE ----------------------
const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    addAnswer(state, action) {
      const { questionId, answer } = action.payload;
      const index = state.allAnswers.findIndex((a) => a.questionId === questionId);
      if (index >= 0) state.allAnswers[index] = action.payload;
      else state.allAnswers.push(action.payload);
    },
    setLoggedUser(state, action) {
      state.loggedUser = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedUser = {
          name: action.payload.name,
          email: action.payload.email,
          id: action.payload.id,
        };
        state.token = action.payload.token;
        state.error = "Student registered successfully!";
      })
      .addCase(registerStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGIN
      .addCase(loginStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedUser = {
          name: action.payload.name,
          email: action.payload.email,
          id: action.payload.id,
        };
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // FETCH QUESTIONS
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // SUBMIT RESPONSES
      .addCase(submitAllResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAllResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.allAnswers = []; // clear after submission
        state.error = null;
      })
      .addCase(submitAllResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addAnswer, setLoggedUser, setError } = studentSlice.actions;
export default studentSlice.reducer;
