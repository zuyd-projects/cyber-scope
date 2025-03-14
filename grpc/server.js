import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const PROTO_PATH = "./proto/logs.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const logProto = grpc.loadPackageDefinition(packageDefinition).logs;

const db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

async function sendLog(call, callback) {
    const logData = call.request;
    console.log("Received log:", logData);

    const jobData = JSON.stringify({
        displayName: "App\\Jobs\\ProcessLogJob",
        job: "Illuminate\\Queue\\CallQueuedHandler@call",
        data: {
            commandName: "App\\Jobs\\ProcessLogJob",
            command: JSON.stringify(logData),
        },
    });

    await db.execute(
        "INSERT INTO jobs (queue, payload, attempts, reserved_at, available_at, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        ["default", jobData, 0, null, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)]
    );

    callback(null, { status: "OK" });
}

const server = new grpc.Server();
server.addService(logProto.LogService.service, { sendLog });

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("🚀 gRPC Server running on port 50051");
});
