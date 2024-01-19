import Head from "next/head";

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home(props) {

  
  const [dept, setDept] = useState()

  useEffect(()=>{
    axios.get('/api/hello')
      .then(function (response) {

        setDept(response.data.result)

      })
      .catch(function (error) {
        console.log(error);
      });
setTimeout(() => {
  var nl=document.getElementsByClassName("nav-link");
    for (var i = 0; i < nl.length; i++) {
        nl[i].classList.remove('active');
    }
    document.getElementById('side_index').classList.add('active')
    document.getElementById('page_title').innerHTML='Index'
}, 50);
    
      },[]);

  return (
    <table className="table table-hover align-items-center mb-0">

      <thead className="bg-gray-100">
        <tr>
          <th className="text-secondary text-xs font-weight-semibold opacity-7">id</th>
          <th className="text-secondary text-xs font-weight-semibold opacity-7 ps-2">Niveau</th>
        </tr>
      </thead>

      <tbody>
        {
        dept&&
        dept.map((item, index) => {
          return(<tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.libelle}</td>
            </tr>)
            
        })
      }

      </tbody>


    </table>

  )
}

