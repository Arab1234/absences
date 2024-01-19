// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    const { du, matiere, au } = req.body

    const prisma = new PrismaClient()

    

    if(matiere=='Tout')
    {
      const result = await prisma.detailSeance.findMany({
        where: {
          AND: [
            { dateSeance: { lte: new Date(au) }  },
            {dateSeance: { gte: new Date(du) }}
         ]
        },
        include:{
          groupe:true,
          seance:true,
          matiere:true
        }
      })
  
      
  
        res.status(200).json({ result })
    }
    else
    {
      const result = await prisma.detailSeance.findMany({
        where: {
          AND: [
            { dateSeance: { lte: new Date(au) }, dateSeance: { gte: new Date(du) } }
         ],
          matiereId: parseInt(matiere),
        },
        include:{
          groupe:true,
          seance:true,
          matiere:true
        }
      })
  
      
  
        res.status(200).json({ result })
    }

    

    


  }
  else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
