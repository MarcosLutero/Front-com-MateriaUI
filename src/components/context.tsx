import React, { ReactNode } from "react";

// Definindo as interfaces para o contexto
interface Modal {
    show: boolean;
    titulo: string | null;
    conteudo: ReactNode | null;
    onClose: (() => void) | null;
    size: 'sm' | 'md' | 'lg' | 'xl';
    scrollable?: boolean;
}

interface Toast {
    titulo: string;
    conteudo: ReactNode;
    delay?: number;
    toastKey: number;
}

interface Config {
    FRONTEND_URL: string;
    BACKEND_URL: string;
    CONFIGURE_URL: string;
}

interface Usuario {
    Modulos: { nome: string; conteudo: ReactNode; Menus: any[]; titulo: string }[];
    Permissoes: { nome: string }[];
}

interface ContextState {
    token: string | null;
    usuario: Usuario | null;
    modulo: string | null;
    fullpage: boolean;
    conteudo: string | ReactNode;
    contentProps: any;
    toasts: Toast[];
    menus: any[];
    modal: Modal;
    titulo: string;
    config: Config;
    toastKey: number;
    expirado: boolean;
    setState: (state: Partial<ContextState>) => void;
    setConfig: (config: Partial<Config>) => void;
    delToast: (key: number) => void;
    addToast: (toast: Omit<Toast, 'toastKey'>) => void;
    setToken: (token: string, usuario: Usuario) => void;
    resetToken: () => void;
    setModule: (moduleName: string) => void;
    setContent: (conteudo: string | ReactNode, props?: any, titulo?: string, fullpage?: boolean) => void;
    setTitle: (titulo: string) => void;
    openModal: (modal: Partial<Modal>) => void;
    closeModal: () => void;
    isAuthorized?: (permissionName: string) => boolean | undefined;
}

// Valores padrão
export const defaultValues: ContextState = {
    token: null,
    usuario: null,
    modulo: null,
    fullpage: true,
    conteudo: "LoginForm",
    contentProps: {},
    toasts: [],
    menus: [],
    modal: {
        show: false,
        titulo: null,
        conteudo: null,
        onClose: null,
        size: "md"
    },
    titulo: 'PISP - Plataforma Integrada de Segurança Pública',
    config: {
       FRONTEND_URL: 'http://localhost:3000',
       BACKEND_URL: 'http://localhost:8080',
       CONFIGURE_URL: 'http://localhost:8080/configuracao/frontend'
    },
    toastKey: 1,
    expirado: false,
    setState: () => undefined,
    setConfig: () => undefined,
    delToast: () => undefined,
    addToast: () => undefined,
    setToken: () => undefined,
    resetToken: () => undefined,
    setModule: () => undefined,
    setContent: () => undefined,
    setTitle: () => undefined,
    openModal: () => undefined,
    closeModal: () => undefined
};

// Criação do contexto
export const AppContext = React.createContext<ContextState>(defaultValues);

// Função para criar o valor do contexto
export const createContextValue = (currentState: ContextState, setState: React.Dispatch<React.SetStateAction<ContextState>>): ContextState => ({
    ...currentState,
    setState: state => setState({ ...currentState, ...state }),        
    setConfig: config => setState({ ...currentState, config: { ...currentState.config, ...config } }),
    delToast: key => setState(state => ({
        ...state,
        toasts: state.toasts.filter(toast => toast.toastKey !== key)
    })),
    addToast: ({ titulo, conteudo, delay }) => setState(state => ({
        ...state,
        toastKey: state.toastKey + 1,
        toasts: [
            ...state.toasts,
            { titulo, conteudo, delay, toastKey: state.toastKey }
        ]
    })),
    setToken: (token, usuario) => setState({
        ...currentState,
        token,
        usuario,
        conteudo: "DashboardPage",
        modulo: null,
        menus: []
    }),
    setModule: moduleName => setState(state => {
        const modulo = state.usuario?.Modulos.find(modulo => modulo.nome === moduleName);
        if (!modulo) return state;
        return {
            ...state,
            conteudo: modulo.conteudo,
            menus: modulo.Menus,
            modulo: moduleName,
            titulo: modulo.titulo,
            fullpage: false
        };
    }),
    resetToken: () => setState({
        ...defaultValues,
        toasts: [
            {
                titulo: "Usuário desconectado",
                conteudo: "Feche a janela do navegador para sair com segurança.",
                toastKey: 1
            }
        ],
        toastKey: 2
    }),
    setContent: (conteudo, props, titulo, fullpage = false) => setState(state => ({
        ...state,
        conteudo,
        contentProps: props,
        titulo: titulo ?? state.titulo,
        fullpage
    })),
    setTitle: titulo => setState(state => ({ ...state, titulo })),
    openModal: ({ show, titulo, conteudo, onClose, size, scrollable }) => setState(state => ({
        ...state,
        modal: {
            ...state.modal,
            show: show ?? true,
            scrollable,
            titulo: titulo ?? null,  // Garantir que 'titulo' seja string ou null
            conteudo, 
            onClose: onClose ?? null,  // Garantir que 'onClose' seja uma função ou null
            size: size ?? "md"  // Garantir que 'size' tenha um valor padrão
        }
    })),
    
    
    
    closeModal: () => setState(state => ({
        ...state,
        modal: defaultValues.modal
    })),
    isAuthorized: permissionName => currentState.usuario?.Permissoes.find(p => p.nome === permissionName) !== undefined
});
