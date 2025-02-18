import axios from "axios";
import { API_ROOT } from "~/utils/constant";

/**Board */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/` + boardId);

  console.log("fetchBoardDetailsAPI", response.data);

  return response.data;
};

export const updateBoardAPI = async (boardId, updatedBoardData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/boards/` + boardId,
    updatedBoardData
  );

  return response.data;
};

export const updateColumnDetailsAPI = async (columnId, updatedData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updatedData
  );

  return response.data;
};

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`);

  return response.data;
};

export const moveCardToDifferentColumnAPI = async (updatedData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/boards/supports/moveCard`,
    updatedData
  );

  return response.data;
};

/**Column */
export const createColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns/`, newColumnData);

  return response.data;
};

export const updateColumnAPI = async (columnId, updatedColumnData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/columns/` + columnId,
    updatedColumnData
  );

  return response.data;
};

/**Card */
export const createCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/`, newCardData);

  return response.data;
};
