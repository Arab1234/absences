// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/react"

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (session) {
  const prisma = new PrismaClient()

  const result= await prisma.niveau.findMany();
  res.status(200).json({ result })
  }
  else {
    // Not Signed in
    res.status(401)
  }
res.end()
}
