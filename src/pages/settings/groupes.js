import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

const Groupes= () => {

    const [loaded, setLoaded] = useState();

    const [Niveaux, setNiveaux] = useState();

    const [Niveau, setNiveau] = useState();

    const [Groupes, setGroupes] = useState();

    useEffect(() => {
        if (!loaded) {
            axios.get('/api/settings/groupes/getniveau')
                .then(function (response) {

                    setNiveaux(response.data.result)

                    setLoaded(true)

                })
                .catch(function (error) {
                    console.log(error);
                });

            axios.get('/api/settings/groupes/getgroupes')
                .then(function (response) {

                    setGroupes(response.data.result)

                })
                .catch(function (error) {
                    console.log(error);
                });

        }
        setTimeout(() => {
            var nl=document.getElementsByClassName("nav-link");
        for (var i = 0; i < nl.length; i++) {
            nl[i].classList.remove('active');
        }
        document.getElementById('side_groupes').classList.add('active')
        document.getElementById('side_parametres').classList.add('active')
        document.getElementById('page_title').innerHTML='Gestion des groupes'
        }, 50);

    });

    return (
        <>
            <select className="form-select" aria-label="niveau" value={Niveau} onChange={(e) => {
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

            {Niveau &&
                <>

                    <div className="table-responsive" style={{ maxHeight: "40vh" }}>
                        <table className="table table-hover table-striped text-center">
                            <thead>
                                <tr>
                                    <th scope="col">Matière</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                {(Groupes.filter(obj => { return obj.niveauId + "" == Niveau + "" }).length==0)&&
                                        <tr>
                                            <td colSpan={2}>Aucune groupe pour la {Niveaux?.find(obj => { return obj.id + "" == Niveau + "" })?.libelle}</td>
                                        </tr>
                                }

                                {Groupes &&
                                    Groupes.filter(obj => { return obj.niveauId + "" == Niveau + "" }).sort((obj1,obj2) => { return(obj1.libelle>obj2.libelle ? 1 : -1) }).map((value, index) => {
                                        return (
                                            <tr key={value.id}>
                                                <td>{value.libelle}</td>
                                                <td><button className="btn btn-outline-danger  p-2" onClick={() => {
                                                    document.getElementsByClassName("overlay")[0].classList.remove("d-none");
                                                    const data = {
                                                        value
                                                    }
                                                    axios.post('/api/settings/groupes/delgroupe', data)
                                                        .then(function (response) {

                                                            axios.get('/api/settings/groupes/getgroupes')
                                                                .then(function (res) {

                                                                    setGroupes(res.data.result)

                                                                    document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                                    Swal.fire({
                                                                        title: `Le groupe ${response.data.deleted.libelle} a été supprimé avec succés !`,
                                                                        icon: "success"
                                                                    });

                                                                })
                                                                .catch(function (error) {
                                                                    console.log(error);
                                                                });



                                                        })
                                                        .catch(function (error) {

                                                            document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                            Swal.fire({
                                                                title: "Erreur!",
                                                                text: `Veuillez réessayer ultérieurement!`,
                                                                icon: "error"
                                                            });
                                                        });
                                                }}><i className="fa fa-trash"></i></button></td>
                                            </tr>
                                        )

                                    })}

                            </tbody>
                        </table>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault()
                    }}>
                        <div className="mb-3">
                            <label htmlFor="txtGroupe" className="form-label">Nouveau groupe pour la {Niveaux?.find(obj => { return obj.id + "" == Niveau + "" })?.libelle}</label>
                            <input type="text" className="form-control" id="txtGroupe" placeholder="Groupe" required autoComplete="off" />
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-primary" onClick={() => {
                                if (document.getElementById("txtGroupe").value != "") {
                                    document.getElementsByClassName("overlay")[0].classList.remove("d-none");
                                    const data = {
                                        groupe: document.getElementById("txtGroupe").value,
                                        niveau: Niveau
                                    }
                                    axios.post('/api/settings/groupes/addgroupe', data)
                                        .then(function (response) {

                                            axios.get('/api/settings/groupes/getgroupes')
                                                .then(function (res) {

                                                    document.getElementById("txtGroupe").value = ""

                                                    setGroupes(res.data.result)

                                                    document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                    Swal.fire({
                                                        title: `Le groupe ${response.data.inserted.libelle} a été ajouté avec succés !`,
                                                        icon: "success"
                                                    });

                                                    

                                                })
                                                .catch(function (error) {
                                                    console.log(error);
                                                });

                                        })
                                        .catch(function (error) {

                                            document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                            Swal.fire({
                                                title: "Erreur!",
                                                text: `Veuillez réessayer ultérieurement!`,
                                                icon: "error"
                                            });
                                        });
                                }
                            }}>Enregistrer</button>
                        </div>

                    </form>
                </>
            }


        </>
    )
}

export default Groupes