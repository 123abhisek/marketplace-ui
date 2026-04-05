// src/pages/LandingPage.jsx
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import FeaturedListings from '../components/FeaturedListings'
import Pricing from '../components/Pricing'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedListings />
      <Pricing />
      <HowItWorks />
      <Testimonials />
    </>
  )
}