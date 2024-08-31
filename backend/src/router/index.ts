import fs from 'fs';
import path from 'path';
import { Router } from 'express';

const Routers: Router[] = [];

fs.readdirSync(__dirname)
  .filter((file: string) => file !== 'index.ts')
  .forEach((file: string) => {
    const router = require(path.join(__dirname, file));
    Routers.push(router.default || router);  // Verifica se `default` existe, senão usa o próprio módulo.
  });

export default Routers;
