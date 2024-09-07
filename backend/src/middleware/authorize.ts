import { Request, Response, NextFunction } from "express";

interface Usuario {
    Permissoes: { nome: string }[];
}

interface CustomRequest extends Request {
    usuario?: Usuario;
}

const authorize = (permissaoNome: string) => {   
    const middleware = (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!permissaoNome || (
            req.usuario &&
            req.usuario.Permissoes.some((permissao: { nome: string }) => permissao.nome === permissaoNome)
        )) {
            next();
        } else {
            res.status(401).send("Not Authorized: " + permissaoNome);
        }
    };
    return middleware;
};

export default authorize;
