import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We're committed to delivering fresh, quality groceries right to your doorstep.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link href="/" className="text-green-600 dark:text-green-400 hover:underline">Home</Link></li>
                <li><Link href="/products" className="text-green-600 dark:text-green-400 hover:underline">Products</Link></li>
                <li><Link href="/categories" className="text-green-600 dark:text-green-400 hover:underline">Categories</Link></li>
                <li><Link href="/contact" className="text-green-600 dark:text-green-400 hover:underline">Contact Us</Link></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">123 Grocery St, Food City, FC 12345</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Phone: (123) 456-7890</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Email: info@grocerystore.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">&copy; {new Date().getFullYear()} Your Grocery Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;