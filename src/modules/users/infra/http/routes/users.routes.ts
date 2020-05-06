import { Router } from 'express';
import multer from 'multer';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUsersServices from '@modules/users/services/CreateUsersServices';
import UploadAvatarUserServices from '@modules/users/services/UploadAvatarUserServices';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UploadConfig from '@config/upload';

const routes = Router();
const upload = multer(UploadConfig);

routes.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const usersRepository = new UsersRepository();
  const createUsersServices = new CreateUsersServices(usersRepository);

  const user = await createUsersServices.execute({
    name,
    email,
    password,
  });

  delete user.password;
  return response.json(user);
});

routes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const { filename } = request.file;
    const usersRepository = new UsersRepository();
    const uploadAvatarUser = new UploadAvatarUserServices(usersRepository);
    const user = await uploadAvatarUser.execute({
      user_id: request.user.id,
      avatar_filename: filename,
    });
    delete user.password;
    return response.json(user);
  },
);

export default routes;
