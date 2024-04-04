import React, { useState,useContext } from "react";
import './login.scss'
import { useNavigate } from "react-router-dom";
import { Input, Button, Form, Spin } from "antd"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { AuthContext } from "../authcontext";


function EmailLogin() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const signIn = (values) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user = userCredential.user;
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    login();
                    navigate('/')
                }, 1000);


            })
            .catch((error) => {
                setLoading(false);
                alert("User Not Found !!!!")
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <div className="split-layout">

            <div className="left-panel">
                <img className="image" src="https://cdn.pixabay.com/photo/2021/08/25/12/45/phishing-6573326_1280.png" />
            </div>
            <div className="right-panel">


                <>
                    <Form layout='vertical'
                        onFinish={signIn}>

                        <h2 className="header">User Login</h2>

                        <div>
                            <Form.Item label="Enter Email Id" name="email" style={{ marginLeft: "25px" }}>
                                < Input placeholder="Enter Email Address" style={{ width: "300px" }} />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="Enter Password" name="password" style={{ marginLeft: "25px" }}>
                                < Input type="password" placeholder="Enter Password" style={{ width: "300px" }} />
                            </Form.Item>
                        </div>

                        <div>

                            <Button htmlType="submit" className="otpbox" loading={loading}>{loading ? 'Logging In' : 'Log In'}</Button>
                        </div>

                    </Form>
                </>
            </div>

        </div>
    )
}

export default EmailLogin;




