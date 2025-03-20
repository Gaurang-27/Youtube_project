
import './App.css'
import RegisterUser from './Usercontrols/RegisterUser'
import Getvideo from './Getvideos/Getvideo'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import GetvideobyId from './Getvideos/Getvideobyid';
import LoginUser from './Usercontrols/LoginUser';
import Homepage from './Homepage/Homepage';
import ChannelVideos from './ChannelPage/ChannelVideos';
import Dashboard from './Dasboard/Dashboard';
import SubscribersPage from './Dasboard/SubscribersPage';
import SubscriberCard from './Dasboard/SubscriberCard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element ={<Homepage/>}>
        <Route path='/' element = {<Getvideo/>}></Route>
        <Route path='/channel/:user_id' element={<ChannelVideos/>}></Route>
      </Route>
      <Route path='/:video_id' element ={<GetvideobyId/>}> </Route>
      <Route path='/register' element={<RegisterUser/>}></Route>
      <Route path='login' element={<LoginUser/>}></Route>
      <Route path='/account-dashboard' element={<Dashboard/>}>
        <Route index element={<SubscriberCard />} />
        <Route path='subscriber-list' element={<SubscribersPage/>}></Route>
      </Route>
      
    </>
  )
)
function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
