import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseURL = "http://localhost:5000";
const initialState = {
  todos: [],
  responseStatus: "",
  responseMessage: "",
};

export const getTodo = async (id) =>
  await axios.get(`/todos/${id}`);

export const getTodos = createAsyncThunk("todos/getTodos", async () => {
  try {
    const response = await axios.get(`${baseURL}/todos`);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
});

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (todoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseURL}/todos/${todoId}`);
      return todoId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todo, { rejectWithValue }) => {
    try {
      const response = await axios.post( `${baseURL}/todos`, todo );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (todo, { rejectWithValue }) => {
    console.log('todoSlice: ', todo)
    try {
      const response = await axios.put( `${baseURL}/todos/${todo.todo_id}`, todo );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (todo, { rejectWithValue }) => {
    console.log('todoSlice: ', todo)
    try {
      const response = await axios.put(`${baseURL}/todos/${todo.todo_id}`, {
        owner: todo.owner,
        description: todo.description,
        completed: todo.completed,
        day: todo.day,
        priority: todo.priority,
        morning: todo.morning,
        afternoon: todo.afternoon,
        evening: todo.evening,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: {
    [getTodos.pending]: (state, action) => {
      return {
        ...state,
        responseStatus: "pending",
      };
    },
    [getTodos.fulfilled]: (state, action) => {
      return {
        ...state,
        todos: action.payload,
        responseStatus: "success",
      };
    },
    [getTodos.rejected]: (state, action) => {
      return {
        ...state,
        responseStatus: "rejected",
        responseMessage: action.payload,
      };
    },
    [deleteTodo.fulfilled]: (state, action) => {
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.todo_id !== action.payload),
        responseStatus: "success",
        responseMessage: "Todo deleted successfully",
      };
    },
    [deleteTodo.rejected]: (state, action) => {
      return {
        ...state,
        responseStatus: "rejected",
        responseMessage: action.payload,
      };
    },
    [updateTodo.pending]: (state, action) => {
      return {
        ...state,
        responseStatus: "pending",
      };
    },
    [updateTodo.fulfilled]: (state, action) => {
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.todo_id === action.payload.todo_id ? action.payload : todo
        ),
        responseStatus: "success",
        responseMessage: "Todo updated successfully",
      };
    },
    [updateTodo.rejected]: (state, action) => {
      return {
        ...state,
        responseStatus: "rejected",
        responseMessage: action.payload,
      };
    },
    [createTodo.pending]: (state, action) => {
      return {
        ...state,
        responseStatus: "pending",
      };
    },
    [createTodo.fulfilled]: (state, action) => {
      return {
        ...state,
        todos: [...state.todos, action.payload],
        responseStatus: "success",
        responseMessage: "Todo created successfully",
      };
    },
    [createTodo.rejected]: (state, action) => {
      return {
        ...state,
        responseStatus: "rejected",
        responseMessage: action.payload,
      };
    },
  },
});

export default todoSlice.reducer;