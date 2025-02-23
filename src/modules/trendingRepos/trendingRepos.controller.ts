import express, {Request, Response, NextFunction} from 'express';
import trendingResposService from "./trendingRespos.service";
import {DEFAULT_TRENDING_DATE} from "../../app.constants";

const trendingReposController = express.Router();

trendingReposController.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdAt = req.query?.createdAt?.toString() || DEFAULT_TRENDING_DATE;
        const language = req.query?.language?.toString();
        if (!language) {
            res.status(400).json({error: 'language is required'});
            return;
        }
        const response = await trendingResposService.getRepose(language, new Date(createdAt));
        res.status(200).json(response);
    } catch (e) {
        next(e);
    }
});


export default trendingReposController;
