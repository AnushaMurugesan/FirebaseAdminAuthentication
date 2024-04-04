import React, { useState, useEffect } from "react";
import './userlist.scss'
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged, getAuth } from "firebase/auth"
import { Button, Input, InputNumber, Modal, Form, DatePicker, Table, Upload, message, Popconfirm } from "antd";
import { UploadOutlined, EyeInvisibleOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getFirestore, onSnapshot, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import moment from "moment";
import { auth, storage } from "../FirebaseConfig";
import { uploadBytes, ref, getDownloadURL, deleteObject, getMetadata } from "firebase/storage";

function Emailverify() {

    const [ismodalOpen, setIsmodalOpen] = useState(false)
    const [emplist, setEmplist] = useState([])
    const [page, setPage] = useState(2)
    const [isButtondisable, setIsButtondisable] = useState(true)
    const [image, setImage] = useState(null)
    const [editimg, setEditimg] = useState("")
    const [form] = Form.useForm();
    const [title, setTitle] = useState("")
    const [profile, setProfile] = useState("")
    const [loading, setLoading] = useState(false)
    const [isEditModal, setIsEditModal] = useState(false)
    const [edit, setEdit] = useState(null)
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const columns = [
        {
            title: "Name",
            dataIndex: "firstname",
            editable: true,
            render: (text, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="circular-image">
                        <img className="circular-image-inner" src={record.image || "https://www.w3schools.com/howto/img_avatar.png"} />
                    </div>
                    <div style={{ marginLeft: "28px" }}>{record.firstname} {record.lastname}
                    </div>
                </div>
            ),
        },
        {
            title: "Email Id",
            dataIndex: "email",

        },
        {
            title: "Age",
            dataIndex: "age",

        },
        {
            title: "Date Of Birth",
            dataIndex: "dob",

        },
        {
            title: "Phone Number",
            dataIndex: "phonenumber",

        },
        {
            title: "District",
            dataIndex: "district",

        },
        {
            title: 'Actions',
            dataIndex: 'Actions',
            render: (values, record) => {
                return (
                    <div>
                        <EditOutlined onClick={(e) => { edituser(values, record, e) }} style={{ color: 'blue' }} />
                        <DeleteOutlined onClick={(e) => deluser(record, e)} style={{ color: 'red', marginLeft: 12 }} />
                    </div>
                );
            },
        },
    ]

    const adduser = () => {
        setIsmodalOpen(true)
        setPage(2)
        // form.resetFields()
    }

    const modalcancel = () => {
        setIsmodalOpen(false)
        setIsButtondisable(true)
        form.resetFields()
    }

    const onCancel = () => {
        setIsmodalOpen(false)
        form.resetFields()
    }

    const prepage = () => {
        setPage(2)
    }

    const signout = async () => {
        try {
            await signOut(auth)
            navigate("/login");
            alert("Successfully Logged Out !! Please Login ")
        }
        catch (err) {
            console.log(err)
        }
    }

    const checkField = () => {
        const value = form.getFieldValue();
        setIsButtondisable(!value.firstname || !value.lastname || !value.email || !value.password || !value.confirmpassword);
    };


    const edituser = async (values, record, e) => {
        e.stopPropagation();
        let imgobj =
        {
            uid: '-1',
            status: 'done',
            url: record.image || "https://www.w3schools.com/howto/img_avatar.png",
        }
        setEditimg(record.image ? [imgobj] : null)
        setIsEditModal(true)
        form.setFieldsValue({
            id: record.id,
            firstname: record.firstname,
            lastname: record.lastname,
            age: record.age,
            dob: moment(record.dob),
            phonenumber: record.phonenumber,
            district: record.district,

        })
        console.log("record", record)
    }

    const deluser = async (record, e) => {
        e.stopPropagation();
        const userdoc = doc(db, "employees", record.id)
        await deleteDoc(userdoc);
    }


    // const defaultimage = "https://www.w3schools.com/howto/img_avatar.png";

    const handleRemove = async (file) => {
        setIsEditing(true);
        const storageRef = ref(storage, file.url);
        try {
            await deleteObject(storageRef);
            setEditimg(null);
            message.success('File deleted successfully.');
            console.log('File deleted successfully.');


        } catch (error) {
           console.log(error , "error")
        }
    };


    const handleChange = ({ fileList: editimg }) => {
        setEditimg(editimg)
    }


    const onFinishEdit = async (values) => {
        console.log("values", values)
        const age = parseInt(values.age)
        const phonenumber = parseInt(values.phonenumber)
        const timestamp = new Date(values.dob)


        let editimageUrl = "";
        if (editimg) {

            const storageRef = ref(storage, `Images/${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            editimageUrl = await getDownloadURL(storageRef);
            console.log(editimageUrl, "url")
        }
        setLoading(true)
        setIsEditModal(false)
        try {
            const docRef = await updateDoc(doc(db, 'employees', values.id), {
                firstname: values.firstname,
                lastname: values.lastname,
                age: age,
                dob: timestamp,
                phonenumber: phonenumber,
                image: editimageUrl,
                district: values.district,

            });
            message.success('Details uploaded successfully!');
        }
        catch (error) {
            console.log(error)
        }
    };

    const onFinish = async (values) => {
        const age = parseInt(values.age)
        const phonenumber = parseInt(values.phonenumber)
        const timestamp = new Date(values.dob)
        setLoading(true)
        try {
            const mail = await createUserWithEmailAndPassword(auth, values.email, values.confirmpassword)
                .then(async (userCredential) => {

                    let imageUrl = "";
                    if (image) {

                        const storageRef = ref(storage, `Images/${image.name}`);
                        const snapshot = await uploadBytes(storageRef, image);
                        imageUrl = await getDownloadURL(storageRef);
                        console.log(imageUrl, "url")
                    }
                    try {
                        const user = userCredential.user;
                        const docRef = await setDoc(doc(db, 'employees', user.uid), {
                            firstname: values.firstname,
                            lastname: values.lastname,
                            email: values.email,
                            confirmpassword: values.confirmpassword,
                            age: age,
                            dob: timestamp,
                            phonenumber: phonenumber,
                            image: imageUrl,
                            state: values.state,
                            district: values.district,
                        });
                        setTimeout(() => {
                            setLoading(false);
                        }, 2000);
                    }
                    catch (error) {
                        message.error('Error uploading in Firebase.');
                    }
                    message.success('Details uploaded successfully!');
                    fetchData();
                    form.resetFields();
                    setLoading(true)
                    setIsmodalOpen(false)
                })

        }
        catch (error) {
            message.error('Error uploading Details');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const db = getFirestore()
        const addlist = collection(db, "employees")
        const display = onAuthStateChanged(auth, (user) => {
            if (user) {
                const currentuser = user;
                const Ref = doc(db, "employees", currentuser.uid)
                const docref = getDoc(Ref)
                docref.then((doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        const dataname = data.firstname;
                        setTitle(dataname)
                        const dataimg = data.image;
                        setProfile(dataimg)
                    }
                })
                onSnapshot(addlist, (snapshot) => {
                    const newData = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const jsDate = data.dob ? data.dob.toDate() : new Date();
                        const dateString = jsDate?.toLocaleDateString();
                        return { id: doc.id, ...data, dob: dateString }
                    });
                    setEmplist(newData);
                });
            }
        })
        return () => display();
    }

    return (
        <div>
            <div className="formheader">
                <div>
                    <h1 className="formheading">Employee Lists</h1>
                </div>
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", marginRight: "20px" }} >
                    <h1>Login as {title}!</h1>
                    <img src={profile || "https://www.w3schools.com/howto/img_avatar.png"} style={{ width: '50px', height: '50px', borderRadius: "50%", marginLeft: "25px", objectFit: "cover", overflow: "hidden" }} />
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "20px", marginBottom: "20px" }}>
                <Button className="createbtn" onClick={adduser}> Create Form </Button>
                <Button className="signoutbtn" onClick={signout}>Sign Out</Button>
            </div>

            <Modal
                width={720}
                title={<h2 className="title">{page === 2 ? 'New Job Post(1/2)' : 'New Job Post(2/2)'}</h2>}
                centered
                onCancel={modalcancel}
                footer={null}
                open={ismodalOpen}
                bodyStyle={{ maxHeight: "75vh", overflowY: 'scroll' }}
            >

                <Form
                    layout='vertical'
                    form={form}
                    onFinish={onFinish}
                    style={{ height: "75vh" }}
                >

                    <div style={{ position: 'relative' }}>

                        <div className="page1" style={{ position: "absolute", top: 0, zIndex: page == 1 ? -1 : 0, width: '100%' }}>
                            <div className="two-section">
                                <Form.Item label="First Name" name="firstname"
                                    hasFeedback
                                    rules={[{
                                        required: true,
                                        pattern: "^[A-Za-z]+$",
                                        message: 'Please enter Valid Name'
                                    }
                                    ]}>
                                    <Input onChange={() => checkField('firstname')} placeholder="Enter your First Name" style={{ width: "320px", borderRadius: "0px" }}
                                    />
                                </Form.Item>

                                <Form.Item label="Last Name" name="lastname"
                                    hasFeedback
                                // rules={[{
                                //     required: true,
                                //     pattern: "^[A-Za-z]+$",
                                //     message: 'Please enter Valid Name'
                                // }
                                // ]}

                                >
                                    <Input onChange={() => checkField('lastname')} placeholder="Enter your First Name" style={{ width: "320px", borderRadius: "0px" }} />
                                </Form.Item>
                            </div>

                            <Form.Item label="Email Id" name="email"
                                hasFeedback
                                rules={[{
                                    required: true,
                                    pattern: /^[a-z0-9]+@gmail\.com$/,
                                    message: 'Please enter Valid Email'
                                }
                                ]}>
                                <Input onChange={() => checkField('email')} placeholder="Enter your Email Id" style={{ borderRadius: "0px" }}
                                />
                            </Form.Item>

                            <Form.Item label="Password" name="password"
                                hasFeedback
                            // rules={[{
                            //     required: true,
                            //     pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            //     message: 'Please enter Valid Email'
                            // }
                            // ]}s
                            >
                                <Input.Password
                                    onChange={() => checkField('password')}
                                    style={{ borderRadius: "0px" }}
                                    placeholder="Enter your Password"
                                    iconRender={(visible) =>
                                        visible ? <EyeOutlined style={{ fontSize: "18px" }} /> : <EyeInvisibleOutlined style={{ fontSize: "18px" }} />
                                    }
                                />
                            </Form.Item>

                            <Form.Item label="Confirm Password" name="confirmpassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter Correct Password'
                                    },

                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                "Enter Correct Password"
                                            );
                                        }
                                    })
                                ]}
                                hasFeedback
                            >
                                <Input.Password onChange={() => checkField('confirmpassword')} type="password" style={{ borderRadius: "0px" }} placeholder="Confirm your Password"
                                    iconRender={(visible) =>
                                        visible ? <EyeOutlined style={{ fontSize: "18px" }} /> : <EyeInvisibleOutlined style={{ fontSize: "18px" }} />
                                    } />
                            </Form.Item>
                            <div className='footer'>
                                < Button className="prev" onClick={onCancel}>Cancel</Button>
                                <Button className="next" onClick={() => setPage(1)} disabled={isButtondisable}> Next</Button>
                            </div>
                        </div>

                        < div className="page2" style={{ position: "absolute", top: 0, zIndex: page == 2 ? -1 : 0, width: '100%' }}>

                            <div className="two-section">
                                <Form.Item label="Age" name="age" style={{ width: "300px" }}
                                    hasFeedback
                                    rules={[{
                                        required: true,
                                        pattern: /^(?!0[0-9]|3[6-9]|[4-9][0-9]|35$)[1-9][0-9]$/,
                                        message: 'Please enter Valid Email'
                                    }]}
                                >
                                    <Input placeholder="Enter your Age" style={{ borderRadius: "0px" }}
                                    />
                                </Form.Item>

                                <Form.Item label="Date Of Birth" name="dob"
                                    hasFeedback
                                    rules={[{
                                        required: true,
                                        message: 'Please enter Date of Birth'
                                    }]}
                                >
                                    < DatePicker placeholder="Select your DOB" style={{ width: "300px", borderRadius: "0" }}
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item label="Phone Number" name="phonenumber"
                                hasFeedback
                                rules={[{
                                    required: true,
                                    pattern: /^[1-9]\d{9}$/,
                                    message: 'Please enter Valid Number'
                                }]} >
                                <Input placeholder="Enter your Phone Number" style={{ borderRadius: "0px" }}
                                />
                            </Form.Item>

                            <Form.Item label="Profile Picture" name="image" valuePropName="fileList" style={{ borderRadius: "0" }}
                                getValueFromEvent={(e) => e.fileList}>

                                <Upload
                                    style={{ borderRadius: "0px", height: "20px", width: "40px" }}
                                    name="image"
                                    beforeUpload={(file) => {
                                        setImage(file)
                                        return false
                                    }}
                                    listType="picture"
                                    maxCount={1}
                                    showUploadList={{ showRemoveIcon: true }}


                                >
                                    <Button style={{ borderRadius: "0px" }} icon={<UploadOutlined />}>Upload Profile</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item label="State" name="state"
                                hasFeedback
                                rules={[{
                                    required: true,
                                    pattern: /^[A-Za-z]+$/,
                                    message: 'Please enter Valid State'
                                }]}
                            >
                                <Input placeholder="Enter your State" style={{ borderRadius: "0px" }}
                                />
                            </Form.Item>

                            <Form.Item label="District" name="district"
                                hasFeedback
                                rules={[{
                                    required: true,
                                    pattern: /^[A-Za-z]+$/,
                                    message: 'Please enter Valid District'
                                }]}>
                                <Input placeholder="Enter your District" style={{ borderRadius: "0px" }}
                                />
                            </Form.Item>
                            <div className='footer'>
                                <Button className="prev" onClick={prepage}>Back</Button>
                                <Button className="next" htmlType="submit" loading={loading}> Submit</Button>
                            </div>

                        </div>
                    </div>

                </Form>
            </Modal>
            <div>

                <Table
                    width={1800}
                    bordered
                    dataSource={emplist}
                    columns={columns}
                    // rowClassName="editable-row"
                    pagination={false}
                    onRow={(record, index) => ({
                        onClick: (e) => {
                            navigate(`/empdetails/${record.id}`);

                        }
                    })}
                >
                </Table>

                <Modal
                    width={720}
                    centered
                    title={<h3 className="title">Edit Employee Details</h3>}
                    open={isEditModal}
                    footer={null}
                    okText="Edit"
                    bodyStyle={{ maxHeight: "72vh", overflow: 'scroll' }}
                    onCancel={() => {
                        setIsEditModal(false)
                    }}
                    onOk={() => {
                        setIsEditModal(false)
                    }}
                >
                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={onFinishEdit}
                        style={{ height: "75vh" }}
                    >

                        <div className="two-section">
                            <Form.Item label="First Name" name="firstname">
                                <Input placeholder="Enter your First Name" style={{ width: "310px" }} value={edit?.firstname} onChange={(e) => {
                                    setEdit(pre => {
                                        return { ...pre, firstname: e.target.value }
                                    })
                                }}
                                />
                            </Form.Item>

                            <Form.Item label="Last Name" name="lastname" >
                                <Input placeholder="Enter your Last Name" style={{ width: "310px" }} value={edit?.lastname} onChange={(e) => {
                                    setEdit(pre => {
                                        return { ...pre, lastname: e.target.value }
                                    })
                                }}
                                />
                            </Form.Item>
                        </div>

                        <div className="two-section">
                            <Form.Item label="Age" name="age">
                                <Input placeholder="Enter your Age" style={{ width: "310px" }}
                                />
                            </Form.Item>

                            <Form.Item label="Date of Birth" name="dob">

                                <DatePicker placeholder="Select your Date" style={{ width: "310px" }} />

                            </Form.Item>
                        </div>


                        <Form.Item label="Profile Picture" name="image" valuePropName="fileList" style={{ borderRadius: "0" }}
                            getValueFromEvent={(e) => e.fileList}>

                            <div>
                                {editimg 
                                    ? (
                                        < div >
                                            <Upload 
                                                style={{ borderRadius: "0px", height: "20px", width: "40px" }}
                                                fileList={editimg}
                                                name="image"
                                                maxCount={1}
                                                onRemove={handleRemove}
                                                beforeUpload={(file) => {
                                                    setImage(file)
                                                    return false
                                                }}
                                                listType="picture-circle"
                                            >
                                            </Upload>
                                        </div>
                                    ) : (

                                        <div>
                                            <Upload
                                                fileList={[]}
                                                onChange={handleChange}
                                                listType="picture-circle"
                                                maxCount={1}
                                                beforeUpload={(file) => {
                                                    setImage(file)
                                                    return false
                                                }}
                                            >
                                                <EditOutlined />

                                            </Upload>
                                        </div>
                                    )
                                }
                            </div>
                        </Form.Item>

                        <Form.Item label="Id" name="id" style={{ display: "none" }}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Phone Number" name="phonenumber">
                            <Input placeholder="Enter your PhoneNumber" />
                        </Form.Item>

                        <Form.Item label="District" name="district" >
                            <Input placeholder="Enter your District"
                            />
                        </Form.Item>

                        <div className="footer">
                            <Button className="prev" > Cancel</Button>
                            <Button className="next" htmlType="submit" >Edit</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </div >
    )
}
export default Emailverify;
