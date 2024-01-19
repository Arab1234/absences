// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from '../auth/[...nextauth]'

import { PrismaClient } from "@prisma/client";

import { differenceInDays, addDays, isWeekend } from 'date-fns';

const calculateBusinessDays = (startDate, endDate) => {
  let currentDate = new Date(startDate);
  const targetDate = new Date(endDate);
  let businessDays = 0;

  while (currentDate <= targetDate) {
    if (!isWeekend(currentDate)) {
      businessDays++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return businessDays;
}

function addDays2(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isDateBetween(dateToCheck, startDate, endDate) {
  const checkTimestamp = dateToCheck.getTime();
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  return checkTimestamp >= startTimestamp && checkTimestamp <= endTimestamp;
}

function getJsDateFromExcel(excelDate){
  const SECONDS_IN_DAY = 24 * 60 * 60;
  const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
  const MAGIC_NUMBER_OF_DAYS = (25567 + 2);    
  if (!Number(excelDate)) {
      alert('wrong input format')
  }

  const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
  const parsed = delta * MISSING_LEAP_YEAR_DAY;
  const date = new Date(parsed)

  return date
}

export default async function handler(req, res) {
  const session = await getServerSession( req, res, authOptions )
  if (session) {
    const { du,au } = req.body



    const prisma = new PrismaClient()

    const certificats=await prisma.certificat.findMany({
      where:{
        AND: [
          { dtConsult: { lte: new Date(au) }, dtConsult: { gte: new Date(du) } }
       ]
      
    }
    })

    const result = await prisma.etudiant.findMany({
      where:{
        CIN:{
          in:certificats.map(cer => cer.CIN)
        }
      },
      include:{
        certificats:{
          select:{
            dtConsult:true,
            dtBO:true,
            nbJour:true,
            est_valide:true,
            id:true
          },
          where:{
              AND: [
                { dtConsult: { lte: new Date(au) }, dtConsult: { gte: new Date(du) } }
             ]
            
          }
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
