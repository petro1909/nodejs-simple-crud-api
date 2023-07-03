import { createServer } from 'http';
import { config } from 'dotenv';
import { resolve } from 'path';
import { UserRepository } from './db/users';
import { ApiRouter } from './router/baseRouter';
import { ApiRequest } from './types/apiRequest';
import cluster, { Worker } from 'cluster';
import { cpus } from 'os';
import { inspect } from 'util';
import { ApiResponse } from './types/apiResponse';

config({ path: resolve(process.cwd(), './.env') });

const totalCPUs = cpus().length;
const apiRouter = new ApiRouter();
export const userRepository = new UserRepository();
const workers: Array<Worker> = [];
userRepository.createRandomUsers();

let port = +process.env['PORT']!;

if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  for (let i = 1; i < totalCPUs; i++) {
    port += 1;
    const worker = cluster.fork({ port: port });
    workers.push(worker);
    process.env['PORT'] = port.toString();
  }

  createServer(async (request, response) => {
    const apiRequest = request as ApiRequest;
    let i = 0;
    let data = '';
    request.on('data', (chunk) => {
      data += chunk;
    });
    request.on('end', async () => {
      apiRequest.body = data;
      workers[i]?.send({ req: inspect(apiRequest), res: inspect(response) });
      if (i == workers.length - 1) {
        i = 0;
      } else {
        i++;
      }
    });
  }).listen(+process.env['PORT']! - totalCPUs + 1, () => {
    console.log(`Master port ${+process.env['PORT']! - totalCPUs + 1}`);
  });
  console.log(`Worker ${process.pid} started`);

  // cluster.on('message', (worker, message, handle) => {
  //   console.log(`message ${message}`);
  // });

  // cluster.on('exit', (worker, code, signal) => {
  //   console.log(`worker ${worker.process.pid} died`);
  //   console.log("Let's fork another worker!");
  //   cluster.fork();
  // });
} else {
  process.on('message', async (message: { req: string; res: string }) => {
    console.log(message.req);
    //await apiRouter.processRequest(message.req, message.res);
  });
  // createServer(async (request, response) => {
  //   const apiRequest = request as ApiRequest;

  //   let data = '';
  //   request.on('data', (chunk) => {
  //     data += chunk;
  //   });
  //   request.on('end', async () => {
  //     apiRequest.body = data;
  //     await apiRouter.processRequest(apiRequest, response);
  //   });
  // }).listen(process.env['PORT'], () => {
  //   console.log(process.env['PORT']);
  // });
  // console.log(process.env['PORT']);
  // console.log(`Worker ${process.pid} started`);
}
