import styled from "@emotion/styled";
import { Autocomplete, Popover, TextField } from "@mui/material";
import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { updateTaskStatus } from "../../../adapters/moralis";
import { BoardData, Column, Task } from "../../../types";
import {
  LabelChipButton,
  PrimaryButton,
} from "../../elements/styledComponents";
import { useBoard } from "../taskBoard";
import { PopoverContainer } from "./datePopover";

type Props = {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  handleClose: (field: string) => void;
  column: Column;
  task: Task;
};

const MovePopover = ({ open, anchorEl, handleClose, column, task }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { Moralis } = useMoralis();
  const { data, setData } = useBoard();
  const [status, setStatus] = useState(column.title);
  console.log(data);
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => handleClose("move")}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <PopoverContainer>
        <Autocomplete
          options={Object.values(data.columns).map((column) => column.title)}
          value={status}
          onChange={(event, newValue) => {
            setStatus(newValue as any);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              id="filled-hidden-label-normal"
              size="small"
              fullWidth
              placeholder="List"
            />
          )}
        />
        <PrimaryButton
          variant="outlined"
          sx={{ mt: 4 }}
          onClick={() => {
            setIsLoading(true);
            updateTaskStatus(
              Moralis,
              task.boardId,
              task.taskId,
              status,
              column.id
            ).then((res: BoardData) => {
              console.log(res);
              setData(res);
              setIsLoading(false);
              handleClose("move");
            });
          }}
        >
          Save
        </PrimaryButton>
      </PopoverContainer>
    </Popover>
  );
};

export default MovePopover;