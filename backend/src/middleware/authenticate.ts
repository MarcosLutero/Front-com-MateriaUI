import { expressjwt } from "express-jwt";
import { Request } from "express";


const jwtPass = "jwt_senha";

const authenticate = () => expressjwt({
    secret: jwtPass,
    algorithms: ['HS256'],
    requestProperty: 'usuario',
}).unless({
    path: [
        /^\/login/,
    ]
});

export default authenticate;

