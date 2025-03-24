import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { serialize } from "php-serialize";

const db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

function serializeCommand(data) {
    let start = 'O:23:"App\\Jobs\\ProcessRPCData"';
    const serializedCommand = serialize({
        data: data,
        source: "test"
    });
    // Remove first character and append to default string
    return start + serializedCommand.slice(1);
}

function createJobPayload(data) {
    return {
        uuid: uuidv4(),
        displayName: "App\\Jobs\\ProcessRPCData",
        job: "Illuminate\\Queue\\CallQueuedHandler@call",
        maxTries: null,
        maxExceptions: null,
        failOnTimeout: false,
        backoff: null,
        timeout: null,
        retryUntil: null,
        data: {
            commandName: "App\\Jobs\\ProcessRPCData",
            command: serializeCommand(data),
        }
    };
}

export async function insertJob(source, data) {
    const payload = JSON.stringify(createJobPayload(data));

    await db.execute(
        "INSERT INTO jobs (queue, payload, attempts, reserved_at, available_at, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        ["default", payload, 0, null, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)]
    );
}