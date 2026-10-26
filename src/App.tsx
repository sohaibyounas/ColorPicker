import { useCallback } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { SnackbarProvider } from "notistack";
import { LuExternalLink } from "react-icons/lu";
import theme from "./theme";
import { ActiveColorCard } from "@/components/color/ActiveColorCard";
import { ImageSampler } from "@/components/color/ImageSampler";
import { ColorHistory } from "@/components/color/ColorHistory";
import { normalizeHex } from "@/lib/color-utils";
import { usePersistentState } from "@/lib/storage";
import { isPopup, openFullView } from "@/lib/extension";

const DEFAULT_COLOR = "#7c3aed";
const MAX_HISTORY = 14;

const isHex = (v: unknown): v is string => typeof v === "string" && normalizeHex(v) !== null;
const isHexList = (v: unknown): v is string[] => Array.isArray(v) && v.every(isHex);

const App = () => {
  const popup = isPopup();
  const [active, setActive] = usePersistentState("active-color", DEFAULT_COLOR, isHex);
  const [history, setHistory] = usePersistentState<string[]>("color-history", [], isHexList);

  const pick = useCallback(
    (hex: string) => {
      const color = normalizeHex(hex);
      if (!color) return;
      setActive(color);
      setHistory((prev) =>
        [color, ...prev.filter((c) => normalizeHex(c) !== color)].slice(0, MAX_HISTORY),
      );
    },
    [setActive, setHistory],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={2}
        autoHideDuration={2200}
        dense={popup}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box
          component="main"
          sx={{
            maxWidth: 1200,
            mx: "auto",
            minHeight: popup ? undefined : "100vh",
            p: popup ? 2 : { xs: 2, sm: 3, md: 5 },
          }}
        >
          <Box
            component="header"
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: popup ? 2 : { xs: 2.5, md: 4 } }}
          >
            <Box
              component="img"
              src="icon-48.png"
              alt=""
              sx={{ width: popup ? 28 : 36, height: popup ? 28 : 36, borderRadius: 1.5 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                component="h1"
                sx={{ fontWeight: 700, fontSize: popup ? 16 : { xs: 20, md: 26 }, lineHeight: 1.2 }}
              >
                Spectrum Scoop
              </Typography>
              {!popup && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  Sample from any page or image. Copy HEX, RGB and HSL.
                </Typography>
              )}
            </Box>
            {popup && (
              <Tooltip title="Open in a tab (more room for images)">
                <IconButton size="small" onClick={openFullView} aria-label="Open in a tab">
                  <LuExternalLink size={18} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: popup ? 1.5 : { xs: 2, md: 3 },
              alignItems: "start",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 360px" },
              // Second row absorbs the sampler's extra height so history hugs the active card
              gridTemplateRows: { md: "auto 1fr" },
              gridTemplateAreas: {
                xs: '"active" "sampler" "history"',
                md: '"sampler active" "sampler history"',
              },
            }}
          >
            <Box sx={{ gridArea: "active" }}>
              <ActiveColorCard hex={active} onPick={pick} compact={popup} />
            </Box>

            <Box sx={{ gridArea: "sampler" }}>
              <ImageSampler onPick={pick} compact={popup} />
            </Box>

            <Paper sx={{ gridArea: "history", p: popup ? 2 : 3, borderRadius: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 600 }}>
                  Recent colors
                </Typography>
                {history.length > 0 && (
                  <Button size="small" color="inherit" onClick={() => setHistory([])} sx={{ opacity: 0.7 }}>
                    Clear
                  </Button>
                )}
              </Box>
              <ColorHistory colors={history} active={active} onSelect={pick} />
            </Paper>
          </Box>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
