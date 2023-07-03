import { ApiRequest } from 'src/types/apiRequest';
import { ApiResponse } from 'src/types/apiResponse';
import { userRepository } from '../../src/index';
import { users } from '../entities/users';
import { UserConroller } from '../../src/controller/userController';
import { User } from 'src/types/user';

jest.mock('../../src');
const userConroller = new UserConroller();

describe('test user controller methods', () => {
  const apiRequest = {} as ApiRequest;
  apiRequest.params = { id: '' };

  const apiResponse = {
    statusCode: 0,
    end: (_chunk: string) => apiResponse,
    setHeader: (_name: string, _value: string) => apiResponse,
  } as ApiResponse;

  beforeEach(() => {
    jest.spyOn(userRepository, 'getUsers').mockImplementation(() => users);
  });

  describe('test getAll method', () => {
    test('get all should return user list', async () => {
      const mockedApiResponseEnd = jest.spyOn(apiResponse, 'end');
      const resultApiResponse = await userConroller.getAll(apiRequest, apiResponse);
      const endResult = mockedApiResponseEnd.mock.calls[0]?.[0];
      expect(resultApiResponse.statusCode).toEqual(200);
      expect(endResult).toEqual(JSON.stringify(users));
      mockedApiResponseEnd.mockClear();
    });
  });

  describe('test getOneById method', () => {
    test('get one user if user with passed id exist', async () => {
      apiRequest.params.id = '2ed85ed3-7ac5-49d3-a87f-af45a622b93e';
      const resultApiResponse = await userConroller.getOneById(apiRequest, apiResponse);
      expect(resultApiResponse.statusCode).toEqual(200);
    });
    test('return response with status code 404 if user with passed id doesn"t exist', async () => {
      apiRequest.params.id = '2ed85ed3-7ac5-49d1-a87f-af45a622b93e';
      const resultApiResponse = await userConroller.getOneById(apiRequest, apiResponse);
      expect(resultApiResponse.statusCode).toEqual(404);
    });
    test('return response with status code 400 if passed id is invalid', async () => {
      apiRequest.params.id = 'invalid id';
      const resultApiResponse = await userConroller.getOneById(apiRequest, apiResponse);
      expect(resultApiResponse.statusCode).toEqual(400);
    });
  });

  describe('test create method', () => {
    test('should return response with status 201 and newly created entity and create one user and add it to users', async () => {
      const mockedApiResponseEnd = jest.spyOn(apiResponse, 'end');
      const validUser: User = { username: 'testname', age: 60, hobbies: [] };
      apiRequest.body = validUser;

      const usersLengthBeforePost = users.length;
      const resultApiResponse = await userConroller.create(apiRequest, apiResponse);
      const usersLengthAfterPost = users.length;

      expect(resultApiResponse.statusCode).toEqual(201);
      expect(usersLengthAfterPost).toEqual(usersLengthBeforePost + 1);

      const createdUserStr = mockedApiResponseEnd.mock.calls[0]?.[0];
      const createdUser: User = JSON.parse(createdUserStr);

      expect(createdUser).toEqual(validUser);
      mockedApiResponseEnd.mockClear();
    });

    test('return response with status code 400 if user is invalid', async () => {
      const mockedApiResponseEnd = jest.spyOn(apiResponse, 'end');
      const invalidUser = { username: 'testname', age: 'invalid', hobbies: [] };
      apiRequest.body = invalidUser;

      const usersLengthBeforePost = users.length;
      const resultApiResponse = await userConroller.create(apiRequest, apiResponse);
      const usersLengthAfterPost = users.length;

      expect(resultApiResponse.statusCode).toEqual(400);
      expect(usersLengthAfterPost).toEqual(usersLengthBeforePost);
      mockedApiResponseEnd.mockClear();
    });
  });
  describe('test edit method', () => {
    test('should return response with status 200 and edited entity and edit this user in users', async () => {
      const mockedApiResponseEnd = jest.spyOn(apiResponse, 'end');
      const validEditedUser: User = { username: 'newName', age: 20, hobbies: [] };
      apiRequest.params.id = '7522228b-2e45-46d0-8656-50b606a76170';
      apiRequest.body = validEditedUser;

      const usersLengthBeforePost = users.length;
      const resultApiResponse = await userConroller.edit(apiRequest, apiResponse);
      const usersLengthAfterPost = users.length;

      expect(resultApiResponse.statusCode).toEqual(200);
      expect(usersLengthBeforePost).toEqual(usersLengthAfterPost);

      const editedUserStr = mockedApiResponseEnd.mock.calls[0]?.[0];
      const editedUser: User = JSON.parse(editedUserStr);

      expect(editedUser).toEqual(validEditedUser);
      mockedApiResponseEnd.mockClear();
    });
    test('return response with status code 404 if user with passed id doesn"t exist', async () => {
      apiRequest.params.id = '2ed85ed3-1ac5-49d1-a87f-af45a622b93e';
      const resultApiResponse = await userConroller.edit(apiRequest, apiResponse);
      expect(resultApiResponse.statusCode).toEqual(404);
    });
    test('return response with status code 400 if passed id is invalid', async () => {
      apiRequest.params.id = 'invalid id';
      const resultApiResponse = await userConroller.edit(apiRequest, apiResponse);
      expect(resultApiResponse.statusCode).toEqual(400);
    });
  });

  describe('test delete method', () => {
    test('delete one user if user with passed id exist', async () => {
      apiRequest.params.id = '2ed85ed3-7ac5-49d3-a87f-af45a622b93e';
      const resultApiResponse = await userConroller.deleteById(apiRequest, apiResponse);
      expect(resultApiResponse.statusCode).toEqual(204);
      expect(users.find((item) => item.id == apiRequest.params.id)).toBeUndefined();
    });
    test('return response with status code 404 if user with passed id doesn"t exist', async () => {
      apiRequest.params.id = '2ed85ed3-7ac5-49d1-a87f-af45a622b93e';
      const resultApiResponse = await userConroller.deleteById(apiRequest, apiResponse);
      expect(resultApiResponse.statusCode).toEqual(404);
    });
    test('return response with status code 400 if passed id is invalid', async () => {
      apiRequest.params.id = 'invalid id';
      const resultApiResponse = await userConroller.deleteById(apiRequest, apiResponse);
      expect(resultApiResponse.statusCode).toEqual(400);
    });
  });
});
