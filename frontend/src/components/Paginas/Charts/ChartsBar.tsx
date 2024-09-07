import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ocorrencias from "../../json/Municipios_Seguranca_Random_with_date_time.json";
import dayjs from "dayjs";

interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

interface ChartsBarProps {
  uf: string;
  municipio: string;
  estados: Estado[];
  horizontal: boolean;
  startDate: Date;
  endDate: Date;
}

const ChartsBar: React.FC<ChartsBarProps> = ({ uf, municipio, estados, horizontal, startDate, endDate }) => {
  const keys = [
    "eficiencia_policial",
    "percepcao_de_seguranca",
    "nivel_educacao",
    "programas_inclusao_social",
    "acesso_a_saude",
    "idh"
  ];

  const filteredDataByDate = useMemo(() => {
    return ocorrencias.filter(item => {
      const itemDate = dayjs(item.data);
      return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
    });
  }, [startDate, endDate]);

  const filteredData = useMemo(() => {
    if (!uf) return filteredDataByDate; // Retornar dados gerais se não houver UF selecionado
    const ufCode = estados.find(e => e.sigla === uf)?.id;
    return filteredDataByDate.filter(item => item.codigo_uf === ufCode);
  }, [uf, estados, filteredDataByDate]);

  const dataUF = useMemo(() => {
    if (filteredData.length === 0) return [];
    return keys.map(key => ({
      name: key.replace(/_/g, " "),
      value: filteredData.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0) / filteredData.length
    }));
  }, [filteredData]);

  const dataMunicipio = useMemo(() => {
    const municipioData = filteredDataByDate.find(item => item.nome === municipio);
    if (!municipioData) return [];
    return keys.map(key => ({
      name: key.replace(/_/g, " "),
      value: municipioData[key as keyof typeof municipioData] as number
    }));
  }, [municipio, filteredDataByDate]);

  // Fallback para dados nacionais
  const chartData = municipio && dataMunicipio.length > 0
    ? dataMunicipio
    : uf && dataUF.length > 0
    ? dataUF
    : keys.map(key => ({
        name: key.replace(/_/g, " "),
        value: ocorrencias.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0) / ocorrencias.length
      }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {!horizontal && <XAxis type="category" dataKey="name" />}
        {horizontal && <XAxis type="number" />}
        {!horizontal && <YAxis type="number" />}
        {horizontal && <YAxis type="category" dataKey="name" />}
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartsBar;
