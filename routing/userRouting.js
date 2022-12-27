import {Router} from 'express';
import {getAllUsers, signup, login, getUserbyId} from '../controller/userController';

const userRoute = Router();
userRoute.get('/',getAllUsers);
userRoute.get('/:id',getUserbyId);
userRoute.post('/signup',signup);
userRoute.post('/login',login);


export default userRoute;