import React,{useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import global from "../../../../../global";

export default function Popup(props) {
    useEffect(() => {
        get_owners_data()
        console.log('I have poped up')
    }, [])

    const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }

    const navigate = useNavigate()

  function nav(url) {
    navigate(url);
  }

    function get_owners_data() {
        var post_url = global.backend_server+'/client/applicant_get_listing_owner_details'
        var data = { 'listing_id': props.id }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    //set_my_applications(res.data['data']['my_applications'])
                } else {
                    toast.warning('Please log in')
                    //nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }



    


    function close_popup() {
        var closePopup = document.getElementById("popupclose");
        var overlay = document.getElementById("overlay");
        var popup = document.getElementById("popup");
        var button = document.getElementById("button");
        overlay.style.display = 'none';
          popup.style.display = 'none';
      }


    return (
        <>
            {/* <div id="overlay" onClick={(e) => { close_popup() }}></div> */}
            <div id="popup">
                <div class="popupcontrols">
                    <span id="popupclose" onClick={(e) => { close_popup() }}>X</span>
                </div>
                <div class="popupcontent">
                    <center>
                    <p>Username:</p><h3>{props.owner_data['username']}</h3>
                    <p>Email:</p><h3>{props.owner_data['email']}</h3>
                        <p>Phone:</p><h3>{props.owner_data['phone_number']}</h3>
                        <button onClick={e => { close_popup(); nav('/SublettingForm') }} >Procede to pay</button>
                        
                    </center>
                </div>
            </div>
        </>
    )
}