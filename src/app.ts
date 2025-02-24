import express from 'express'
import path from "path";
import YAML from 'yamljs';
import * as OpenApiValidator from 'express-openapi-validator';

import errorMiddleware from "./common/middlewares/error.middleware";
import router from "./routes";

const apiSpecPath = path.join(__dirname, 'swagger.yaml');
const apiSpec = YAML.load(apiSpecPath);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true,
    })
);

app.use(router)
app.use(errorMiddleware)

export default app;
