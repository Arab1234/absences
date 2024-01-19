import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

const Seances= () => {

    const [loaded, setLoaded] = useState(false);

    const [Seances, setSeances] = useState();

    useEffect(() => {
        if (!loaded) {
            document.getElementsByClassName("overlay")[0].classList.remove("d-none");
            axios.get('/api/settings/seances/getseances')
                .then(function (response) {

                    setLoaded(true)

                    setSeances(response.data.result)

                    document.getElementsByClassName("overlay")[0].classList.add("d-none");

                })
                .catch(function (error) {
                    console.log(error);
                });


            setTimeout(() => {
                var nl = document.getElementsByClassName("nav-link");
                for (var i = 0; i < nl.length; i++) {
                    nl[i].classList.remove('active');
                }
                document.getElementById('side_seances').classList.add('active')
                document.getElementById('side_parametres').classList.add('active')
                document.getElementById('page_title').innerHTML = 'Gestion des séances'
            }, 50);
        }

    });

    return (
        <>
            <h6>Liste des Séances</h6>

            <div className="table-responsive" style={{ maxHeight: "40vh" }}>
                <table className="table table-hover table-striped text-center">
                    <thead>
                        <tr>
                            <th scope="col">Séance</th>
                            <th scope="col">Du <i className="fa fa-arrow-right"></i> Au</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Seances &&
                            Seances.length > 0 &&
                            Seances.map((item, key) => {
                                return(<tr key={item.id}>
                                    <td scope="col">{item.libelle}</td>
                                    <td scope="col">{item.duH.toString().padStart(2, '0')} : {item.duM.toString().padStart(2, '0')} <i className="fa fa-arrow-right"></i> {item.auH.toString().padStart(2, '0')} : {item.auM.toString().padStart(2, '0')}</td>
                                    <td scope="col"><button className="btn btn-outline-danger  p-2" onClick={() => {
                                                    document.getElementsByClassName("overlay")[0].classList.remove("d-none");
                                                    const data = {
                                                        id:item.id
                                                    }
                                                    axios.post('/api/settings/seances/delseance', data)
                                                        .then(function (response) {

                                                            axios.get('/api/settings/seances/getseances')
                                                                .then(function (res) {

                                                                    setSeances(res.data.result)

                                                                    document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                                    Swal.fire({
                                                                        title: `La séance ${response.data.deleted.libelle} a été supprimée avec succés !`,
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
                                </tr>)
                            })

                        }

                        {Seances &&
                            Seances.length == 0 &&
                            <tr>
                                <td colSpan={3}>Aucune seance</td>
                            </tr>
                        }
                        <tr>
                            
                                
                            
                            <td scope="col"><input type="text" autoComplete="off" className="form-control" placeholder="Séance" id="txtSeance" required/></td>
                            <td scope="col" className="form-inline">
                                <div className="row">
                                    <div className="col"><input type="time" autoComplete="off" className="form-control" id="txtDD" required/></div>
                                    <div className="col-1"><i className="fa fa-arrow-right" style={{marginTop:'17px'}}></i></div>
                                    <div className="col"><input type="time" autoComplete="off" className="form-control" id="txtDF" required/></div>
                                </div>
                            </td>
                            <td scope="col"><a className="btn btn-primary" onClick={() => {
                                if (document.getElementById("txtSeance").value != "" && document.getElementById("txtDD").value != "" && document.getElementById("txtDF").value != "" ) {
                                    document.getElementsByClassName("overlay")[0].classList.remove("d-none");
                                    const data = {
                                        seance: document.getElementById("txtSeance").value,
                                        du: document.getElementById("txtDD").value,
                                        au: document.getElementById("txtDF").value
                                    }
                                    axios.post('/api/settings/seances/addseance', data)
                                        .then(function (response) {

                                            axios.get('/api/settings/seances/getseances')
                                                .then(function (res) {

                                                    document.getElementById("txtSeance").value = ""
                                                    document.getElementById("txtDD").value = ""
                                                    document.getElementById("txtDF").value = ""

                                                    setSeances(res.data.result)

                                                    document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                    Swal.fire({
                                                        title: `La seance ${response.data.inserted.libelle} a été ajoutée avec succés !`,
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
                                else{
                                    Swal.fire({
                                        title: "Erreur!",
                                        text: `Veuillez renseigner toutes les champs!`,
                                        icon: "error"
                                    });
                                }
                            }}>Enregistrer</a></td>
                            
                            
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Seances