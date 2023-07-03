import { UserConroller } from '../controller/userController';
const userConroller = new UserConroller();

export const routes = {
  GET: userConroller.getAll,
  GETONE: userConroller.getOneById,
  POST: userConroller.create,
  PUT: userConroller.edit,
  DELETE: userConroller.deleteById,
};
