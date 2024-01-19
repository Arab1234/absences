// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const session = await getServerSession( req, res, authOptions )
    if (session) {
        const { id } = req.body

        const prisma = new PrismaClient()

        const result = await prisma.seance.delete({
            where: {
                id: id
            }

        })
        res.status(200).json({ deleted: result })
    }
    else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}