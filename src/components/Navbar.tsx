// File: src/components/Navbar.tsx
"use client"

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, ShoppingCart } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
  cartItemCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, handleLogout, cartItemCount }) => {
  const { theme, setTheme } = useTheme();
  console.log(cartItemCount)
  return (
    <div className="border-b border-green-200 dark:border-green-800 bg-white dark:bg-gray-900">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <span className="font-bold text-green-600 dark:text-green-400">FreshEats</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-white dark:bg-gray-800">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-green-600 dark:text-green-300">
                          Today&apos;s Special
                        </div>
                        <p className="text-sm leading-tight text-green-700 dark:text-green-200">
                          Discover our fresh pick of the day!
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a href="#" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Full Menu</a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a href="#" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Categories</a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a href="#" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Special Deals</a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 bg-green-100 dark:bg-green-800">
                      <AvatarFallback className="text-green-600 dark:text-green-300">U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-green-600 dark:text-green-400">User</p>
                      <p className="text-xs leading-none text-green-500 dark:text-green-500">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/order" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/cart">
                <Button variant="ghost" className="relative p-2">
                  <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-[3rem] px-0"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
