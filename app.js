const express = require('express');
const app = express();
require("dotenv").config();
require("./config/db");
const indexRouter = require('./routes');
const authRouter= require("./routes/auth")
const adminRouter= require("./routes/admin")
const productRouter= require("./routes/product")
const categoryRouter= require("./routes/category")
const userRouter= require("./routes/user")
const cartRouter= require("./routes/cart")
const paymentsRouter= require("./routes/payment")
const orderRouter= require("./routes/order")
const path=require("path")
require("./config/googleauthconfing");
const cookieParser =require("cookie-parser")
const expressSession = require("express-session")
const passport = require("passport");
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.SESSION_SECRET
    
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use("/", indexRouter);
app.use("/auth",authRouter)
app.use("/admin",adminRouter)
app.use("/products",productRouter)
app.use("/categories",categoryRouter)
app.use("/users",userRouter)
app.use("/cart",cartRouter)
app.use("/payment",paymentsRouter)
app.use("/order",orderRouter)

app.listen(3000);
