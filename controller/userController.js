import bcrypt from 'bcrypt';
import User from "../model/User";
import CustomError from "../services/CustomError";

export async function getAllUsers(req, res, next) {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return next(CustomError.serverError());
  }

  if (!users) {
    return next(CustomError.serverError("Nothing in Database"));
  }

  return res.status(200).json({ users });
}


export async function getUserbyId(req, res, next){

  let user;
  try {
    const id = req.params.id
    user = await User.find({_id:id}).populate('posts');
  } catch (error) {
    return next(CustomError.serverError());
  }
  if (!user) {
    return next(CustomError.serverError("Nothing in Database"));
  }

  return res.status(200).json({ user });
}

export async function signup(req, res, next){
   const { name , email, password } = req.body;
   if(!name && name.trim() ==="" && !email && email.trim() && !password && password.trim()){
    return next(CustomError.validationError(422));
   }
   const hashPassword = await bcrypt.hash(password,10);
   let user;
   try {
    user = new User({name,email,password:hashPassword});
     await user.save();
   } catch (error) {
    return next(CustomError.serverError());
   }
   if(!user){
    return next(CustomError.serverError());
   }
   return res.status(201).json({user});
}

export async function login(req, res, next){
    const {email, password} = req.body;
    if(!email && email.trim() ==="" && !password && password.trim() ===""){
        return next(CustomError.validationError(422,"email or password is wrong"));
    }

    let userExist;
    try {
      userExist= await User.findOne({email:email}).select('-__v');
    } catch (error) {
      return next(CustomError.serverError());
    }

    if(!userExist){
        return next(CustomError.validationError(200, 'User does not exist'));
    }

    res.status(200).json(userExist);
    
}



