import mongoose from "mongoose";

console.log('@@@ process.env.MONGO_URI:process.env.MONGO_URI: ', process.env.MONGO_URI);
// @ts-ignore
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));