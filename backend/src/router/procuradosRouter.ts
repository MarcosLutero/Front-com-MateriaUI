import express, { Request, Response } from 'express';
import { Op } from 'sequelize';
import Procurados from '../models/procurados';

const procuradosRouter = express.Router();

procuradosRouter.get("/procurados", (req: Request, res: Response) => {  
    const queryFilter: any = {};

    if (req.query.filter && typeof req.query.filter === 'string') {
        queryFilter[Op.or] = {
            nome: {
                [Op.like]: `%${req.query.filter}%`
            },
            nomeMae: {
                [Op.like]: `%${req.query.filter}%`
            },
            nomePai: {
                [Op.like]: `%${req.query.filter}%`
            },
            cpf: {
                [Op.like]: `%${req.query.filter}%`
            },
            naturalidade: {
                [Op.like]: `%${req.query.filter}%`
            },
            municipio: {
                [Op.like]: `%${req.query.filter}%`
            },
        }
    }

    const order = req.query.order && typeof req.query.order === 'string'
      ? req.query.dir && typeof req.query.dir === 'string'
        ? req.query.order.split(",").map(order => [...order.split("."), req.query.dir])
        : req.query.order.split(",").map(order => order.split("."))
      : undefined;
  
    Procurados.findAndCountAll({
      where: queryFilter,
      order: order as any,
      distinct: true,
      limit: req.query.limit && typeof req.query.limit === 'string' && parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset && typeof req.query.offset === 'string' && parseInt(req.query.offset) > 0 ? parseInt(req.query.offset) : undefined
    }).then((result) => {
      res.send({
        headers: [
          { title: "Nome", order: "nome" },
          { title: "Nome da Mãe", order: "nomeMae" },
          { title: "Nome do Pai", order: "nomePai" },
          { title: "CPF", order: "cpf" },
          { title: "Estado", order: "naturalidade" },
          { title: "Municipio", order: "municipio" },
        ],
        count: result.count,
        rows: result.rows.map((procudado) => ({
          values: [
            procudado.nome,
            procudado.nomeMae,
            procudado.nomePai,
            procudado.cpf,
            procudado.naturalidade,
            procudado.municipio,
          ],
          actions: [
            {
              id: procudado.id,
              name: "edit",
              permission: "contratos_aditivo",
  
              //Exigido pelo Datatable
              icon: "faEdit",
              title: "Editar",
              variant: "outline-primary",
            },
            {
              id: procudado.id,
              name: "delete",
              permission: "contratos_aditivo",
  
              //Exigido pelo Datatable
              icon: "faTrash",
              title: "Excluir",
              variant: "outline-danger",
            },
          ]
        })),
      });
    });
  });

export default procuradosRouter;
