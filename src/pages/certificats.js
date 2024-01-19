import axios from "axios";
import { useEffect, useState, useCallback } from "react"
import Swal from "sweetalert2";
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

const Certificats=() => {

    const [loaded, setLoaded] = useState();



    const [Certificats, setCertificats] = useState();

    const [JF, setJF] = useState();

    const [filteredJF, setFilteredJF] = useState();

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

                console.log(formattedData)
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
                cert: excelData
            }
            axios.post('/api/certificats/addcertificat', data)
                .then(function (response) {

                    Swal.fire({
                        title: `${response.data.result} certificat(s) ajoutée(s) !`,
                        icon: "success"
                    });

                    document.getElementById('btnSearch').click()

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
document.getElementById('btnSearch').click()
            
            },[JF])
    useEffect(() => {
        if (!loaded) {

            document.getElementsByClassName("overlay")[0].classList.remove("d-none");

            axios.post('/api/certificats/getjf')
                .then(function (response) {

                    document.getElementsByClassName("overlay")[0].classList.add("d-none");

                    setLoaded(true)

                    setJF(response.data.JF)

                })
                .catch(function (error) {

                    document.getElementsByClassName("overlay")[0].classList.add("d-none");

                    Swal.fire({
                        title: "Erreur!",
                        text: `Veuillez réessayer ultérieurement!`,
                        icon: "error"
                    });
                });



            setTimeout(() => {
                var nl = document.getElementsByClassName("nav-link");
                for (var i = 0; i < nl.length; i++) {
                    nl[i].classList.remove('active');
                }
                document.getElementById('side_certificats')?.classList.add('active')
                document.getElementById('page_title').innerHTML = 'Gestion des certificats'
            }, 50);

        }


    });


    return (
        <>
            

            <form onSubmit={(e) => {
                e.preventDefault()

                document.getElementsByClassName("overlay")[0].classList.remove("d-none");

                setCertificats(null)

                axios.post('/api/certificats/getcertificats', {
                    du: document.getElementById("du").value,
                    au: document.getElementById("au").value
                })
                    .then(function (response) {

                        setCertificats(response.data.result)

                        setFilteredJF(JF.filter((jf) => { return (new Date((jf.dateJF+"").split("T")[0]) >= new Date(document.getElementById("du").value) && new Date((jf.dateJF+"").split("T")[0]) <= new Date(document.getElementById("au").value)) }))

                        document.getElementsByClassName("overlay")[0].classList.add("d-none");

                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }}>
                <div className="row">
                    <div className="col-6">
                        <input type="date" className="form-control" aria-label="du" placeholder="Du" id="du" required />
                    </div>
                    <div className="col-6">
                        <input type="date" className="form-control" aria-label="au" placeholder="Au" id="au" required />
                    </div>
                </div>

                <div className="text-center mt-2">
                    <button id="btnSearch" type="submit" className="btn btn-primary">Rechercher</button>
                </div>
            </form>


            {Certificats &&
                <>
                    <div className="table-responsive mt-3" style={{ maxHeight: "40vh" }}>
                        <table className="table table-hover table-striped text-center">
                            <thead>
                                <tr>
                                    <th scope="col">CNE</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Filière</th>
                                    <th scope="col">date Consultation</th>
                                    <th scope="col">nb Jours</th>
                                    <th scope="col">date Réception</th>
                                    <th scope="col">état</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                {Certificats &&
                                    (Certificats.length == 0) &&
                                    <tr>
                                        <td colSpan={9}>Aucune certificat</td>
                                    </tr>
                                }

                                {Certificats &&
                                    Certificats.sort((obj1, obj2) => { return (obj1.nom == obj2.nom) ? ((obj1.prenom > obj2.prenom) ? 1 : -1) : obj1.nom > obj2.nom ? 1 : -1 }).map((value, index) => {
                                        return (
                                            value.certificats.map((c, ci) => {
                                                return (
                                                    <tr key={value.CIN}>
                                                        <td>{value.CNE}</td>
                                                        <td>{value.nom}</td>
                                                        <td>{value.prenom}</td>
                                                        <td>{value.filiere}</td>
                                                        <td>{(c.dtConsult + "").split("T")[0]}</td>
                                                        <td>{c.nbJour}</td>
                                                        <td>{c.dtBO.split("T")[0]}</td>
                                                        <td>{c.est_valide ? 'Valide' : 'Hors délai'}</td>
                                                        <td><button className="btn btn-outline-danger  p-2" onClick={() => {
                                                            document.getElementsByClassName("overlay")[0].classList.remove("d-none");
                                                            const data = {
                                                                id: c.id
                                                            }
                                                            axios.post('/api/certificats/delcertificat', data)
                                                                .then(function (response) {

                                                                    document.getElementById('btnSearch').click()

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
                                            }))


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
                            <p>{excelData?.length} certificat(s) sélectionnée(s)</p>
                        }
                    </div>
                    <hr />
                    <h6 style={{ color: 'rgba(0,0,0,.75)' }}>Gestion des jours feriés</h6>
                    {filteredJF &&
                        filteredJF.length > 0 &&
                        <div className="table-responsive mt-3" style={{ maxHeight: "20vh" }}>
                            <table className="table table-hover table-striped text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">Jour Ferié</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {filteredJF &&
                                        (filteredJF.length == 0) &&
                                        <tr>
                                            <td colSpan={9}>Aucun jour ferié</td>
                                        </tr>
                                    }

                                    {filteredJF &&
                                        filteredJF.sort((obj1, obj2) => { return (obj1.libelle > obj2.libelle) ? 1 : -1 }).map((jf, index) => {
                                            return (
                                                <tr key={jf.id}>
                                                    <td>{jf.libelle}</td>
                                                    <td>{(jf.dateJF + "").split("T")[0]}</td>
                                                    <td><button className="btn btn-outline-danger  p-2" onClick={() => {
                                                        document.getElementsByClassName("overlay")[0].classList.remove("d-none");
                                                        const data = {
                                                            id: jf.id
                                                        }
                                                        axios.post('/api/certificats/deljf', data)
                                                            .then(function (response) {

                                                                axios.post('/api/certificats/getjf')
                                                                    .then(function (response) {

                                                                        document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                                        setJF(response.data.JF)

                                                                    })
                                                                    .catch(function (error) {

                                                                        document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                                                        Swal.fire({
                                                                            title: "Erreur!",
                                                                            text: `Veuillez réessayer ultérieurement!`,
                                                                            icon: "error"
                                                                        });
                                                                    });

                                                                document.getElementById('btnSearch').click()

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
                                        })
                                    }




                                </tbody>
                            </table>
                        </div>
                    }

                    <form className="mt-2" onSubmit={(e) => {
                        e.preventDefault()

                        document.getElementsByClassName("overlay")[0].classList.remove("d-none");
                        const data = {
                            libelle: document.getElementById("txtlibellejf").value,
                            date: document.getElementById("txtdatejf").value
                        }
                        axios.post('/api/certificats/addjf', data)
                            .then(function (response) {
                                if(response.data.inserted)
                                Swal.fire({
                                    title: `Jour ferié ajouté !`,
                                    icon: "success"
                                });

                                axios.post('/api/certificats/getjf')
                                    .then(function (response) {

                                        document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                        setJF(response.data.JF)

                                    })
                                    .catch(function (error) {

                                        document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                        Swal.fire({
                                            title: "Erreur!",
                                            text: `Veuillez réessayer ultérieurement!`,
                                            icon: "error"
                                        });
                                    });

                                document.getElementById('btnSearch').click()

                            })
                            .catch(function (error) {

                                document.getElementsByClassName("overlay")[0].classList.add("d-none");

                                Swal.fire({
                                    title: "Erreur!",
                                    text: `Veuillez réessayer ultérieurement!`,
                                    icon: "error"
                                });
                            });
                    }}>
                        <div className="row">
                            <div className="col">
                                <input type="text" className="form-control" id="txtlibellejf" placeholder="Libellé" required autoComplete="off"/>
                            </div>

                            <div className="col">
                                <input type="date" className="form-control" id="txtdatejf" placeholder="Date" required autoComplete="off"/>
                            </div>

                            <div className="col">
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary"><i className="fa fa-save" /></button>
                                </div>

                            </div>
                        </div>
                    </form>
                </>
            }




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

export default Certificats;