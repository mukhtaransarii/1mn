

export default function ProductCard() {
  return (
    <div className="bg-white w-76 p-1 border border-[#E5E5E5] flex flex-col gap-5 relative">

      {/* absoluste */}
      <p className="absolute top-3 right-3 px-2.5 py-1 bg-[#77B464] text-[12px] font-bold text-white rounded">NEW</p>
      <p className="absolute top-3 left-3 px-2.5 py-1 bg-[#863986] text-[12px] font-bold text-white rounded">30% OFF</p>

      <img 
        src="https://leofigures.com/assets/catalog_300X300/superadmin/catalog/products/7125/7125.webp" 
        className="" 
      />

      <p className="font-semibold text-sm text-[#767676] text-center">king sweatshirt</p>

      <div className="flex gap-1 items-center justify-center">
        <div className="flex-1 h-px bg-linear-to-r from-transparent to-gray-300" />

        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-[#C2C4C7]">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
        </svg>
        ))}

        <div className="flex-1 h-px bg-linear-to-l from-transparent to-gray-300" />
      </div>

      <div className="mb-5">
        <p className="text-[#E0988A] line-through text-[14px] font-bold text-center">Rs. 1999</p>
        <p className="text-[20px] font-bold text-center leading-none">Rs. 1299</p>
      </div>
    </div>
  )
}
