import React from "react";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import { LuPipette } from "react-icons/lu";

interface Props {
  onPick: (hex: string) => void;
}

const supported = typeof window !== "undefined" && "EyeDropper" in window;

export const ColorDropperButton: React.FC<Props> = ({ onPick }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handlePick = async () => {
    if (!window.EyeDropper) return;
    try {
      const result = await new window.EyeDropper().open();
      // Picked colors are persisted immediately, so they survive the popup closing.
      onPick(result.sRGBHex);
      enqueueSnackbar(`Picked ${result.sRGBHex.toUpperCase()}`, { variant: "success" });
    } catch (e) {
      // AbortError means the user pressed Esc; anything else is a real failure.
      if (!(e instanceof DOMException && e.name === "AbortError")) {
        enqueueSnackbar("Couldn't pick a color from the page.", { variant: "error" });
      }
    }
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      onClick={handlePick}
      disabled={!supported}
      startIcon={<LuPipette />}
      title={supported ? "Pick a color from anywhere on screen" : "This browser doesn't support the EyeDropper API"}
      sx={{ py: 1.1 }}
    >
      {supported ? "Pick from page" : "Page picking not supported"}
    </Button>
  );
};
