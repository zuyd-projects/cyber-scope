import { insertJob } from "../helpers/jobHelper.js";

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

export const logService = { sendLinuxLog, sendWindowsLog };