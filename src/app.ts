import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import compression from 'compression';
import notFound from './middlewares/notFound.ts';
import globalError from './middlewares/globalError.ts';
import { appRoutes } from './routes/mainRouter.ts';
import cookieParser from 'cookie-parser';
import { envVars } from './configs/envVars.ts';

const app: Application = express();

console.log(envVars.FRONTEND_URL);



app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use('/api/v1', appRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to th my porfolio - Rasel Shikder');
});

app.use(globalError);

app.use(notFound);

export default app;
