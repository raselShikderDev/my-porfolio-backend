import dotenv from "dotenv";

dotenv.config()

interface IEnvVars {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
}

 const envvarriables = ():IEnvVars => {
  const varriables: string[] = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "FRONTEND_URL",
  ];

  varriables.map((envItem: string) => {
    if (!process.env[envItem]) {
      throw new Error(`Missing envoirnment varriabls ${envItem}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
  };
};


export const envVars = envvarriables()