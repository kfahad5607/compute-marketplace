import express from "express";
import config from "./config.js";

const port = config.PORT;
const app = express();

app.get("/", async (req, res, next) => {
    try {
        return res.status(200).json({
            'status': 'success',
            'message': ''
        });
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: statusCode,
        },
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});