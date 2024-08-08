const express = require('express');
require("dotenv").config();
const database = require("./config/database");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const routes = require("./routes");
const cors = require("cors");

database.connect();

const app = express();
const port = process.env.PORT;

// Cors
const corsOptions = {
    origin: 'http://localhost:3000', // Địa chỉ frontend của bạn
    credentials: true, // Đảm bảo cho phép gửi cookie
};

app.use(cors(corsOptions));

// Cookies
app.use(cookieParser())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Routes
routes(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
