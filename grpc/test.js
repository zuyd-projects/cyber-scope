const data = "{\"uuid\":\"46cfe65d-f46f-4334-ae61-d689c4ebd20e\",\"displayName\":\"App\\\\Jobs\\\\ProcessRPCData\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessRPCData\",\"command\":\"O:23:\\\"App\\\\Jobs\\\\ProcessRPCData\\\":4:{s:4:\\\"data\\\";a:0:{}s:6:\\\"source\\\";s:4:\\\"test\\\";s:10:\\\"connection\\\";s:5:\\\"redis\\\";s:5:\\\"queue\\\";s:4:\\\"grpc\\\";}\"},\"id\":\"linux-dhjfbgjdh\",\"attempts\":0}"

// import { createClient } from "redis";

// const redis = createClient({
//   url: `redis://localhost:6379`,
//   password: 'hiyBIU3yb6i3h4b6iuy3b46i34b63k4hb53IOU4b6o34',
// })
// await redis.connect();

// redis.rPush(`cyber_scope_database_queues:grpc`, data).then((result) => {
//   console.log("Data pushed to Redis:", result);
// }).catch((error) => {
//   console.error("Error pushing data to Redis:", error);
// });

// redis.quit();

// // random id a69JtCuAyAre4nRUk5LGLWkpId98OdkG

let datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
let base64 = Buffer.from(datetime).toString('base64');
let test = base64.replace(/=/g, '').replace(/\+/g, '').replace(/\//g, '')
console.log(datetime)
console.log(test)
let decoded = Buffer.from(test, 'base64').toString('utf-8');
console.log(decoded)
