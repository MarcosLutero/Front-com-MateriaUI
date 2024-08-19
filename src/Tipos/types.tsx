export interface Estado {
    id: number;
    nome: string;
    sigla: string;
    municipios: {
      nome: string;
      incidencias: {
        roubo: {
          tipo: string;
          quantidade: number;
        }[];
        trafico: {
          tipo: string;
          quantidade: number;
        }[];
        incendio: {
          classe: string;
          descricao: string;
          quantidade: number;
        }[];
        mortes: {
          assassinato: number;
          homicidio: number;
          suicidio: number;
        }[];
      };
    }[];
  }
  