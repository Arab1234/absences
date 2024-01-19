// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    const { dateseance, matiere, seance, groupe } = req.body

    const prisma = new PrismaClient()

    const seanceabs = await prisma.detailSeance.findMany({
      where: {
        dateSeance: new Date(dateseance).toISOString(),
        matiereId: parseInt(matiere),
        seanceId: parseInt(seance),
        groupeId: parseInt(groupe)
      }
    })

    if (seanceabs.length > 0) {
      const presents=await prisma.presence.findMany({
        where: {
          seanceId: parseInt(seanceabs[0].id)
        }
      })

      const affectations = await prisma.affectation_groupe.findMany({
        where: {
          groupeId: parseInt(groupe)
        }
      })

      const Etudiants = await prisma.etudiant.findMany({
        where: {
          CIN: {
            in: affectations.map(aff => aff.CIN)
          }
        },
        include: {
          _count: {
            select: {
              presences: {
                where:{
                  seanceId: parseInt(seanceabs[0].id)
                }
              },
            },
        },
        },
      })

      const result = Etudiants

      res.status(200).json({ result })

    }
    else {
      const result = seanceabs

      //const result = await prisma.matiere.findMany();
      res.status(200).json({ result })
    }


  }
  else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
