/*
 * A very simplified demo of tracing with Honeycomb using
 * Redis, MySQL, adding some attributes and creating new
 * spans. Generating some fake load just to show the concept.
 */

// Import tracing before any other package is imported.
require("./tracing");

// Packages 
const bodyParser = require("body-parser");
const opentelemetry = require('@opentelemetry/api');
const http = require("http");

// Redis Setup
const redis = require("redis");
const client = redis.createClient({ url: process.env.REDIS_HOST });

// MySQL Setup
const models = require("./models");

// Express setup
const express = require("express");
const app = express();

app.set("client", client);
app.set("models", models);
app.set("tracer", opentelemetry.trace.getTracer("my-service-tracer"));

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

// Simple sleep to simulate longer running http calls.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Endpoint that will call redis, mysql, and generate additional spans.
app.get("/", async (req, res) => {
  try {
    // Get the active span and set attribute of how long it slept for.
    let activeSpan = opentelemetry.trace.getSpan(opentelemetry.context.active());
    activeSpan.setAttribute("sleep", parseInt(req.query.sleep));

    // Create a new span to show the sleep time in tracing.
    let span = req.app.get("tracer").startSpan("sleep");
    await sleep(parseInt(req.query.sleep) * 1000);
    span.end();

    // Set a record in redis that won't expire and is unique to build the count up.
    let key = await req.app.get("client").get(activeSpan.spanContext().traceId);
    if(!key) {
      key = await req.app.get("client").set(activeSpan.spanContext().traceId, `sleep_${req.query.sleep}`);
    }

    // Create a record in the db to build the count up.
    await req.app.get("models").honeycomb.create({});

    // Get all the records from the db and set an attribute of how many are there.
    let dbItems = await req.app.get("models").honeycomb.findAll();
    activeSpan.setAttribute("num_mysql_items", dbItems.length);

    // Get all the records from redis and set an attribute of how many are there.
    let cacheItems = await req.app.get("client").keys("*");
    activeSpan.setAttribute("num_redis_items", cacheItems.length);
  } catch(e) {
    console.log(e);
  }

    res.status(200);
});

// Run api.
app.listen(process.env.PORT || 3000, () =>
  console.log("Listening on port 3000.")
);