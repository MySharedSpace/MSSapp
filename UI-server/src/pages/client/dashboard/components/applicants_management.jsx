import React, { useEffect, useState } from "react";
import delete_logo from '../dash_icons/delete.svg'
import view_logo from '../dash_icons/visibility.svg'
import axios from "axios";
import okay_logo from '../dash_icons/check.svg'
import global from "../../../../../global";



function Manage_My_Applications( props ) {
    useEffect(() => {
        get_users_data(props.id)
    },[])

    const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    
    function get_users_data( id ) {
        var post_url = global.backend_server+'/client/get_my_listing_applicants_data'
        var data = { 'id': id }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    set_my_applicants(res.data['data']['my_applicants'])
                } else {
                    toast.warning('Please log in')
                    //nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }

    function delete_listing_request(listing_id){
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


    function approve_my_applicants_application(listing_id){
        var post_url = global.backend_server+'/client/approve_my_applicants_application'
        var data = { 'application_id': listing_id }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    get_users_data(props.id)
                    //set_users_list(res.data['data']['listings_data'])
                    //set_users_list(res.data['data']['listings_data'])
                } else {
                    console.log(res.data['data'])
                    //toast.warning('Please log in')
                    //nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }


    const [my_applicants, set_my_applicants] = useState([])



    return (
        <>
            <div className="dashpga_dash_container_type2_centered">
                <button style={{'position':'relative','top':'1px','left':'1px'}} onClick={ (e)=>{ props.back() } }>Back</button>
                <h2>Applications for Listing: { props.id }</h2>
                <div className="dashpga_dash_table">
                    <table>
                        <tr>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>

                        {my_applicants.map((applicant) => {
                            return (
                                <>
                                    <tr key={applicant['_id']}>
                                        <td>{applicant['applicant_email']}</td>
                                        <td>{applicant['application_status']}</td>
                                        <td>
                                            <div className="dashpga_dash_table_button" style={{'background-color':'green'}} onClick={(e)=>{approve_my_applicants_application( applicant['_id'] )}}>
                                                <img src={okay_logo} alt=""></img>
                                                <p>Approve</p>
                                            </div>
                                        </td>
                                        {/* <td>
                                            <div className="dashpga_dash_table_button" onClick={(e)=>{delete_listing_request(listing['_id'])}}>
                                                <img src={delete_logo} alt=""></img>
                                                <p>Approve</p>
                                            </div>
                                        </td> */}
                                    </tr>
                                </>)
                        })}


                    </table>
                </div>
            </div>
        </>
    )
}

export default Manage_My_Applications