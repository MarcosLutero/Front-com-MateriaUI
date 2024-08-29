import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import SignInSide from "./components/Paginas/LogInAndLogOut/SingInSide";
import Dashboard from "./components/Paginas/Dashboard";
import SignUp from "./components/Paginas/LogInAndLogOut/SingUp";
import Educacao from "./components/Paginas/PaginaLateral/Educacao";
import Procurados from "./components/Paginas/PaginaLateral/Procurados/ProcuradosList";
import Seguranca from "./components/Paginas/PaginaLateral/Seguranca";
import { Box } from "@mui/material";
import MenuLateral from "./components/Paginas/PaginaLateral/MenuLateral";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
function App() {
  const location = useLocation();

  // Verifica se a rota atual é "/login"
  const isLoginPage = location.pathname === "/login" || location.pathname === "/signup";

  function PrivateRoute({ element, ...rest }: any) {
    const isLoggedIn = !!localStorage.getItem("token"); // Substitua pela lógica de autenticação que você utiliza

    return isLoggedIn ? element : <Navigate to="/login" replace />;
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',  // Azul padrão para o tema
      },
      secondary: {
        main: '#d32f2f',  // Vermelho para destaques e ações
      },
      background: {
        default: '#f4f6f8',  // Cor de fundo clara
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: "flex" }}>
      {/* Exibe o MenuLateral apenas se não estiver na página de login */}
      {!isLoginPage && <MenuLateral />}
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        <Routes>
          <Route path="/login" element={<SignInSide />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/procurados" element={<PrivateRoute element={<Procurados />} />} />
          <Route path="/educacao" element={<PrivateRoute element={<Educacao />} />} />
          <Route path="/seguranca" element={<PrivateRoute element={<Seguranca />} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </Box>
    </ThemeProvider>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
