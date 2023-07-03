import { createServer } from 'http';
import { config } from 'dotenv';
import { resolve } from 'path';
import { UserRepository } from './db/users';
import { ApiRouter } from './router/baseRouter';
import { ApiRequest } from './types/apiRequest';
import cluster from 'cluster';
import { cpus } from 'os';

//const totalCPUs = cpus().length;
config({ path: resolve(process.cwd(), './.env') });
const apiRouter = new ApiRouter();
export const userRepository = new UserRepository();
userRepository.createRandomUsers();

//const port = +process.env['PORT']!;
// if (cluster.isPrimary) {
//   console.log(`Number of CPUs is ${totalCPUs}`);
//   console.log(`Master ${process.pid} is running`);

// for (let i = 0; i < totalCPUs; i++) {
//   port += 1;
//   cluster.fork({ port: port });
//   process.env['PORT'] = port.toString();
// }
// cluster.on('message', (worker, message, handle) => {
//   console.log(`message ${message}`);
// });

// cluster.on('exit', (worker, code, signal) => {
//   console.log(`worker ${worker.process.pid} died`);
//   console.log("Let's fork another worker!");
//   cluster.fork();
// });
// } else {
createServer(async (request, response) => {
  const apiRequest = request as ApiRequest;

  let data = '';
  request.on('data', (chunk) => {
    data += chunk;
  });
  request.on('end', async () => {
    apiRequest.body = data;
    await apiRouter.processRequest(apiRequest, response);
  });
}).listen(process.env['PORT'], () => {
  console.log(process.env['PORT']);
});
// console.log(`Worker ${process.pid} started`);
//console.log(process.env);
//}
