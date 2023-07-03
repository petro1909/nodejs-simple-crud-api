import { createServer } from 'http';
import { config } from 'dotenv';
import { resolve } from 'path';
import { UserRepository } from './db/users';
import { ApiRouter } from './router/baseRouter';
import { ApiRequest } from './types/apiRequest';

config({ path: resolve(process.cwd(), './.env') });
const apiRouter = new ApiRouter();
export const userRepository = new UserRepository();
userRepository.createRandomUsers();

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
