"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const menuItems = [
    { name: "Home", icon: "🏠", url: "/" },
    { name: "Men", icon: "👕", url: "/store/category/mens" },
    { name: "All Products", icon: "🛍️", url: "/store/category/all-products" },
    { name: "Sales & Offers", icon: "🔥", url: "/store/category/sales-offers" },
    { name: "Authentics Products", icon: "✔️", url: "/store/category/authentics-products" }
  ];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      {/* TOP BAR */}
      <div className="bg-[#736D66] h-20 flex items-center justify-evenly">
        <img
          src="https://leofigures.com/assets/superadmin/catalog/site_logo/150y.webp"
          className="h-full py-2 md:block hidden"
        />

        <div className="flex items-center md:gap-3 gap-8">
          {/* HAMBURGER */}
          <button onClick={() => setIsOpen(true)} className="md:hidden block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex items-center bg-[#EEEEEE] rounded overflow-hidden">
            <input
              type="text"
              placeholder="Search..."
              className="bg-white border border-[#EEEEEE] px-2 focus:outline-none"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mx-1 text-[#736D66]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
          </svg>
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="bg-[#767676] hidden md:block">
        <ul className="flex items-center justify-center gap-5">
          {menuItems.map((item) => (
            <li key={item.name} className="hover:bg-[#736D66] font-bold text-[#ffb300] uppercase text-xs py-2 px-3">
              <Link href={item.url} className="hover:bg-[#736D66] cursor-pointer font-bold text-[#ffb300] uppercase text-xs py-2 px-3">
                <span>{item.icon}</span> {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && ( <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)}/>)}

      {/* MOBILE SIDEBAR */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#1C1C1C] z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="py-4 border-b border-white/20 px-3 mb-3">
          <img
            src="https://leofigures.com/assets/superadmin/catalog/site_logo/150y.webp"
            className="w-20 mx-auto"
            />
        </div>

        <ul className="flex flex-col gap-4 px-6">
          {menuItems.map((item) => (
            <li key={item.name} className="font-bold text-white uppercase text-sm">
              <Link href={item.url} className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <span>{item.icon}</span> {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}