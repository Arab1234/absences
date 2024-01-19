// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const session = await getServerSession( req, res, authOptions )
  if (session) {
    const prisma = new PrismaClient()

    const { groupe } = req.body

    const affectations=await prisma.affectation_groupe.findMany({
      where:{
        groupeId:parseInt(groupe)
      }
    })

    const result = await prisma.etudiant.findMany({
      where:{
        CIN:{
          in:affectations.map(aff => aff.CIN)
        }
      }
    });
    res.status(200).json({ result })
  }
  else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
