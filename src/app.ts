import express, {Application, Request, Response} from "express" ;
//import userRoutes from './routes/';
import carRoutes from './routes/cars';
import { env } from "./config/env";
import { connectDB } from "./config/database";
import { authenticateKey } from "./middleware/auth.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const port = env.port;
 
export const app: Application = express();

app.use(express.json());

app.use('/api/v1/cars', authenticateKey, loggerMiddleware, carRoutes);

app.use(
'/api-docs',
swaggerUi.serve,
swaggerUi.setup(swaggerSpec)
);


app.use(loggerMiddleware);

app.get("/ping", async (_req : Request, res: Response) => {
    res.json(
    "hello from Roman"
    );
});

app.get('/bananas', async (_req : Request, res: Response) => {
    res.json({
    message: "this is bananas",
    });
});

app.get('/sirozha', async (_req : Request, res: Response) => {
    res.json({
    message: "this is sirozha",
    });
});

// const startServer = async () => {
//   await connectDB();

//   app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
// };

// startServer();

