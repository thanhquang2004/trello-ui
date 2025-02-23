import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { isEmpty } from "lodash";
import { build } from "vite";
import { API_ROOT } from "~/utils/constant";
import { generatePlaceholderCard } from "~/utils/formatter";
import { mapOrder } from "~/utils/sorts";

// Define the initial state using that type
const initialState = {
  currentActiveBoard: null,
};

//With async actions, you can define a thunk action creator that returns a function. Middleware createAsyncthunk is used to handle async actions.
export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/` + boardId);

    return response.data;
  }
);

// Define a slice with the initial state, reducers, and action creators
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const fullBoard = action.payload;

      state.currentActiveBoard = fullBoard;
    },
  },
  // Extra reducers are generated for each action type
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      let board = action.payload;

      // Logic to update state
      board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
        }
      });

      state.currentActiveBoard = board;
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;

// Selectors
export const selectCurrentActiveBoard = (state) =>
  state.activeBoard.currentActiveBoard;

// export default activeBoardSlice.reducer;
export const activeBoardReducer = activeBoardSlice.reducer;
