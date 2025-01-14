import styled from "@emotion/styled";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";
import {
  addColumn,
  updateColumnOrder,
  updateColumnTasks,
  updateTaskStatus,
} from "../../../adapters/moralis";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { reorder } from "../../../utils/utils";
import { BoardData } from "../../../types";
import { notify } from "../settingsTab";
import { useSpace } from "../../../../pages/tribe/[id]/space/[bid]";
import Column from "../column";

type Props = {
  expanded: boolean;
  handleChange: (
    panel: string
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
};

const Board = ({ expanded, handleChange }: Props) => {
  const { space, setSpace } = useSpace();
  const router = useRouter();
  const { Moralis, user } = useMoralis();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    const task = space.tasks[draggableId];
    if (
      type !== "column" &&
      !(
        task.access.assignee ||
        task.access.creator ||
        task.access.reviewer ||
        space.roles[user?.id as string] === 3
      )
    ) {
      notify("Looks like you don't have access to move this task", "error");
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type === "column") {
      const newColumnOrder = reorder(
        space.columnOrder,
        source.index,
        destination.index
      );
      const tempData = Object.assign({}, space);
      setSpace({
        ...space,
        columnOrder: newColumnOrder,
      });
      updateColumnOrder(Moralis, bid as string, newColumnOrder)
        .then((res: any) => {
          setSpace(res as BoardData);
        })
        .catch((err: any) => {
          setSpace(tempData);
          notify(
            "Sorry! There was an error while changing the column order.",
            "error"
          );
        });
      return;
    }

    const start = space.columns[source.droppableId];
    const finish = space.columns[destination.droppableId];

    if (start === finish) {
      const newList = reorder(start.taskIds, source.index, destination.index);
      const tempData = Object.assign({}, space);
      setSpace({
        ...space,
        columns: {
          ...space.columns,
          [result.source.droppableId]: {
            ...space.columns[result.source.droppableId],
            taskIds: newList,
          },
        },
      });
      updateColumnTasks(
        Moralis,
        bid as string,
        result.source.droppableId,
        result.source.droppableId,
        newList,
        newList
      )
        .then((res: any) => {
          setSpace(res as BoardData);
        })
        .catch((err: any) => {
          setSpace(tempData);
          notify("Sorry! There was an error while moving tasks.", "error");
        });
    } else {
      const startTaskIds = Array.from(start.taskIds); // copy
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds); // copy
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };
      const tempData = Object.assign({}, space);
      setSpace({
        ...space,
        columns: {
          ...space.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });

      updateColumnTasks(
        Moralis,
        bid as string,
        newStart.id,
        newFinish.id,
        newStart,
        newFinish
      )
        .then((res: any) => {
          setSpace(res as BoardData);
          if (newFinish.id === "column-3") {
            updateTaskStatus(Moralis, draggableId, 205).then((res: any) => {
              console.log("updateTaskStatus", res);
              setSpace(res as BoardData);
            });
          }
        })
        .catch((err: any) => {
          setSpace(tempData);
          notify("Sorry! There was an error while moving tasks.", "error");
        });
    }
  };

  const { id, bid } = router.query;
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided, snapshot) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {space.columnOrder.map((columnId, index) => {
              const column = space.columns[columnId];
              const tasks = column.taskIds?.map(
                (taskId) => space.tasks[taskId]
              );
              return (
                <Column
                  key={columnId}
                  column={column}
                  tasks={tasks}
                  id={columnId}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                height: "5%",
                minWidth: "16rem",
                borderRadius: 1,
                margin: "0.3rem 2rem 1rem 0rem",
              }}
              disabled={space.roles[user?.id as string] !== 3}
              onClick={() => {
                const newColumnId = Object.keys(space.columns).length;
                const tempData = Object.assign({}, space);
                setSpace({
                  ...space,
                  columns: {
                    ...space.columns,
                    [`column-${newColumnId}`]: {
                      id: `column-${newColumnId}`,
                      title: "",
                      taskIds: [],
                      cardType: 1,
                      createCard: { 0: false, 1: false, 2: true, 3: true },
                      moveCard: { 0: false, 1: true, 2: true, 3: true },
                    },
                  },
                  columnOrder: [...space.columnOrder, `column-${newColumnId}`],
                });
                addColumn(Moralis, bid as string)
                  .then((res: BoardData) => setSpace(res))
                  .catch((err: any) => {
                    setSpace(tempData);
                    notify(
                      "Sorry! There was an error while adding column",
                      "error"
                    );
                  });
              }}
            >
              Add new column
            </Button>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 0.5rem;
  height: calc(100vh - 3.8rem);
  max-width: calc(100vw - 7.2rem);
  overflow-x: auto;
  overflow-y: hidden;
`;

export default Board;
