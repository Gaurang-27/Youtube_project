import Header from "./Header";
import Getvideo from "../Getvideos/Getvideo";
import { NavLink, Outlet } from "react-router-dom";


const Homepage = function(){
    return(
        <>
        <Header></Header>
        <Getvideo></Getvideo>
        </>
    )
}

export default Homepage
