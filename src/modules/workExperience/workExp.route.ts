import { Router } from 'express';
import authCheck from '../../middlewares/authCheck';
import { Role } from '../users/user.interface';
import { workExpController } from './workExp.controller';
import { multerUpload } from '../../configs/multerConfig';

const router = Router();


// Creating a Work Experince
router.post(
  "/create",
   multerUpload.single("file"),
  authCheck(...Object.values(Role)),
  // requestValidator(WorkExperienceCreateSchema),
  workExpController.createWorkExp,
);


// edit a Work Experince
router.patch(
  "/edit/:id",
   multerUpload.single("file"),
  authCheck(...Object.values(Role)),
  // requestValidator(WorkExperienceUpdateSchema),
  workExpController.editWorkExp,
);


// get all Work Experince
router.get(
  "/all",
  workExpController.getAllWorkExp,
);


// get a Work Experince
router.get(
  "/:id",
  authCheck(...Object.values(Role)),
  workExpController.getWorkExp,
);


// remove a Work Experince
router.delete(
  "/:id",
  authCheck(...Object.values(Role)),
  workExpController.removeWorkExp,
);


export const workExpRoute = router;
