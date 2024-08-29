import React, { ReactNode } from 'react';
import Datatable from './Datatable';
import Request from '../Request';
import { AppContext } from '../../context';

interface Action {
    id: string;
    name: string;
}

interface ModelListProps {
    url: string;
    title?: string;
    modelIcon?: string;
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

    static defaultProps: Partial<ModelListProps> = {
        title: "Lista de Registros",
        modelIcon: "",
        modelForm: (props) => <div {...props} />,
        modelName: "model",
        modalSize: "md",
        empty: {},
        useAdd: false,
        filter: ""
    }

    onAction(action: Action, update: () => void) {
        const defaultHandler = () => {
            const url = `${this.props.url}/${action.id}`;
            switch (action.name) {
                case 'print':
                    Request('GET', url, this.context.token!)
                        .then(res => {
                            const props = {
                                [this.props.modelName!]: res.body,
                            };
                            const ModelPrint = this.props.modelPrint!;
                            this.context.setContent(<ModelPrint {...props} />);  // Renderizando como JSX
                        })
                        .catch(err => {
                            this.context.addToast({ titulo: "Erro", conteudo: "Houve uma falha na execução da operação: " + err.toString() });
                        });
                    break;
                // Outros casos continuam iguais...
            }
        };

        if (this.props.onAction) {
            this.props.onAction(action, update, defaultHandler);
        } else {
            defaultHandler();
        }
    }

    render() {
        const EmptyForm = this.props.modelForm!;
        const emptyProps = {
            [this.props.modelName!]: this.props.empty
        };

        return (
            <div className='h-100 d-flex flex-column'>
                <h3 className="mb-3">
                    <div>
                        {this.props.modelIcon}
                        &nbsp;
                        {this.props.title}
                    </div>
                </h3>
                <div className='flex-grow-1 flex-shrink-1 overflow-auto'>
                    <Datatable
                        url={this.props.url}
                        onError={(err) => this.context.addToast({ titulo: "Erro", conteudo: err.toString() })}
                        onAction={(action, update) => this.onAction(action, update)}
                        onClickAdd={(update: () => void) => this.props.onClickAdd ? this.props.onClickAdd(update) : this.context.openModal({ titulo: 'Adicionar', conteudo: <EmptyForm {...emptyProps} onSave={() => update()} />, size: this.props.modalSize ?? "md" })}
                        filter={this.props.filter}
                    />
                </div>
            </div>
        );
    }
}

export default ModelList;
