import axios from "axios";
import { useEffect, useState, useCallback } from "react"
import Swal from "sweetalert2";
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

const Absences=() => {

    const [loaded, setLoaded] = useState();

    const [Niveaux, setNiveaux] = useState();

    const [Niveau, setNiveau] = useState();

    const [Groupe, setGroupe] = useState();

    const [Groupes, setGroupes] = useState();

    const [Matieres, setMatieres] = useState();

    const [Matiere, setMatiere] = useState();

    const [Seances, setSeances] = useState();

    const [Seance, setSeance] = useState();

    const [Etudiants, setEtudiants] = useState();

    const [filtredEtudiants, setfiltredEtudiants] = useState();

    const [ch, setch] = useState(false);

    useEffect(() => {
        if (!loaded) {

            document.getElementsByClassName("overlay")[0].classList.remove("d-none");

            axios.get('/api/absences/getniveau')
                .then(function (response) {

                    setNiveaux(response.data.result)

                    axios.get('/api/absences/getmatieres')
                        .then(function (response) {

                            setMatieres(response.data.result)

                            axios.get('/api/absences/getgroupes')
                                .then(function (response) {

                                    setGroupes(response.data.result)

                                    axios.get('/api/absences/getseances')
                                        .then(function (response) {

                                            setSeances(response.data.result)

                                            document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                            setLoaded(true)

                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });

                                })
                                .catch(function (error) {
                                    console.log(error);
                                });

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
                document.getElementById('side_absences')?.classList.add('active')
                document.getElementById('page_title').innerHTML = 'Gestion des absences'
            }, 50);

        }


    }, [loaded]);

    useEffect(() => {
        setfiltredEtudiants(Etudiants);
    }, [Etudiants])


    return (
        <>
            <div className="card card-background card-background-after-none align-items-start mt-4 mb-5">
                <div className="full-background" style={{ backgroundImage: "url('../assets/img/header-blue-purple.jpg')" }}></div>
                <div className="card-body text-start p-4 w-100">
                    <h3 className="text-white mb-2">Rechercher une séance d'absence</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        setEtudiants(null)

                        document.getElementsByClassName("overlay")[0].classList.remove("d-none");

                        axios.post('/api/absences/getseanceabsence', {
                            dateseance: document.getElementById("dateSeance").value,
                            matiere: Matiere,
                            seance: Seance,
                            groupe: Groupe
                        })
                            .then(function (response) {

                                setEtudiants(response.data.result)

                                document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                document.getElementById('btnradiotable3').checked = true

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
                                <select className="form-select" aria-label="groupe" value={Groupe} required onChange={(e) => {
                                    setGroupe(e.target.value);

                                }}>
                                    <option value={''} defaultValue>Choisir un Groupe</option>
                                    {
                                        Groupes &&
                                        Groupes.filter((grp) => { return grp.niveauId == Niveau }).map((value, index) => {
                                            return (
                                                <option key={value.id} id={value.id} value={value.id}>{value.libelle}</option>
                                            )

                                        })
                                    }
                                </select>
                            </div>

                            <div className="col">
                                <select className="form-select" aria-label="matiere" value={Matiere} required onChange={(e) => {
                                    setMatiere(e.target.value);

                                }}>
                                    <option value={''} defaultValue>Choisir une Matière</option>
                                    {
                                        Matieres &&
                                        Matieres.filter((matiere) => { return matiere.niveauId == Niveau }).map((value, index) => {
                                            return (
                                                <option key={value.id} id={value.id} value={value.id}>{value.libelle}</option>
                                            )

                                        })
                                    }
                                </select>
                            </div>

                            <div className="col">
                                <select className="form-select" aria-label="seance" value={Seance} required onChange={(e) => {
                                    setSeance(e.target.value);

                                }}>
                                    <option value={''} defaultValue>Choisir une Séance</option>
                                    {
                                        Seances &&
                                        Seances.map((value, index) => {
                                            return (
                                                <option key={value.id} id={value.id} value={value.id}>{value.libelle} = {value.duH.toString().padStart(2, '0')} : {value.duM.toString().padStart(2, '0')} {'=>'} {value.auH.toString().padStart(2, '0')} : {value.auM.toString().padStart(2, '0')}</option>
                                            )

                                        })
                                    }
                                </select>
                            </div>

                            <div className="col">
                                <input type="date" id="dateSeance" className="form-control" placeholder="date de la séance" required />
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
                                        <p className="text-sm">{Etudiants?.length > 0 ? 'Veuillez cocher les étudiants absents' : 'Merci de créer la séance d\'absence'}</p>
                                    </div>
                                    {Etudiants?.length == 0 &&
                                        <div className="ms-auto d-flex">

                                            <button type="button" className="btn btn-sm btn-dark btn-icon d-flex align-items-center me-2" onClick={() => {
                                                document.getElementsByClassName("overlay")[0].classList.remove("d-none");

                                                axios.post('/api/absences/newseance', {
                                                    dateseance: document.getElementById("dateSeance").value,
                                                    matiere: Matiere,
                                                    seance: Seance,
                                                    groupe: Groupe
                                                })
                                                    .then(function (response) {

                                                        document.getElementById('btnSearch').click()

                                                        document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                    })
                                                    .catch(function (error) {
                                                        console.log(error);
                                                    });
                                            }}>
                                                <span className="btn-inner--icon">
                                                    <i className="fa fa-book-open-reader" style={{ fontSize: '0.9rem' }}></i>
                                                </span>
                                                <span className="btn-inner--text ms-2">Créer une séance</span>
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                            {Etudiants?.length > 0 &&
                                <div className="card-body px-0 py-0">
                                    <div className="border-bottom py-3 px-3 d-sm-flex align-items-center">
                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <input type="radio" className="btn-check" name="btnradiotable" id="btnradiotable1" autoComplete="off" defaultChecked value={"Tout"} onChange={(e) => {
                                                setfiltredEtudiants(Etudiants)
                                            }} />
                                            <label className="btn btn-white px-3 mb-0" htmlFor="btnradiotable1">Tout</label>
                                            <input type="radio" className="btn-check" name="btnradiotable" id="btnradiotable2" autoComplete="off" value={"Absents"} onChange={(e) => {
                                                setfiltredEtudiants(Etudiants.filter((item) => { return item._count.presences > 0 }))
                                            }} />
                                            <label className="btn btn-white px-3 mb-0" htmlFor="btnradiotable2">Absents</label>
                                            <input type="radio" className="btn-check" name="btnradiotable" id="btnradiotable3" autoComplete="off" value={"Présents"} onChange={(e) => {
                                                setfiltredEtudiants(Etudiants.filter((item) => { return item._count.presences == 0 }))
                                            }} />
                                            <label className="btn btn-white px-3 mb-0" htmlFor="btnradiotable3">Présents</label>
                                        </div>
                                    </div>

                                    <div className="table-responsive p-0" style={{ maxHeight: '35vh' }}>
                                        <table className="table align-items-center mb-0">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="text-secondary text-xs font-weight-semibold opacity-7 text-center">CNE</th>
                                                    <th className="text-secondary text-xs font-weight-semibold opacity-7 ps-2 text-center">Nom</th>
                                                    <th className="text-center text-secondary text-xs font-weight-semibold opacity-7">Prénom</th>
                                                    <th className="text-center text-secondary text-xs font-weight-semibold opacity-7">Filière</th>
                                                    <th className="text-center text-secondary text-xs font-weight-semibold opacity-7">Email</th>
                                                    <th className="text-secondary opacity-7 text-center" style={{ cursor: "pointer" }} onClick={() => {
                                                        var cbs = document.getElementsByClassName('cbPresent');
                                                        for (var i = 0; i < cbs.length; i++) {
                                                            if (cbs[i].type == 'checkbox') {
                                                                cbs[i].checked = !ch;
                                                                setch(cbs[i].checked)
                                                            }
                                                        }
                                                        setch(cbs[0].checked)
                                                    }}>{!ch ? "Tout" : "Aucun"}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtredEtudiants &&
                                                    filtredEtudiants.sort((obj1, obj2) => { return (obj1.nom == obj2.nom) ? ((obj1.prenom > obj2.prenom) ? 1 : -1) : obj1.nom > obj2.nom ? 1 : -1 }).map((item, index) => {
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

                                                                <td>
                                                                    <div className="text-center">
                                                                        <h6 className="mb-0 text-sm font-weight-semibold">{item.email}</h6>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="text-center">
                                                                        <h6 className="mb-0 text-sm font-weight-semibold">
                                                                            {item._count &&
                                                                                item._count.presences > 0 &&
                                                                                <input type="checkbox" defaultChecked className="cbPresent" value={item.CIN} />
                                                                            }

                                                                            {item._count &&
                                                                                item._count.presences == 0 &&
                                                                                <input type="checkbox" className="cbPresent" value={item.CIN} />
                                                                            }
                                                                            

                                                                        </h6>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="text-center mt-2">
                                        <button className="btn btn-primary" onClick={() => {
                                            document.getElementsByClassName("overlay")[0].classList.remove("d-none");

                                            var cbs = document.getElementsByClassName('cbPresent');

                                            var arr = []

                                            for (var i = 0; i < cbs.length; i++) {
                                                if (cbs[i].type == 'checkbox') {
                                                    if (cbs[i].checked == true)
                                                        arr.push(cbs[i].value)
                                                }
                                            }

                                            axios.post('/api/absences/savePresence', {
                                                dateseance: document.getElementById("dateSeance").value,
                                                matiere: Matiere,
                                                seance: Seance,
                                                groupe: Groupe,
                                                CIN: arr
                                            })
                                                .then(function (response) {

                                                    document.getElementById('btnSearch').click()

                                                    document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                })
                                                .catch(function (error) {
                                                    console.log(error);
                                                });
                                        }}>Enregistrer</button>
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

export default Absences