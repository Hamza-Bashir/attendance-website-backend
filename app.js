require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { unless } = require("express-unless");
const routes = require("./routes");
const { authenticateRoutes } = require("./config/unlessRoutes");
const { authenticate } = require("./middlewares/auth.middleware");
const globalError = require("./controllers/error/globalErrorHandler")
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));


app.get("/test",(req,res)=>{
  res.send("Server is running changes")
})

authenticate.unless = unless;
app.use(authenticate.unless(authenticateRoutes));




app.use(routes);


app.use(globalError)



module.exports = app;