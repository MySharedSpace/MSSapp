import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import user_logo from '../login/assets/imgs/account_circle.svg';
import password_logo from '../login/assets/imgs/lock.svg'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import global from "../../../../global";


export default function Register() {
    //axios header
    const headers={headers: {'Content-Type': 'application/json'},withCredentials: true}


    const navigate = useNavigate()
    function nav(url) {
        navigate(url);
    }

    //This function will be done at the begining of every reload
    useEffect(() => {
        auth_status()
    })

    const [username, set_username]=useState('')
    const [email, set_email]=useState('')
    const [password, set_password]=useState('')
    const [confirmed_password, set_confirmed_password]=useState('')


    function auth_status() {
        var post_url = global.backend_server+'/auth/status'
        var data = { 'code': 101 }
        axios.post(post_url, data,headers)
            .then(res => {
                if (res.data['status'] === 'success') {
                    toast.warning('you are alreading logged in')
                } else {
                    console.log('Loging in...')
                }
            })
            .catch(e => { console.error(e) })
    }


    function registration_form() {
        //Get the username , password and email
        

        //If the fields are empty return an error message prompting them to edit
        if (username.length <= 0 || email.length <= 0 || password.length <= 0 || confirmed_password.length <= 0) {
            toast.warning('Ensure all fields Not Null')
            console.log(username, email , password);
        } else {
            //Check if the passwords match
            console.log(username, email , password,"pp");
            if (password === confirmed_password) {
                var post_url = global.backend_server+'/auth/new_registration'
                var data = { 'username':username,'email':email , 'password':password}
                axios.post(post_url, data,headers)
                    .then(res => {
                        if (res.data['status'] === 'success') {
                            toast.success('you are now part of us, please verify')
                        } else {
                            toast.error(res.data['message'])
                        }
                    })
                    .catch(e => { console.error(e) })
            }else{
                
                toast.warning("Password missmatch")
            }
        } 


    }



    return (
        <div className="login_body">
            <nav className="login_nav">
                <div className="login_nav_1">
                    <span className="login_logo" onClick={(e) => { nav('/') }} >Sharespace</span>
                    <button onClick={(e) => { nav('/login') }}>Login</button>
                </div>
            </nav>
            <center>
                <div className="login_login_form">
                    <h3>Register</h3>
                    <div className="login_login_input">
                        <img src={user_logo} alt="" className="login_input_icon"></img>
                        <input id="reg_username_id" type="text" className="login_form_input" placeholder="User name" name="username" value={username} onChange={e=>{set_username(e.target.value)}} />
                    </div>
                    <div className="login_login_input">
                        <img src={user_logo} alt="" className="login_input_icon"></img>
                        <input id="reg_email_id" type="text" className="login_form_input" placeholder="Email" name="email" value={email} onChange={e=>{set_email(e.target.value)}} />
                    </div>
                    <span>password</span>
                    <div className="login_login_input">
                        <img src={password_logo} alt="" className="login_input_icon"></img>
                        <input id="reg_password_id" type="password" className="login_form_input" placeholder="password" name="password" value={password} onChange={e=>{set_password(e.target.value)}} />
                    </div>

                    <div className="login_login_input">
                        <img src={password_logo} alt="" className="login_input_icon"></img>
                        <input type="password" className="login_form_input" placeholder="confirm password" name="confirmed_password" id="reg_confirmed_password_id" value={confirmed_password} onChange={e=>{set_confirmed_password(e.target.value)}} />
                    </div>

                    <button className="login_login_button" style={{ 'margin-bottom': '20px' }} onClick={(e)=>{console.log('here');registration_form()}}>Register</button>
                </div>
            </center >
            <ToastContainer />
        </div>


    )
}