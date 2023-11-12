/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../shared_components/nav_bar/nav_bar';
import Filter_bar from './components/filter_bar';
import { ToastContainer, toast } from 'react-toastify';
import global from '../../../global';

export default function ListingDetails() {
  const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch the listings data from the server
    const fetchListings = async () => {
      try {
        const response = await axios.get(global.backend_server+'/listingDetails');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);


  function search(search_key){
    var filter_data={'search_key':search_key}
    var post_url = global.backend_server+'/client/listing_search'
        axios.post(post_url, filter_data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    //set_users_list(res.data['data']['listings_data'])
                    setListings(res.data['data'])
                } else {
                    toast.warning('Please log in')
                }
            })
            .catch(e => { console.error(e) })
  }


  return (
    <div>
      <Navbar />
      <Filter_bar search={search}/>
      <h1>Listings</h1>

      <div className="card-container">
        {listings.map((listing) => (
          <Link to={`/listingDetails/${listing._id}`} key={listing._id} className="card-link">
            <div className="card" style={{'max-width': '300px'}}>
            <img src={listing.images} alt='Listing'></img>
              <div className='card-body'style={{'color':'black'}}>
                  <h2 className='' >{listing.title}</h2>
                  <p>Location: {listing.place}</p>
                  <p>Price: {listing.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .card-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          grid-gap: 20px;
          
        }

        .card-link {
          text-decoration: none;
          color: inherit;
        }

        .card {
          border: 1px solid #ccc;
          padding: 20px;
          background-color: #f9f9f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 15px;
          margin-bottom: 10px;
        }

        .card-body .card-title {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .card-body .card-location,
        .card-body .card-price {
          font-size: 14px;
        }
      `}</style>
      <ToastContainer  />
    </div>
    
  );
}
