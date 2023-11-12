import React, { useEffect, useState } from "react";
import delete_logo from '../dash_icons/delete.svg'
import view_logo from '../dash_icons/visibility.svg'
import axios from "axios";
import okay_logo from '../dash_icons/check.svg'
import Popup from "./user_details_popup";
import { ToastContainer, toast } from 'react-toastify';
import global from "../../../../../global";


function My_Applications_Manager() {
    useEffect(() => {
        get_users_data()
    }, [])

    useEffect(()=>{
        get_owners_data()
    },[Popup])

    const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }

    const [listing_id_in_view,set_listing_id_in_view] = useState()
    const [owner_data,set_owner_data] = useState({})

    function get_users_data() {
        var post_url = global.backend_server+'/client/my_application_data'
        var data = { 'code': 101 }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    set_my_applications(res.data['data']['my_applications'])
                } else {
                    toast.warning('Please log in')
                    //nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }

    async function get_owners_data(listing_id) {
        var post_url = global.backend_server+'/client/applicant_get_listing_owner_details'
        await set_listing_id_in_view(listing_id);
        var data = { 'listing_id': listing_id }
        console.log('Owners data for:',data)
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    console.log('My listing is:',listing_id)
                    
                    set_owner_data(res.data['data']['owner'])
                    show_popup()
                } else {
                    //toast.warning('Please log in')
                    console.log(res.data['data'])
                }
            })
            .catch(e => { console.error(e) })
    }
    



    function delete_listing_request(listing_id) {
        var post_url = global.backend_server+'/admin/delete_listing_request'
        var data = { 'id': listing_id }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    set_users_list(res.data['data']['listings_data'])
                    //set_users_list(res.data['data']['listings_data'])
                } else {
                    console.log(res.data['data'])
                    toast.warning('Please log in')
                    //nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }



    function delete_my_application(application_id) {
        var post_url = global.backend_server+'/client/delete_my_application'
        var data = { 'application_id': application_id }
        console.log('Deleting my application...:',data)
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    //set_users_list(res.data['data']['listings_data'])
                    //set_users_list(res.data['data']['listings_data'])
                    get_users_data()
                } else {
                    console.log(res.data['data'])
                    toast.warning('Please log in')
                    //nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }







    async function show_popup(listing_id) {
        // Initialize Variables
        
        // await get_owners_data()
        var closePopup = document.getElementById("popupclose");
        var overlay = document.getElementById("overlay");
        var popup = document.getElementById("popup");
        var button = document.getElementById("button");
        overlay.style.display = 'block';
        popup.style.display = 'block';
    
      }
    const [my_applications, set_my_applications] = useState([])



    



    return (
        <>
            <div className="dashpga_dash_container_type2_centered">
                <h2>My Applications</h2>
                <div className="dashpga_dash_table">
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Applicants</th>
                        </tr>

                        {my_applications.map((application) => {
                            return (
                                <>
                                    <tr key={application['_id']}>
                                        <td>{application['listing_id']}</td>
                                        <td>{application['application_status']}</td>
                                        <td>
                                            <div className="dashpga_dash_table_button">
                                                <img src={view_logo} alt=""></img>
                                                <p>View</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="dashpga_dash_table_button" onClick={(e) => { delete_my_application(application['_id']) }}>
                                                <img src={delete_logo} alt=""></img>
                                                <p>Cancel</p>
                                            </div>
                                        </td>
                                        {(() => {
                                            if (application['application_status'] === 'approved') {
                                                return (
                                                    <>
                                                        <td>
                                                            <div className="dashpga_dash_table_button" onClick={(e) => { get_owners_data(application['listing_id']); }}>
                                                                <img src={okay_logo} alt=""></img>
                                                                <p>Get Details</p>
                                                            </div>
                                                        </td>
                                                    </>
                                                )

                                            }
                                        })()}
                                    </tr>
                                </>)
                        })}


                    </table>
                </div>
            </div>
            <Popup owner_data={owner_data}  id={ listing_id_in_view } />
        </>
    )
}

export default My_Applications_Manager