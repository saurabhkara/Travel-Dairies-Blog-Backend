class CustomError extends Error{
    constructor(status,message){
        super();
        this.status= status;
        this.message =message;
    }

    static serverError(status=500,message='Internal Server Error..'){
        return new CustomError(status,message);
    }

    static validationError(status=422,message='Email or Passowrd is incorrect'){
        return new CustomError(status,message);
    }
}

export default CustomError;