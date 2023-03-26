require("dotenv").config();
const express = require("express");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

const whitelist = [
  "https://google-login-demo.netlify.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

const oAuthClient = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

router.post("/auth/google", async (req, res) => {
  const { tokens } = await oAuthClient.getToken(req.body.code); // exchanging code for tokens

  res.json(tokens);
});

router.post("/auth/google/refresh-token", (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );

  const { credentials } = user.refreshAccessToken(); // obtaining new tokens
  res.json(credentials);
});

router.get("/", (req, res) => {
  res.json("app is running");
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
