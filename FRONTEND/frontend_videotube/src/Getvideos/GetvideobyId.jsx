import { useState, useEffect } from "react";
import { NavLink , useParams} from "react-router-dom";
import axios from "axios";



const GetvideobyId = function(){

    const [video, setvideo] = useState(null);
    const [error, setError] = useState(null);
    const {video_id} = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(video_id)
                const response = await axios.get(`/videos/videoid/${video_id}`);
                console.log(response)
                setvideo(response.data.statusCode.video_url)
            } catch (err) {
                console.log(err)
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    if(error) return <p>{error}</p>

    return (
        <div>
            <video src={video} controls autoPlay type="video/mp4"></video>
        </div>
    )
}


export default GetvideobyId;