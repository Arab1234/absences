import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Sidebar(){
    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
      setIsClient(true)
    }, [])

    
    return(isClient&&
        
        <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 bg-slate-900 fixed-start collapse" id="sidenav-main">
    <div className="sidenav-header">
      <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
      <a className="navbar-brand d-flex align-items-center m-0" href={"/"}>
        <img src={"/assets/img/logo.png"} />
        <span className="font-weight-bold text-lg ms-2">ENSMR</span>
      </a>
    </div>
    <div className="collapse navbar-collapse px-4  w-auto overflow-hidden" id="sidenav-collapse-main">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" href={"/"} id="side_index">
            <div className="icon icon-shape icon-sm px-0 text-center d-flex align-items-center justify-content-center">
              <svg width="30px" height="30px" viewBox="0 0 48 48" version="1.1">
                <title>dashboard</title>
                <g id="dashboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="template" transform="translate(12.000000, 12.000000)" fill="#FFFFFF" fillRule="nonzero">
                    <path className="color-foreground" d="M0,1.71428571 C0,0.76752 0.76752,0 1.71428571,0 L22.2857143,0 C23.2325143,0 24,0.76752 24,1.71428571 L24,5.14285714 C24,6.08962286 23.2325143,6.85714286 22.2857143,6.85714286 L1.71428571,6.85714286 C0.76752,6.85714286 0,6.08962286 0,5.14285714 L0,1.71428571 Z" id="Path"></path>
                    <path className="color-background" d="M0,12 C0,11.0532171 0.76752,10.2857143 1.71428571,10.2857143 L12,10.2857143 C12.9468,10.2857143 13.7142857,11.0532171 13.7142857,12 L13.7142857,22.2857143 C13.7142857,23.2325143 12.9468,24 12,24 L1.71428571,24 C0.76752,24 0,23.2325143 0,22.2857143 L0,12 Z" id="Path"></path>
                    <path className="color-background" d="M18.8571429,10.2857143 C17.9103429,10.2857143 17.1428571,11.0532171 17.1428571,12 L17.1428571,22.2857143 C17.1428571,23.2325143 17.9103429,24 18.8571429,24 L22.2857143,24 C23.2325143,24 24,23.2325143 24,22.2857143 L24,12 C24,11.0532171 23.2325143,10.2857143 22.2857143,10.2857143 L18.8571429,10.2857143 Z" id="Path"></path>
                  </g>
                </g>
              </svg>
            </div>
            <span className="nav-link-text ms-1">Dashboard</span>
          </Link>
        </li>
        <li className="nav-item ms-2">
          <Link className="nav-link position-relative ms-0 ps-2 py-2" href={"/absences"} id='side_absences'>
            <i className="fa fa-pen"></i> <span className="nav-link-text ms-1">Absences</span>
          </Link>
        </li>

        <li className="nav-item ms-2">
          <Link className="nav-link position-relative ms-0 ps-2 py-2" href={"/certificats"} id='side_certificats'>
            <i className="fa fa-file"></i> <span className="nav-link-text ms-1">Certificats</span>
          </Link>
        </li>

        <li className="nav-item ms-2">
          <Link className="nav-link position-relative ms-0 ps-2 py-2" href={"/resultat"} id='side_resultat'>
            <i className="fa fa-list-alt"></i> <span className="nav-link-text ms-1">Resultat</span>
          </Link>
        </li>
       
        <li className="nav-item mt-2">
          <div className="d-flex align-items-center nav-link" id="side_parametres">
            <div className="icon icon-shape icon-sm px-0 text-center d-flex align-items-center justify-content-center">
              <i style={{fontSize:'18px'}} className="fa fa-cog"></i>
            </div>
            <span className="font-weight-normal text-md ms-2">Paramètres</span>
          </div>
        </li>
        <li className="nav-item border-start my-0 pt-2">
          <Link className="nav-link position-relative ms-0 ps-2 py-2" href={"/settings/matieres"} id='side_matieres'>
            <span className="nav-link-text ms-1">Matières</span>
          </Link>
        </li>
        <li className="nav-item border-start my-0 pt-2">
          <Link className="nav-link position-relative ms-0 ps-2 py-2 " href={"/settings/seances"} id='side_seances'>
            <span className="nav-link-text ms-1">Séances</span>
          </Link>
        </li>
        <li className="nav-item border-start my-0 pt-2">
          <Link className="nav-link position-relative ms-0 ps-2 py-2 " href={"/settings/groupes"} id='side_groupes'>
            <span className="nav-link-text ms-1">Groupes</span>
          </Link>
        </li>
        <li className="nav-item border-start my-0 pt-2">
          <Link className="nav-link position-relative ms-0 ps-2 py-2 " href={"/settings/etudiants"} id='side_etudiants'>
            <span className="nav-link-text ms-1">Etudiants</span>
          </Link>
        </li>
        
      </ul>
    </div>
  </aside>
        
    )
}