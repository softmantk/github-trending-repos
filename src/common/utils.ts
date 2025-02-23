import {format} from 'date-fns';

export type GithubSortBy = 'stars' | 'forks' | 'updated';
export type GithubSortOrder = 'asc' | 'desc';
export const dateFormat = 'yyyy-MM-dd'

export const formattedDate = (date: Date) => format(date, dateFormat);