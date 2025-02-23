import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';


const errorMiddleware: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error: ${err.toString()}`);
    res.status(500).json({code: 'Internal Server Error'});
}
export default errorMiddleware;