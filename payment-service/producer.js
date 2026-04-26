import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["127.0.0.1:9092"],
});

const producer = kafka.producer();

await producer.connect();

export default producer;
