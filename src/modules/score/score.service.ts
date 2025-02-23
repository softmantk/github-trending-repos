import {FORK_WEIGHT, RECENCY_WEIGHT, STAR_WEIGHT} from "./score.constants";

const getDateDifferenceByDays = (date1: Date, date2: Date) => Math.floor((date1.getTime() - date2.getTime()) / (1000 * 3600 * 24))


export const computePopularity = (starsCount: number, forksCount: number, lastUpdatedAtAt: Date): number => {

    const lastUpdatedAtDate = getDateDifferenceByDays(new Date(), lastUpdatedAtAt)
    const starScore = (starsCount * STAR_WEIGHT)
    const forkScore = (forksCount * FORK_WEIGHT)
    const recencyScore = RECENCY_WEIGHT * (1 / lastUpdatedAtDate)
    const score = starScore + forkScore + recencyScore;
    return Math.floor(score)
}