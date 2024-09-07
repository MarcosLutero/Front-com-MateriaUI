import React, { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend } from "recharts";
import ocorrencias from "../../json/Municipios_Seguranca_Random_with_date_time.json";
import dayjs from "dayjs";

interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

interface ChartsRadarProps {
  uf: string;
  municipio: string;
  estados: Estado[];
  width?: number;
  height?: number;
  startDate: Date;
  endDate: Date;
}

const ChartsRadar: React.FC<ChartsRadarProps> = ({ uf, municipio, estados, startDate, endDate }) => {
  const keys = ["taxa_homicidios", "taxa_crimes_violentos", "indice_corrupcao", "desigualdade_social", "taxa_desemprego"];

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
      key,
      value: filteredData.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0) / filteredData.length
    }));
  }, [filteredData]);

  const dataMunicipio = useMemo(() => {
    const municipioData = filteredDataByDate.find(item => item.nome === municipio);
    if (!municipioData) return [];
    return keys.map(key => ({
      key,
      value: municipioData[key as keyof typeof municipioData] as number
    }));
  }, [municipio, filteredDataByDate]);

  // Fallback para dados nacionais
  const dataToRender = municipio && dataMunicipio.length > 0
    ? dataMunicipio
    : uf && dataUF.length > 0
    ? dataUF
    : keys.map(key => ({
        key,
        value: ocorrencias.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0) / ocorrencias.length
      }));

  return (
    <RadarChart width={600} height={400} data={dataToRender}>
      <PolarGrid />
      <PolarAngleAxis dataKey="key" />
      <PolarRadiusAxis />
      <Radar
        name={municipio ? `Média do Município: ${municipio}` : uf ? `Média UF` : "Média Nacional"}
        dataKey="value"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.6}
      />
      <Tooltip />
      <Legend />
    </RadarChart>
  );
};

export default ChartsRadar;
