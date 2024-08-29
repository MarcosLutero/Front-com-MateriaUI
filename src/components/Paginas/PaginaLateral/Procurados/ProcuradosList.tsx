import React,{useContext} from 'react'
import { AppContext } from '../../../context';
import ModelList from '../../layout/Model';
import ProcuradosForm from './ProcuradosForm';
export default function ProcuradosList() {
  const context = useContext(AppContext);
  return (
    <ModelList
    url={context.config.BACKEND_URL + '/aviso'}
    title="Lista de Avisos"
    modelIcon="faNewspaper"
    useAdd={true}
    modelName="aviso"
    modelForm={ProcuradosForm}
/>
  )
}
