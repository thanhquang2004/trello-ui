/* eslint-disable react/prop-types */
import { Box, Button, TextField } from "@mui/material";
import Column from "./Column/Column";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

function ListColumns({
  columns,
  createNewColumn,
  createNewCard,
  handleDeleteColumnDetails,
}) {
  //Handle open/close add new column form
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm((prev) => !prev);

  const [newColumnTitle, setNewColumnTitle] = useState("");

  //Handle add new column
  const handleAddColumn = async () => {
    if (!newColumnTitle) {
      toast.error("Please enter column title");
      return;
    }

    //Call API to create new column
    const newColumnData = {
      title: newColumnTitle,
    };

    await createNewColumn(newColumnData);

    toggleOpenNewColumnForm();
    setNewColumnTitle("");
  };

  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar-track": { m: 2 },
        }}
      >
        {/* Box Column */}
        {columns?.map((column) => (
          <Column
            key={column?._id}
            column={column}
            createNewCard={createNewCard}
            handleDeleteColumnDetails={handleDeleteColumnDetails}
          />
        ))}

        {/* Box Add new column */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
            }}
          >
            <Button
              sx={{
                color: "white",
                width: "100%",
                justifyContent: "flex-start",
                pl: 2.5,
                py: 1,
              }}
              startIcon={<NoteAddIcon />}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              id="outlined-search"
              size="small"
              label="Enter column title"
              type="text"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                minWidth: "120px",
                maxWidth: "240px",
                "& label": {
                  color: "white",
                },
                "& input": {
                  color: "white",
                },
                "& label.Mui-focused": {
                  color: "white",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleAddColumn}
                sx={{
                  boxShadow: "none",
                  border: "0.5px solid",
                  borderColor: (theme) => theme.palette.primary.main,
                  "&:hover": { bgcolor: (theme) => theme.palette.primary.main },
                }}
              >
                Add Column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: "white",
                  cursor: "pointer",
                  "&:hover": { color: (theme) => theme.palette.warning.light },
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
}

export default ListColumns;
