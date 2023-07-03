import { ApiRequest } from '../types/apiRequest';
import { ApiResponse } from '../types/apiResponse';

export interface ApiController {
  getAll: (request: ApiRequest, response: ApiResponse) => Promise<ApiResponse>;
  getOneById: (request: ApiRequest, response: ApiResponse) => Promise<ApiResponse>;
  create: (request: ApiRequest, response: ApiResponse) => Promise<ApiResponse>;
  edit: (request: ApiRequest, response: ApiResponse) => Promise<ApiResponse>;
  deleteById: (request: ApiRequest, response: ApiResponse) => Promise<ApiResponse>;
}
