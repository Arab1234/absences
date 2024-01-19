// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";
import { group } from "console";

function customDateFormat(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default async function handler(req, res) {
    const session = await getServerSession( req, res, authOptions )
    
    if (session) {
        const { seances } = req.body

        var idseances=seances.map((item)=>{
          return parseInt(item)
        })

        const prisma = new PrismaClient()

        const groupes=await prisma.groupe.findMany({
          where:{
            detailSeances:{
              some:{
                id:{
                  in:idseances
                }
              }
            }
            }
          })

          const groupeId=groupes.map((gr)=>{return(gr.id)})

        var etudiants=await prisma.etudiant.findMany({

          where:{
            Affectation_groupes:{
              some:{
                groupeId:{
                  in:groupeId
                }
              }
            }
          },
          include:{
            Affectation_groupes:{
              include:{
                groupe:true,
              },
              where:{
                groupeId:{
                  in:groupeId
                }
              }
            },
            certificats:true

          }
        })

        const seancedate=await prisma.detailSeance.findMany({
          where:{
            id:{
              in:idseances
            }
          },include:{
            seance:true,
            matiere:true,
            groupe:true,
            presences:true
          }

        })

        /*etudiants.forEach((item)=>{
          seancedate.map((item2)=>{
            item[customDateFormat(new Date(item2.dateSeance))]=''
          })
          
        })*/

        res.status(200).json({ result:{etudiants,seancedate} })
        
    }
    else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}