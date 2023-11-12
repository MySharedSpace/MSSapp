import React, { useState, useEffect, useRef } from "react";
import { CartesianAxis, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import axios from 'axios'
import user_logo from '../../../auth/login/assets/imgs/account_circle.svg';
import password_logo from '../../../auth/login/assets/imgs/lock.svg'
import add_logo from '../dash_icons/add_circle.svg'
import profile_logo from '../dash_icons/profile_logo.svg'
import { ToastContainer,toast } from "react-toastify";
import global from "../../../../../global";

function Profile() {
    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }

    useEffect(() => {
        //auth_status()
        initialize_cloudinary()
        get_profile_data()
    }, [])

    const [first_name, set_first_name] = useState('')
    const [last_name, set_last_name] = useState('')
    const [username, set_usename] = useState('')
    const [photo_url, set_photo_url] = useState('')
    const [DOB, set_DOB] = useState('')
    const [phone, set_phone] = useState('')
    const [profile_pic, set_profile_pic] = useState('')

    function auth_status() {
        var post_url = global.backend_server+'/admin/dashboard_data'
        var data = { 'code': 101 }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                } else {
                    toast.warning('Please log in')
                    nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }


    function initialize_cloudinary() {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({ cloudName: 'ddngewkt3', uploadPreset: 'fk26s1mi' }, function (error, result) { upload_state_handler(error, result) })
        console.log(cloudinaryRef.current)
    }

    function upload_state_handler(error, result) {
        if (!error && result['event'] === 'success') {
            console.log(result)
            var url = result['info']['url']
            console.log(url)
            set_profile_pic(url)
            update_profile_pic(url)
        }
    }


    function get_profile_data() {
        var post_url = global.backend_server+'/client/profile_data'
        var data = { 'code': 101 }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    initialize_profile_data(res.data['data'])
                } else {
                    //toast.warning('Please log in')
                    //nav('/admin')
                    console.log(res.data)
                    
                }
            })
            .catch(e => { console.error(e) })
    }

    function update_profile_pic(url){
        var post_url = global.backend_server+'/client/update_profile_picture'
        var data = { 'url': url }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    toast.success('Profile picture updated successfully')
                } else {
                    console.log(res.data)
                }
            })
            .catch(e => { console.error(e) })
    }
    

    function update_profile_details(){
        var post_url = global.backend_server+'/client/update_profile_details'
        var data = { 
            'username':username,
            'first_name':first_name,
            'last_name':last_name,
            'DOB':DOB,
            'phone_number':phone
        }
        console.log('Updating data:',data)
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    toast.success('Profile updated successfully')
                } else {
                    console.log(res.data)
                }
            })
            .catch(e => { console.error(e) })
    }


    function initialize_profile_data(data){
        console.log('Initializing profile data')
        set_profile_pic(data['profile_photo'])
        set_first_name(data['first_name'])
        set_last_name(data['last_name'])
        set_usename(data['username'])
        set_DOB(data['DOB'])
        set_phone(data['phone_number'])
    }





    return (
        <>
            <div class="dashpga_dash_profile_container_centered" >


                <div class="dashpga_dash_container_type2_centered">
                    <div class="profile_container">
                        {(() => {
                            if (profile_pic.length > 0) {
                                return (
                                    <>
                                        <img src={profile_pic} alt="" style={{"width":'100px',"height":'100px'}}/>
                                        <div class="profile_button" onClick={e => { widgetRef.current.open() }}>
                                            <img src={add_logo} alt=""/>
                                            <p>Edit Profile photo</p>
                                        </div>
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <img src={profile_logo} alt="" style={{"width":'100px',"height":'100px'}}/>
                                        <div class="profile_button" onClick={e => { widgetRef.current.open() }}>
                                            <img src={add_logo} alt="" />
                                            <p>Add a profile a profile pic</p>
                                        </div>
                                    </>
                                )
                            }
                        })()}

                    </div>

                    <div class="profile_input_container_horizontal">
                        <div class="profile_input">
                            <p>Username</p>
                            <input type="text" value={username} onChange={(e) => { set_usename(e.target.value) }} />
                        </div>
                    </div>


                    <div class="profile_input_container_horizontal">
                        <div class="profile_input">
                            <p>First name</p>
                            <input type="text" value={first_name} onChange={(e) => { set_first_name(e.target.value) }} />
                        </div>
                        <div class="profile_input">
                            <p>Last name</p>
                            <input type="text" value={last_name} onChange={(e) => { set_last_name(e.target.value) }} />
                        </div>
                    </div>

                    <div class="profile_input_container_horizontal">
                        <div class="profile_input">
                            <p>Date of Birth</p>
                            <input type="text" placeholder="DD-MM-YYYY" value={DOB} onChange={(e) => { set_DOB(e.target.value) }} />
                        </div>
                    </div>

                    <div class="profile_input_container_horizontal">
                        <div class="profile_input">
                            <p>Phone Number</p>
                            <input type="text" value={phone} onChange={(e) => { set_phone(e.target.value) }} />
                        </div>
                    </div>


                    <div class="dashpga_dash_container_type2_centered" style={{ "width": "100%" }}>
                        <div class="dashpga_dash_table_button" onClick={(e)=>{update_profile_details()}}>
                            <img src="./add_circle.svg" alt="" />
                            <p>Save</p>
                        </div>
                    </div>

                    {/* <p>Change your password</p>
                    <div class="profile_input_container_vertical">
                        <div class="profile_input">
                            <p>New Password</p>
                            <input type="text" />
                        </div>

                        <div class="profile_input">
                            <p>Confirm password</p>
                            <input type="text" />
                        </div>
                    </div>

                    <div class="dashpga_dash_container_type2_centered" >
                        <div class="dashpga_dash_table_button">
                            <img src="./add_circle.svg" alt=""></img>
                            <p>Save</p>
                        </div>
                    </div> */}
                </div>

            </div>
            <ToastContainer/>
        </>
    )
}

export default Profile;