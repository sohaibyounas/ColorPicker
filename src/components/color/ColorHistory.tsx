import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

interface Props {
  colors: string[];
  active: string;
  onSelect: (hex: string) => void;
}

export const ColorHistory: React.FC<Props> = ({ colors, active, onSelect }) => {
  if (colors.length === 0) {
    return (
      <Box
        sx={{
          p: 2.5,
          border: "1px dashed rgba(255,255,255,0.15)",
          borderRadius: 2,
          textAlign: "center",
          bgcolor: "rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Colors you pick will appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="ul"
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(34px, 1fr))",
        gap: 1,
      }}
    >
      {colors.map((c) => {
        const selected = c.toLowerCase() === active.toLowerCase();
        return (
          <li key={c}>
            <Tooltip title={c.toUpperCase()} arrow placement="top">
              <Box
                component="button"
                type="button"
                onClick={() => onSelect(c)}
                aria-label={`Use color ${c.toUpperCase()}`}
                aria-pressed={selected}
                sx={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: selected ? "#fff" : "rgba(255,255,255,0.15)",
                  cursor: "pointer",
                  backgroundColor: c,
                  p: 0,
                  boxShadow: `0 4px 12px ${c}40`,
                  transition: "transform 0.15s ease, border-color 0.15s ease",
                  "&:hover": { transform: "scale(1.12)" },
                  "&:active": { transform: "scale(0.95)" },
                  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.light", outlineOffset: 2 },
                }}
              />
            </Tooltip>
          </li>
        );
      })}
    </Box>
  );
};
