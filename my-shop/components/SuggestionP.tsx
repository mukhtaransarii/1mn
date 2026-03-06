import React from 'react'
import ProductCard from './product/ProductCard'

export default function SuggestionP() {
  return (
    <div className='bg-gray-100 p-6'>
      <img 
       src="https://leofigures.com/assets/superadmin/catalog/category/1349x375/comfort.webp"
       className='mx-auto'
      />

      <div className='mt-8 flex gap-3'>
        <div className="bg-white w-76 rounded-md flex flex-col gap-5 overflow-hidden">
          <img 
            src="https://leofigures.com/assets/catalog_300X300/superadmin/catalog/products/7125/7125.webp" 
            className="" 
          />

          <p className="font-semibold text-sm text-[#767676] text-center">king sweatshirt</p>

          <div className="mb-5">
            <p className="text-[#E0988A] line-through text-[14px] font-bold text-center">Rs. 1999</p>
            <p className="text-[20px] font-bold text-center leading-none">Rs. 1299</p>
          </div>

          <button className='bg-black text-white rounded-md mx-4 mb-4 text-sm py-2'>View Product</button>
        </div>

        <div className="bg-white w-76 rounded-md flex flex-col gap-5 overflow-hidden">
          <img 
            src="https://leofigures.com/assets/catalog_300X300/superadmin/catalog/products/7125/7125.webp" 
            className="" 
          />

          <p className="font-semibold text-sm text-[#767676] text-center">king sweatshirt</p>

          <div className="mb-5">
            <p className="text-[#E0988A] line-through text-[14px] font-bold text-center">Rs. 1999</p>
            <p className="text-[20px] font-bold text-center leading-none">Rs. 1299</p>
          </div>

          <button className='bg-black text-white rounded-md mx-4 mb-4 text-sm py-2'>View Product</button>
        </div>

        <div className="bg-white w-76 rounded-md flex flex-col gap-5 overflow-hidden">
          <img 
            src="https://leofigures.com/assets/catalog_300X300/superadmin/catalog/products/7125/7125.webp" 
            className="" 
          />

          <p className="font-semibold text-sm text-[#767676] text-center">king sweatshirt</p>

          <div className="mb-5">
            <p className="text-[#E0988A] line-through text-[14px] font-bold text-center">Rs. 1999</p>
            <p className="text-[20px] font-bold text-center leading-none">Rs. 1299</p>
          </div>

          <button className='bg-black text-white rounded-md mx-4 mb-4 text-sm py-2'>View Product</button>
        </div>
      </div>
    </div>
  )
}
