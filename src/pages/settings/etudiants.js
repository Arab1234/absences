import axios from "axios";
import { useEffect, useState, useCallback } from "react"
import Swal from "sweetalert2";
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

const Etudiants= () => {

    const [loaded, setLoaded] = useState();

    const [Niveaux, setNiveaux] = useState();

    const [Niveau, setNiveau] = useState();

    const [Groupe, setGroupe] = useState();

    const [Groupes, setGroupes] = useState();

    const [Etudiants, setEtudiants] = useState();

    const [excelData, setExcelData] = useState();

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Assuming only one sheet exists in the workbook
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Parse the sheet's data into an array of objects
                const dataArr = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                const headers = dataArr[0];
                const formattedData = dataArr.slice(1).map((row) => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });

                // Set the extracted data in the state
                setExcelData(formattedData);
            };

            reader.readAsArrayBuffer(file);
        }
        else
            Swal.fire({
                title: "Erreur!",
                text: `Veuillez importer un fichier excel valide!`,
                icon: "error"
            });
    })

    useEffect(() => {
        if (excelData?.length > 0) {
            document.getElementsByClassName("overlay")[0].classList.remove("d-none");
            const data = {
                etudiants: excelData,
                groupe: Groupe
            }
            axios.post('/api/settings/etudiants/importetudiants', data)
                .then(function (response) {

                    if (Groupe) {
                        document.getElementsByClassName("overlay")[0].classList.remove("d-none");

                        axios.post("/api/settings/etudiants/getetudiants", {
                            groupe: Groupe
                        })
                            .then((res) => {
                                setEtudiants(res.data.result)
                                setExcelData(null)
                                document.getElementsByClassName("overlay")[0].classList.add("d-none");
                                Swal.fire({
                                    title: `L'affectation des ${response.data.inserted.length} étudiants(es) au groupe ${Groupes?.find(obj => { return obj.id + "" == Groupe + "" })?.libelle} a été faite avec succés !`,
                                    icon: "success"
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }

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

    }, [excelData])

    const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

    useEffect(() => {
        if (!loaded) {
            document.getElementsByClassName("overlay")[0].classList.remove("d-none");

            axios.get('/api/settings/etudiants/getniveau')
                .then(function (response) {

                    setNiveaux(response.data.result)

                    axios.get('/api/settings/etudiants/getgroupes')
                        .then(function (response) {

                            setGroupes(response.data.result)

                            setLoaded(true)

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
                document.getElementById('side_etudiants')?.classList.add('active')
                document.getElementById('side_parametres')?.classList.add('active')
                document.getElementById('page_title').innerHTML = 'Gestion des étudiants'
            }, 50);

        }


    });


    return (
        <>
            <div className="row">
                <div className="col"></div>
                <div className="col-4"><a className="btn btn-primary float-end" href={"../model.xlsx"}><i className="fa fa-download" aria-hidden="true"></i>Télécharger le fichier model</a></div>
                
            </div>



            <div className="row">
                <div className="col-6">
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
                </div>

                {Niveau &&
                    <div className="col-6">
                        <select className="form-select" aria-label="groupe" value={Groupe} onChange={(e) => {
                            setGroupe(e.target.value);

                            if (e.target.value) {
                                document.getElementsByClassName("overlay")[0].classList.remove("d-none");

                                axios.post("/api/settings/etudiants/getetudiants", {
                                    groupe: e.target.value
                                })
                                    .then((res) => {
                                        setEtudiants(res.data.result)
                                        document.getElementsByClassName("overlay")[0].classList.add("d-none");
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
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
                }

                {Groupe &&
                    <>
                        <div className="table-responsive mt-3" style={{ maxHeight: "40vh" }}>
                            <table className="table table-hover table-striped text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">CNE</th>
                                        <th scope="col">Nom</th>
                                        <th scope="col">Prénom</th>
                                        <th scope="col">CIN</th>
                                        <th scope="col">email</th>
                                        <th scope="col">Filière</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {Etudiants &&
                                        (Etudiants.length == 0) &&
                                        <tr>
                                            <td colSpan={7}>Aucun étudiant(e) pour le groupe {Groupes?.find(obj => { return obj.id + "" == Groupe + "" })?.libelle}</td>
                                        </tr>
                                    }

                                    {Etudiants &&
                                        Etudiants.sort((obj1, obj2) => { return (obj1.nom == obj2.nom) ? ((obj1.prenom > obj2.prenom) ? 1 : -1) : obj1.nom > obj2.nom ? 1 : -1 }).map((value, index) => {
                                            return (
                                                <tr key={value.CIN}>
                                                    <td>{value.CNE}</td>
                                                    <td>{value.nom}</td>
                                                    <td>{value.prenom}</td>
                                                    <td>{value.CIN}</td>
                                                    <td>{value.email}</td>
                                                    <td>{value.filiere}</td>
                                                    <td><button className="btn btn-outline-danger  p-2" onClick={() => {
                                                        document.getElementsByClassName("overlay")[0].classList.remove("d-none");
                                                        const data = {
                                                            CIN: value.CIN,
                                                            groupe: Groupe
                                                        }
                                                        axios.post('/api/settings/etudiants/deletudiant', data)
                                                            .then(function (response) {

                                                                if (Groupe) {
                                                                    document.getElementsByClassName("overlay")[0].classList.remove("d-none");

                                                                    axios.post("/api/settings/etudiants/getetudiants", {
                                                                        groupe: Groupe
                                                                    })
                                                                        .then((res) => {
                                                                            setEtudiants(res.data.result)
                                                                            document.getElementsByClassName("overlay")[0].classList.add("d-none");
                                                                            Swal.fire({
                                                                                title: `L'affectation de l'étudiant(e) ${response.data.deleted.nom} ${response.data.deleted.prenom} au groupe ${Groupes?.find(obj => { return obj.id + "" == Groupe + "" })?.libelle} a été annulée avec succés !`,
                                                                                icon: "success"
                                                                            });
                                                                        })
                                                                        .catch((error) => {
                                                                            console.log(error);
                                                                        });
                                                                }

                                                            })
                                                            .catch(function (error) {

                                                                document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                                Swal.fire({
                                                                    title: "Erreur!",
                                                                    text: `Veuillez réessayer ultérieurement!`,
                                                                    icon: "error"
                                                                });
                                                            });
                                                    }}><i className="fa fa-unlink"></i></button></td>
                                                </tr>
                                            )

                                        })}

                                </tbody>
                            </table>
                        </div>

                        <div {...getRootProps()} style={dropzoneStyles} className="mt-3">
                            <input {...getInputProps()} />
                            {!excelData &&
                                <p>Déposer votre fichier XLSX ici, ou cliquer ici pour sélectionner un.</p>
                            }

                            {excelData &&
                                <p>{excelData?.length} étudiant(s) sélectionné(s)</p>
                            }
                        </div>
                    </>
                }

            </div>



        </>
    )
}

const dropzoneStyles = {
    border: '2px dashed #aaa',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

export default Etudiants