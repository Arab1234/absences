// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"

import { authOptions } from './[...nextauth]'

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const prisma = new PrismaClient()

    const session = await getServerSession( req, res, authOptions )

    if (session) {

        var authusers = await prisma.authUser.findMany({
            select: {
                email: true
            },
            where: {
                email:session.user.email
            }
        });

        authusers = [...new Set(authusers.map(x => x.email))];

        if(authusers.length>0)
            res.status(200).json({ response: session.user })
        else
            res.status(200).json({ response: "UnAuthenticated" })
    }
    else
    {
        res.status(200).json({ response: "UnAuthenticated" })
    }




/*
    

    if (user.length > 0)
        res.status(200).json({ response: user[0] })
    else
        res.status(200).json({ response: 'UnAuthentified' })

*/
}
