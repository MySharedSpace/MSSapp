import React,{ useState, useEffect} from "react";
import './user_dash.css'
import { ToastContainer, toast } from 'react-toastify';
import listing_logo from './dash_icons/listing.svg'
import profile_logo from './dash_icons/profile.svg'
import dash_logo from './dash_icons/view-dashboard.svg'
import Listings_Manager from "./components/listings";
import Dashboard from "./components/dashboard";
import Users_Manager from "./components/users";
import Profile from "../../client/dashboard/components/profile";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import global from '../../../../global'

function Admin_Dashboard(){
    const [View, setView]=useState('dashboard')
    const navigate = useNavigate()
    function nav(url) {
        navigate(url);
    }
    const headers={headers: {'Content-Type': 'application/json'},withCredentials: true}


    //Check if logged in
    useEffect(()=>{
        auth_status()
    },[])

    function auth_status(){
        var post_url = global.backend_server+'/auth/status'
        var data = { 'code':101 }
        axios.post(post_url, data,headers)
            .then(res => { 
                console.log(res.data)
                if(res.data['status']==='success'){
                    console.log('Continue...')
                }else{
                    toast.warning('Please log in')
                    nav('/admin')
                }
             })
            .catch(e => { console.error(e) })
    }

    function logout_request(){
        var post_url = global.backend_server+'/auth/logout'
        var data = { 'code':101 }
        axios.post(post_url, data,headers)
            .then(res => { 
                console.log(res.data)
                if(res.data['status']==='success'){
                    toast.success('Bye')
                    nav('/')
                }else{
                    toast.warning('Please Try again')
                }
             })
            .catch(e => { console.error(e) })
    }



    return (
        <>
            <nav className="nav">
        <div className="nav_1">
            <span className="logo">Sharespace</span>
            <button onclick="link('/registration')">Dashboard</button>
            <button onClick={(e)=>{ logout_request() }}>Logout</button>
        </div>
    </nav>



    <div className="dashpga_dash_controls">
        <div className="dashpga_dash_control_button" onClick={(e)=>{setView('dashboard')}}>
            <img src={dash_logo} alt=""></img>
            <p>Dashboard</p>
        </div>
        <div className="dashpga_dash_control_button" onClick={(e)=>{setView('manage_users')}}>
            <img src={profile_logo} alt=""></img>
            <p>Users</p>
        </div>
        <div className="dashpga_dash_control_button" onClick={(e)=>{setView('profile')}}>
            <img src={profile_logo} alt=""></img>
            <p>Profile</p>
        </div>

        <div className="dashpga_dash_control_button" onClick={(e)=>{setView('manage_listing')}}>
            <img src={listing_logo} alt=""></img>
            <p>Listings</p>
        </div>
    </div>


    <section className="dashpga_containerlvl0">
        <div className="dashpga_dash_container">
            {(()=>{
                if(View==='dashboard'){
                    return (<Dashboard></Dashboard>)
                }else if(View==="manage_users"){
                    return (<Users_Manager></Users_Manager>)
                }else if(View==='manage_listing'){
                    return (<Listings_Manager></Listings_Manager>)
                }else if(View==='profile'){
                    return (<Profile></Profile>)
                }
            })()}
        </div>
    </section>
        </>
    )
}


export default Admin_Dashboard;