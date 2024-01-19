// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    const { dateseance, matiere, seance, groupe, CIN } = req.body

    const prisma = new PrismaClient()

    const detailseance = await prisma.detailSeance.findFirst({
      where: {
        dateSeance: new Date(dateseance).toISOString(),
        matiereId: parseInt(matiere),
        seanceId: parseInt(seance),
        groupeId: parseInt(groupe)
      }

    })

    const affectations = await prisma.affectation_groupe.findMany({
      where: {
        groupeId: parseInt(groupe),
        CIN: {
          notIn: CIN
        }
      }
    })


    const delpres = await prisma.presence.findMany({
      where: {
        CIN: {
          in: affectations.map(aff => aff.CIN)

        },
        seanceId:detailseance.id
      }
    })

    const deleted = await prisma.presence.deleteMany({
      where: {
        id: {
          in: delpres.map(dp => dp.id)
        }
      }
    })

    if (detailseance && CIN.length > 0) {

      CIN.map(async (cin, index) => {

        const checkCIN = await prisma.affectation_groupe.findMany({
          where: {
            CIN: cin,
            groupeId: parseInt(groupe)
          }
        })

        if (checkCIN.length > 0) {

          const pr = await prisma.presence.findFirst({
            where: {
              CIN: cin,
              seanceId: detailseance.id
            }
          })
            const inserted = await prisma.presence.upsert({
              where: {

                id: pr ? pr.id : 0
              },
              create: {
                seanceId: detailseance.id,
                CIN: cin
                // Other fields...
              },
              update: {
                seanceId: detailseance.id,
                CIN: cin
              }
            })
            res.status(200).json({ inserted })

          
        }


      })
    }
  }
  else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}

export const config = {
  api: {
    responseLimit: false,
  },
}