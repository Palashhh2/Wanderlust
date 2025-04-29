class ExpressError extends Error{
    constructor (statusCode,message){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}
module.exports=ExpressError;
//go and require this in the app.js