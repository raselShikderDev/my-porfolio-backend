import { Router } from 'express';
import { requestValidator } from '../../middlewares/requestValidator';
import { resumeCreateSchema, resumeUpdateSchema } from './resume.schema';
import authCheck from '../../middlewares/authCheck';
import { Role } from '../users/user.interface';
import { resumeController } from './resume.controller';

const router = Router();

// Create a resume (authenticated)
router.post(
  '/upload',
  authCheck(...Object.values(Role)),
  requestValidator(resumeCreateSchema),
  resumeController.createResume,
);

// Get all resumes (public)
router.get(
  '/',
  resumeController.getAllResumes,
);

// Get a single resume (public)
router.get(
  '/:id',
  resumeController.getResume,
);

// Update a resume (authenticated)
router.patch(
  '/:id',
  authCheck(...Object.values(Role)),
  requestValidator(resumeUpdateSchema),
  resumeController.updateResume,
);

// Delete a resume (authenticated)
router.delete(
  '/:id',
  authCheck(...Object.values(Role)),
  resumeController.deleteResume,
);

export const resumeRoute = router;