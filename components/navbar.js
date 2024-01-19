import { useEffect, useState } from "react"

import {signIn,signOut,useSession} from 'next-auth/react'


const Navbar=() => {

  const [isClient, setIsClient] = useState(false)

  const { data: session, status } = useSession()

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    isClient &&
    <nav className="navbar navbar-main navbar-expand-lg mx-5 px-0 shadow-none rounded" id="navbarBlur" navbar-scroll="true">
      <div className="container-fluid py-1 px-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-transparent mb-1 pb-0 pt-1 px-0 me-sm-6 me-5">

          </ol>
          <h6 className="font-weight-bold mb-0" id="page_title"></h6>
        </nav>
        <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
          <div className="ms-md-auto pe-md-3 d-flex align-items-center">

          </div>
          <ul className="navbar-nav  justify-content-end">
            <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
              <a className="me-2" href="#" onClick={
                () => {
                  if (document.getElementsByTagName('body')[0].classList.contains('g-sidenav-pinned'))
                    document.getElementsByTagName('body')[0].classList.remove('g-sidenav-pinned')
                  else
                    document.getElementsByTagName('body')[0].classList.add('g-sidenav-pinned')
                }
              }>
                <div className="sidenav-toggler-inner">
                  <i className="sidenav-toggler-line"></i>
                  <i className="sidenav-toggler-line"></i>
                  <i className="sidenav-toggler-line"></i>
                </div>
              </a>
            </li>

            <li className="nav-item dropdown pe-2 d-flex align-items-center">
              <a href="#" className="nav-link text-body p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={session?.user?.image} className="avatar avatar-sm" alt="avatar" />
              </a>
              <ul className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton">

                <li className="mb-2">
                  <h5 className="text-sm font-weight-normal mb-1 text-center">
                    <span className="font-weight-bold">{session?.user?.name}</span>
                  </h5>
                </li>

                <li className="mb-2">
                  <a className="dropdown-item border-radius-md" href="#" onClick={()=>{signOut()}}>
                    <div className="d-flex py-1">
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="text-sm font-weight-normal mb-1">
                          <i className="fa fa-sign-out opacity-6 me-1"></i>
                          <span className="font-weight-bold">Deconnexion</span>
                        </h6>

                      </div>
                    </div>
                  </a>
                </li>

              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar