import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ColorDropperButton } from "./ColorDropperButton";
import { ColorFormats } from "./ColorFormats";

interface Props {
  hex: string;
  onPick: (hex: string) => void;
  compact?: boolean;
}

export const ActiveColorCard: React.FC<Props> = ({ hex, onPick, compact = false }) => (
  <Paper sx={{ p: compact ? 2 : 3, borderRadius: 3, position: "relative", overflow: "hidden" }}>
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: -50,
        right: -50,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: hex,
        filter: "blur(50px)",
        opacity: 0.3,
        pointerEvents: "none",
        transition: "background 0.3s ease",
      }}
    />
    <Box sx={{ position: "relative", display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        role="img"
        aria-label={`Active color ${hex.toUpperCase()}`}
        sx={{
          flexShrink: 0,
          width: compact ? 52 : 64,
          height: compact ? 52 : 64,
          borderRadius: 2,
          border: "2px solid rgba(255,255,255,0.15)",
          backgroundColor: hex,
          boxShadow: `0 8px 32px -8px ${hex}80`,
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" component="p">
          Active color
        </Typography>
        <Typography sx={{ fontFamily: "monospace", fontSize: compact ? 20 : 24, fontWeight: 700 }}>
          {hex.toUpperCase()}
        </Typography>
      </Box>
    </Box>
    <Box sx={{ position: "relative", mt: 2 }}>
      <ColorDropperButton onPick={onPick} />
    </Box>
    <Box sx={{ position: "relative", mt: 2 }}>
      <ColorFormats hex={hex} />
    </Box>
  </Paper>
);
