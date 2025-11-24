import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/userRoute";
import { errorHandler } from "./middleware/errorHandler";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/users", router);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
