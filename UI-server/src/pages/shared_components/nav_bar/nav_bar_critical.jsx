//import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../home/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import global from "../../../../global";


const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()

  function nav(url) {
    navigate(url);
  }

  function logout_request(){
    var post_url = global.backend_server+'/auth/logout'
    var data = { 'code':101 }
    axios.post(post_url, data,headers)
        .then(res => { 
            console.log(res.data)
            if(res.data['status']==='success'){
                toast.success('Bye')
                set_auth_state(false)
            }else{
                toast.warning('Please Try again')
            }
         })
        .catch(e => { console.error(e) })
  }

  useEffect(()=>{
    auth_status()
  },[])

  const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }


  function auth_status() {

    var post_url = global.backend_server+'/auth/status'
    var data = { 'code': 101 }
    axios.post(post_url, data, headers)
      .then(res => {
        console.log(res.data)
        if (res.data['status'] === 'success') {
          set_auth_state(true)
        } else {
          console.log('Loging in...')
          set_auth_state(false)
          nav('/login')
        }
      })
      .catch(e => { console.error(e) })
  }

  const [auth_state, set_auth_state] = useState(false)

  return (
    <div className="navbar">
      <div className="navContainer">

        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>

        </Link>
        {user ? user.username : (
          <div className="navItems">
            {(() => {
              if (auth_state) {
                return (
                  <>
                    <button className="navButton" onClick={(e) => { nav('/client_dashboard') }}>Dashboard</button>
                    <button className="navButton" onClick={(e) => { nav('/enlisting_form') }}>List your property</button>
                    <button className="navButton" onClick={(e) => { logout_request() }}>Logout</button>
                  </>)
              } else {
                return (<>
                <button className="navButton" onClick={(e) => { nav('/enlisting_form') }}>List your property</button>
                  <button className="navButton" onClick={(e) => { nav('/login') }}>Login</button>
                  <button className="navButton" onClick={(e) => { nav('/register') }}>Create Account</button>
                </>)

              }
            })()}


          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
