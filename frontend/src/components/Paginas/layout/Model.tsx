import React from 'react';
import Datatable from './Datatable';
import { Action } from './Types';
import superagent from 'superagent';
import { AppContext } from '../../context';
import {
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
    modalContent: null,
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
    const defaultHandler = () => {
      const url = `${this.props.url}/${action.id}`;
      switch (action.name) {
        case 'edit':
          superagent
            .get(url)
            .set('Authorization', `Bearer ${this.context.token!}`)
            .then((res) => {
              const Form = this.props.modelForm!;
              const props = {
                initialValues: res.body,
                onSubmit: () => update(),
              };
              this.setState({
                modalContent: <Form {...props} />,
                isModalOpen: true,
              });
            })
            .catch(err => {
              console.log(err);
            });
          break;
        case 'delete':
          if (window.confirm(`Deseja realmente excluir o registro com id ${action.id}?`)) {
            superagent
              .delete(url)
              .set('Authorization', `Bearer ${this.context.token!}`)
              .then(() => {
                update();
              })
              .catch(err => {
                console.log(err);
              });
          }
          break;
        default:
          console.log("Ação não reconhecida");
      }
    };

    if (this.props.onAction) {
      this.props.onAction(action, update, defaultHandler);
    } else {
      defaultHandler();
    }
  }

  handleAddClick = () => {
    const EmptyForm = this.props.modelForm!;
    const emptyProps = {
      [this.props.modelName!]: this.props.empty,
      onSave: () => {
        this.handleCloseModal();
      },
    };

    this.setState({
      modalContent: <EmptyForm {...emptyProps} />,
      isModalOpen: true,
    });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false, modalContent: null });
  };

  render() {
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
            onAction={(action: Action, update) => this.onAction(action, update)}
            onClickAdd={this.handleAddClick}
            filter={this.props.filter}
          />
        </div>

        <Dialog
          open={this.state.isModalOpen}
          onClose={this.handleCloseModal}
          maxWidth={this.props.modalSize}
          fullWidth
        >
          <DialogTitle>{`Adicionar ${this.props.title}`}</DialogTitle>
          <DialogContent>
            {this.state.modalContent}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default ModelList;
