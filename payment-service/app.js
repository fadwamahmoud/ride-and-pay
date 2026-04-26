// POST /payments/initiate
// body: { rideId, userId, driverId, amount, currency }

import express from "express";
import mongoClient from "./db.js";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

app.post("/payments/initiate", async (req, res) => {
  const { rideId, userId, driverId, amount, currency } = req.body;

  // Write the payment record to MongoDB with status pending
  const doc = { rideId, userId, driverId, amount, currency, status: "pending" };
  const outbox = {
    eventId: uuidv4(),
    event: "payment.initiated",
    payload: doc,
    published: false,
    createdAt: new Date(),
  };
  const session = mongoClient.startSession();
  //  Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
  //  The callback for withTransaction MUST be async and/or return a Promise.
  try {
    await session.withTransaction(async () => {
      const payments = mongoClient.db("payment").collection("payments");
      const paymentsOutbox = mongoClient
        .db("payment")
        .collection("payments-outbox");
      // Important:: You must pass the session to the operations
      await payments.insertOne(doc, { session });
      await paymentsOutbox.insertOne(outbox, { session });
    });
  } finally {
    await session.endSession();
  }

  // Write an outbox record in the same transaction with published: false
  // Return the payment record to the caller immediately
  res.status(200).send({ rideId, userId, driverId, amount, currency });
});

app.listen(3000, (err) => {
  console.error(err);
});
