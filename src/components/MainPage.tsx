'use client'
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import Slider from "react-slick";
import { useToast } from "@/hooks/use-toast";
// Import css files for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carouselItems = [
 { id: 1, image: '/images/carousel/slide1.jpg', title: 'Fresh Ingredients Delivered Daily' },
 { id: 2, image: '/images/carousel/slide2.jpg', title: 'Discover Delicious Meals' },
 { id: 3, image: '/images/carousel/slide3.jpg', title: 'Quick and Easy Ordering' },
];

const categories = [
 { name: 'Bakery', description: 'Bread, Cakes, Baking Products', image: '/images/categories/bakery.jpg' },
 { name: 'Beverages', description: 'Water, Soft Drinks, Juices, Energy Drinks', image: '/images/categories/beverages.jpg' },
 { name: 'Dairy & Eggs', description: 'Milk, Yoghurts, Cheese, Eggs, Butter, Cream, Laban Drink', image: '/images/categories/dairy.jpg' },
 { name: 'Fresh To Go', description: 'Cereals, Cereal Bars, Spreads, Jams, Honey', image: '/images/categories/fresh-to-go.jpg' },
 { name: 'Fruits & Vegetables', description: 'Fresh Fruits and Vegetables', image: '/images/categories/fruits-vegetables.jpg' },
 { name: 'Fresh & Frozen', description: 'Fresh and Frozen Products', image: '/images/categories/fresh-frozen.jpg' },
];

interface MainPageProps {
  isLoggedIn: boolean;
}

export default function MainPage({ isLoggedIn }: MainPageProps) {
  const { toast } = useToast();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleCategoryClick = (categoryName: string) => {
    if (isLoggedIn) {
      // Navigate to category page
      window.location.href = `/category/${categoryName}`;
    } else {
      // Show login prompt
      toast({
        title: "Login Required",
        description: "Please log in to view and purchase products.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="w-full relative">
        <Slider {...settings}>
          {carouselItems.map((item) => (
            <div key={item.id} className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
              <Image 
                src={item.image} 
                alt={item.title} 
                layout="fill" 
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
                  {item.title}
                </h1>
              </div>
            </div>
          ))}
        </Slider>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4/5 md:w-2/3 z-10">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
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
                  <Image 
                    src={category.image} 
                    alt={category.name} 
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover mb-2 rounded-t-lg" 
                  />
                  <CardTitle className="text-green-600 dark:text-green-400">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
                  <Button 
                    variant="link" 
                    className="mt-2 p-0 text-green-600 dark:text-green-400"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    View More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}