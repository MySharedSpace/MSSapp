import React, { useEffect, useState } from "react";
import delete_logo from '../dash_icons/delete.svg'
import view_logo from '../dash_icons/visibility.svg'
import profile_logo from '../dash_icons/profile_logo.svg'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import global from "../../../../../global";


function My_Listings_Manager(props) {
    useEffect(() => {
        get_users_data()
    },[])
    const navigate = useNavigate()
    function nav(url) {
        navigate(url);
    }

    const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }

    function get_users_data() {
        var post_url = global.backend_server+'/client/my_listings_data'
        var data = { 'code': 101 }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    set_my_listings(res.data['data']['listings_data'])
                    set_application_stats(res.data['data']['application_stats'])
                } else {
                    toast.warning('Please log in')
                    nav('/admin')
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
                    //set_my_listings(res.data['data']['listings_data'])
                    get_users_data()
                    //set_users_list(res.data['data']['listings_data'])
                } else {
                    console.log(res.data['data'])
                    //toast.warning('Please log in')
                    //nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }


    const [my_listings, set_my_listings] = useState([])
    const [application_stats, set_application_stats] = useState([])



    return (
        <>{(()=>{ 
            if(my_listings.length>0){
                return (
                    <div className="dashpga_dash_container_type2_centered">
                <button>Back</button>
                <h2>My listings</h2>
                <div className="dashpga_dash_table">
                    <table>
                        <tr>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Applicants</th>
                        </tr>

                        {my_listings.map((listing) => {
                            return (
                                <>
                                    <tr key={listing['_id']}>
                                        <td>{listing['title']}</td>
                                        <td>{listing['place']}</td>
                                        <td>{application_stats[listing['_id']]}</td>
                                        <td>
                                            <div className="dashpga_dash_table_button" onClick={(e)=>{nav('/listingDetails/'+listing['_id'])}} >
                                                <img src={view_logo} alt=""></img>
                                                <p>View</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="dashpga_dash_table_button" onClick={(e)=>{props.applicants_data(listing['_id'])}}>
                                                <img src={profile_logo} style={{'width':'24px'}} alt=""></img>
                                                <p>Applicants</p>
                                            </div>
                                        </td>
                                        {/* <td>
                                            <div className="dashpga_dash_table_button" onClick={(e)=>{delete_listing_request(listing['_id'])}}>
                                                <img src={delete_logo} alt=""></img>
                                                <p>Edit</p>
                                            </div>
                                        </td> */}
                                        <td>
                                            <div className="dashpga_dash_table_button" onClick={(e)=>{delete_listing_request(listing['_id'])}}>
                                                <img src={delete_logo} alt=""></img>
                                                <p>Delete</p>
                                            </div>
                                        </td>
                                    </tr>
                                </>)
                        })}


                    </table>
                </div>
            </div>
                )
            }else{
                return (
                    <>
                    <span onClick={(e)=>{ nav('/enlisting_form') }} >Click here to enlist your property</span>
                    </>
                )
            }
         })()}
            
        </>
    )
}

export default My_Listings_Manager