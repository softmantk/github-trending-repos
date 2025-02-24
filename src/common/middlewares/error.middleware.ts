import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';


const errorMiddleware: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    console.log('@@@ errorMiddleware:err: ', err);
    console.error(`Error: ${err.toString()}`);
    if(err.status && err.status < 500) {
        res.status(err.status).json({
            message: err?.message,
            errors: err?.errors
        });
        return;
    }
    res.status(500).json({code: 'Internal Server Error'});
}
export default errorMiddleware;