import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { my_xAccessToken } from './config.js';

const app = express();
const port = 3000;
const lat = "13.65";
const lng = "100.50";
const API_URL = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}&alt=100&dt=`;

const timeOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
  };

const xAccessToken = my_xAccessToken;
const config = {
  headers:{ "x-access-token": xAccessToken }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL, config)
        const result = response.data.result

        const currentTimeStamp = result.uv_time
        const maxUVTimeStamp = result.uv_time
        const Current = new Date(currentTimeStamp);
        const maxUVTime = new Date(maxUVTimeStamp);
        const readableCurrentTime = Current.toLocaleString('en-US', timeOptions); // Since server is sent UTC, I have to change it to human version
        const readableMaxUVTimeTime = maxUVTime.toLocaleString('en-US', timeOptions); // Since server is sent UTC, I have to change it to human version

        res.render("index.ejs", { currentUV: result.uv, time: readableCurrentTime, maxUV: result.uv_max, maxUVTime: readableMaxUVTimeTime });
    } catch (error) {
        res.render("index.ejs", { Error: `Error ${error}` });
    }
});

app.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`)
})