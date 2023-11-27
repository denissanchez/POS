import { Router } from "express";
import { getAll, create } from '../repository/users.js'
import { runAsyncWrapper } from "../utils/wrapper.js";
import { isAuthorized } from "../middlewares/authorization.js";
import { CAN_CREATE_USERS, CAN_VIEW_USERS } from "../utils/constants.js";


const router = Router();


router.get('/', isAuthorized(CAN_VIEW_USERS), runAsyncWrapper((req, res) => {
  const users = getAll();
  res.json(users);
}));


router.post('/', isAuthorized(CAN_CREATE_USERS), runAsyncWrapper(async (req, res) => {
  const { name, username, password, permissions } = req.body;
  
  create({ name, username, password, permissions });
  
  res.status(201).end();
}));

export default router;
