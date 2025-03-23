"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon, SearchIcon, MenuIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Header() {
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Movie Explorer
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search movies..."
                    className="w-64 pr-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </form>
                <nav className="flex items-center space-x-4">
                  <Link
                    href="/"
                    className={`hover:text-primary ${
                      pathname === "/" ? "text-primary font-medium" : ""
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/favorites"
                    className={`hover:text-primary ${
                      pathname === "/favorites"
                        ? "text-primary font-medium"
                        : ""
                    }`}
                  >
                    Favorites
                  </Link>
                </nav>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {session.user?.name || session.user?.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? (
                        <SunIcon className="mr-2 h-4 w-4" />
                      ) : (
                        <MoonIcon className="mr-2 h-4 w-4" />
                      )}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            {session ? (
              <>
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search movies..."
                    className="w-full pr-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </form>
                <nav className="flex flex-col space-y-2">
                  <Link
                    href="/"
                    className={`hover:text-primary px-2 py-1 rounded-md ${
                      pathname === "/"
                        ? "bg-muted text-primary font-medium"
                        : ""
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/favorites"
                    className={`hover:text-primary px-2 py-1 rounded-md ${
                      pathname === "/favorites"
                        ? "bg-muted text-primary font-medium"
                        : ""
                    }`}
                  >
                    Favorites
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start px-2"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </nav>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
