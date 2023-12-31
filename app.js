const express = require("express");
const path = require("path");
const helmet = require("helmet");
const createError = require("http-errors");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerOptions = require("./swaggerOptions");
const { errorHandler } = require("./utils/errorHandler");
const { standardLimiter } = require("./middleware/rateLimiter");

dotenv.config();

const app = express();

//this is set to allow for the use of rate limiter in production when deployed to Railway (or similar services)
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(logger("dev"));

const allowedEmbedOrigins = (process.env.ALLOWED_EMBED_ORIGIN || "").split(",");

app.use("/userImageUploads", function (req, res, next) {
  const origin = req.get("Origin");

  // if (allowedEmbedOrigins.includes(origin)) {
    // res.header("Access-Control-Allow-Origin", origin);
    res.header("Cross-Origin-Embedder-Policy", "none");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
  // }

  next();
});

app.use(
  "/userImageUploads",
  express.static(path.join(__dirname, "public/userImageUploads"))
);
//swagger documentation
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const specs = swaggerJsDoc(swaggerOptions);

// Routes
const userRouter = require("./routes/user");
const tradeRouter = require("./routes/trade");
const tradeDetailsRouter = require("./routes/tradeDetails");
const imageRouter = require("./routes/image");
const commentRouter = require("./routes/comment");
const tagRouter = require("./routes/tag");
const tradeTagRouter = require("./routes/tradeTag");
const refreshRouter = require("./routes/refresh");
// const ipRouter = require("./routes/proxy");

// Use Routes

app.use(standardLimiter);

app.use("/user", userRouter);
app.use("/trade", tradeRouter);
app.use("/tradedetails", tradeDetailsRouter);
app.use("/image", imageRouter);
app.use("/comment", commentRouter);
app.use("/tag", tagRouter);
app.use("/tradetag", tradeTagRouter);
app.use("/refresh", refreshRouter);
// app.use("/ip", ipRouter)

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Serve any static files for React app
app.use(express.static(path.join(__dirname, "dist")));

// Handle React routing, return all requests to React app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
