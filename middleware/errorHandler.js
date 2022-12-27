import CustomError from "../services/CustomError";
const errorHandler = (err,req, res,next )=>{
    let errorData ={
        status:500,
        message:'Error ....'
    }
    if(err instanceof CustomError ){
        errorData.message = err.message;
    }else{
        errorData.message=err.message;
    }

    res.status(errorData.status).json(errorData);
}

export default errorHandler;