'use client'

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Slider from "react-slick";

// Import css files for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carouselItems = [
  { id: 1, image: '/images/carousel/slide1.jpg', title: 'Slide 1' },
  { id: 2, image: '/images/carousel/slide2.jpg', title: 'Slide 2' },
  { id: 3, image: '/images/carousel/slide3.jpg', title: 'Slide 3' },
];

const categories = [
  { name: 'Bakery', description: 'Bread, Cakes, Baking Products', image: '/images/categories/bakery.jpg' },
  { name: 'Beverages', description: 'Water, Soft Drinks, Juices, Energy Drinks', image: '/images/categories/beverages.jpg' },
  { name: 'Dairy & Eggs', description: 'Milk, Yoghurts, Cheese, Eggs, Butter, Cream, Laban Drink', image: '/images/categories/dairy.jpg' },
  { name: 'Fresh To Go', description: 'Cereals, Cereal Bars, Spreads, Jams, Honey', image: '/images/categories/fresh-to-go.jpg' },
  { name: 'Fruits & Vegetables', description: 'Fresh Fruits and Vegetables', image: '/images/categories/fruits-vegetables.jpg' },
  { name: 'Fresh & Frozen', description: 'Fresh and Frozen Products', image: '/images/categories/fresh-frozen.jpg' },
];

export default function DashboardPage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="w-full relative">
        <Slider {...settings}>
          {carouselItems.map((item) => (
            <div key={item.id} className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </Slider>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4/5 md:w-2/3 z-10">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search el Grocer Market..."
              className="w-full py-2 px-4 pr-10 rounded-full"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
          </div>
        </div>
      </div>

      <div className="flex-grow bg-gray-50 dark:bg-gray-900 w-full">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <img src={category.image} alt={category.name} className="w-full h-40 object-cover mb-2 rounded-t-lg" />
                  <CardTitle className="text-green-600 dark:text-green-400">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
                  <Button variant="link" className="mt-2 p-0 text-green-600 dark:text-green-400">View More →</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}