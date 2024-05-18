/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import Profilepic from './Profilepic'

/* eslint-disable react/jsx-no-undef */
const Profile = () => {
  var picLink = "https://cdn-icons-png.flaticon.com/128/11919/11919842.png";
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [changepic, setChangepic] = useState(false);
  const [user, setUser] = useState("");

  const changeProfile = () => {
    setChangepic(!changepic);
  };

  const toggleComments = (posts) => {
    setShow(!show);
    setPosts(posts);
  };

  useEffect(() => {
    fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.postData);
        setUser(data.userData);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="profile">
      {/* profile-frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img
            onClick={changeProfile}
            src={user.photo ? user.photo : picLink}
            alt=""
          />
        </div>
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info">
            <p>{data ? data.length : "0"} posts</p>
            <p>{user ? user.followers.length : "0"} followers</p>
            <p>{user ? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />
      {/* gallery */}
      <div className="gallery">
        {data.map((pics) => (
          <img key={pics._id} src={pics.image} alt="" className="gallery-image" onClick={() => { toggleComments(pics) }} />
        ))}
      </div>
      {changepic && <Profilepic changeProfile={changeProfile} />}
    </div>
  );
};

export default Profile;
