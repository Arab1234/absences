// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const session = await getServerSession( req, res, authOptions )
    if (session) {
        const { CIN,groupe } = req.body

        const prisma = new PrismaClient()

        const getAffect=await prisma.affectation_groupe.findMany({
            where: {
                CIN: CIN,
                groupeId:parseInt(groupe)
            }
        })

        const result = await prisma.affectation_groupe.delete({
            where: {
                id:getAffect[0].id
            }

        })

        const deletedEtud=await prisma.etudiant.findMany({
            where:{
                CIN:result.CIN
            }
        })
        res.status(200).json({ deleted: deletedEtud[0] })
    }
    else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}