require("dotenv").config();
const express = require("express");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

const oAuthClient = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

router.get("/", (req, res) => {
  res.json("app is running");
});

app.post("/auth/google", async (req, res) => {
  const { tokens } = await oAuthClient.getToken(req.body.code); // exchanging code for tokens

  res.json(tokens);
});

app.post("/auth/google/refresh-token", (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );

  const { credentials } = user.refreshAccessToken(); // obtaining new tokens
  res.json(credentials);
});

app.use(cors());
app.use(express.json());
app.use("/.netlify/functions/api");
module.exports.handler = serverless(app);
// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log("server is running on http://localhost:3001");
// });
