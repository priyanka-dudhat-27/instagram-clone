/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../css/Profile.css";
import PostDetails from "./PostDetails";
import { useParams } from "react-router-dom";
const UserProfile = () => {
  // const [data,setData]=useState([])
  var picLink = "https://cdn-icons-png.flaticon.com/128/11919/11919842.png";
  const { userid } = useParams();
  console.log(userid);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const[isFollow,setIsFollow]=useState(false);

  //   const toggleComments=(posts)=>{
  //     if(show){
  //       setShow(false)
  //     }else{
  //       setShow(true)
  //       setPosts(posts)
  //     }
  //   }

  const followUser=(userId)=>{
    fetch("/user/follow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        followId:userId
      })
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data,'user follow successfully')
      setIsFollow(true)
    })
    .catch((err)=>console.log(err))
  }

  // tounfollow user
  const unfollowUser=(userId)=>{
    fetch("/user/unfollow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        followId:userId
      })
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data,'user follow successfully')
      setIsFollow(false)
    })
    .catch((err)=>console.log(err))
  }

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result:",result);
        setUser(result.userData);
        setPosts(result.postData);
        if(result.userData.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
          setIsFollow(true)
        }
      })
  }, [isFollow]);

  return (
    <div className="profile">
      {/* profile-frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img
            src={user.photo ? user.photo : picLink}
            alt=""
          />
        </div>
        <div className="profile-data">
          <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
            <h1>{user.name}</h1>
            <button className="followBtn" onClick={()=>{
              if(isFollow){
              unfollowUser(user._id)
            }else{
            followUser(user._id)}}}>
              {isFollow?"Unfollow":"follow"}
            </button>
          </div>
          <div className="profile-info">
            <p>{posts.length} posts</p>
            <p>{user.followers ? user.followers.length:"0"} folowwers</p>
            <p>{user.following?user.following.length:"0"} following</p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />
      {/* gallery */}
      <div className="gallery">
        {posts.map((pics) => {
          return (
            <img
              key={pics._id}
              src={pics.image}
              alt=""
              className="gallery-image"
            />
          );
        })}
      </div>
      {/* {
        show && <PostDetails  item={posts}/>
      } */}
    </div>
  );
};

export default UserProfile;
