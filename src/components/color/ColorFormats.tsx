import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { LuCopy, LuCheck } from "react-icons/lu";
import { formatHsl, formatRgb, hexToRgb, rgbToHsl } from "@/lib/color-utils";
import { copyText } from "@/lib/clipboard";

interface Props {
  hex: string;
}

const CopyField: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const [copied, setCopied] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    if (await copyText(value)) {
      setCopied(true);
      enqueueSnackbar(`${label} copied`, { variant: "success" });
    } else {
      enqueueSnackbar("Clipboard access was blocked", { variant: "error" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 2,
        pl: 1.5,
        pr: 1,
        py: 0.5,
        bgcolor: "rgba(0,0,0,0.2)",
        transition: "background-color 0.2s ease",
        "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" component="span" sx={{ width: 30, flexShrink: 0 }}>
          {label}
        </Typography>
        <Typography sx={{ fontFamily: "monospace", fontSize: 14, fontWeight: 500, overflowWrap: "anywhere" }}>
          {value}
        </Typography>
      </Box>
      <IconButton
        size="small"
        color={copied ? "success" : "primary"}
        onClick={copy}
        aria-label={`Copy ${label} value ${value}`}
        sx={{ bgcolor: copied ? "rgba(74, 222, 128, 0.1)" : "rgba(124, 58, 237, 0.12)", borderRadius: 1.5 }}
      >
        {copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
      </IconButton>
    </Box>
  );
};

export const ColorFormats: React.FC<Props> = ({ hex }) => {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <CopyField label="HEX" value={hex.toUpperCase()} />
      <CopyField label="RGB" value={formatRgb(rgb)} />
      <CopyField label="HSL" value={formatHsl(rgbToHsl(rgb))} />
    </Box>
  );
};
