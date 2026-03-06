

export default function Footer() {
  return (
    <div>
      <div className="bg-[#4C4C4C]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Item */}
          <div className="flex items-start gap-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-12 -scale-x-100">
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
              <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
              <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
            </svg>

            <div>
              <h2 className="font-semibold text-base sm:text-lg">
                FREE SHIPPING
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Free shipping on orders worth Rs. 2000 & up.
              </p>
            </div>
          </div>

          {/* Item */}
          <div className="flex items-start gap-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <div>
              <h2 className="font-semibold text-base sm:text-lg">
                CASH ON DELIVERY AVAILABLE
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Worry-free shopping. Pay only when you receive your order.
              </p>
            </div>
          </div>

          {/* Item */}
          <div className="flex items-start gap-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>

            <div>
              <h2 className="font-semibold text-base sm:text-lg">
                EARN SHOPBUCKS
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Accumulate Shopbucks every time you shop or refer friends.
              </p>
            </div>
          </div>

        </div>
      </div>

      <footer className="bg-[#F6F6F6]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 text-sm">

          {/* 1️⃣ Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#3B86C5]">Contact Information</h3>
            <p className="mb-2"><span className="font-medium">Phone:</span><br />+92 304 7919925</p>
            <p className="mb-2"><span className="font-medium">Email:</span><br />leofiguresofficial@gmail.com</p>
            <p><span className="font-medium">Business Hours:</span><br />9:00AM – 10:00PM</p>
          </div>

          {/* 2️⃣ Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#3B86C5]">Customer Service</h3>
            <ul className="space-y-2">
              <li className="hover:underline cursor-pointer">FAQs</li>
              <li className="hover:underline cursor-pointer">Return & Exchange</li>
              <li className="hover:underline cursor-pointer">Terms and Conditions</li>
              <li className="hover:underline cursor-pointer">Shipping Details</li>
            </ul>
          </div>

          {/* 3️⃣ Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#3B86C5]">New to LeoFigures?</h3>
            <p className="mb-4">
              Sign-up for newsletter today to receive special offers and exclusive deals!
            </p>
            <div className="flex rounded overflow-hidden">
              <input
                type="email"
                placeholder="Your e-mail address"
                className="flex-1 px-2 py-1 border border-gray-300 bg-[#DBDBDB] outline-none text-sm"
              />
              <button className="bg-[#4C4C4C] text-white px-4 py-1 text-sm">
                Submit
              </button>
            </div>
          </div>

          {/* 4️⃣ Map Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#3B86C5]">Find LeoFigures</h3>
            <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-gray-600">
              <iframe
                src="https://www.google.com/maps?q=31.458591,73.11362&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-white max-w-7xl mx-auto px-6 py-12 flex items-center justify-between gap-5">
        <img src="https://leofigures.com/assets/superadmin/catalog/logo.webp" className="w-20" />
        
        <div>
          <p className="font-bold text-xs text-[#767676]">Copyright © {new Date().getFullYear()} by LeoFigures. All Rights Reserved</p>
          <p className="text-xs text-[#7E7F81]">desined by <span className="font-bold">LeoFigures</span></p>
        </div>
      </div>
    </div>
  )
}
