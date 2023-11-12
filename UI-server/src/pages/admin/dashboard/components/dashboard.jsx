import React, { useState ,useEffect } from "react";
import {CartesianAxis, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis,YAxis} from 'recharts'
import axios from 'axios'
import global from '../../../../../global'

function Dashboard() {
    useEffect(()=>{
        auth_status()
    },[])

    const headers={headers: {'Content-Type': 'application/json'},withCredentials: true}

    function auth_status(){
        var post_url = global.backend_server+'/admin/dashboard_data'
        var data = { 'code':101 }
        axios.post(post_url, data,headers)
            .then(res => { 
                console.log(res.data)
                if(res.data['status']==='success'){
                    console.log(res.data['data'])
                    set_hits_data(res.data['data']['hit_data'].reverse())
                    set_users_count(res.data['data']['users_count'])
                    set_listing_count(res.data['data']['listing_count'])
                }else{
                    toast.warning('Please log in')
                    nav('/admin')
                }
             })
            .catch(e => { console.error(e) })
    }


    const [hits_data,set_hits_data]=useState([])
    const [users_count,set_users_count]= useState(0)
    const [listing_count,set_listing_count]= useState(0)


    return (
        <>
            <div className="dashpga_dashboard_container_type1">
                <div className="dashpga_content_container_type1">
                    <p>No. Users</p>
                    <h3 style={{ 'font-size': '60px' }}>{ users_count }</h3>
                </div>

                <div className="dashpga_content_container_type1">
                    <p>No. Listings</p>
                    <h3 style={{ 'font-size': '60px' }}>{listing_count}</h3>
                </div>



            </div>

            <div className="dashpga_dash_container_type2_centered">
                <h2>Activity analysis Graph</h2>
                <div className="dashpga_dash_table">
                    
                    <LineChart width={600} height={300} data={ hits_data }>
                        <Line type='monotone' dataKey='hits' stroke='#232234' strokeWidth={2} />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                    </LineChart>
                </div>
            </div>
        </>
    )
}

export default Dashboard;