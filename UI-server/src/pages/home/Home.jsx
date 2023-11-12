import Featured from "./components/featured/Featured";
import Testimonials from "./components/Testimonials/testimonials";
import Footer from "./components/footer/Footer";
 import Header from "./components/header/Header";
import MailList from "./components/mailList/MailList";
import Navbar from "./components/navbar/Navbar";
import PropertyList from "./components/propertyList/PropertyList";

import Hostels from "./components/hostels/Hostels";
import "./home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header/>
      <div className="homeContainer">
        <Featured/>
        <Hostels/>
        <Testimonials/>
        <MailList/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
