import {differenceInMinutes, differenceInSeconds} from "date-fns";
import TrendingReposModel, {ITrendingRepo} from "./trendingRepos.model";
import githubService from "../github/github.service";
import {CACHE_DURATION_MINUTES} from "../../app.constants";

export class TrendingReposService {

    async getRepos(language: string, creationDate: Date) {

        let trendingRepo: ITrendingRepo | null = await TrendingReposModel.findOne({
            language: language,
            creationDate: new Date(creationDate),
        });
        if (!trendingRepo) {
            console.log('Cache miss, fetching from GitHub');
            const repositories = await githubService.getRepositoryList(language, creationDate);
            trendingRepo = await this.upsertTrendingRepo(language, creationDate, repositories, true, true);
        } else {
            // const duration = differenceInMinutes(new Date(), new Date(trendingRepo.lastUpdatedAt));
            const duration = differenceInSeconds(new Date(), new Date(trendingRepo.lastUpdatedAt));
            if (duration >= CACHE_DURATION_MINUTES) {
                console.log('Cache expired, refresh data');
                const repositories = await githubService.getRepositoryList(language, creationDate);
                trendingRepo = await this.upsertTrendingRepo(language, creationDate, repositories, true, true);
            } else {
                const durationInSeconds = differenceInSeconds(new Date(), new Date(trendingRepo.lastUpdatedAt));
                console.log('cache hit', {duration, CACHE_DURATION_MINUTES, durationInSeconds})
                this.upsertTrendingRepo(language, creationDate, trendingRepo.repositories, true, false).then()
            }
        }
        return trendingRepo
    }

    upsertTrendingRepo = async (language: string, creationDate: Date, repositories: any[], incrementFrequency: boolean = true, updateLastUpdated = false): Promise<ITrendingRepo> => {
        const update: any = {$set: {repositories}};
        if (updateLastUpdated) {
            update.$set.lastUpdatedAt = new Date();
        }
        if (incrementFrequency) {
            update.$inc = {frequency: 1};
        }
        const trending = await TrendingReposModel.findOneAndUpdate(
            {language, creationDate},
            update,
            {upsert: true, new: true, setDefaultsOnInsert: true}
        )
        // await trending.save(); //unnecessary
        return trending;
    };
}

export default new TrendingReposService();