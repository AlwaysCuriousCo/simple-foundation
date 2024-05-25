require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

async function addHealthcheckPlugin() {
    const client = new MongoClient(config.DATABASE_URL, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
  await client.connect();
  const db = client.db(process.env.DATABASE_NAME);

  const plugin = {
    name: "healthcheck",
    path: "./plugins/healthcheck",
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const routes = [
    {
      method: "GET",
      path: "/healthcheck",
      handler: "./plugins/healthcheck/handlers/healthcheck.js",
      plugin: "healthcheck",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('plugins').insertOne(plugin);
  await db.collection('routes').insertMany(routes);
  console.log("Healthcheck plugin added");
  client.close();
}

addHealthcheckPlugin().catch(console.error);
