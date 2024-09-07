import { RecaptchaV2 as Recaptcha } from 'express-recaptcha';
import { Request, Response, NextFunction } from "express";
import * as dotenv from 'dotenv';

dotenv.config();

interface Usuario {
    Permissoes: { nome: string }[];
}
interface CustomRequest extends Request {
    usuario?: Usuario;
}

const antibot = () => (req: CustomRequest, res: Response, next: NextFunction) => {
    const siteKey = process.env.RECAPTCHA_SITE_KEY!;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY!;

    if (siteKey && secretKey) {
        const recaptcha = new Recaptcha(siteKey, secretKey, { callback: 'cb' });

        recaptcha.verify(req, (error, data) => {                
            if (!error) {
                next();
            } else {
                console.log(error);
                res.status(401).send("Recaptcha não verificado.");
            }
        });
    } else {
        res.status(500).send("Chaves do reCAPTCHA não configuradas.");
    }
}

export default antibot;
