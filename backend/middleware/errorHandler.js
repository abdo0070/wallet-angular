const errorHandler = (error,req,res,next) => {
    res
    .status(500)
    .send({msg: error.message,status : 500})
    next();
}

module.exports = errorHandler;