import { Router } from 'express';
import { requestValidator } from '../../middlewares/requestValidator';
import { ProjectCreateSchema, ProjectUpdateSchema } from './project.schema';
import authCheck from '../../middlewares/authCheck';
import { Role } from '../users/user.interface';
import { projectController } from './project.controller';

const router = Router();


// Creating a project
router.post(
  "/create",
  authCheck(...Object.values(Role)),
  requestValidator(ProjectCreateSchema),
  projectController.createProject,
);


// edit a project
router.patch(
  "/edit/:id",
  authCheck(...Object.values(Role)),
  requestValidator(ProjectUpdateSchema),
  projectController.editProject,
);


// get all project
router.get(
  "/all",
  authCheck(...Object.values(Role)),
  projectController.getAllProject,
);


// get a project
router.get(
  "/:id",
  authCheck(...Object.values(Role)),
  projectController.getProject,
);


// remove a project
router.delete(
  "/:id",
  authCheck(...Object.values(Role)),
  projectController.removeProject,
);


export const projectRoute = router;
