/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../css/Home.css";
import { Link, useNavigate } from "react-router-dom";
import {toast} from "react-toastify"

const MyFollowingPost = () => {
  

  const [data, setData] = useState([])
  const [comment,setComment]=useState("")
  const [show,setShow] =useState(false)
  const [item,setItem]=useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
    }

    // fetching all post
    fetch("/post/myfollowingpost", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        console.log(data)
        setData(data)
      })
      .catch((error) => console.log(error));
  }, []);

  // show & hide comments
  const toggleComments=(post)=>{
    if(show){
      setShow(false)
    }else{
      setShow(true)
      setItem(post)
      console.log(item)
    }
  }

  // likepost
const likePost = (id) => {
  fetch("/post/like", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
    body: JSON.stringify({
      postId: id,
    }),
  })
    .then((res) => res.json())
    .then((updatedPost) => {
      setData((prevData) =>
        prevData.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    })
    .catch((err) => console.log(err));
};

// unlikepost
const unlikePost = (id) => {
  fetch("/post/unlike", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
    body: JSON.stringify({
      postId: id,
    }),
  })
    .then((res) => res.json())
    .then((updatedPost) => {
      setData((prevData) =>
        prevData.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    })
    .catch((err) => console.log(err));
};


// function to make comment
const makeComment = (text,id) => {
  fetch("/post/comment", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
    body: JSON.stringify({
      text:text,
      postId: id,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      const newData=data.map((post)=>{
        if(post._id===id){
          return result
        }else{
          return post
        }
      })
      setData(newData)
      setComment("")
        console.log(result)        
    })
    .catch((err) => console.log(err));
};
  return (
    <div className="home">
      {/* card */}
      {data.map((post, index) => (
        <div key={index} className="card">
          {/* card-header */}
          <div className="card-header">
            <div className="card-pic">
              <img
                src="https://media.istockphoto.com/id/1496615764/photo/cheerful-young-woman-with-eyeglasses-smiling-and-looking-at-camera.webp?b=1&s=170667a&w=0&k=20&c=6lBkFoVEGPrC87iy4zNldvnCUPFY3ta1MGxmHyTJzIA="
                alt=""
              />
            </div>
            <h5>
              <Link to={`/user/${post.postedBy._id}`}>
                 {post.postedBy.username}
              </Link>
            </h5>
          </div>
          {/* card-image */}
          <div className="card-image">
            <img src={post.image} alt="Post" />
          </div>
          {/* card content */}
          <div className="card-content">
            {
              post.likes.includes(JSON.parse(localStorage.getItem("user"))._id)?(<span className="material-symbols-outlined material-symbols-outlined-red" onClick={()=>unlikePost(post._id)}>favorite</span>
            ):(<span className="material-symbols-outlined" onClick={()=>likePost(post._id)}>favorite</span>
          )
            }
            <p>{post.likes.length} Likes</p>
            <p>{post.body}</p>
            <p style={{fontWeight:"bold",cursor:"pointer"}} onClick={()=>{toggleComments(post)}}>View all Comments</p>
          </div>
          {/* add_comment */}
          <div className="add-comment">
            <span className="material-symbols-outlined">
              sentiment_satisfied
            </span>
            <input type="text" placeholder="add a comment" value={comment} onChange={(e)=>setComment(e.target.value)} />
            <button className="comment" onClick={()=>{makeComment(comment,post._id)}}>Post</button>
          </div>
        </div>
      ))}
      {/* show comments */}
      { show &&(
        <div className="show-comments">
        <div className="container">
          <div className="post-pic">
            <img src={item.image} />
          </div>
          <div className="details">
             {/* card-header */}
          <div className="card-header" style={{borderBottom:"1px solid #00000029"}}>
            <div className="card-pic">
              <img
                src={item.image}
              />
            </div>
            <h5>{item.postedBy.username}</h5>
          </div>
          {/* comment-section */}
          <div className="comment-section"  style={{borderBottom:"1px solid #00000029"}}>
            {
              item.comments.map((comment)=>{
                return (
                  <>
                  <p className="comm">
                  <span className="commentor" style={{fontWeight:"bold"}}>{comment.postedBy.name}{""} </span>
                  <span className="comment-text">{comment.comment}</span>
            </p></>
                )
              })
            }
           
          </div>
            {/* card content */}
          <div className="card-content">
            <p>{item.likes.length} Likes</p>
            <p>{item.body}</p>
          </div>
           {/* add_comment */}
           <div className="add-comment">
            <span className="material-symbols-outlined">
              sentiment_satisfied
            </span>
            <input type="text" placeholder="add a comment" value={comment} onChange={(e)=>setComment(e.target.value)} />
            <button className="comment" onClick={()=>{
              makeComment(comment,item._id)
              toggleComments()
            }}>Post</button>
          </div>
          </div>
        </div>
        <div className="close-comment" onClick={()=>{toggleComments()}}>
        <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
        </div>
      </div>)
      }
    </div>
  );
};

export default MyFollowingPost;
