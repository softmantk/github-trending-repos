import express from 'express'

import errorMiddleware from "./common/middlewares/error.middleware";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router)
app.use(errorMiddleware)

export default app;
