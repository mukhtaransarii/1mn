"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";

export default function ProductContainer() {
  const products = Array.from({ length: 16 });
  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState(5);

  // Responsive perView
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setPerView(5);
      else if (w >= 1024) setPerView(4);
      else if (w >= 768) setPerView(3);
      else if (w >= 640) setPerView(2);
      else setPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalSlides = Math.ceil(products.length / perView);

  return (
    <div className="max-w-[90vw] mx-auto py-12">
      <h2 className="md:text-2xl text-lg text-center mb-8">New Arrivals</h2>

      {/* Slider */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full shrink-0">
              <div
                className="grid gap-6"
                style={{
                  gridTemplateColumns: `repeat(${perView}, minmax(0,1fr))`,
                }}
              >
                {products
                  .slice(
                    slideIndex * perView,
                    slideIndex * perView + perView
                  )
                  .map((_, i) => (
                    <ProductCard key={i} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              active === i ? "bg-[#DA7054] w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}