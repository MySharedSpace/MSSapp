import React, { useEffect, useState } from "react";
import delete_logo from '../dash_icons/delete.svg'
import view_logo from '../dash_icons/visibility.svg'
import axios from "axios";
import global from "../../../../../global";


function Users_Manager() {
    useEffect(() => {
        get_users_data()
    },[])

    const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }

    function get_users_data() {
        var post_url = global.backend_server+'/admin/users_data'
        var data = { 'code': 101 }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    set_users_list(res.data['data']['users_data'])
                } else {
                    toast.warning('Please log in')
                    nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }

    const [users_list, set_users_list] = useState([])



    return (
        <>
            <div className="dashpga_dash_container_type2_centered">
                <h2>Users Management</h2>
                <div className="dashpga_dash_table">
                    <table>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                        </tr>

                        {users_list.map((user) => {
                            return (
                                <>
                                    <tr>
                                        <td>{user['username']}</td>
                                        <td>{user['email']}</td>
                                        <td>
                                            <div className="dashpga_dash_table_button">
                                                <img src={view_logo} alt=""></img>
                                                <p>View</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="dashpga_dash_table_button">
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
        </>
    )
}

export default Users_Manager