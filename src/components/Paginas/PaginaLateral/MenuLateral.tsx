import React from "react";
import { Avatar, Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import { Folder } from "@mui/icons-material";

const MenuLateral: React.FC = () => {
  const drawerWidth = 190;
  const theme = useTheme();
  const navigate = useNavigate();

  const DrawerHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start", // Alinha o avatar à esquerda
    paddingLeft: theme.spacing(2), // Adiciona espaço à esquerda
  }));

  const location = useLocation();
  const menuItems = [
    { text: "Dashboard", icon: <InboxIcon />, path: "/dashboard" },
    { text: "Procurados", icon: <MailIcon />, path: "/procurados" },
    { text: "Educação", icon: <InboxIcon />, path: "/educacao" },
    { text: "Segurança", icon: <MailIcon />, path: "/seguranca" },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#fff",
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <DrawerHeader>
          <Avatar>
            <Folder />
          </Avatar>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.text}
            disablePadding
            component={NavLink}
            to={item.path}
            selected={location.pathname === item.path} // Destaca o item ativo
            sx={{
              color: "inherit",
              textDecoration: "none",
              paddingLeft: theme.spacing(2), // Adiciona espaçamento do texto com a borda esquerda
              "&.active": {
                backgroundColor: "#839b4a", // Fundo cinza claro para item selecionado
                color: "#ededed", 
                "& .MuiListItemIcon-root": {
                  color: "#fff" 
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.primary }}>{item.icon}</ListItemIcon> {/* Ícones com cor padrão */}
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate("/login")} disablePadding sx={{ color: theme.palette.text.primary, paddingLeft: theme.spacing(2) }}>
          <ListItemIcon sx={{ color: theme.palette.text.primary }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default MenuLateral;
