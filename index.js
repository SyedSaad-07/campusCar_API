const express = require("express");
const sequelize = require('./database/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const userRoutes = require("./router/User");
const riderRoutes = require("./router/Rider");
const rideHistory = require("./router/rideHistory");



app.use(cors());
app.use(bodyParser.json())
app.use(express.json());
app.use("/userapi", userRoutes);
app.use("/riderapi", riderRoutes);
app.use("/rideHistory",rideHistory);

app.listen(port, async () => {
    await sequelize.authenticate()
    console.log('Database Connected!');
    console.log(`Server running on PORT ${port}!`);
})