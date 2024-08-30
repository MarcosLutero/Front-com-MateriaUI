import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface Municipio {
  id: number;
  nome: string;
}

interface MunicipioProps {
  uf: string;
  municipio: string; // Adicione uma prop para receber o município selecionado do Dashboard
  onMunicipioSelect: (municipio: string) => void;
}

export default function Municipio({ uf, municipio, onMunicipioSelect }: MunicipioProps) {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  useEffect(() => {
    if (uf) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(response => response.json())
        .then(data => setMunicipios(data))
        .catch(error => console.error('Erro ao buscar os municípios:', error));
    }
  }, [uf]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedMunicipio = event.target.value;
    onMunicipioSelect(selectedMunicipio); // Passa o município selecionado para o componente pai
  };

  return (
    <FormControl fullWidth >
      <InputLabel id="select-municipio-label">Município</InputLabel>
      <Select
        labelId="select-municipio-label"
        id="select-municipio"
        value={municipio} // Vincula o município recebido como prop
        onChange={handleChange}
        autoWidth
        label="Município"
      >
        {municipios.map((municipio) => (
          <MenuItem key={municipio.id} value={municipio.nome}>
            {municipio.nome}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
