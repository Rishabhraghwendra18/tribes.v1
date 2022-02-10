import {
  Backdrop,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Fade,
  Modal,
  Step,
  StepButton,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import { useForm } from "react-hook-form";
import EpochForm from "../epochForm";
import ImportTasks from "../importTasks";
import CreateTask from "../createTask";

import ImportExportIcon from "@mui/icons-material/ImportExport";
import { LoadingButton } from "@mui/lab";

type Props = {
  step: number;
};

export const PrimaryButton = styled(LoadingButton)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText("#000f29"),
  borderRadius: "20px",
  textTransform: "none",
}));

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  overflow: "auto",
  maxHeight: "calc(100% - 128px)",
};

const taskModalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  overflow: "auto",
  maxHeight: "calc(100% - 128px)",
};

const steps = ["Epoch Details", "Import Tasks"];

const TaskModal = ({ step }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [activeStep, setActiveStep] = useState(0);
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const [loaderText, setLoaderText] = useState("Updating metadata");
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {step === 0 && (
        <PrimaryButton
          variant="outlined"
          size="large"
          type="submit"
          endIcon={<ImportExportIcon />}
          onClick={() => {
            setIsOpen(true);
            setActiveStep(1);
          }}
          fullWidth
          sx={{ mx: 1 }}
        >
          Create Task
        </PrimaryButton>
      )}
      <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
        <Fade in={isOpen} timeout={500}>
          <Box sx={taskModalStyle}>
            <Backdrop
              sx={{
                color: "#eaeaea",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={loading}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress color="inherit" />
                <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>{loaderText}</Typography>
              </Box>
            </Backdrop>
            {activeStep === 1 && <CreateTask setIsOpen={setIsOpen} />}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default TaskModal;