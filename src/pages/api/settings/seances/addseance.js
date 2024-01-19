// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const session = await getServerSession( req, res, authOptions )
    if (session) {
        const { seance,du,au } = req.body

        const prisma = new PrismaClient()

        const result = await prisma.seance.create({
            data: {
                libelle: seance,
                duH:parseInt(du.split(':')[0]),
                duM:parseInt(du.split(':')[1]),
                auH:parseInt(au.split(':')[0]),
                auM:parseInt(au.split(':')[1])
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