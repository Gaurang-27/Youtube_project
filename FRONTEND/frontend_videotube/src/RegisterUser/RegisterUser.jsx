import axios from "axios";
import { useState, useEffect} from "react";

function RegisterUser(){

    const [resp , setresp] =useState({});
    

    // useEffect(()=>{
    //     axios.post('/users/register',userdetails)
    //     .then((response) =>{
    //     setresp(response);
    //     })
    //     .catch((error) => console.log ("error", error))
    // },[])

    function handleClick(){
        axios.post('/users/register',userdetails)
        .then((response) =>{
        setresp(response.data.data);console.log(response);
        })
        .catch((error) => console.log ("error", error))
    }
    

    return(
        <div>
            <button onClick={handleClick}>send req</button>
            {resp.email}
        </div>
    )
}

export default RegisterUser