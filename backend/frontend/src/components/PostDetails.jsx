/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'
import '../css/PostDetails.css'

const postDetails = (item) => {
  return (
    <div>
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
                src={item?.image}
              />
            </div>
            <h5>{item?.postedBy?.username}</h5>
          </div>
          {/* comment-section */}
          <div className="comment-section"  style={{borderBottom:"1px solid #00000029"}}>
            {
              item?.comments.map((comment,index)=>{
                return (
                  <div key={index}>
                  <p className="comm">
                  <span className="commentor" style={{fontWeight:"bold"}}>{comment.postedBy.username}{""} </span>
                  <span className="comment-text">{comment.comment}</span>
            </p></div>
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
      </div>
    </div>
  )
}

export default postDetails