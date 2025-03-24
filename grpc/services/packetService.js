import { insertJob } from "../helpers/jobHelper.js";

async function sendPacket(call, callback) {
    const logData = call.request;
    console.log("Received packet:", logData);

    await insertJob("packet", logData);

    callback(null, { status: "OK" });
}

export const packetService = { sendPacket };