//Board details
import { Container } from "@mui/material";
import AppBar from "../../components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useEffect, useState } from "react";
import {
  createCardAPI,
  createColumnAPI,
  deleteColumnDetailsAPI,
  fetchBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardAPI,
  updateColumnDetailsAPI,
} from "~/apis";
import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatter";
import { mapOrder } from "~/utils/sorts";
import { toast } from "react-toastify";
// import { mockData } from "~/apis/mock-data";

function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // fetch board data
    fetchBoardDetailsAPI("676e67f4b3da0998c477a0f9").then((data) => {
      data.columns = mapOrder(data.columns, data.columnOrderIds, "_id");

      data.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
        }
      });

      setBoard(data);
    });
  }, []);

  const createNewColumn = async (newColumnData) => {
    const newColumn = await createColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    newColumn.cards = [generatePlaceholderCard(newColumn)];
    newColumn.cardOrderIds = [generatePlaceholderCard(newColumn)._id];

    const newBoard = { ...board };
    newBoard.columns.push(newColumn);
    newBoard.columnOrderIds.push(newColumn._id);
    setBoard(newBoard);
  };

  const createNewCard = async (newCardData) => {
    const newCard = await createCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    const newBoard = { ...board };

    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === newCard.columnId
    );
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [newCard];
        columnToUpdate.cardOrderIds = [newCard._id];
      } else {
        columnToUpdate.cards.push(newCard);
        columnToUpdate.cardOrderIds.push(newCard._id);
      }
    }
    setBoard(newBoard);
  };

  const moveColumns = async (dndOrderedColumn) => {
    const dndOrderedColumnsIds = dndOrderedColumn.map((c) => c._id);

    const newBoard = { ...board };
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    newBoard.columns = dndOrderedColumn;
    setBoard(newBoard);

    //Call API to update column order
    await updateBoardAPI(board._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndCardOrderIds,
    columnId
  ) => {
    //Update state Board
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndCardOrderIds;
    }

    //Call API to update column
    // updateColumnDetailsAPI(columnId, {
    //   cardOrderIds: dndCardOrderIds,
    // });
  };

  const moveCardToDifferentColumn = async (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    //Update state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    newBoard.columns = dndOrderedColumns;
    setBoard(newBoard);

    //Check if the first card is placeholder card
    let prevCardOrderIds =
      dndOrderedColumns.find((c) => c._id == prevColumnId).cardOrderIds || [];
    if (prevCardOrderIds[0].includes("placeholder-card")) prevCardOrderIds = [];

    //Call API to update column order
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id == nextColumnId)
        .cardOrderIds,
    });
  };

  //Handle delete column
  const handleDeleteColumnDetails = async (columnId) => {
    const newBoard = { ...board };
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    );
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId);
    setBoard(newBoard);

    const result = await deleteColumnDetailsAPI(columnId);

    toast.success(result.message);
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        handleDeleteColumnDetails={handleDeleteColumnDetails}
      />
    </Container>
  );
}

export default Board;
