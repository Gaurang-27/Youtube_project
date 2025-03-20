import Header from "./Header";
import Getvideo from "../Getvideos/Getvideo";
import { NavLink, Outlet } from "react-router-dom";
import SubsBar from "./SubsBar";


const Homepage = function(){
    return(
        <>
        <Header></Header>
        <Outlet/>
        <SubsBar/>
        </>
    )
}

export default Homepage
