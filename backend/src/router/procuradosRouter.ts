import express, { Request, Response } from 'express';
import { Op } from 'sequelize';
import Procurado from "../models/Procurado";
import storage from "../storage";
import { v4 as uuidv4 } from 'uuid';
import FotoProcurado from '../models/FotoProcurado';

const procuradosRouter = express.Router();

procuradosRouter.get("/procurados", (req: Request, res: Response) => {  
  const queryFilter: any = {};

  if (req.query.filter && typeof req.query.filter === 'string') {
      queryFilter[Op.or] = {
          nome: { [Op.like]: `%${req.query.filter}%` },
          nomeMae: { [Op.like]: `%${req.query.filter}%` },
          nomePai: { [Op.like]: `%${req.query.filter}%` },
          cpf: { [Op.like]: `%${req.query.filter}%` },
          naturalidade: { [Op.like]: `%${req.query.filter}%` },
          municipio: { [Op.like]: `%${req.query.filter}%` },
      };
  }

  const order = req.query.order && typeof req.query.order === 'string'
    ? req.query.dir && typeof req.query.dir === 'string'
      ? req.query.order.split(",").map(order => [...order.split("."), req.query.dir])
      : req.query.order.split(",").map(order => order.split("."))
    : undefined;

  Procurado.findAndCountAll({
    where: queryFilter,
    order: order as any,
    distinct: true,
    limit: req.query.limit && typeof req.query.limit === 'string' && parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : undefined,
    offset: req.query.offset && typeof req.query.offset === 'string' && parseInt(req.query.offset) > 0 ? parseInt(req.query.offset) : undefined,
    include: [
      {
        model: FotoProcurado,
        as: 'fotosProcurado' // Use o alias correto aqui
      }
    ]  // Inclui as fotos na consulta
  }).then((result) => {
    res.send({
      headers: [
        { title: "Foto", order: "uuid" }, // Usando UUID como identificador da foto
        { title: "Nome", order: "nome" },
        { title: "Nome da Mãe", order: "nomeMae" },
        { title: "Nome do Pai", order: "nomePai" },
        { title: "CPF", order: "cpf" },
        { title: "Estado", order: "naturalidade" },
        { title: "Municipio", order: "municipio" },
      ],
      count: result.count,
      rows: result.rows.map((procurado) => ({
        values: [
          procurado.FotoProcurados?.[0] ? `https://your-minio-domain/${procurado.FotoProcurados[0].uuid}` : 'Sem foto',
          procurado.nome,
          procurado.nomeMae,
          procurado.nomePai,
          procurado.cpf,
          procurado.naturalidade,
          procurado.municipio,
        ],
        actions: [
          {
            id: procurado.id,
            name: "edit",
            permission: "contratos_aditivo",
            icon: "Edit",
            title: "Editar",
            variant: "outline-primary",
          },
          {
            id: procurado.id,
            name: "delete",
            permission: "contratos_aditivo",
            icon: "Delete",
            title: "Excluir",
            variant: "outline-danger",
          },
        ]
      })),
    });
  });
});


procuradosRouter.get('/procurados/:id',
  (req, res) => {
      Procurado.findByPk(req.params.id).then(procurado => {
          if (procurado) res.send(procurado);
          else res.sendStatus(404)
      }).catch(() => {
          res.sendStatus(500);
      });      
  }
);

procuradosRouter.post("/procurados", async (req: Request, res: Response) => {
  try {
      const client = storage({
          STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT!,
          STORAGE_PORT: parseInt(process.env.STORAGE_PORT!),
          STORAGE_USE_SSL: process.env.STORAGE_USE_SSL === 'true',
          STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY!,
          STORAGE_SECRET_KEY: process.env.STORAGE_SECRET_KEY!
      });

      const uuid = uuidv4();
      const buffer = Buffer.from(req.body.arquivo, 'base64');  // Decodifica a imagem base64 para buffer
      const metadata = {
          "Content-Type": "image/jpeg"  // Supondo que a imagem seja JPEG
      };

      try {
          await client.putObject(process.env.PROCURADO_BUCKET!, uuid, buffer, buffer.length, metadata);
          const procurado = await Procurado.create(req.body);
          await FotoProcurado.create({
              nome: req.body.nomeFoto, // Nome da foto passado no corpo da requisição
              tamanho: buffer.length,  // Tamanho da foto
              uuid: uuid,              // UUID gerado para a foto
              procuradoId: procurado.id // ID do procurado recém-criado
          });
          res.send(procurado);
      } catch (err) {
          console.log(err);
          res.sendStatus(500);
      }
  } catch (err) {
      console.log(err);
      res.sendStatus(500);
  }
});

export default procuradosRouter;
