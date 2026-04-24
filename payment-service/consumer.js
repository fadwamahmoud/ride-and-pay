import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["127.0.0.1:9092"],
});

const consumer = kafka.consumer({ groupId: "payment-group" });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: ["ride.completed"] });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Received message:", {
        topic,
        value: message.value.toString(),
      });
    },
  });

  console.log("Consumer listening on ride.completed");
}

startConsumer().catch(console.error);

export default consumer;
