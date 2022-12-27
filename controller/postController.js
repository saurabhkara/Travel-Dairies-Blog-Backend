import mongoose from "mongoose";
import Post from "../model/Post";
import User from "../model/User";
import CustomError from "../services/CustomError";


export const getAllPost = async (req, res, next) => {
  let allPost;
  try {
    allPost = await Post.find();
    if (!allPost) {
      return next(CustomError.validationError(500, "Nothing to fetch"));
    }
    return res.status(200).json({ allPost });
  } catch (error) {
    return next(CustomError.serverError());
  }
};


export const createPost = async (req, res, next) => {
  const { title, description, location, date, image, user } = req.body;

  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() === "" &&
    !location &&
    location.trim() === "" &&
    !date &&
    date.trim() === "" &&
    !image &&
    image.trim() === "" &&
    !user &&
    user.trim() === ""
  ) {
    return next(CustomError.validationError(422, "All fields are required"));
  }

  let existingUser;
  try {
    existingUser = await User.findById(user);
    if(!existingUser){
        return next(CustomError.serverError(404,"User does not exist"))
    }
  } catch (error) {
    return next(CustomError.serverError());
  }


  let post;
  try {
    post = new Post({
      title,
      description,
      location,
      description,
      date,
      image,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.posts.push(post);
    await existingUser.save({session});
    await post.save({session});
    session.commitTransaction();

  } catch (error) {
    return next(CustomError.serverError());
  }

  return res.status(201).json(post);
};

export const fetchPost = async (req, res, next) => {
  const _id = req.params.id;

  if (!_id) {
    return next(CustomError.serverError(500, "post id is missing"));
  }
  let post;
  try {
    post = await Post.findOne({ _id });
    if (!post) {
      return next(CustomError.serverError(500, "Nothing to fetch"));
    }
  } catch (error) {
    return next(CustomError.serverError(500, "Internal Server Error"));
  }
  return res.status(200).json(post);
};


export async function updatePost(req, res, next) {
  console.log('update post api');
  const _id = req.params.id;
  const { title, description, location, date, image } = req.body;
  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() === "" &&
    !location &&
    location.trim() === "" &&
    !image &&
    image.trim() === ""
  ) {
    return next(CustomError.validationError(422, "All fields are required"));
  }
  let post;
  try {
    post = await Post.findByIdAndUpdate(
      { _id },
      {
        title,
        description,
        image,
        location,
      }
    );
    if (!post) {
      return next(CustomError.validationError(500, "Unable to fetch the DB"));
    }
    return res.status(201).json(post);
  } catch (error) {
    return next(CustomError.serverError());
  }
}


export const deletePost = async (req, res, next) => {
  const _id = req.params.id;
  let post;
  try {
    const session =await mongoose.startSession();
    session.startTransaction();
    post = await Post.findById({_id}).populate('user');
    post.user.posts.pull(post);
    await post.user.save({session});
    post = await Post.findByIdAndDelete({ _id });
    session.commitTransaction();
    if (!post) {
      return next(CustomError.validationError(500, "No such post exist"));
    }

    return res.status(200).json(post);
  } catch (error) {
    return next(CustomError.validationError());
  }
};


