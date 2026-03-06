import React from 'react'

export default function Banner() {
  return (
    <div className='flex-col'>
      <img 
       src="https://leofigures.com/assets/superadmin/catalog/home/1585x500.webp"
       className='mx-auto'
      />

      <div className='flex flex-wrap w-full'> 
        <img className="md:w-1/4 w-1/2 object-cover" src="https://leofigures.com/assets/superadmin/catalog/banner_under/Website---Upper-Front---Sign-Up-2---Mini-Banners-1.webp"/>
        <img className="md:w-1/4 w-1/2 object-cover" src="https://leofigures.com/assets/superadmin/catalog/banner_under/Website---Upper-Front---Sign-Up-2---Mini-Banners-2.webp"/>
        <img className="md:w-1/4 w-1/2 object-cover" src="https://leofigures.com/assets/superadmin/catalog/banner_under/Website---Upper-Front---Sign-Up-2---Mini-Banners-3.webp"/>
        <img className="md:w-1/4 w-1/2 object-cover" src="https://leofigures.com/assets/superadmin/catalog/banner_under/Website---Upper-Front---Sign-Up-2---Mini-Banners-4.webp"/>
      </div>

      <div className='p-5 md:text-[32px] text-lg text-[#DA7054] font-bold text-center uppercase'>
        <p>Welcome to Premium Mens Clothing</p>
      </div>
    </div>
  )
}
