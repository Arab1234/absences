// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        const { groupe, etudiants } = req.body

        const prisma = new PrismaClient()

        etudiants.map(async (item, index) => {
           await prisma.etudiant.upsert({
                where: {
                    CIN: item.CIN+"" // Unique identifier
                  },
                  create: {
                    CIN:item.CIN+"",
                    nom:item.nom+"",
                    prenom:item.prenom+"",
                    email:item.email+"",
                    CNE:item.CNE+"",
                    filiere:item.filiere+""
                    // Other fields...
                  },
                  update: {
                    nom:item.nom+"",
                    prenom:item.prenom+"",
                    email:item.email+"",
                    CNE:item.CNE+"",
                    filiere:item.filiere+""
                  }

            })

            const aff=await prisma.affectation_groupe.findFirst({
                where:{
                    CIN: item.CIN+"",
                    groupeId: parseInt(groupe) // Unique identifier
                }
            })

            await prisma.affectation_groupe.upsert({
                where: {
                    id:aff?.id??-1
                  },
                  create: {
                    CIN:item.CIN+"",
                    groupeId:parseInt(groupe)
                    // Other fields...
                  },
                  update: {
                  }

            })
        })


        res.status(200).json({ inserted: etudiants })
    }
    else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}