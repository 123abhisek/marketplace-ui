// src/pages/LandingPage.jsx
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedListings from "../components/FeaturedListings";
import Pricing from "../components/Pricing";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>EasyDeal — Buy & Sell Properties and Vehicles Online | India</title>
        <meta name="description" content="EasyDeal is India's trusted marketplace to buy, sell, and rent properties and vehicles. Get on-ground assistance from verified sellers across Karnataka." />
        <meta name="keywords" content="properties for sale India, vehicles for sale, real estate Karnataka, buy property online, sell vehicle online, EasyDeal marketplace" />
        <meta property="og:title" content="EasyDeal — Buy & Sell Properties and Vehicles Online" />
        <meta property="og:description" content="India's trusted marketplace for properties and vehicles. Verified listings, on-ground support." />
        <meta property="og:url" content="https://easydealworld.com/" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://easydealworld.com/" />
      </Helmet>
      <Carousel />
      {/* <Hero /> */}
      <Categories />
      <FeaturedListings />
      <Pricing />
      <HowItWorks />
      <Testimonials />
    </>
  );
}
