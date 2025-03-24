import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const PROTO_PATH = "./proto/cyberscope.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const cyberscopeProto = grpc.loadPackageDefinition(packageDefinition);

const db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

async function insertJob(source, data) {
    const jobData = JSON.stringify({
        displayName: "App\\Jobs\\ProcessRPCData",
        job: "Illuminate\\Queue\\CallQueuedHandler@call",
        data: {
            commandName: "App\\Jobs\\ProcessRPCData",
            command: JSON.stringify({ source: source, data: data }),
        },
    });

    await db.execute(
        "INSERT INTO jobs (queue, payload, attempts, reserved_at, available_at, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        ["default", jobData, 0, null, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)]
    );
}

async function sendLinuxLog(call, callback) {
    const logData = call.request;
    console.log("Received linux log:", logData);

    await insertJob("linuxLog", logData);

    callback(null, { status: "OK" });
}

async function sendWindowsLog(call, callback) {
    const logData = call.request;
    console.log("Received Windows log:", logData);

    await insertJob("windowsLog", logData);

    callback(null, { status: "OK" });
}

async function sendPacket(call, callback) {
    const logData = call.request;
    console.log("Received windows packet:", logData);

    await insertJob("packet", logData);

    callback(null, { status: "OK" });
}

const server = new grpc.Server();
server.addService(cyberscopeProto.LogService.service, { sendLinuxLog, sendWindowsLog });
server.addService(cyberscopeProto.PacketService.service, { sendPacket });

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("🚀 gRPC Server running on port 50051");
});
