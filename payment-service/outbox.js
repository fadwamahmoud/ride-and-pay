import client from "./db.js";
import producer from "./producer.js";

// Find records where published: false
async function checkForUnpublished() {
  const res = await client
    .db("payment")
    .collection("payments-outbox")
    .find({ published: false })
    .toArray();
  return res;
}
// Publish each one to Kafka
async function publishUnpublished(outboxedDocument) {
  await producer.send({
    topic: "payment.initiated",
    messages: [{ value: JSON.stringify(outboxedDocument.payload) }],
  });
}

// Mark them published: true
async function markAsPublished(paymentOutboxId) {
  await client
    .db("payment")
    .collection("payments-outbox")
    .updateOne({ _id: paymentOutboxId }, { $set: { published: true } });
}

async function createWorker() {
  while (true) {
    const res = await checkForUnpublished();

    if (res.length) {
      for (const doc of res) {
        await publishUnpublished(doc);
        await markAsPublished(doc._id);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

createWorker().catch(console.error);
