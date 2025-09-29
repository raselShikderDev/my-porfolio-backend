import { prisma } from "../configs/db";
import { IUser } from "../modules/users/user.interface";
import bcrypt from "bcrypt";
import avater from "../assets/avater.svg";
import { constraints } from "../constraints/constraints";

export const seedOwner = async () => {
  console.log("Checking existed Owner");

  const existedOwner = await prisma.user.findUnique({
    where: {
      email: process.env.OWNER_EMAIL as string,
    },
  });

  if (existedOwner) {
    console.log(`Owner already exists with ${existedOwner.email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(
    process.env.OWNER_PASSWORD as string,
    Number(process.env.BCRYPT_SALT as string)
  );

  const ownerPayload = {
    name: "Rasel Shikder",
    email: process.env.OWNER_EMAIL as string,
    password: hashedPassword,
    avater: avater,
    skills: constraints.skills,
    address: constraints.address,
    phone: Number(constraints.phone),
    github: constraints.socialUrl.github,
    linkedin: constraints.socialUrl.linkedin,
    twitter: constraints.socialUrl.twitter,
  };

  try {
    console.log("Creating Owner...");
    const owner = await prisma.user.create({
      data: ownerPayload,
    });
    if (!owner) {
      throw new Error("Creating Owner is failed");
    }
    console.log("Owner Sucessfully created");
  } catch (error: any) {
    console.error("Creating Owner is failed", error.message);
    throw new Error("Somthing wrong! OwnerShip creation failed");
  }
};
