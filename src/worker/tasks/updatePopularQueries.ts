import 'dotenv/config'
import '../../db'
import {subMinutes, subSeconds} from "date-fns";
import cron from 'node-cron'
import TrendingReposModel from "../../modules/trendingRepos/trendingRepos.model";
import githubService from "../../modules/github/github.service";
import trendingResposService from "../../modules/trendingRepos/trendingRespos.service";
import {MIN_FREQUENCY_FOR_POPULAR_QUERY, MIN_MINUTES_THRESHOLD_FOR_POPULAR_QUERY} from "../../app.constants";

cron.schedule('*/5 * * * * *', updatePopularQueries)


async function updatePopularQueries() {
    try {
        // const timeLimit = subMinutes(new Date(), MIN_MINUTES_THRESHOLD_FOR_POPULAR_QUERY);
        const timeLimit = subSeconds(new Date(), MIN_MINUTES_THRESHOLD_FOR_POPULAR_QUERY);
        let count = 0;
        const trendingRecordsCursor = TrendingReposModel.find({
            frequency: {
                $gt: MIN_FREQUENCY_FOR_POPULAR_QUERY,
            },
            lastUpdatedAt: {
                $lt: timeLimit
            }
        }).select({repositories: 0}).cursor()
        for await (const record of trendingRecordsCursor) {
            // console.log('@@@ updatePopularQueries:record: ', record.language, record.creationDate);
            count++
            const repositories = await githubService.getRepositoryList(record.language, record.creationDate);
            await trendingResposService.upsertTrendingRepo(record.language, record.creationDate, repositories, false, true)
        }
        console.log('[JOB:updatePopularQueries] updatedPopularQueries - count ', count)
    } catch (e) {
        console.log(e)
        throw e;
    }
}