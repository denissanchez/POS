import { Router } from "express";
import { getAll, getById, create, remove } from '../repository/users.js'
import { runAsyncWrapper } from "../utils/wrapper.js";
import { isAuthorized } from "../middlewares/authorization.js";
import { CAN_CREATE_USERS, CAN_REMOVE_USERS, CAN_VIEW_USERS } from "../utils/constants.js";


const router = Router();


router.get('/', isAuthorized(CAN_VIEW_USERS), runAsyncWrapper(async (req, res) => {
  const users = getAll();
  res.json(users);
}));


router.post('/', isAuthorized(CAN_CREATE_USERS), runAsyncWrapper(async (req, res) => {
  const { name, username, password, permissions } = req.body;

  const [errors, ] = create({ name, username, password, permissions });

  if (errors) {
    res.status(400).json({ errors });
    return;
  }
  
  res.status(201).end();
}));

router.get('/:id', isAuthorized(CAN_VIEW_USERS), runAsyncWrapper(async (req, res) => {
  const { id } = req.params;
  
  const user = getById(id);

  if (!user) {
    res.status(404).end();
    return;
  }
  
  res.json(user);
}));


router.delete('/:id', isAuthorized(CAN_REMOVE_USERS), runAsyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (req.user._id === id) {
    res.status(400).json({ errors: { id: 'You cannot remove yourself' } });
    return;
  }
  
  remove(id);
  
  res.status(204).end();
}));


router.put('/:id', isAuthorized(CAN_CREATE_USERS), runAsyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { name, username, password: possiblePassword, permissions } = req.body;

  const user = getById(id);

  if (!user) {
    res.status(404).end();
    return;
  }

  const password = possiblePassword !== "" ? possiblePassword : user.password;
  
  remove(id);
  create({ name, username, password, permissions }, id);
  
  res.status(204).end();
}));

export default router;
