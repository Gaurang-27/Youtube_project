
import './App.css'
import RegisterUser from './Usercontrols/RegisterUser'
import Getvideo from './Getvideos/Getvideo'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import GetvideobyId from './Getvideos/Getvideobyid';
import LoginUser from './Usercontrols/LoginUser';
import Homepage from './Homepage/Homepage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element ={<Homepage/>}></Route>
      <Route path='/:video_id' element ={<GetvideobyId/>}> </Route>
      <Route path='/register' element={<RegisterUser/>}></Route>
      <Route path='login' element={<LoginUser/>}></Route>
    </>
  )
)
function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
