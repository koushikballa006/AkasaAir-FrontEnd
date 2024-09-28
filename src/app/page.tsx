import React from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-4xl font-bold mb-4 dark:text-white">Feast Your Senses,<br /><span className="text-green-500 dark:text-green-400">Fast and Fresh</span></h1>
            <p className="mb-4 dark:text-gray-300">Order Restaurant food, takeaway and groceries.</p>
            <div className="flex">
              <Input placeholder="Enter a postcode to see what we deliver" className="mr-2 flex-grow dark:bg-gray-700 dark:text-white" />
              <Button className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700">Search</Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <Image src="/images/veggies.jpg" alt="Fresh food delivery" width={800} height={600} className="rounded-lg" />
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Up to -40% FreshEats exclusive deals</h2>
        <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
          <Button variant="outline" className="rounded-full whitespace-nowrap dark:text-gray-300 dark:border-gray-600">Vegan</Button>
          <Button variant="outline" className="rounded-full whitespace-nowrap dark:text-gray-300 dark:border-gray-600">Sushi</Button>
          <Button variant="outline" className="rounded-full bg-green-100 text-green-500 border-green-500 whitespace-nowrap dark:bg-green-900 dark:text-green-400 dark:border-green-700">Pizza & Fast food</Button>
          <Button variant="outline" className="rounded-full whitespace-nowrap dark:text-gray-300 dark:border-gray-600">Healthy Bowls</Button>
          <Button variant="outline" className="rounded-full whitespace-nowrap dark:text-gray-300 dark:border-gray-600">Others</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Green Garden Bistro', 'Fresh Fusion Cafe', 'Eco Eats Diner'].map((restaurant, index) => (
            <Card key={index} className="relative overflow-hidden group dark:bg-gray-800">
              <Image src={`/api/placeholder/400/300`} alt={restaurant} width={400} height={300} className="w-full transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded">
                -{[40, 25, 30][index]}%
              </div>
              <CardContent className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-4 transition-all duration-300 group-hover:bg-opacity-100 dark:group-hover:bg-opacity-100">
                <p className="text-sm text-green-600 dark:text-green-400">Restaurant</p>
                <p className="font-semibold text-gray-800 dark:text-white">{restaurant}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Popular Categories 🥗</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Salads', 'Smoothies', 'Vegan', 'Organic'].map((category, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="text-3xl mb-2">
                  {['🥗', '🥤', '🥑', '🌿'][index]}
                </div>
                <p className="font-semibold text-green-600 dark:text-green-400">{category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}