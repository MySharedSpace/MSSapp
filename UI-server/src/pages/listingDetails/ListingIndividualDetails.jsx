import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './IndividualListing.css';
import Navbar from '../home/components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import global  from '../../../global';


function IndividualListing() {
  const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  const { id } = useParams();
  const [listing, setListing] = useState(null);


  const navigate = useNavigate()

  function nav(url) {
    navigate(url);
  }


  function make_application(listing_id){
    var application_data={'id':listing_id}
    var post_url = global.backend_server+'/client/my_application_request'
        axios.post(post_url, application_data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data']['message'])
                    //set_users_list(res.data['data']['listings_data'])
                    //setListings(res.data['data'])
                    toast.success(res.data['data']['message'])
                } else {
                    toast.warning('Please log in')
                }
            })
            .catch(e => { console.error(e) })
  }


  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(global.backend_server+`/listingDetails/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <Navbar />
      <div className="container mt-4">

        <div className="card">
          <h1 className="card-title">{listing.title} - {listing.place}</h1>
          <div className='main'>
            <img src={listing.images[0]} alt="Listing" className="card-img-top" />
            <div className="aside">
              <p className="card-aside"><b>Kes  {listing.price}</b> Monthly</p>
              <button className="individual-button" onClick={e => { make_application(id) }}>Apply</button>
            </div>
          </div>



          <div className="card-body">
            <p className="card-text">Features: {listing.features}</p>
            <p className="card-text">Type of Sublet: {listing.sublets}</p>
            <p className="card-text">Smoking Allowed: {listing.isSmokingAllowed ? 'Yes' : 'No'}</p>
            <p className="card-text">Pets Allowed: {listing.isPetsAllowed ? 'Yes' : 'No'}</p>
            <p className="card-text">Perks: {listing.perks}</p>
            <p className="card-text">Desc: {listing.desc}</p>
            <p className="card-text">Description: {listing.description}</p>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default IndividualListing;
