import { Router } from 'express';
import { UserController } from "./../controller/UserController";
import { checkJwt } from "./../middlewares/jwt";
import { checkRole } from "./../middlewares/role";

const router = Router();

router.get('/', [checkJwt, checkRole(['admin'])], UserController.getAllUsers);

router.get('/:id', [checkJwt, checkRole(['admin'])], UserController.getUserById);

router.post('/', [checkJwt, checkRole(['admin'])], UserController.newUser);

router.patch('/:id', [checkJwt, checkRole(['admin'])], UserController.editUser);

router.delete('/:id', [checkJwt, checkRole(['admin'])], UserController.deleteUser);

export default router;
