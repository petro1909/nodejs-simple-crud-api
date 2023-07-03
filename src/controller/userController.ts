import { ApiRequest } from '../types/apiRequest';
import { ApiResponse } from '../types/apiResponse';
import { ApiController } from './controller';
import { userRepository } from '../index';
import { v4, validate } from 'uuid';
import { validateUser } from '../validator/userValidator';
import { User } from '../types/user';
export class UserConroller implements ApiController {
  async getAll(request: ApiRequest, response: ApiResponse): Promise<ApiResponse> {
    response.statusCode = 200;
    response.setHeader('Content-type', 'application/json');
    response.end(JSON.stringify(userRepository.getUsers()));
    return response;
  }

  async getOneById(request: ApiRequest, response: ApiResponse): Promise<ApiResponse> {
    const userId = request.params.id;
    if (userId && !validate(userId)) {
      response.statusCode = 400;
      return response.end(`Provided user id: ${userId} is invalid`);
    }
    const user = userRepository.getUsers().find((user) => user.id === userId);
    if (!user) {
      response.statusCode = 404;
      return response.end(`user with id: ${userId} not found`);
    }
    response.statusCode = 200;
    response.setHeader('Content-type', 'application/json');
    return response.end(JSON.stringify(user));
  }

  async create(request: ApiRequest, response: ApiResponse): Promise<ApiResponse> {
    let createdUser;
    try {
      createdUser = JSON.parse(request.body as string) as User;
    } catch (err) {
      response.statusCode = 400;
      return response.end(`Posted user entity is invalid`);
    }

    if (!validateUser(createdUser)) {
      response.statusCode = 400;
      return response.end(`Posted user entity is invalid`);
    }

    const userId = v4();
    createdUser.id = userId;
    userRepository.getUsers().push(createdUser);

    response.statusCode = 201;
    return response.end(JSON.stringify(createdUser));
  }

  async edit(request: ApiRequest, response: ApiResponse): Promise<ApiResponse> {
    const userId = request.params.id;
    if (userId && !validate(userId)) {
      response.statusCode = 400;
      return response.end(`Provided user id: ${userId} is invalid`);
    }
    const user = userRepository.getUsers().find((user) => user.id === userId);
    if (!user) {
      response.statusCode = 404;
      return response.end(`user with id: ${userId} not found`);
    }
    let editedUser;
    try {
      editedUser = JSON.parse(request.body as string) as User;
    } catch (err) {
      response.statusCode = 400;
      return response.end(`Edited user entity is invalid`);
    }
    editedUser.id = userId!;
    userRepository.getUsers()[userRepository.getUsers().indexOf(user)] = editedUser;

    response.statusCode = 200;
    return response.end(JSON.stringify(userRepository.getUsers()[userRepository.getUsers().indexOf(editedUser)]));
  }

  async deleteById(request: ApiRequest, response: ApiResponse): Promise<ApiResponse> {
    const userId = request.params.id;
    if (userId && !validate(userId)) {
      response.statusCode = 400;
      return response.end(`Provided user id: ${userId} is invalid`);
    }
    const user = userRepository.getUsers().find((user) => user.id === userId);
    if (!user) {
      response.statusCode = 404;
      return response.end(`user with id: ${userId} not found`);
    }
    userRepository.getUsers().splice(userRepository.getUsers().indexOf(user), 1);
    console.log(JSON.stringify(userRepository.getUsers()));
    response.statusCode = 204;
    return response.end('User sucsessfully deleted');
  }
}
