import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Container,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br'; // Importa o idioma pt-br para o dayjs
import UF from './Selects/UF';
import Municipio from './Selects/Municipios';
import ChartsRadar from './Charts/ChartsRadar';
import ChartsBar from './Charts/ChartsBar';

// Define o idioma para português do Brasil
dayjs.locale('pt-br');

interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

function Dashboard() {
  const [selectedUF, setSelectedUF] = useState<string>('');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('');
  const [estados, setEstados] = useState<Estado[]>([]);
  const [horizontal, setHorizontal] = useState(false);
  const [showFilters, setShowFilters] = useState<boolean>(false); // Estado que controla a exibição dos filtros
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const handleUfSelect = (uf: string) => {
    setSelectedUF(uf);
    setSelectedMunicipio('');
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

  const toggleFilters = () => {
    setShowFilters((prev) => !prev); // Alterna entre mostrar e esconder os filtros
  };

  const resetFilters = () => {
    setSelectedUF('');
    setSelectedMunicipio('');
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        sx={{
          maxWidth: '100% !important',
          padding: '16px',
          backgroundColor: '#f4f6f8',
          minHeight: '100vh',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" sx={{ textAlign: 'center' }}>
              Dashboard de Segurança Pública
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* Adiciona a funcionalidade de adicionar e remover filtros */}
            <IconButton onClick={toggleFilters} size="small">
              {showFilters ? <>Remover Filtro <FilterAltOffIcon fontSize="small" /></> : <>Adicionar Filtro <FilterAltIcon fontSize="small" /></>}
            </IconButton>
          </Grid>

          {/* Exibe os filtros quando showFilters for true */}
          {showFilters && (
            <>
              <Grid item xs={12} md={3}>
                <UF uf={selectedUF} onUfSelect={handleUfSelect} setEstados={handleSetEstados} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Municipio uf={selectedUF} municipio={selectedMunicipio} onMunicipioSelect={handleMunicipioSelect} />
              </Grid>

              <Grid item xs={12} md={3}>
                <DateTimePicker
                  label="Data e Hora Inicial"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="YYYY/MM/DD HH:mm"
                  ampm={false}  // Desabilita o AM/PM, usa formato 24 horas
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <DateTimePicker
                  label="Data e Hora Final"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="YYYY/MM/DD HH:mm"
                  ampm={false}  // Desabilita o AM/PM, usa formato 24 horas
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 350,
              }}
            >
              <ChartsRadar
                uf={selectedUF}
                municipio={selectedMunicipio}
                estados={estados}
                startDate={startDate?.toDate() as Date}
                endDate={endDate?.toDate() as Date}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 350,
              }}
            >
              <ChartsBar
                uf={selectedUF}
                municipio={selectedMunicipio}
                estados={estados}
                horizontal={horizontal}
                startDate={startDate?.toDate() as Date}
                endDate={endDate?.toDate() as Date}
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
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}

export default Dashboard;
