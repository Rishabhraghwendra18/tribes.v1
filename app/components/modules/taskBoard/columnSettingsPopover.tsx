import styled from "@emotion/styled";
import { Button, Popover } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useMoralis } from "react-moralis";
import { useBoard } from ".";
import { removeColumn } from "../../../adapters/moralis";
import { BoardData } from "../../../types";

type Props = {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  columnId: string;
  handleClose: () => void;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 6rem;
`;

const ColumnSettingsPopover = ({
  open,
  anchorEl,
  columnId,
  handleClose,
}: Props) => {
  const { data, setData } = useBoard();
  const { Moralis } = useMoralis();
  const router = useRouter();
  const { bid } = router.query;
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Container>
        <Button
          color="inherit"
          fullWidth
          sx={{ textTransform: "none" }}
          size="small"
          onClick={() => {
            setData({
              ...data,
              columnOrder: data.columnOrder.filter((id) => id !== columnId),
            });
            removeColumn(Moralis, bid as string, columnId)
              .then((res: BoardData) => {
                setData(res);
                console.log(res.columns);
                handleClose();
              })
              .catch((err: any) => {
                console.log(err);
              });
          }}
        >
          Delete
        </Button>
        {/* <Button
          color="inherit"
          fullWidth
          sx={{ textTransform: "none" }}
          size="small"
        >
          Import Repo
        </Button>
        <Button
          color="inherit"
          fullWidth
          sx={{ textTransform: "none" }}
          size="small"
          disabled
        >
          Start Epoch
        </Button> */}
      </Container>
    </Popover>
  );
};

export default ColumnSettingsPopover;
