import { useState, useEffect } from "react";
import { NavLink , useLocation, useParams} from "react-router-dom";
import axios from "axios";
import SubscribeButton from "../Usercontrols/SubscribeButton";



const GetvideobyId = function({title,description,video_url}){
    const location = useLocation();
    const [video, setvideo] = useState(location.state || null);
    //console.log("video is" ,video)
    const [error, setError] = useState(null);
    const {video_id} = useParams();
    const [channel , setChannel] = useState(null)



    useEffect(() => {
        if(video==null){
            const fetchData = async () => {
                try {
                    console.log(video_id);
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/videos/videoid/${video_id}`);

                    //console.log(response.data.statusCode)
                    setvideo(response.data.statusCode)
                } catch (err) {
                    console.log(err)
                    setError(err.message);
                }
            };
    
            fetchData();
        }
        const getUserData = async function(){
            try {
                const result = await axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/subs/subscriber-list/${video.user_id}`)
                console.log(result.data.statusCode);
                setChannel(result.data.statusCode)
            } catch (err) {
                console.log(err)
            }
        }
        getUserData();
    }, [video]);

    

    if(error) return <p>{error}</p>
    if(!video || !channel) return <p>loading...</p>

    return (
        <div>
            <video src={video.video_url} controls autoPlay type="video/mp4"></video>
            <h2>{video.title}</h2>
            <p>{video.description}</p>
            <p>Channel Name : {channel.user_fullName}</p>
            <p>Number of Subscribers : {channel.subscribers.length}</p>
            <SubscribeButton channel_id={channel.user_id}/>
        </div>
    )
}


export default GetvideobyId;