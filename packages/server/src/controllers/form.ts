'use strict';

import express, { Response, Request } from 'express';
import { Form as FormType } from '@formable/shared';
import { UserDocument } from '../models/User';
import { Form } from '../models/Form';
import { isAuthenticated } from '../config/passport';

const router = express.Router();

router.post('/create', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const form = req.body as FormType;
    form.owner = (req.user as UserDocument)._id;
    const newForm = new Form(form);
    await newForm.save();
    return res.status(200).json(newForm);
  } catch (e) {
    return res.status(400).json(e);
  }
});

export default router;
