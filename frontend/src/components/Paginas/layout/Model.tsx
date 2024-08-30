import React, { ReactNode } from 'react';
import Datatable from './Datatable';
import { Action } from './Types'; // Importa a interface Action
import Request from '../Request';
import { AppContext } from '../../context';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  SvgIcon,
} from '@mui/material';

interface ModelListProps {
  url: string;
  title?: string;
  modelIcon?: React.ElementType;
  modelForm?: React.ComponentType<any>;
  modelName?: string;
  modalSize?: 'sm' | 'md' | 'lg' | 'xl';
  empty?: any;
  useAdd?: boolean;
  filter?: string;
  onAction?: (action: Action, update: () => void, defaultHandler: () => void) => void;
  onClickAdd?: (update: () => void) => void;
  modelPrint?: React.ComponentType<any>;
}

class ModelList extends React.Component<ModelListProps> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  state = {
    isModalOpen: false,
  };

  static defaultProps: Partial<ModelListProps> = {
    title: "Lista de Registros",
    modelIcon: SvgIcon, 
    modelForm: (props) => <div {...props} />,
    modelName: "model",
    modalSize: "md",
    empty: {},
    useAdd: false,
    filter: "",
  };

  onAction(action: Action, update: () => void) {
    const token = this.context.token || ""; 
    const defaultHandler = () => {
      const url = `${this.props.url}/${action.id}`;
      switch (action.name) {
        // Código do case
      }
    };

    if (this.props.onAction) this.props.onAction(action, update, defaultHandler);
    else defaultHandler();
  }

  handleAddClick = () => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const EmptyForm = this.props.modelForm!;
    const emptyProps = {
      [this.props.modelName!]: this.props.empty,
    };

    return (
      <div className="h-100 d-flex flex-column">
        <h3 className="mb-3">
          <div>
            {this.props.modelIcon && (
              <this.props.modelIcon fontSize="inherit" />
            )}
            &nbsp;
            {this.props.title}
          </div>
        </h3>
        <div className="flex-grow-1 flex-shrink-1 overflow-auto">
          <Datatable
            url={this.props.url}
            useAdd={this.props.useAdd}
            onError={(err) => this.context.addToast({ titulo: "Erro", conteudo: err.toString() })}
            onAction={(action: Action, update) => this.onAction(action, update)}
            onClickAdd={this.handleAddClick}
            filter={this.props.filter}
          />
        </div>

        {/* Modal for the form */}
        <Dialog
          open={this.state.isModalOpen}
          onClose={this.handleCloseModal}
          maxWidth={this.props.modalSize}
          fullWidth
        >
          <DialogTitle>{`Adicionar ${this.props.title}`}</DialogTitle>
          <DialogContent>
            <EmptyForm {...emptyProps} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default ModelList;
