import React, { ReactNode, useState, useEffect } from "react";

// Definindo as interfaces para o contexto
interface Modal {
    show: boolean;
    titulo: string | null;
    conteudo: ReactNode | null;
    onClose: (() => void) | null;
    size: 'sm' | 'md' | 'lg' | 'xl';
    scrollable?: boolean;
}

interface Config {
    FRONTEND_URL: string;
    BACKEND_URL: string;
    CONFIGURE_URL: string;
}

interface Usuario {
    Permissoes: { nome: string }[];
}

interface ContextState {
    token: string | null;
    usuario: Usuario | null;
    modal: Modal;
    titulo: string;
    config: Config;
    setToken: (token: string, usuario: Usuario) => void;
    resetToken: () => void;
    setTitle: (titulo: string) => void;
    openModal: (modal: Partial<Modal>) => void;
    closeModal: () => void;
    isAuthorized?: (permissionName: string) => boolean | undefined;
}

// Valores padrão
export const defaultValues: ContextState = {
    token: null,
    usuario: null,
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
       BACKEND_URL: 'http://localhost:3001',
       CONFIGURE_URL: 'http://localhost:8080/configuracao/frontend'
    },
    setToken: () => undefined,
    resetToken: () => undefined,
    setTitle: () => undefined,
    openModal: () => undefined,
    closeModal: () => undefined
};

// Criação do contexto
export const AppContext = React.createContext<ContextState>(defaultValues);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState(defaultValues);

    // Carrega o token do localStorage ao inicializar
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Aqui você pode fazer uma chamada à API para obter os dados do usuário com base no token, se necessário
            setState({ ...state, token });
        }
    }, []);

    const setToken = (token: string, usuario: Usuario) => {
        localStorage.setItem('token', token);
        setState({ ...state, token, usuario });
    };

    const resetToken = () => {
        localStorage.removeItem('token');
        setState(defaultValues);
    };

    return (
        <AppContext.Provider
            value={{
                ...state,
                setToken,
                resetToken,
                setTitle: (titulo) => setState((prev) => ({ ...prev, titulo })),
                openModal: (modal) =>
                    setState((prev) => ({ ...prev, modal: { ...prev.modal, ...modal, show: true } })),
                closeModal: () =>
                    setState((prev) => ({ ...prev, modal: defaultValues.modal })),
                isAuthorized: (permissionName) =>
                    state.usuario?.Permissoes.some((p) => p.nome === permissionName) !== undefined,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
