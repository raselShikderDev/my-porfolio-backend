import { Router } from 'express';
import { projectController } from './project.controller';
import { requestValidator } from '../../middlewares/requestValidator';
import { ProjectCreateSchema } from './project.schema';
import authCheck from '../../middlewares/authCheck';
import { Role } from '../users/user.interface';

const router = Router();

router.post(
  '/create',
  authCheck(...Object.values(Role)),
  requestValidator(ProjectCreateSchema),
  projectController.createProject,
);

export const projectRoute = router;
