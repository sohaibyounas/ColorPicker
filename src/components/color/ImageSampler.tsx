import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { LuUpload, LuImage, LuTrash2 } from "react-icons/lu";
import { readableTextColor, rgbToHex } from "@/lib/color-utils";
import { readStorage, removeStorage, writeStorage } from "@/lib/storage";

interface Props {
  onPick: (hex: string) => void;
  compact?: boolean;
}

const STORAGE_KEY = "saved-image";
// Canvas resolution cap: plenty for sampling, keeps memory sane for huge photos
const MAX_CANVAS_DIM = 1600;
// Persisted copy is a small JPEG so it fits comfortably in localStorage
const MAX_SAVED_DIM = 800;

const isString = (v: unknown): v is string => typeof v === "string";

const fitWithin = (w: number, h: number, max: number) => {
  const scale = Math.min(1, max / Math.max(w, h));
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
};

export const ImageSampler: React.FC<Props> = ({ onPick, compact = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const drawImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, MAX_CANVAS_DIM);
    canvas.width = width;
    canvas.height = height;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);
    setHasImage(true);
  }, []);

  // Restore the last image across popup sessions
  useEffect(() => {
    const saved = readStorage(STORAGE_KEY, "", isString);
    if (!saved) return;
    const img = new Image();
    img.onload = () => drawImage(img);
    img.src = saved;
  }, [drawImage]);

  const saveImage = (img: HTMLImageElement) => {
    const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, MAX_SAVED_DIM);
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    offscreen.getContext("2d")?.drawImage(img, 0, 0, width, height);
    if (!writeStorage(STORAGE_KEY, offscreen.toDataURL("image/jpeg", 0.85))) {
      removeStorage(STORAGE_KEY);
    }
  };

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      enqueueSnackbar("Please choose an image file", { variant: "error" });
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      drawImage(img);
      saveImage(img);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      enqueueSnackbar("That image couldn't be read", { variant: "error" });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    // Reset so choosing the same file again still fires onChange
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const sampleAt = (e: React.PointerEvent<HTMLCanvasElement>): string | null => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.min(canvas.width - 1, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width)));
    const y = Math.min(canvas.height - 1, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height)));
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    return rgbToHex(r, g, b);
  };

  // Pointer events cover mouse, touch and pen. On touch, drag to preview and lift to pick.
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const hex = sampleAt(e);
    if (hex) setPreviewColor(hex);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const hex = sampleAt(e);
    if (!hex) return;
    setPreviewColor(hex);
    onPick(hex);
    enqueueSnackbar(`Picked ${hex.toUpperCase()}`, { variant: "success" });
  };

  const handleClear = () => {
    setHasImage(false);
    setPreviewColor(null);
    removeStorage(STORAGE_KEY);
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <Paper sx={{ p: compact ? 2 : { xs: 2, sm: 3 }, borderRadius: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 1.5 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", minWidth: 0 }}>
          <Box sx={{ display: "flex", p: 0.75, borderRadius: 1.5, bgcolor: "rgba(124, 58, 237, 0.12)", color: "primary.light" }}>
            <LuImage size={18} />
          </Box>
          <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 600 }} noWrap>
            Sample from image
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          {hasImage && (
            <Tooltip title="Remove image">
              <IconButton color="error" size="small" onClick={handleClear} aria-label="Remove image">
                <LuTrash2 size={16} />
              </IconButton>
            </Tooltip>
          )}
          <Button size="small" variant="outlined" startIcon={<LuUpload />} onClick={() => inputRef.current?.click()}>
            Upload
          </Button>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
        </Box>
      </Box>

      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onPointerLeave={() => setPreviewColor(null)}
        sx={{
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: dragging ? "primary.main" : "rgba(255,255,255,0.08)",
          bgcolor: "rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "border-color 0.2s ease",
        }}
      >
        <Box
          component="canvas"
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          aria-label="Uploaded image. Click or tap to pick a color."
          sx={{
            display: hasImage ? "block" : "none",
            maxWidth: "100%",
            maxHeight: compact ? 220 : { xs: "50vh", md: "70vh" },
            cursor: "crosshair",
            userSelect: "none",
            touchAction: "none",
          }}
        />

        {!hasImage && (
          <Box
            component="button"
            type="button"
            onClick={() => inputRef.current?.click()}
            sx={{
              width: "100%",
              minHeight: compact ? 120 : { xs: 200, md: 380 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "text.secondary",
              bgcolor: "transparent",
              border: 0,
              cursor: "pointer",
              font: "inherit",
              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.light", outlineOffset: -4 },
            }}
          >
            <Box
              sx={{
                width: compact ? 44 : 56,
                height: compact ? 44 : 56,
                borderRadius: "50%",
                border: "1px dashed rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LuUpload size={22} style={{ opacity: 0.6 }} />
            </Box>
            <Typography variant="body2">Drop an image or click to browse</Typography>
          </Box>
        )}

        {hasImage && previewColor && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              px: 1.25,
              py: 0.5,
              borderRadius: 1.5,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "monospace",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              backgroundColor: previewColor,
              color: readableTextColor(previewColor),
              pointerEvents: "none",
            }}
          >
            {previewColor.toUpperCase()}
          </Box>
        )}
      </Box>
    </Paper>
  );
};
