import {Schema, model, Document} from 'mongoose';

export interface ITrendingRepo extends Document {
    language: string;
    creationDate: Date;
    lastUpdatedAt: Date;
    score: number;
    frequency: number;
    repositories: unknown[];
}

const trendingRepoSchema = new Schema<ITrendingRepo>({
    language: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    repositories: {
        type: [Schema.Types.Mixed],
        default: []
    },
    frequency: {type: Number, default: 0},
    score: {type: Number, default: 0},
    lastUpdatedAt: {type: Date, default: Date.now}
});

trendingRepoSchema.index({language: 1, creationDate: 1}, {unique: true});

export default model<ITrendingRepo>('TrendingRepo', trendingRepoSchema);
