/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState ,useEffect} from "react";
import "../css/CreatePost.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url,setUrl]=useState("");

  const navigate=useNavigate();
  const notyfyA = (message) => {
    toast.error(message);
  };
  const notyfyB = (message) => {
    toast.success(message);
  };

  // saving post to database
  useEffect(() => {
    if(url){
       // saving post to mongodb
    fetch("/post/createPost",{
      method:"post",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        body:body,
        image:url
      })
    })
    .then((res)=>res.json())
    .then((data)=>{
      if(data.error){
        notyfyA(data.error)
      }else{
        notyfyB(data.message)
        navigate("/")
      }
    })
    .catch((err)=>{console.log(err)})
    }
  },[url])
  // posting image to cloudinary
  const postDetails=()=>{
    const data=new FormData();
    data.append("file",image)
    data.append("upload_preset","instaclone")
    data.append("cloud_name","cantacloudy2")
    fetch("https://api.cloudinary.com/v1_1/cantacloudy2/image/upload",{
      method:"post",
      body:data
    })
    .then((res)=>res.json())
    .then((data)=>setUrl(data.url))
    .catch((err)=>console.log(err))
  }

  // preview
  const loadfile = function (event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }
  };

  return (
    <div className="createpost">
      {/* header */}
      <div className="post-header">
        <h4>Create a New Post</h4>
        <button className="post-btn" onClick={()=>{postDetails()}}>
          Share
        </button>
      </div>
      <div className="main-div">
        <img
          id="output"
          src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-256.png"
          alt="Preview"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            loadfile(event)
            setImage(event.target.files[0])
          }}
        />
      </div>
      <div className="details">
        <div className="card-header">
          <div className="card-pic">
            <img
              src="https://tse1.mm.bing.net/th?id=OIP.y-nGyqT5AwES8oqp344z4gHaHa&pid=Api&P=0&h=180"
              alt=""
            />
          </div>
          <h5>Pia Dudhat</h5>
        </div>
        <textarea
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a Caption..."
        ></textarea>
      </div>
    </div>
  );
};

export default CreatePost;
