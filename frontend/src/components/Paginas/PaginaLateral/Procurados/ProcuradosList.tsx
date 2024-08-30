import React, { useContext } from 'react';
import { AppContext } from '../../../context';
import ModelList from '../../layout/Model';
import ProcuradosForm from './ProcuradosForm';
import NewspaperIcon from '@mui/icons-material/Newspaper';

export default function ProcuradosList() {
  const context = useContext(AppContext);
  return (
    <ModelList
      url={context.config.BACKEND_URL + '/produrados'}
      useAdd={true}
      title="Lista de Procurados"
      modelIcon={NewspaperIcon}
      modelName="produrados"
      modelForm={ProcuradosForm}
    />
  );
}
