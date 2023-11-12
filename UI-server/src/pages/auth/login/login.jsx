import { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect';
import ReactDOM from 'react-dom/client'
import './assets/login.css'
import { useNavigate } from "react-router-dom";
import user_logo from './assets/imgs/account_circle.svg'
import password_logo from './assets/imgs/lock.svg'
import google_logo from './assets/imgs/google.svg'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import global from '../../../../global';






export default function Login() {
    const navigate = useNavigate()
    function nav(url) {
        navigate(url);
    }

    const headers={headers: {'Content-Type': 'application/json'},withCredentials: true}

    useEffect(() => {
        console.log('Hello world, This page has loaded')
        //Check if user is logged in
        auth_status()
    })


    function auth_status() {
        
        var post_url = global.backend_server+'/auth/status'
        var data = { 'code':101 }
        axios.post(post_url, data,headers)
            .then(res => { 
                console.log(res.data)
                if(res.data['status']==='success'){
                    toast.warning('you are already logged in')
                }else{
                    console.log('Loging in...')
                }
             })
            .catch(e => { console.error(e) })
    }


    function login() {
        var email = document.getElementById('user_email').value
        var password = document.getElementById('user_password').value
    
        if (password.length > 0 && email.length > 0) {
            var post_url = global.backend_server+'/auth/login'
            var data = { email: email, password: password }
            axios.post(post_url, data,headers)
            .then(res => { 
                console.log(res.data)
                if(res.data['status']==='success'){
                    toast.success("You have successfully logged in")
                    nav('/')
                }else{
                    toast.warning('Worng password or email')
                }
                })
            .catch(e => { console.error(e) })
        }
    
    
    
    }



    return (
        <>
            <div className='login_body'>
                <nav className="login_nav">
                    <div className="login_nav_1">
                        <span className="login_logo" onClick={(e) => { nav('/') }}>Sharespace</span>
                        <button style={{ width: '100px' }} onClick={(e) => { nav('/register') }}>Sign up</button>
                    </div>
                </nav>
                <center>
                    <div className="login_login_form">
                        <div>
                            <h2>Login</h2>
                            <div className="login_login_input">
                                <img src={user_logo} alt="" className="login_input_icon" ></img>
                                <input id='user_email' type="text" className="login_form_input" name="username" placeholder="Email" required="true"></input>
                            </div>
                            <div className="login_login_input">
                                <img src={password_logo} alt="" className="login_input_icon"></img>
                                <input id='user_password' type="password" name="password" className="login_form_input" placeholder="password" required></input>
                            </div>

                            <button className="login_login_button" type="submit" onClick={(e) => { login() }}>Login</button>
                        </div>
                        <p>or</p>
                        <div className="login_google_auth_api" >
                            <img className='login_input_icon login_google' src={google_logo} alt="" ></img>
                            <span>Sign in with google</span>
                        </div>

                        <p><a href="/password_reset" style={{ 'color': 'red' }}>Forgot your password?</a><a href="/register">Signup?</a></p>
                    </div>
                </center>
            </div>
            <ToastContainer />
        </>
    )
}


