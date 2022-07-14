// Configure your .env with Honeycomb specific variables. See .env.sample.
require("dotenv").config();

const { NodeSDK } = require("@opentelemetry/sdk-node");
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { RedisInstrumentation } = require('@opentelemetry/instrumentation-redis-4');
const { MySQL2Instrumentation } = require('@opentelemetry/instrumentation-mysql2');
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");

// The Trace Exporter exports the data to Honeycomb and uses
// the environment variables for endpoint, service name, and API Key.
const traceExporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new RedisInstrumentation(),
      new MySQL2Instrumentation(),
    ]
});

sdk.start()