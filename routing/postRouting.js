import { Router } from "express";
import { createPost, getAllPost, fetchPost, updatePost,deletePost } from "../controller/postController";
const postRoute = Router();

postRoute.get('/',getAllPost);
postRoute.post('/',createPost);
postRoute.get('/:id',fetchPost);
postRoute.put('/:id',updatePost);
postRoute.delete('/:id',deletePost);

export default postRoute;