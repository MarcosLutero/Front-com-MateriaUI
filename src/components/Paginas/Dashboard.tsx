import React, { useState } from "react";
import Maps from "./Maps";
import Informacoes from "./Informacoes";
import {
  Grid,
  Paper,
  Box,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  createTheme,
  CssBaseline,
  Toolbar,
  Container
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import MenuLateral from "./MenuLateral";
import ufData from "../json/UF.json";
import { Estado } from "../../Tipos/types";
import { useNavigate } from "react-router-dom"; // Importação do useNavigate
import { styled, ThemeProvider } from "@mui/material/styles";
import { Copyright } from "@mui/icons-material";
import Link from "@mui/material/Link";

function App() {
  const [open, setOpen] = useState(false);
  const [uf, setUf] = useState<string>("");
  const [selectedUfData, setSelectedUfData] = useState<Estado | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);
  const navigate = useNavigate(); // Instância do useNavigate

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setUf(event.target.value);
    const selectedData = ufData.find(estado => estado.nome === event.target.value) || null;
    setSelectedUfData(selectedData);
    setSelectedMunicipio(null); // Resetar a seleção de município ao selecionar uma nova UF
  };
  const handleMunicipioSelect = (municipio: string) => {
    setSelectedMunicipio(municipio);
  };
  const handleSignOut = () => {
    navigate("/login"); // Redireciona para a página de login
  };
  const defaultTheme = createTheme();
  const drawerWidth = 240;

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop: string) => prop !== "open"
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  }));

  const MainContent = styled("main", { shouldForwardProp: prop => prop !== "open" })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    })
  }));

  function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          MARCOS LUTERO DA SILVA ROCHA
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MenuLateral open={open} onClose={handleDrawerClose} />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px" // keep right padding when drawer closed
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 2, ...(open && { display: "none" }) }} // Esconde o ícone de menu quando o Drawer está aberto
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <Button variant="text" color="inherit" onClick={handleSignOut}>
              Sign out
            </Button>
          </Toolbar>
        </AppBar>
        <MainContent open={open}>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                <FormControl sx={{minWidth: 80, mt: 2 }}>
                  <InputLabel id="select-uf-label">UF</InputLabel>
                  <Select labelId="select-uf-label" id="select-uf" value={uf} onChange={handleChange} autoWidth label="UF">
                    {ufData.map(estado => (
                      <MenuItem key={estado.id} value={estado.nome}>
                        {estado.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Box
                  sx={{
                    display: "flex",
                    height: "400px",
                    alignItems: "stretch"
                  }}
                >
                  <Box sx={{ flexGrow: 1, paddingRight: 0.5, display: "flex", width: "50%" }}>
                    <Paper sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                      <Maps />
                    </Paper>
                  </Box>
                  <Box sx={{ flexGrow: 1, paddingLeft: 0.5, display: "flex", width: "50%" }}>
                    <Paper sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                      <Informacoes data={ufData} selectedUf={selectedUfData} onMunicipioSelect={handleMunicipioSelect} />
                    </Paper>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Copyright sx={{ pt: 4 }} />
              </Grid>
            </Grid>
          </Container>
        </MainContent>
      </Box>
    </ThemeProvider>
  );
}

export default App;
