import { createClient } from "redis";

const client = createClient({
  url: "redis://:devpass@127.0.0.1:6380",
});

client.on("error", (err) => console.log("Redis Client Error", err));

async function connect() {
  await client.connect();
  const pong = await client.ping();
  console.log("Redis connected:", pong);
}

connect().catch(console.error);

export default client;
