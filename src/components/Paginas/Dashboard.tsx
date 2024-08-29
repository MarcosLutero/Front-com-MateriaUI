import React, { useState } from "react";
import { Grid, Paper, Box, Container, Typography, Button } from "@mui/material";
import UF from "./Selects/UF";
import Municipio from "./Selects/Municipios";
import ChartsRadar from "./Charts/ChartsRadar";
import BadTable from "./Tabelas/BadTable";
import GodTable from "./Tabelas/GodTable";
import ChartsBar from "./Charts/ChartsBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

function Dashboard() {
  const [selectedUF, setSelectedUF] = useState<string>("");
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>("");
  const [estados, setEstados] = useState<Estado[]>([]);
  const [horizontal, setHorizontal] = useState(false);

  const handleUfSelect = (uf: string) => {
    setSelectedUF(uf);
    setSelectedMunicipio("");
  };

  const handleMunicipioSelect = (municipio: string) => {
    setSelectedMunicipio(municipio);
  };

  const handleSetEstados = (estados: Estado[]) => {
    setEstados(estados);
  };

  const handleToggleOrientation = () => {
    setHorizontal(!horizontal);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#d32f2f",
      },
      background: {
        default: "#f4f6f8",
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          maxWidth: "100% !important",
          padding: "16px",
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" sx={{ textAlign: "center" }}>
              Dashboard de Segurança Pública
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <UF uf={selectedUF} onUfSelect={handleUfSelect} setEstados={handleSetEstados} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Municipio uf={selectedUF} municipio={selectedMunicipio} onMunicipioSelect={handleMunicipioSelect} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 350, 
              }}
            >
              <ChartsRadar
                uf={selectedUF}
                municipio={selectedMunicipio}
                estados={estados}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                flexDirection: "column",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: 350, 
              }}
            >
              <ChartsBar
                uf={selectedUF}
                municipio={selectedMunicipio}
                estados={estados}
                horizontal={horizontal}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, alignSelf: 'center' }}
                onClick={handleToggleOrientation}
              >
                ALTERNAR ORIENTAÇÃO
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <BadTable />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <GodTable />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;
