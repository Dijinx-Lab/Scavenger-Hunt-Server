import { config } from "dotenv";


config();

const databaseConfig = {

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

export default databaseConfig;
