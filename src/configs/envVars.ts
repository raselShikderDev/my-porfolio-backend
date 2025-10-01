import dotenv from "dotenv";

dotenv.config();

interface IEnvVars {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  OWNER_EMAIL: string;
  OWNER_PASSWORD: string;
  BCRYPT_SALT: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
}

const envvarriables = (): IEnvVars => {
  const varriables: string[] = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "FRONTEND_URL",
    "OWNER_EMAIL",
    "OWNER_PASSWORD",
    "BCRYPT_SALT",
    "JWT_REFRESH_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_ACCESS_SECRET",
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
    OWNER_EMAIL: process.env.OWNER_EMAIL as string,
    OWNER_PASSWORD: process.env.OWNER_PASSWORD as string,
    BCRYPT_SALT: process.env.BCRYPT_SALT as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  };
};

export const envVars = envvarriables();
