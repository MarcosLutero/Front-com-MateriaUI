import fs from 'fs';
import path from 'path';

const Routers: any[] = [];

fs.readdirSync(__dirname)
  .filter((file: string) => file !== 'index.ts') 
  .forEach((file: string) => {
    const router = require(path.join(__dirname, file)).default;
    Routers.push(router);
  });

export default Routers;
