const grpc = require("@grpc/grpc-js");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const serviceImpl = require('./service');
const prisma = require("./prisma");
const userProtoPath = path.join(__dirname, "..", "proto", "user.proto");
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const addr = "0.0.0.0:50051";

const userPackageDefinition =
  grpc.loadPackageDefinition(userProtoDefinition).user;


function cleanup(server) {
  console.log('Cleanup');

  if (server) {
    server.forceShutdown();
  }
}

function main() {
  prisma.$connect().then(() => {
    const creds = grpc.ServerCredentials.createInsecure();
    const server = new grpc.Server();
    server.addService(userPackageDefinition.UserService.service, serviceImpl);
    server.bindAsync(addr, creds, (err, _) => {
      if (err) {
        return cleanup(server);
      }
      server.start();
    });
    console.log(`Server Runnig at ${addr}`);
  });  
}

main();
