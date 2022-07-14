require("./tracing");

const bodyParser = require("body-parser");
const redis = require("redis");
const client = redis.createClient({ url: process.env.REDIS_HOST });

const models = require("./models");

const express = require("express");
const http = require("http");
const app = express();

app.set("client", client);
app.set("models", models);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  try {
    await req.app.get("client").connect();
  } catch(e) {
    // Do nothing
  }

  next();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get("/", async (req, res) => {
  let k, data;

  await sleep(parseInt(req.query.sleep) * 1000);

  try {
    k = await req.app.get("client").get("hello");

    if(!k) {
      k = await req.app.get("client").set("hello", "world");
    }

    await req.app.get("models").honeycomb.create({});

    data = await req.app.get("models").honeycomb.findAll();
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    k,
    data
  })
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Listening on port 3000. Try: http://localhost:3000/")
);