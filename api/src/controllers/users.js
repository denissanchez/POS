import { Router } from "express";
import { getAll, create } from '../repository/users.js'
import { runAsyncWrapper } from "../utils/wrapper.js";


const router = Router();


router.get('/', runAsyncWrapper((req, res) => {
  const users = getAll();
  res.json(users);
}));


router.post('/', runAsyncWrapper(async (req, res) => {
  const { name, username, password } = req.body;
  
  create({ name, username, password });
  
  res.status(201).end();
}));

export default router;
