import Snackbar from "@mui/material/Snackbar";
interface AutohideSnackbarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AutohideSnackbar({
  open,
  setOpen,
}: AutohideSnackbarProps) {
  const handleClose = (_: unknown, reason: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="This Snackbar will be dismissed in 5 seconds."
      />
    </div>
  );
}
