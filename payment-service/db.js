import { MongoClient } from "mongodb";
// payment service
// both the container and host machine resolve mongodb-payment
// the container uses Docker DNS, host uses /etc/hosts
// /etc/hosts file has mongodb-payment which resolves to 127.0.0.1
const uri =
  "mongodb://mongodb-payment:27018/?replicaSet=rs-payment&directConnection=true";
// ride service
// const uri = "mongodb://127.0.0.1:27017/?replicaSet=rs-ride";

const client = new MongoClient(uri);

export async function runStableAPIConnect() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    const result = await client.db("payment").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
    return result;
  } catch (err) {
    // Ensures that the client will close when you finish/error
    console.log(err);
    await client.close();
  }
}
runStableAPIConnect();

export default client;
