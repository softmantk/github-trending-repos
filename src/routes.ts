import express from 'express';
import trendingReposController from "./modules/trendingRepos/trendingRepos.controller";


const router = express.Router();

router.use('/trending-repos', trendingReposController)

export default router;