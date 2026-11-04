import express from "express";
import confgService from './config/config.service.js';
import { dpconnect } from './database/connection.js';
import { errHandler } from "./common/index.js";
import { authRouter, userRouter } from "./module/index.js";



const app = express();
const port = confgService.port


await dpconnect();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/user', userRouter);


app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello, World!" });
});

app.use(errHandler);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});