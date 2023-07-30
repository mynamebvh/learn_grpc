const grpc = require("@grpc/grpc-js");
const prisma = require("./prisma");
const { Empty } = require("google-protobuf/google/protobuf/empty_pb");

exports.createUser = async (call, callback) => {
  try {
    const user = await prisma.user.create({
      data: { ...call.request },
    });

    if (!user) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "can not create new user",
      });
    }

    callback(null, user);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

exports.getUserById = async (call, callback) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: call.request.id,
      },
    });

    if (!user) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "user does not exist",
      });
    }

    callback(null, user);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

exports.updateUser = async (call, callback) => {
  try {
    const { fullName, email, password } = call.request;
    const updateUser = await prisma.user.update({
      where: {
        id: call.request.id,
      },
      data: {
        fullName,
        email,
        password,
      },
    });

    if (updateUser.count == 0) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "user does not exist",
      });
    }

    callback(null, new Empty());
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

exports.deleteUser = async (call, callback) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id: call.request.id,
      },
    });

    callback(null, new Empty());
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};
