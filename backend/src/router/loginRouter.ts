import express, { Request, Response } from "express";
import Usuario from "../models/Usuario";
import Perfil from "../models/Perfil";
import Permissao from "../models/Permissao";
import jwt from "jsonwebtoken";
import antibot from "../middleware/antibot";
import md5 from "md5";

const loginRouter = express.Router();

type UsuarioComPerfis = Usuario & {
  Perfis: (Perfil & { Permissoes: Permissao[] })[];
};

loginRouter.post("/login", async (req: Request, res: Response) => {
  try {
    console.log("Iniciando processo de login"); // Adicionado para depuração
    const usuario = (await Usuario.findOne({
      where: {
        email: req.body.email, // Procura o usuário pelo email
        senha: md5(req.body.senha),
        status: "Ativo"
      },
      include: [
        {
          model: Perfil,
          as: "Perfis",
          include: [{ model: Permissao, as: "Permissoes" }]
        }
      ]
    })) as UsuarioComPerfis | null;

    if (usuario) {
      console.log("Usuário encontrado:", usuario);
      const Permissoes: any[] = [];
      usuario.Perfis.forEach(perfil => {
        if (perfil.Permissoes && Array.isArray(perfil.Permissoes)) {
          perfil.Permissoes.forEach(permissao => {
            if (!Permissoes.find(p => p.id === permissao.id)) {
              Permissoes.push(permissao);
            }
          });
        } else {
          console.log("Perfil sem permissões ou estrutura inválida:", perfil);
        }
      });

      const token = jwt.sign(
        {
          id: usuario.id,
          Permissoes
        },
        "jwt_senha",
        {
          algorithm: "HS256",
          expiresIn: "1h"
        }
      );

      res.send({
        token, // Envia o token para o cliente
        usuario: {
          id: usuario.id,
          cpf: usuario.cpf,
          nome: usuario.nome
        }
      });
    } else {
      console.log("Usuário não encontrado ou credenciais inválidas");
      res.status(401).send("Email ou senha incorretos");
    }
  } catch (err) {
    console.error("Erro durante o login:", err); // Adicionado para capturar qualquer erro
    res.status(500).send("Erro interno no servidor");
  }
});

export default loginRouter;
