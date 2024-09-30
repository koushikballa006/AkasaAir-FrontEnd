import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">About Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We're committed to delivering fresh, quality groceries right to your doorstep.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link href="/" className="text-green-600 dark:text-green-400 hover:underline">Home</Link></li>
                <li><Link href="#" className="text-green-600 dark:text-green-400 hover:underline">Products</Link></li>
                <li><Link href="#" className="text-green-600 dark:text-green-400 hover:underline">Categories</Link></li>
                <li><Link href="#" className="text-green-600 dark:text-green-400 hover:underline">Contact Us</Link></li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Contact Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">123 Grocery St, Food City, FC 12345</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Phone: (123) 456-7890</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Email: info@grocerystore.com</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Follow Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">&copy; {new Date().getFullYear()} FreshEats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;