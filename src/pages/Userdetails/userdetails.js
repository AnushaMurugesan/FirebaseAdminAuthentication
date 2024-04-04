import React, { useState, useEffect } from "react";
import './userdetails.scss'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Button } from "antd";
import { HeartOutlined, TwitterOutlined, YoutubeOutlined, InstagramOutlined, GoogleOutlined, AmazonOutlined, LeftCircleOutlined } from "@ant-design/icons"
import { getDoc, doc, getFirestore } from "firebase/firestore";

const Emaildetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detailsList, setDetailsList] = useState([])


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const db = getFirestore();
    const docRef = doc(db, `employees`, id)
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      const doc = userDoc.data();
      const jsDate = doc.dob ? doc.dob.toDate() : new Date();
      const dateString = jsDate?.toLocaleDateString();
      setDetailsList({
        firstname: doc.firstname,
        age: doc.age,
        dob: dateString,
        phonenumber: doc.phonenumber,
        image: doc.image,
      })
    }
    else {
      console.log("User Not found")
    }

  };
  return (
    <div>
      <div className="det-header ">
        < Button className="backbtn" onClick={() => navigate("/")}>Back</Button>
        <div className="det-heading">{detailsList.firstname}'s Details Page</div>
      </div>

      <div className="body-div">
        <LeftCircleOutlined onClick={() => navigate("/")} style={{ marginBottom: "32.5rem", color: " #102738", marginLeft: "1rem", fontSize: "2rem" }} />

        <div className="box">
          <div className="div-division">
            <div className="triangle">

            </div>

            <div className="overlay-container">
              <div className="overlay-text">{detailsList.firstname}</div>
            </div>


            <div className="right-div">
              <div className="right-content">

                <div className="content">
                  <div>
                    <h3 className="div-header">EMPLOYEE DETAILS</h3>
                  </div>
                  <div className="div-content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </div>

                  <div className="icon-content">
                    <InstagramOutlined style={{ fontSize: "1.2rem", color: " #85D6BF" }} />
                    <GoogleOutlined style={{ marginLeft: "1rem", fontSize: "1.2rem", color: " #85D6BF" }} />
                    <AmazonOutlined style={{ marginLeft: "1rem", fontSize: "1.2rem", color: " #85D6BF" }} />
                  </div>


                </div>
                <div className="lower-content">
                  <div className="content-box">LIKE</div>
                  <div className="content-box" style={{ marginTop: "1rem" }}>FOLLOW</div>
                </div>
              </div>
            </div>
            <div className="side-div">

              <div className="side-icons">

                <div style={{ display: "flex", flexDirection: "column" }} >
                  <HeartOutlined style={{ fontSize: "2rem", marginTop: "1rem", color: "#85D6BF" }} />
                  <div className="vertical-line"></div>
                </div>


                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <TwitterOutlined style={{ fontSize: "2rem", marginTop: "18rem", fontWeight: 0, color: "#85D6BF" }} />
                  <div className="line"></div>
                  <YoutubeOutlined style={{ fontSize: "2rem", marginTop: "1.5rem", color: "#85D6BF" }} />
                </div>

              </div>
              <div className="img-div">
                <img src={detailsList.image || "https://www.w3schools.com/howto/img_avatar.png"} style={{ width: "24rem", height: "20rem", objectFit: "cover" }} />
                <div className="bottom-div">

                  <div>
                    <h1 >AGE</h1>
                    <h2 style={{ color: " #85D6BF" }}>{detailsList.age}</h2>
                  </div>

                  <div class="verti-line"></div>

                  <div>
                    <h1>DOB</h1>
                    <h2 style={{ color: " #85D6BF" }}>{detailsList.dob}</h2>
                  </div>
                  <div class="verti-line"></div>

                  <div>
                    <h1>CALL</h1>
                    <h2 style={{ color: " #85D6BF" }}>{detailsList.phonenumber}</h2>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>

        <div className="lower-div">

        </div>

      </div>
    </div>
  );
}

export default Emaildetails;



