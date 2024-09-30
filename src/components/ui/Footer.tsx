import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">About Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We're committed to delivering fresh, quality groceries right to your doorstep.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Home</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Products</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Categories</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">Contact Info</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">123 Grocery St, Food City, FC 12345</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Phone: (123) 456-7890</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Email: info@grocerystore.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">Follow Us</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">&copy; {new Date().getFullYear()} FreshEats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;