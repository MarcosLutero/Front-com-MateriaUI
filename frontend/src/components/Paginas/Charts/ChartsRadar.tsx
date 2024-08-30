import React, { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend } from "recharts";
import ocorrencias from "../../json/Municipios_Seguranca_Random.json";

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
}

// Função para obter o código da UF a partir da sigla
const siglaToCodigoUF = (sigla: string, estados: Estado[]) => {
  const estado = estados.find(e => e.sigla === sigla);
  return estado ? estado.id : null;
};

const ChartsRadar: React.FC<ChartsRadarProps> = ({ uf, municipio, estados }) => {
  const keys = ["taxa_homicidios", "taxa_crimes_violentos", "indice_corrupcao", "desigualdade_social", "taxa_desemprego"];

  // Média nacional
  const dataNacional = useMemo(() => {
    if (ocorrencias.length === 0) return [];

    return keys.map(key => ({
      key,
      value: ocorrencias.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0) / ocorrencias.length
    }));
  }, []);

  // Média por UF
  const filteredData = useMemo(
    () => {
      const ufCode = siglaToCodigoUF(uf, estados);
      return ocorrencias.filter(item => item.codigo_uf === ufCode);
    },
    [uf, estados]
  );

  const dataUF = useMemo(
    () => {
      if (filteredData.length === 0) return [];

      return keys.map(key => ({
        key,
        value: filteredData.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0) / filteredData.length
      }));
    },
    [filteredData]
  );

  // Média por Município
  const dataMunicipio = useMemo(
    () => {
      const municipioData = ocorrencias.find(item => item.nome === municipio);
      if (!municipioData) return [];

      return keys.map(key => ({
        key,
        value: municipioData[key as keyof typeof municipioData] as number
      }));
    },
    [municipio]
  );

  // Decidir qual dado renderizar
  const dataToRender = municipio && dataMunicipio.length > 0 ? dataMunicipio : uf && dataUF.length > 0 ? dataUF : dataNacional;

  return (
    <RadarChart width={600} height={400} data={dataToRender}>
      <PolarGrid />
      <PolarAngleAxis dataKey="key" />
      <PolarRadiusAxis />
      <Radar
        name={
          municipio && dataMunicipio.length > 0
            ? `Média do Município: ${municipio}`
            : uf && dataUF.length > 0
            ? `Média UF`
            : "Média Nacional"
        }
        dataKey="value"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.6}
      />
      <Tooltip />
      <Legend wrapperStyle={{ paddingBottom: "10px" }} /> {/* Adiciona espaçamento superior */}
    </RadarChart>
  );
};

export default ChartsRadar;
