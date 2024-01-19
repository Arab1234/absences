import axios from "axios";
import { useEffect, useState, useCallback } from "react"
import Swal from "sweetalert2";
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { setISODay } from "date-fns";

function addDays2(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const Resultat=() => {

    const [loaded, setLoaded] = useState();

    const [Niveaux, setNiveaux] = useState();

    const [Niveau, setNiveau] = useState();

    const [Matieres, setMatieres] = useState();

    const [Matiere, setMatiere] = useState();

    const [Seances, setSeances] = useState();

    const [Seance, setSeance] = useState();

    const [Etudiants, setEtudiants] = useState();

    const [seanceDate, setSeanceDate] = useState();

    var str = "CNE;Nom;Prénom;Filière;";

    useEffect(() => {
        if (!loaded) {

            document.getElementsByClassName("overlay")[0].classList.remove("d-none");

            axios.get('/api/resultat/getniveau')
                .then(function (response) {

                    setNiveaux(response.data.result)

                    axios.get('/api/resultat/getmatieres')
                        .then(function (response) {
                            setMatieres(response.data.result)
                            document.getElementsByClassName("overlay")[0].classList.add("d-none");
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                })
                .catch(function (error) {
                    console.log(error);
                });

            setTimeout(() => {
                var nl = document.getElementsByClassName("nav-link");
                for (var i = 0; i < nl.length; i++) {
                    nl[i].classList.remove('active');
                }
                document.getElementById('side_resultat')?.classList.add('active')
                document.getElementById('page_title').innerHTML = 'Cumul d\'absences'
            }, 50);

        }


    }, [loaded]);

    /*useEffect(() => {
        setfiltredEtudiants(Etudiants);
    }, [Etudiants])*/


    return (
        <>
            <div className="card card-background card-background-after-none align-items-start mt-4 mb-5">
                <div className="full-background" style={{ backgroundImage: "url('../assets/img/header-blue-purple.jpg')" }}></div>
                <div className="card-body text-start p-4 w-100">
                    <h3 className="text-white mb-2">Rechercher des séances d'absences</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        setSeances(null)

                        document.getElementsByClassName("overlay")[0].classList.remove("d-none");

                        axios.post('/api/resultat/getseanceabsence', {
                            du: document.getElementById("du").value,
                            au: document.getElementById("au").value,
                            matiere: Matiere
                        })
                            .then(function (response) {

                                setSeances(response.data.result)

                                document.getElementsByClassName("overlay")[0].classList.add("d-none");

                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }}>
                        <div className="row">
                            <div className="col">
                                <select className="form-select" aria-label="niveau" value={Niveau} required onChange={(e) => {
                                    setNiveau(e.target.value);

                                }}>
                                    <option value={''} defaultValue>Choisir un Niveau</option>
                                    {
                                        Niveaux &&
                                        Niveaux.map((value, index) => {
                                            return (
                                                <option key={value.id} id={value.id} value={value.id}>{value.libelle}</option>
                                            )

                                        })
                                    }
                                </select>
                            </div>



                            <div className="col">
                                <select className="form-select" aria-label="matiere" defaultValue={Matiere} required onChange={(e) => {
                                    setMatiere(e.target.value);

                                }}>
                                    <option value={''} defaultValue>Choisir une Matière</option>
                                    {
                                        Matieres &&
                                        Matieres.filter((matiere) => { return matiere.niveauId == Niveau }).map((value, index) => {
                                            if (index == 0) {
                                                return (
                                                    <>
                                                        <option key={-1} value={'Tout'} defaultValue>Tout</option>

                                                        <option key={value.id} id={value.id} value={value.id}>{value.libelle}</option>
                                                    </>

                                                )
                                            } else
                                                return (
                                                    <>

                                                        <option key={value.id} id={value.id} value={value.id}>{value.libelle}</option>
                                                    </>

                                                )


                                        })
                                    }
                                </select>
                            </div>



                            <div className="col">
                                <input type="date" id="du" className="form-control" placeholder="du" required />
                            </div>

                            <div className="col">
                                <input type="date" id="au" className="form-control" placeholder="au" required />
                            </div>

                        </div>
                        <div className="text-center mt-3">
                            <button type="submit" className="btn btn-outline-white btn-blur btn-icon d-flex align-items-center mb-0" id="btnSearch">
                                <span className="btn-inner--icon">
                                    <i className="fa fa-search"></i>
                                </span>&nbsp;
                                <span className="btn-inner--text">Rechercher</span>
                            </button>

                        </div>
                    </form>

                    {Seances &&
                        Seances.length > 0 &&
                        <>
                            <form onSubmit={(e) => {
                                e.preventDefault()

                                str = "CNE;Nom;Prénom;Filière;"

                                axios.post('/api/resultat/getcumulabsence', {
                                    seances: Seance
                                })
                                    .then(function (response) {

                                        setEtudiants(response.data.result.etudiants)

                                        setSeanceDate(response.data.result.seancedate)

                                        document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }}>
                                <select className="form-select mt-2" aria-label="seance" required multiple size={4} onChange={(e) => {

                                    var options = e.target.options;
                                    var value = [];
                                    for (var i = 0, l = options.length; i < l; i++) {
                                        if (options[i].selected) {
                                            value.push(options[i].value);
                                        }
                                    }

                                    setSeance(value)
                                }}>
                                    {
                                        Seances &&
                                        Seances.map((value, index) => {
                                            return (
                                                <option key={value.id} id={value.id} value={value.id}>{value.groupe.libelle}|{(value.dateSeance + "").split('T')[0]}|{value.matiere.libelle}|{value.seance.libelle}</option>
                                            )

                                        })
                                    }
                                </select>

                                <div className="text-center mt-3">
                                    <button type="submit" className="btn btn-outline-white btn-blur btn-icon" id="btngenerate">

                                        <span className="btn-inner--text">Générer le cumul d'absence</span>
                                    </button>

                                </div>
                            </form>
                        </>
                    }
                </div>



            </div>
            {
                Etudiants &&
                <div className="row">
                    <div className="col-12">
                        <div className="card border shadow-xs mb-4">
                            <div className="card-header border-bottom pb-0">
                                <div className="d-sm-flex align-items-center">
                                    <div>
                                        <h6 className="font-weight-semibold text-lg mb-0">Liste des étudiants</h6>
                                        <p className="text-sm">{Etudiants?.length > 0 ? 'Tableau de cumul' : 'Aucun étudiant'}</p>
                                    </div>

                                </div>
                            </div>
                            {Etudiants?.length > 0 &&
                                <div className="card-body px-0 py-0">

                                    <div className="table-responsive p-0" style={{ maxHeight: '35vh' }}>
                                        <table className="table align-items-center mb-0">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="text-secondary text-xs font-weight-semibold opacity-7 text-center">CNE</th>
                                                    <th className="text-secondary text-xs font-weight-semibold opacity-7 ps-2 text-center">Nom</th>
                                                    <th className="text-center text-secondary text-xs font-weight-semibold opacity-7">Prénom</th>
                                                    <th className="text-center text-secondary text-xs font-weight-semibold opacity-7">Filière</th>
                                                    {seanceDate &&
                                                        seanceDate.map((item, index) => {
                                                            str += (item.dateSeance + "").split('T')[0] + "_" + item.seance.libelle + "_" + item.matiere.libelle + "_" + item.groupe.libelle + ";"

                                                            return (
                                                                <th key={index} className="text-center text-secondary text-xs font-weight-semibold opacity-7">{(item.dateSeance + "").split('T')[0]}_{item.seance.libelle}_{item.matiere.libelle}_{item.groupe.libelle}</th>
                                                            )
                                                        })}
                                                    <th className="text-center text-secondary text-xs font-weight-semibold opacity-7">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Etudiants &&
                                                    Etudiants.sort((obj1, obj2) => { return (obj1.nom == obj2.nom) ? ((obj1.prenom > obj2.prenom) ? 1 : -1) : obj1.nom > obj2.nom ? 1 : -1 }).map((item, index) => {

                                                        if (index == 0)
                                                            str += "Total\n"

                                                        var cumul = 0

                                                        str += item.CNE + ";" + item.nom + ";" + item.prenom + ";" + item.filiere + ";"

                                                        return (
                                                            <tr key={item.CIN}>
                                                                <td>
                                                                    <div className="text-center">
                                                                        <h6 className="mb-0 text-sm font-weight-semibold">{item.CNE}</h6>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="text-center">
                                                                        <h6 className="mb-0 text-sm font-weight-semibold">{item.nom}</h6>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="text-center">
                                                                        <h6 className="mb-0 text-sm font-weight-semibold">{item.prenom}</h6>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="text-center">
                                                                        <h6 className="mb-0 text-sm font-weight-semibold">{item.filiere}</h6>
                                                                    </div>
                                                                </td>

                                                                {seanceDate &&

                                                                    seanceDate.map((sd, oi) => {
                                                                        var cmpt = 0
                                                                        var cert = false
                                                                        sd.presences.map((pr, ii) => {
                                                                            if (pr.CIN == item.CIN)
                                                                                cmpt++
                                                                        })



                                                                        if (cmpt > 0) {
                                                                            item.certificats.map((certif, ii) => {
                                                                                const du = new Date(certif.dtConsult)
                                                                                const au = addDays2(new Date((certif.dtConsult + "").split('T')[0]), (certif.nbJour - 1))
                                                                                if (new Date(sd.dateSeance) >= du && new Date(sd.dateSeance) <= au && certif.est_valide == true)
                                                                                    cert = true
                                                                            })
                                                                            cumul++
                                                                            if (cert) {
                                                                                str += "X (Absence certifiée);"
                                                                            }
                                                                            else
                                                                                str += "X (Absence non certifiée ou certificat non valide);"
                                                                            return (

                                                                                <td key={oi}>
                                                                                    {!cert &&
                                                                                        <div className="text-center text-danger">
                                                                                            X
                                                                                        </div>
                                                                                    }

                                                                                    {cert &&
                                                                                        <div className="text-center text-success">
                                                                                            X
                                                                                        </div>
                                                                                    }

                                                                                </td>

                                                                            )
                                                                        }
                                                                        else {
                                                                            str += ";"
                                                                            return (

                                                                                <td key={oi}></td>
                                                                            )
                                                                        }

                                                                    })}
                                                                <td>
                                                                    <div className="text-center">
                                                                        <h6 className="mb-0 text-sm font-weight-semibold">{cumul}</h6>
                                                                    </div>
                                                                </td>{[0].map((ca) => {
                                                                    str += cumul+"\n"
                                                                })}
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="text-center mt-2">
                                        <button className="btn btn-primary" onClick={() => {
                                            const blob = new Blob([str], { type: "text/plain" });
                                            const url = URL.createObjectURL(blob);
                                            const link = document.createElement("a");
                                            link.download = "export.csv";
                                            link.href = url;
                                            link.click();
                                        }}>Exporter</button>
                                    </div>

                                </div>
                            }
                        </div>
                    </div>
                </div>
            }



        </>
    )
}

export default Resultat