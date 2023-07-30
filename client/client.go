package main

import (
	"context"
	"flag"
	"log"
	"time"

	pb "hoangdev.com/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var (
	addr = flag.String("addr", "localhost:50051", "the address to connect to")
	name = flag.String("name", "gprc", "Name to greet")
)

func main() {
	flag.Parse()
	// Set up a connection to the server.
	conn, err := grpc.Dial(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewUserServiceClient(conn)

	// Contact the server and print out its response.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	r, err := c.GetUserById(ctx, &pb.UserId{Id: "a49f7222-2e7b-47fa-968b-27a8769fa634"})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}
	log.Printf("User: %s", r.GetFullName())
}
