import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "test-producer",
  brokers: ["127.0.0.1:9092"],
});

const producer = kafka.producer();

async function sendTestMessage() {
  await producer.connect();
  await producer.send({
    topic: "ride.completed",
    messages: [
      {
        value: JSON.stringify({
          rideId: "ride-123",
          driverId: "driver-456",
          userId: "user-789",
          amount: 150,
          currency: "DZD",
        }),
      },
    ],
  });
  console.log("Message sent");
  await producer.disconnect();
}

sendTestMessage().catch(console.error);
