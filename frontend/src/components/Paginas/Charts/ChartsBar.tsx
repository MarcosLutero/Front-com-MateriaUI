import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ocorrencias from "../../json/Municipios_Seguranca_Random.json";

interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

interface ChartsBarProps {
  uf: string;
  municipio: string;
  estados: Estado[];
  horizontal: boolean;  // Adiciona a propriedade horizontal
}

const siglaToCodigoUF = (sigla: string, estados: Estado[]) => {
  const estado = estados.find(e => e.sigla === sigla);
  return estado ? estado.id : null;
};

const ChartsBar: React.FC<ChartsBarProps> = ({ uf, municipio, estados, horizontal }) => {
  const keys = [
    "eficiencia_policial",
    "percepcao_de_seguranca",
    "nivel_educacao",
    "programas_inclusao_social",
    "acesso_a_saude",
    "idh"
  ];

  const filteredData = useMemo(
    () => {
      if (!uf) {
        return ocorrencias;
      }
      const ufCode = siglaToCodigoUF(uf, estados);
      return ocorrencias.filter(item => item.codigo_uf === ufCode);
    },
    [uf, estados]
  );

  const dataNacional = useMemo(() => {
    return keys.map(key => ({
      name: key.replace(/_/g, " "),
      value: filteredData.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0) / filteredData.length
    }));
  }, []);

  const dataUF = useMemo(
    () => {
      if (filteredData.length === 0) return [];

      return keys.map(key => ({
        name: key.replace(/_/g, " "),
        value: filteredData.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0) / filteredData.length
      }));
    },
    [filteredData]
  );

  const dataMunicipio = useMemo(
    () => {
      const municipioData = ocorrencias.find(item => item.nome === municipio);
      if (!municipioData) return [];

      return keys.map(key => ({
        name: key.replace(/_/g, " "),
        value: municipioData[key as keyof typeof municipioData] as number
      }));
    },
    [municipio]
  );

  const chartData = municipio ? dataMunicipio : uf ? dataUF : dataNacional;
  const legendName = municipio ? "Média Municipal" : uf ? "Média Estadual" : "Média Nacional";


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {!horizontal && <XAxis type="category" dataKey="name" />}
        {horizontal && <XAxis type="number" />}
        {!horizontal && <YAxis type="number" />}
        {horizontal && <YAxis type="category" dataKey="name" />}
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name={legendName} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartsBar;
