/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";

const Profilepic = ({ changeProfile }) => {
 
    const hiddenFileInput = useRef(null);
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")

  
    const handleClick = () => {
      hiddenFileInput.current.click();
    };
  
    const postDetails = () => {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "instaclone");
      data.append("cloud_name", "cantacloudy2");
      fetch("https://api.cloudinary.com/v1_1/cantacloudy2/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => setUrl(data.url))
        .catch((err) => console.log(err));
        console.log(url)
    };

    const postPic=()=>{
        // saving post to mongodb
        fetch("/user/uploadProfilePic",{
          method:"put",
          headers:{
            "Content-Type":"application/json",
            Authorization:"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            pic:url
          })
        })
        .then((res)=>res.json())
        .then((data)=>{
          console.log(data)
          changeProfile()
          window.location.reload()
        })
        .catch((err)=>{console.log(err)})
    }
  
    useEffect(()=>{
      if(image){
          postDetails()
      }
    },[image])
    

    useEffect(()=>{
      if(url){
        postPic()
      }
  },[url])
    
    
  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Pic</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={handleClick}
          >
            Upload photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={hiddenFileInput}
            style={{ display: "none" }}
            onChange={(e)=>{setImage(e.target.files[0])}}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button className="upload-btn" style={{ color: "#ED4956" }} onClick={()=>{
            setUrl(null);
            postPic();
          }}>
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={changeProfile}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profilepic;
