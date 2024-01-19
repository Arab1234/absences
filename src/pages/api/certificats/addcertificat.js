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
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    const { cert } = req.body

    var cmptAdded = 0

    const prisma = new PrismaClient()

    var JF = await prisma.jourferie.findMany()

    const getStudent=await prisma.etudiant.findMany()

    cert.map(async (value, index) => {
      var cmpt = calculateBusinessDays(new Date(getJsDateFromExcel(value.Consultation)), new Date(getJsDateFromExcel(value.Réception)))

      var myJF = JF.filter((jf) => { return isDateBetween(new Date(jf.dateJF.toISOString().split('T')[0]), new Date(getJsDateFromExcel(value.Consultation).toISOString().split('T')[0]), new Date(getJsDateFromExcel(value.Réception))) })

      var cmptWeekend = 0

      myJF.map((item, value) => {
        var days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        var d = new Date(item.dateJF);
        var dayName = days[d.getDay()];

        if (dayName != 'Samedi' && dayName != 'Dimanche')
          cmptWeekend++
      })

      cmpt=cmpt-cmptWeekend

      if(cmpt<=3)
      {

        const tmpStudent=getStudent.filter((stud)=>{return stud.nom==value.Nom && stud.prenom==value.Prénom})
        
        if(tmpStudent.length>0)
        {
          cmptAdded++
          const certificats = await prisma.certificat.findFirst({
            where: {
              dtConsult:new Date(getJsDateFromExcel(value.Consultation)).toISOString(),
              dtBO:new Date(getJsDateFromExcel(value.Réception)).toISOString(),
              nbJour:parseInt(value[" NB de Jours"]),
              CIN:tmpStudent[0].CIN
          }
          })
    
          const inserted = await prisma.certificat.upsert({
            where: {
    
              id: certificats ? certificats.id : 0
            },
            create: {
              dtConsult:new Date(getJsDateFromExcel(value.Consultation)).toISOString(),
              dtBO:new Date(getJsDateFromExcel(value.Réception)).toISOString(),
              nbJour:parseInt(value[" NB de Jours"]),
              est_valide:true,
              CIN:tmpStudent[0].CIN
              // Other fields...
            },
            update: {
              dtConsult:new Date(getJsDateFromExcel(value.Consultation)).toISOString(),
              dtBO:new Date(getJsDateFromExcel(value.Réception)).toISOString(),
              nbJour:parseInt(value[" NB de Jours"]),
              est_valide:true,
              CIN:tmpStudent[0].CIN
            }
          })
        
        }
    
        }
        else
        {
          const tmpStudent=getStudent.filter((stud)=>{return stud.nom==value.Nom && stud.prenom==value.Prénom})
        
        if(tmpStudent.length>0)
        {
          cmptAdded++
          const certificats = await prisma.certificat.findFirst({
            where: {
              dtConsult:new Date(getJsDateFromExcel(value.Consultation)).toISOString(),
              dtBO:new Date(getJsDateFromExcel(value.Réception)).toISOString(),
              nbJour:parseInt(value[" NB de Jours"]),
              CIN:tmpStudent[0].CIN
          }
          })
    
          const inserted = await prisma.certificat.upsert({
            where: {
    
              id: certificats ? certificats.id : 0
            },
            create: {
              dtConsult:new Date(getJsDateFromExcel(value.Consultation)).toISOString(),
              dtBO:new Date(getJsDateFromExcel(value.Réception)).toISOString(),
              nbJour:parseInt(value[" NB de Jours"]),
              est_valide:false,
              CIN:tmpStudent[0].CIN
              // Other fields...
            },
            update: {
              dtConsult:new Date(getJsDateFromExcel(value.Consultation)).toISOString(),
              dtBO:new Date(getJsDateFromExcel(value.Réception)).toISOString(),
              nbJour:parseInt(value[" NB de Jours"]),
              est_valide:false,
              CIN:tmpStudent[0].CIN
            }
          })
        
        }
    
        }

        
      })

      
      res.status(200).json({ result:cmptAdded })

      //var cmptdtabs=calculateBusinessDays(new Date(getJsDateFromExcel(value.Consultation)),addDays2(new Date(getJsDateFromExcel(value.Consultation)),(value[" NB de Jours"]-1)))

      //var cpmtJFdtabs=(value[" NB de Jours"]-cmptdtabs)


}
  else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
