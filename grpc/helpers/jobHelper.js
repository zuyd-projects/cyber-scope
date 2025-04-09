import { v4 as uuidv4 } from "uuid";
import { serialize } from "php-serialize";
import { createClient } from "redis";

const redis = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
})
await redis.connect();

function serializeCommand(source, data) {
    let start = 'O:23:"App\\Jobs\\ProcessRPCData"';
    const serializedCommand = serialize({
        data: data,
        source: source,
        connection: "redis",
        queue: "grpc"
    });
    // Remove first character and append to default string
    return start + serializedCommand.slice(1);
}

function randomId() {
    let datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let base64 = Buffer.from(datetime).toString('base64');
    return base64.replace(/=/g, '').replace(/\+/g, '').replace(/\//g, '');
}

function createJobPayload(source, data) {
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
            command: serializeCommand(source, data),
        },
        id: `${source}-${randomId()}`,
        attempts: 0
    };
}

export async function insertJob(source, data) {
    const payload = JSON.stringify(createJobPayload(source, data));

    // Push the job payload into the Redis queue
    await redis.rPush(`cyber_scope_database_queues:grpc`, payload);
}