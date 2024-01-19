import Head from "next/head"
import Sidebar from "./sidebar"
import Navbar from "./navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { signIn, signOut, useSession } from 'next-auth/react'
import { usePathname } from "next/navigation"


export default function Layout(props) {

    const { data: session, status } = useSession()

    const [isClient, setIsClient] = useState(false)

    const [loaded, setloaded] = useState(false)

    const pathname = usePathname();

    useEffect(() => {
        setIsClient(true)

        if(pathname!='/login')

        {if (status != "loading") {


            axios.post('/api/auth/getSession')
                .then(function (response) {

                    if (response.data.response == "UnAuthenticated") {
                        if (status == "authenticated")
                            signOut()
                        signIn()
                        console.log("test")
                    }
                    else
                        {
                            console.log(response.data.response)
                            setloaded(true)
                        }

                    
                })
                .catch(function (error) {
                    console.log(error);
                });

        }
    
    }else
    setloaded(true)

    }, [status])

    return ((isClient && status != "loading" && loaded) &&
        <>
            <Head>
                <title>ENSMR - Absence</title>
            </Head>

            {pathname == '/login' &&
                props.children
            }
            {pathname != '/login' &&


                <div id="app">




                    <Sidebar />

                    <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">

                        <Navbar />
                        <div className="overlay d-none">
                            <div className="d-flex justify-content-center" style={{ marginTop: "25%", marginLeft: "5%" }}>
                                <div className="spinner-grow text-primary" role="status" style={{ width: "3rem", height: "3rem", zIndex: "20" }}>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                        <div className="container-fluid py-4 px-5">
                            {props.children}
                        </div>
                    </main>
                </div>
            }
        </>
    )
}


