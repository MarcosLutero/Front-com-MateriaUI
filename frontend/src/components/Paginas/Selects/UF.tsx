import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';

interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

interface UFProps {
  uf: string;
  onUfSelect: (uf: string) => void;
  setEstados: (estados: Estado[]) => void;
}

export default function UF({ uf, onUfSelect, setEstados }: UFProps) {
  const [estados, setLocalEstados] = React.useState<Estado[]>([]);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => response.json())
      .then(data => {
        setEstados(data);
        setLocalEstados(data); // Armazena localmente para mapear
      })
      .catch(error => console.error('Erro ao buscar os estados:', error));
  }, [setEstados]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedUf = event.target.value;
    onUfSelect(selectedUf);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="select-uf-label">UF</InputLabel>
      <Select
        labelId="select-uf-label"
        id="select-uf"
        value={uf}
        onChange={handleChange}
        autoWidth
        label="UF"
      >
        {estados.map((estado: Estado) => (
          <MenuItem key={estado.id} value={estado.sigla}>
            {estado.nome}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
