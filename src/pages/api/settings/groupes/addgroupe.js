// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const session = await getServerSession( req, res, authOptions )
    
    if (session) {
        const { groupe, niveau } = req.body

        const prisma = new PrismaClient()

        const result = await prisma.groupe.create({
            data: {
                libelle: groupe,
                niveauId: parseInt(niveau)
            }

        })
        res.status(200).json({ inserted: result })
    }
    else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}