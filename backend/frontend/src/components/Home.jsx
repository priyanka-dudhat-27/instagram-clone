/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../css/Home.css";
import { Link, useNavigate } from "react-router-dom";
import {Navigate} from 'react-router-dom'
import { toast } from "react-toastify";

const Home = () => {

  var picLink = "https://cdn-icons-png.flaticon.com/128/11919/11919842.png";
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return <Navigate to="/signin"/>
    }
    fetch("/post/allposts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const toggleComments = (post) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(post);
      console.log(item);
    }
  };

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

  const makeComment = (text, id) => {
    fetch("/post/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id === id) {
            return result;
          } else {
            return post;
          }
        });
        setData(newData);
        setComment("");
        console.log(result);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="home">
      {data.map((post, index) => (
        <div key={index} className="card">
          <div className="card-header">
            <div className="card-pic">
              <img
                src={post.postedBy.photo? post.postedBy.photo:picLink}
                alt=""
              />
            </div>
            <h5>
              <Link to={`/user/${post.postedBy._id}`}>
                {post.postedBy.username}
              </Link>
            </h5>
          </div>
          <div className="card-image">
            <img src={post.image} alt="Post" />
          </div>
          <div className="card-content">
            {post.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ? (
              <span
                className="material-symbols-outlined material-symbols-outlined-red"
                onClick={() => unlikePost(post._id)}
              >
                favorite
              </span>
            ) : (
              <span
                className="material-symbols-outlined"
                onClick={() => likePost(post._id)}
              >
                favorite
              </span>
            )}
            <p>{post.likes.length} Likes</p>
            <p>{post.body}</p>
            <p
              style={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => {
                toggleComments(post);
              }}
            >
              View all Comments
            </p>
          </div>
          <div className="add-comment">
            <span className="material-symbols-outlined">
              sentiment_satisfied
            </span>
            <input
              type="text"
              placeholder="add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="comment"
              onClick={() => {
                makeComment(comment, post._id);
              }}
            >
              Post
            </button>
          </div>
        </div>
      ))}
      {show && (
        <div className="show-comments">
          <div className="container">
            <div className="post-pic">
              <img src={item.image} />
            </div>
            <div className="details">
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img src={item.image} />
                </div>
                <h5>{item.postedBy.username}</h5>
              </div>
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment, index) => {
                  return (
                    <p key={index} className="comm">
                      <span
                        className="commentor"
                        style={{ fontWeight: "bold" }}
                      >
                        {comment.postedBy.name}{" "}
                      </span>
                      <span className="comment-text">{comment.comment}</span>
                    </p>
                  );
                })}
              </div>
              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>
              <div className="add-comment">
                <span className="material-symbols-outlined">
                  sentiment_satisfied
                </span>
                <input
                  type="text"
                  placeholder="add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComments();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => {
              toggleComments();
            }}
          >
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
