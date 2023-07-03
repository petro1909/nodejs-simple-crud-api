import { ApiRequest } from '../types/apiRequest';
import { ApiResponse } from '../types/apiResponse';
import { routes } from './userRouter';

export class ApiRouter {
  async processRequest(request: ApiRequest, response: ApiResponse): Promise<ApiResponse> {
    if (!request.url) {
      response.statusCode = 404;
      return response.end('path not found');
    }
    const url = request.url.slice(1);
    const userApiRegex = /^(api\/users){1}(\/)?.*/;
    if (!userApiRegex.test(url)) {
      response.statusCode = 404;
      return response.end('path not found');
    }
    const pathArray: Array<string> = url.split('/');
    request.params = { id: pathArray[2] };
    try {
      if (request.method == 'GET') {
        if (request.params.id) {
          return await routes['GETONE'](request, response);
        } else {
          return await routes['GET'](request, response);
        }
      } else {
        return await routes[request.method! as keyof typeof routes](request, response);
      }
    } catch (err) {
      response.statusCode = 500;
      return response.end('server error');
    }
  }
}
