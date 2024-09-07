import Usuario from "../models/Usuario";
import Perfil from "../models/Perfil";
import Permissao from "../models/Permissao";
import FotoUsuario from "../models/FotoUsuario";
import Procurado from "../models/Procurado";
import FotoProcurado from "../models/FotoProcurado";
import PerfilUsuario from "../models/PerfilUsuario";
import PerfilPermissao from "../models/PerfilPermissao";

// Um usuário tem vários perfis
const initdb = (): void => {
  // Um usuário tem vários perfis
  Usuario.belongsToMany(Perfil, { through: PerfilUsuario, as: "Perfis" });
  Perfil.belongsToMany(Usuario, { through: PerfilUsuario, as: "Usuarios" });

  // Um perfil tem muitas permissões
  Perfil.belongsToMany(Permissao, { through: PerfilPermissao, as: "Permissoes" });
  Permissao.belongsToMany(Perfil, { through: PerfilPermissao, as: "Perfils" });

  // Um usuário tem uma foto de perfil
  // Um usuário tem uma foto de perfil
  Usuario.hasOne(FotoUsuario, { foreignKey: "usuarioId", as: "fotosUsuario" });
  FotoUsuario.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" }); // Corrigido o alias para evitar confusão

  // Um procurado tem várias fotos_procurado
// Um procurado tem várias fotos_procurado
Procurado.hasMany(FotoProcurado, { foreignKey: "procuradoId", as: "fotosProcurado" });
FotoProcurado.belongsTo(Procurado, { foreignKey: "procuradoId", as: "procurado" });


  console.log("Registrando associações entre Usuario e Perfil...");
};

export default initdb;
