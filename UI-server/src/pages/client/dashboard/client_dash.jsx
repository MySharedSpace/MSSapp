import React, { useState, useEffect } from "react";
import './user_dash.css'
import { ToastContainer, toast } from 'react-toastify';
import listing_logo from './dash_icons/listing.svg'
import profile_logo from './dash_icons/profile.svg'
import save_logo from './dash_icons/save_icon.svg'
import dash_logo from './dash_icons/view-dashboard.svg'
import Listings_Manager from "./components/listings";
import Profile from './components/profile'
import Users_Manager from "./components/users";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import My_Listings_Manager from "./components/my_listings";
import My_Applications_Manager from "./components/my_applications";
import Manage_My_Applications from "./components/applicants_management";

import global from "../../../../global";

function Client_Dashboard() {
    const [View, setView] = useState('profile')
    const [listing_being_managed, set_listing_being_managed] = useState('')
    const navigate = useNavigate()
    function nav(url) {
        navigate(url);
    }
    const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }


    //Check if logged in
    useEffect(() => {
        auth_status()
    }, [])

    function auth_status() {
        var post_url = global.backend_server+'/auth/status'
        var data = { 'code': 101 }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log('Continue...')
                } else {
                    toast.warning('Please log in')
                    nav('/login')
                }
            })
            .catch(e => { console.error(e) })
    }

    function logout_request() {
        var post_url = global.backend_server+'/auth/logout'
        var data = { 'code': 101 }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    toast.success('Bye')
                    nav('/')
                } else {
                    toast.warning('Please Try again')
                }
            })
            .catch(e => { console.error(e) })
    }


    function get_my_listing_applicants_data_view(listing_id){
        console.log('I want my applicants on view',listing_id)
        set_listing_being_managed(listing_id)
        setView('manage_my_applicants')
    }

    function back_to_listings_table(){
        console.log('I want my Listings Back on view')
        setView('manage_my_listings')
        
    }



    return (
        <>
            <nav className="nav">
                <div className="nav_1">
                    <span className="logo" style={{'cursor':'pointer'}} onClick={(e)=>{ nav('/') }} >Sharespace</span>
                    <button onclick="link('/registration')">Dashboard</button>
                    <button onClick={(e) => { logout_request() }}>Logout</button>
                </div>
            </nav>



            <div className="dashpga_dash_controls">
                <div className="dashpga_dash_control_button" onClick={(e) => { setView('profile') }}>
                    <img src={profile_logo} alt=""></img>
                    <p>Profile</p>
                </div>

                {/* <div className="dashpga_dash_control_button" onClick={(e) => { setView('manage_listing') }}>
                    <img src={save_logo} alt=""></img>
                    <p>Saved</p>
                </div> */}


                <div className="dashpga_dash_control_button" onClick={(e) => { setView('manage_my_listings') }}>
                    <img src={listing_logo} alt=""></img>
                    <p>My Listings</p>
                </div>

                <div className="dashpga_dash_control_button" onClick={(e) => { setView('manage_my_applications') }}>
                    <img src={save_logo} alt=""></img>
                    <p>My saved applications</p>
                </div>


            </div>


            <section className="dashpga_containerlvl0">
                <div className="dashpga_dash_container">
                    {(() => {
                        if (View === 'profile') {
                            return (<Profile />)
                        } else if (View === "manage_users") {
                            return (<Users_Manager></Users_Manager>)
                        } else if (View === 'manage_listing') {
                            return (<Listings_Manager></Listings_Manager>)
                        }else if(View==='manage_my_listings'){
                            return (<My_Listings_Manager applicants_data={ get_my_listing_applicants_data_view } />)
                        }else if(View==='manage_my_applications'){
                            return (<My_Applications_Manager/>)
                        }else if(View==='manage_my_applicants'){
                            return (<Manage_My_Applications id={listing_being_managed} back={back_to_listings_table} />)
                        }

                    })()}
                </div>
            </section>
        </>
    )
}


export default Client_Dashboard;