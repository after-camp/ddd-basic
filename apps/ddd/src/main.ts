import express from 'express';
import {userRouter} from "./modules/user/route";

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const v1Router = express.Router();
v1Router.use('/users', userRouter);

app.use('/api/v1', v1Router)

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

