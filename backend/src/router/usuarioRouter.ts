import express, { Request, Response } from 'express';
import { Op } from 'sequelize';
import Usuario from "../models/Usuario";
import storage from "../storage";
import { v4 as uuidv4 } from 'uuid';
import FotoUsuario from '../models/FotoUsuario';


const usuarioRouter = express.Router();

usuarioRouter.get("/usuarios", (req: Request, res: Response) => {  
    const queryFilter: any = {};
  
    if (req.query.filter && typeof req.query.filter === 'string') {
        queryFilter[Op.or] = {
            nome: { [Op.like]: `%${req.query.filter}%` },
            cpf: { [Op.like]: `%${req.query.filter}%` },
            email: { [Op.like]: `%${req.query.filter}%` },
            naturalidade: { [Op.like]: `%${req.query.filter}%` },
            municipio: { [Op.like]: `%${req.query.filter}%` },
            status: { [Op.like]: `%${req.query.filter}%` },
        };
    }
  
    const order = req.query.order && typeof req.query.order === 'string'
      ? req.query.dir && typeof req.query.dir === 'string'
        ? req.query.order.split(",").map(order => [...order.split("."), req.query.dir])
        : req.query.order.split(",").map(order => order.split("."))
      : undefined;
  
    Usuario.findAndCountAll({
      where: queryFilter,
      order: order as any,
      distinct: true,
      limit: req.query.limit && typeof req.query.limit === 'string' && parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset && typeof req.query.offset === 'string' && parseInt(req.query.offset) > 0 ? parseInt(req.query.offset) : undefined,
      include: [
        {
            model: FotoUsuario,
            as: 'fotosUsuario' // Certifique-se de que este alias corresponde ao que você definiu em initdb
        }
    ]
    }).then((result) => {
      res.send({
        headers: [
          { title: "Foto", order: "uuid" },
          { title: "Nome", order: "nome" },
          { title: "Email", order: "email" },
          { title: "CPF", order: "cpf" },
          { title: "Estado", order: "naturalidade" },
          { title: "Municipio", order: "municipio" },
          { title: "Status", order: "status" },
        ],
        count: result.count,
        rows: result.rows.map((usuario) => ({
          values: [
            usuario.FotoUsuario?.[0] ? `https://your-minio-domain/${usuario.FotoUsuario[0].uuid}` : 'Sem foto',
            usuario.nome,
            usuario.email,
            usuario.cpf,
            usuario.naturalidade,
            usuario.municipio,
            usuario.status,
          ],
          actions: [
            {
              id: usuario.id,
              name: "edit",
              permission: "contratos_aditivo",
              icon: "Edit",
              title: "Editar",
              variant: "outline-primary",
            },
            {
              id: usuario.id,
              name: "delete",
              permission: "contratos_aditivo",
              icon: "Delete",
              title: "Excluir",
              variant: "outline-danger",
            },
          ]
        })),
      });
    }).catch((error) => {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).send("Erro ao buscar usuários");
    });
});

usuarioRouter.get('/usuarios/:id',
  (req, res) => {
      Usuario.findByPk(req.params.id).then(usuario => {
          if (usuario) res.send(usuario);
          else res.sendStatus(404)
      }).catch(() => {
          res.sendStatus(500);
      });      
  }
);

export default usuarioRouter;