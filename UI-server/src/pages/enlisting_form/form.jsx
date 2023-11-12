
import { useState, React, useEffect } from 'react'
import './listing-form.css'
import add_logo from './assets/images/boolean_icons/add.svg'
import check_logo from './assets/images/boolean_icons/check.svg'
import close_logo from './assets/images/boolean_icons/close.svg'
import admin_data from "./counties (1).json";
import ad from './counties (1).json'
import Navbar from '../home/components/navbar/Navbar'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import Spinner from './Spinner'
import global from '../../../global'


export default function Enlisting_form() {


    const headers = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }

    const [location, setLocation] = useState('')
    const [sublet, setSublet] = useState('')
    const [description, setDescription] = useState('')
    const [features, setFeatures] = useState([])
    const [perks, setPerks] = useState([])
    const [gender, setGender] = useState('')
    const [isSmokingAllowed, setIsSmokingAllowed] = useState("")
    const [isPetsAllowed, setIsPetsAllowed] = useState("")
    const [price, setPrice] = useState('')
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [images, setImages] = useState([])
    const [isUploading, setIsUploading] = useState(false)



    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
          setIsUploading(true);
          const data = new FormData();
          for (const file of files) {
            data.append("file", file);
          }
          const res = await axios.post(global.backend_server+'/upload', data);
          console.log(data);
          setImages((oldImages) => {
            return [...oldImages, ...res.data.links];
          });
          console.log("Uploaded Images:", res.data.links);
          setIsUploading(false);
        }
      }
    



    useEffect(() => {
        check_draft()
    }, [])



    function check_draft() {
        var post_url = global.backend_server+'/client/check_draft'
        var data = { 'code': 101 }
        axios.post(post_url, data, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    //set_users_list(res.data['data']['listings_data'])
                } else {
                    toast.warning('Please log in')
                    //nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }

    function update_draft(field, data_item) {
        var post_url = global.backend_server+'/client/update_draft'
        var data = { data: [field, data_item] }
        if (data_item.length > 0 && field.length > 0) {
            axios.post(post_url, data, headers)
                .then(res => {
                    console.log(res.data)
                    if (res.data['status'] === 'success') {
                        console.log(res.data['data'])
                        //set_users_list(res.data['data']['listings_data'])
                    } else {
                        toast.warning('Please log in')
                        //nav('/admin')
                    }
                })
                .catch(e => { console.error(e) })
        }

    }


    function upload_draft() {
        const formData = {
            place: location,
            sublet,
            description,
            features,
            perks,
            gender,
            isSmokingAllowed,
            isPetsAllowed,
            price,
            title,
            desc,
            images
        }
        console.log(formData)
        axios.post(global.backend_server+'/client/upload_listing', formData, headers)
            .then(res => {
                console.log(res.data)
                if (res.data['status'] === 'success') {
                    console.log(res.data['data'])
                    toast.success('Listing posted successfully')
                    //set_users_list(res.data['data']['listings_data'])
                } else {
                    toast.warning('Please log in')
                    //nav('/admin')
                }
            })
            .catch(e => { console.error(e) })
    }






    const onSubletChange = (e) => {
        setSublet(e.target.value)
        update_draft('sublet', sublet)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const onFeatureChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            // Add the value to the features array
            const updatedFeatures = [...features, value];
            console.log('Updated Features:', updatedFeatures);
            setFeatures(updatedFeatures);
        } else {
            // Remove the value from the features array
            const updatedFeatures = features.filter((feature) => feature !== value);
            console.log('Updated Features:', updatedFeatures);
            setFeatures(updatedFeatures);
        }
    };
    const onPerksChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            // Add the value to the perks array
            const updatedPerks = [...perks, value];
            console.log('Updated Perks:', updatedPerks);
            setPerks(updatedPerks);
        } else {
            // Remove the value from the perks array
            const updatedPerks = perks.filter((perk) => perk !== value);
            console.log('Updated Perks:', updatedPerks);
            setPerks(updatedPerks);
        }
    };
    const onGenderChange = (e) => {
        setGender(e.target.value)
    }
    const onIsSmokingAllowedChange = (e) => {
        setIsSmokingAllowed(e.target.value)
    }
    const onIsPetsAllowedChange = (e) => {
        setIsPetsAllowed(e.target.value)
    }
    const onPriceChange = (e) => {
        setPrice(e.target.value)
    }
    const onTitleChange = (e) => {
        setTitle(e.target.value)
    }
    const onDescChange = (e) => {
        setDesc(e.target.value)
    }
    const onImagesChange = (e) => {
        setImages(e.target.value)
    }
    const formSubmit = (e) => {
        e.preventDefault()
        const formData = {
            place: location,
            sublet,
            description,
            features,
            perks,
            gender,
            isSmokingAllowed,
            isPetsAllowed,
            price,
            title,
            desc,
            images
        }
        axios.post(global.backend_server+'/insert', formData)
    }





    return (
        <>
            <Navbar />


            <section className="enlist_form_section">
                <div className="enlist_form_container">
                    <div className="enlist_step_indicator">
                        <p>Location</p>
                        <p>Sublet type</p>
                        <p>House Description</p>
                        <p>Features and perks</p>
                        <p>House rules</p>
                        <p>Bills & Rent</p>
                        <p>Title & Description</p>
                    </div>
                    <div className="enlist_form">
                        <div className="enlist_question_container_lvl1">
                            <h3>Location of your listing</h3>
                            <div className="enlist_location_container_lvl1">

                                <div className='location'>
                                    <label>Enter Location</label>
                                    <input type="text" placeholder="Enter Location" value={location} onChange={e => setLocation(e.target.value)} required />
                                </div>

                            </div>
                        </div>
                        <div className="enlist_question_container_lvl1">
                            <h3>Type of sublet</h3>
                            <div className="enlist_options_container_lvl1">
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="Entire Place" onChange={onSubletChange} checked={sublet === 'entire_place'} />
                                    <img src="./others/home.svg" alt=""></img>
                                    <div className="enlist_option_context">
                                        <h5>Entire place</h5>
                                        <span>Tenants will have the entire place to themselvs</span>
                                    </div>
                                </div>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="Room" onChange={onSubletChange} checked={sublet === 'room'} />
                                    <img src="./others/bedroom_parent.svg" alt=""></img>
                                    <div className="enlist_option_context">
                                        <h5>Room</h5>
                                        <span>Tenants will have the entire place to themselvs</span>
                                    </div>
                                </div>
                                <div className="enlist_options_container_lvl2" >
                                    <input type="radio" value="Shared bedroom" onChange={onSubletChange} checked={sublet === 'shared_bedroom'} />
                                    <img src="./others/beds.svg" alt=""></img>
                                    <div className="enlist_option_context">
                                        <h5>Shared bedroom</h5>
                                        <span>Tenants sleep in a room or common area that may be shared with you or
                                            others.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="enlist_question_container_lvl1">
                            <h3>Describe your place</h3>
                            <div className="enlist_options_container_lvl1">
                                <p>How would you describe the place you are subletting</p>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="House" onChange={onDescriptionChange} checked={description === 'House'} />
                                    <p>House</p>
                                </div>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="Apartment" onChange={onDescriptionChange} checked={description === 'Apartment'} />
                                    <p>Apartment</p>
                                </div>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="Studio" onChange={onDescriptionChange} checked={description === 'Studio'} />
                                    <p>Studio</p>
                                </div>
                            </div>
                        </div>
                        <div className="enlist_question_container_lvl1">
                            <h3>Features and perks</h3>
                            <div className="enlist_options_container_lvl1">
                                <p>Which features does your place have</p>
                                <div className="enlist_features_container_lvl1" >
                                    <div className="enlist_feature_item">
                                        <img src="./features/closets.svg" alt=""></img>
                                        <p>Wardobe</p>
                                        <input id='wardobe_feature' type="checkbox" value="Wardrobe" onChange={onFeatureChange} checked={features.includes("Wardrobe")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./features/table_chair.svg" alt=""></img>
                                        <p>Desk and chair</p>
                                        <input type="checkbox" value="Desk and chair" onChange={onFeatureChange} checked={features.includes("Desk and chair")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./features/sofa.png" alt=""></img>
                                        <p>Sofas</p>
                                        <input type="checkbox" value="Sofas" onChange={onFeatureChange} checked={features.includes("Sofas")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./features/varanda.svg" alt=""></img>
                                        <p>Varanda</p>
                                        <input type="checkbox" value="Varanda" onChange={onFeatureChange} checked={features.includes("Varanda")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./features/balcony.svg" alt=""></img>
                                        <p>Balcony</p>
                                        <input type="checkbox" value="Balcony" onChange={onFeatureChange} checked={features.includes("Balcony")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./features/security.svg" alt=""></img>
                                        <p>Security</p>
                                        <input type="checkbox" value="Security" onChange={onFeatureChange} checked={features.includes("Security")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./features/window.svg" alt=""></img>
                                        <p>Windows</p>
                                        <input type="checkbox" value="Windows" onChange={onFeatureChange} checked={features.includes("Windows")} />
                                    </div>
                                </div>
                                <p>What perks does your place offer</p>
                                <div className="enlist_features_container_lvl1">
                                    <div className="enlist_feature_item">
                                        <img src="./perks_logos/nest_remote_comfort_sensor.svg" alt=""></img>
                                        <p>Wi-fi</p>
                                        <input type="checkbox" value="Wi-fi" onChange={onPerksChange} checked={perks.includes("Wi-fi")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./perks_logos/tv_gen.svg" alt=""></img>
                                        <p>Paid TV</p>
                                        <input type="checkbox" value="Paid Tv" onChange={onPerksChange} checked={perks.includes("Paid Tv")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./perks_logos/local_laundry_service.svg" alt=""></img>
                                        <p>Washing Machine</p>
                                        <input type="checkbox" value="Washing Machine" onChange={onPerksChange} checked={perks.includes("Washing Machine")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./perks_logos/accessible.svg" alt=""></img>
                                        <p>Accessibility</p>
                                        <input type="checkbox" value="Accesibility" onChange={onPerksChange} checked={perks.includes("Accesibility")} />
                                    </div>
                                    <div className="enlist_feature_item">
                                        <img src="./perks_logos/heat_pump.svg" alt=""></img>
                                        <p>Air conditioning</p>
                                        <input type="checkbox" value="Air conditioning" onChange={onPerksChange} checked={perks.includes("Air conditioning")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="enlist_question_container_lvl1">
                            <h3>House rules and restrictions</h3>
                            <div className="enlist_options_container_lvl1">
                                <p>What gender of tenants will you allow</p>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="Male" onChange={onGenderChange} checked={gender === 'Male'} />
                                    <img src="./genders/male.svg" alt=""></img>
                                    <p>Male</p>
                                </div>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="Female" onChange={onGenderChange} checked={gender === 'Female'} />
                                    <img src="./genders/female.svg" alt=""></img>
                                    <p>Female</p>
                                </div>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="confused" onChange={onGenderChange} checked={gender === 'confused'} />
                                    <img src="./genders/transgender.svg" alt=""></img>
                                    <p>Both male, female and ambiguous </p>
                                </div>
                            </div>
                            <div className="enlist_options_container_lvl1">
                                <p>Do you allow smoking</p>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="yes" onChange={onIsSmokingAllowedChange} checked={isSmokingAllowed === 'yes'} />
                                    <img src="./check.svg" alt=""></img>
                                    <p>Yes</p>
                                </div>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="No" onChange={onIsSmokingAllowedChange} checked={isSmokingAllowed === 'No'} />
                                    <img src="./close.svg" alt=""></img>
                                    <p>No</p>
                                </div>
                            </div>
                            <div className="enlist_options_container_lvl1">
                                <p>Do you allow pets</p>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="yes" onChange={onIsPetsAllowedChange} checked={isPetsAllowed === 'yes'} />
                                    <img src="./check.svg" alt=""></img>
                                    <p>Yes</p>
                                </div>
                                <div className="enlist_options_container_lvl2">
                                    <input type="radio" value="No" onChange={onIsPetsAllowedChange} checked={isPetsAllowed === 'No'} />
                                    <img src="./close.svg" alt=""></img>
                                    <p>No</p>
                                </div>
                            </div>
                        </div>
                        <div className="enlist_question_container_lvl1">
                            <h3>Rent and Bills</h3>
                            <div className="enlist_options_container_lvl1">
                                <div className="options_container_lvl2">
                                    <p>Rent:</p>
                                    <input type="number" name="" value={price} onChange={onPriceChange} />
                                </div>
                                <p>Bills included</p>
                                <div className="enlist_options_container_lvl2">
                                    <input type="checkbox" />
                                    <p>Water</p>
                                </div>
                                <div className="enlist_options_container_lvl2">
                                    <input type="checkbox" />
                                    <p>Electricity</p>
                                </div>
                                <div className="enlist_options_container_lvl2">
                                    <input type="checkbox" />
                                    <p>Internet</p>
                                </div>
                            </div>
                        </div>
                        <div className="enlist_question_container_lvl1">
                            <h3>Title and Description</h3>
                            <div className="enlist_options_container_lvl1">
                                <p>Write a title that will captures more viewers</p>
                                <div className="enlist_location_container_lvl2">
                                    <p>Title</p>
                                    <input type="text" style={{ width: '70%' }} value={title} onChange={onTitleChange} />
                                </div>
                                <p>Write a description that would make people to consider your place</p>
                                <div className="enlist_location_container_lvl2">
                                    <p>Description</p>
                                    <textarea type="text" value={desc} onChange={onDescChange} />
                                </div>
                            </div>
                        </div>
                        <div className="enlist_question_container_lvl1">
                            <h3>Pictures</h3>

                            <div className="picture">
                                {!!images?.length &&
                                    images.map((link) => (
                                        <div
                                            key={link}
                                            className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
                                        >
                                            <img src={link} alt="" className="rounded-lg" />
                                        </div>
                                    ))}

                                {isUploading && (
                                    <div className="h-24 flex items-center">
                                        <Spinner />
                                    </div>
                                )}
                            </div>

                            <div className="enlist_options_container_lvl1">
                                <p>Add pictures of your place here</p>
                                <input type="file" onChange={uploadImages} />
                            </div>
                        </div>
                        <div className="enlist_question_container_lvl1">
                            <div className="enlist_options_container_lvl1">
                                <button type="submit" onClick={e => { upload_draft() }} >Submit</button>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ToastContainer></ToastContainer>
        </>
    )
}