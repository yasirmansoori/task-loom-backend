// Dependencies
const express = require('express');
const db = require("./src/db/db");
const cors = require('cors');
const userRoute = require('./src/routes/user.route');
const taskRoute = require('./src/routes/task.route');
const commentRoute = require('./src/routes/comment.route');
const { notFoundMiddleware, defaultErrorHandler } = require('./src/middlewares/error');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const dayjs = require('dayjs');

// Environment variables
const PORT = process.env.PORT || 3001;

const CONNECTION_STRING = process.env.MONGODB_URI

// Connect the database
db.connect(CONNECTION_STRING)
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.log(err.message);
  });

// configure
const app = express();

// Middlewares
app.use(compression());
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(bodyParser.json({ limit: '10mb' })); // Set appropriate limit
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// middleware for logging
// Custom token to include timestamp
morgan.token('timestamp', () => dayjs().format('YYYY-MM-DD HH:mm:ss'));

// custom format string 
const morganFormat = '[:timestamp] :method :url :status :response-time ms - :res[content-length]';

app.use(morgan(morganFormat));

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: "Server is running...." });
});

// user routes
app.use("/api/user/", userRoute);

// task routes
app.use("/api/task/", taskRoute);

// comment routes
app.use("/api/comment/", commentRoute);

// 404 Not Found middleware
app.use(notFoundMiddleware);

// Error Handling Middleware
app.use(defaultErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});