import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse, Box, Typography, TablePagination } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Estado } from "../../Tipos/types";

interface InformacoesProps {
  data: Estado[] | null;
  selectedUf: Estado | null;
  onMunicipioSelect: (municipio: string) => void;
}

const Informacoes: React.FC<InformacoesProps> = ({ data, selectedUf, onMunicipioSelect }) => {
  const [open, setOpen] = React.useState<{ [key: string]: boolean }>({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const toggleOpen = (sigla: string) => {
    setOpen((prevState) => ({
      ...prevState,
      [sigla]: !prevState[sigla],
    }));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!data) return <div>Carregando...</div>;

  const sumIncidences = (municipios: Estado['municipios']) => {
    return municipios.map((municipio) => {
      const totalRoubo = municipio.incidencias.roubo?.reduce((sum, inc) => sum + inc.quantidade, 0) || 0;
      const totalTrafico = municipio.incidencias.trafico?.reduce((sum, inc) => sum + inc.quantidade, 0) || 0;
      const totalIncendio = municipio.incidencias.incendio?.reduce((sum, inc) => sum + inc.quantidade, 0) || 0;
      const totalMortes = municipio.incidencias.mortes?.reduce(
        (acc, mortes) => acc + (mortes.assassinato ?? 0) + (mortes.homicidio ?? 0) + (mortes.suicidio ?? 0),
        0
      ) || 0;
      return {
        nome: municipio.nome,
        totalRoubo,
        totalTrafico,
        totalIncendio,
        totalMortes
      };
    });
  };

  const renderRows = () => {
    if (selectedUf) {
        // Paginação dos municípios
        const municipiosAgrupados = sumIncidences(selectedUf.municipios);
        const paginatedMunicipios = municipiosAgrupados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        return paginatedMunicipios.map((municipio) => (
            <TableRow key={municipio.nome} onClick={() => onMunicipioSelect(municipio.nome)}>
                <TableCell>{municipio.nome}</TableCell>
                <TableCell align="right">{municipio.totalRoubo}</TableCell>
                <TableCell align="right">{municipio.totalTrafico}</TableCell>
                <TableCell align="right">{municipio.totalIncendio}</TableCell>
                <TableCell align="right">{municipio.totalMortes}</TableCell>
            </TableRow>
        ));
    } else {
        // Paginação dos estados
        const paginatedEstados = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        return paginatedEstados.map((estado) => (
            <React.Fragment key={estado.sigla}>
                <TableRow onClick={() => toggleOpen(estado.sigla)}>
                    <TableCell>
                        <IconButton size="small" onClick={() => toggleOpen(estado.sigla)}>
                            {open[estado.sigla] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell>{estado.nome}</TableCell>
                    <TableCell>{estado.sigla}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={5} style={{ padding: 0 }}>
                        <Collapse in={open[estado.sigla]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Municípios
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Município</TableCell>
                                            <TableCell align="center">Roubos</TableCell>
                                            <TableCell align="center">Tráficos</TableCell>
                                            <TableCell align="center">Incêndios</TableCell>
                                            <TableCell align="center">Mortes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sumIncidences(estado.municipios).map((municipio) => (
                                            <TableRow key={municipio.nome} onClick={() => onMunicipioSelect(municipio.nome)}>
                                                <TableCell>{municipio.nome}</TableCell>
                                                <TableCell align="right">{municipio.totalRoubo}</TableCell>
                                                <TableCell align="right">{municipio.totalTrafico}</TableCell>
                                                <TableCell align="right">{municipio.totalIncendio}</TableCell>
                                                <TableCell align="right">{municipio.totalMortes}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        ));
    }
};


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{selectedUf ? "Município" : "Estado (UF)"}</TableCell>
            <TableCell align="right">{selectedUf ? "Roubos" : "Sigla"}</TableCell>
            {selectedUf && (
              <>
                <TableCell align="right">Tráficos</TableCell>
                <TableCell align="right">Incêndios</TableCell>
                <TableCell align="right">Mortes</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>{renderRows()}</TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={selectedUf ? selectedUf.municipios.length : data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default Informacoes;
