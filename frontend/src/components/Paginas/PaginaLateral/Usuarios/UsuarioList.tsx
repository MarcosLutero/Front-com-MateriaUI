import React, { useContext } from 'react';
import { AppContext } from '../../../context';
import ModelList from '../../layout/Model';
import UsuarioForm from './UsuarioForm';
import NewspaperIcon from '@mui/icons-material/Newspaper';

export default function UsuarioList() {
  const context = useContext(AppContext);
  return (
    <ModelList
      url={context.config.BACKEND_URL + '/usuarios'}
      useAdd={true}
      title="Lista de Usarios"
      modelIcon={NewspaperIcon}
      modelName="usuarios"
      modelForm={UsuarioForm}
    />
  );
}
