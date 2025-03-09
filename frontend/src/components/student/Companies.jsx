import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-16'>
      <p className='text-base text-gray-500'>Trusted by learners from</p>
      <div className='flex flex-wrap items-center justify-center md:gap-16 gap-6 mt-5 md:mt-10'>
        <img className='w-20 md:w-28' src={assets.microsoft_logo} alt="Microsoft" />
        <img className='w-20 md:w-28' src={assets.accenture_logo} alt="Microsoft" />
        <img className='w-20 md:w-28' src={assets.adobe_logo} alt="Microsoft" />
        <img className='w-20 md:w-28' src={assets.walmart_logo} alt="Microsoft" />
        <img className='w-20 md:w-28' src={assets.paypal_logo} alt="Microsoft" />
      </div>
    </div>
  )
}

export default Companies