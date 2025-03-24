import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import dotenv from "dotenv";
import { logService } from "./services/logService.js";
import { packetService } from "./services/packetService.js";

dotenv.config();

const PROTO_PATH = "./proto/cyberscope.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const cyberscopeProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
server.addService(cyberscopeProto.LogService.service, logService);
server.addService(cyberscopeProto.PacketService.service, packetService);

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("🚀 gRPC Server running on port 50051");
});