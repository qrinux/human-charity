"use client";
 import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from 'motion/react';
export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === "admin";
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      router.push(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "hero" },
    { label: "Projects", href: "projects" },
    { label: "Updates", href: "updates" },
    { label: "Advisor", href: "advisor" },
    { label: "Team", href: "team" },
    { label: "Gallery", href: "/gallery", isRoute: true },
    { label: "About Us", href: "about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  isScrolled || !isHomePage
    ? "bg-white text-slate-800 z-50 border-b border-green-50"
    : "bg-white text-slate-800 z-50 border-b border-green-50"
 }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="cursor-pointer -mt-1.5">
             <motion.div
                        className="flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Image
                          src={'/logo.png'}
                          alt='logo'
                          width={80}
                          height={70}
                          className='rounded-sm'
                        />
                        <h1 className="font-bold text-xl tracking-tight text-green-900 mt-1">
                          Human Care
                        </h1>
                      </motion.div>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link key={link.href} href={link.href} className="text-slate-800 hover:text-green-600 transition-colors relative group font-semibold text-lg">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#10B981] group-hover:w-full transition-all"></span>
                </Link>
              ) : (
                <button key={link.href} onClick={() => scrollToSection(link.href)} className="text-slate-800 hover:text-green-600 transition-colors relative group font-semibold cursor-pointer text-lg">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#10B981] group-hover:w-full transition-all"></span>
                </button>
              )
            )}

            <div className="flex items-center gap-6 border-l text-white/80 border-white/20 pl-6">
            
              {isSignedIn && isAdmin && (
                <div className="cursor-pointer text-white/80">
                  <UserButton afterSignOutUrl="/">
                    <UserButton.MenuItems>
                      <UserButton.Action 
                        label="Dashboard" 
                        labelIcon={<LayoutDashboard size={16} />} 
                        onClick={() => router.push('/admin/dashboard')} 
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              )}

              <button
                onClick={() => scrollToSection("contact")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg cursor-pointer"
            >
              Act Now
              </button>
            </div>
          </nav>

          <button className="lg:hidden text-black cursor-pointer p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      
        {isMobileMenuOpen && (
          <nav 
            className="lg:hidden mt-4 pb-4 flex flex-col gap-2 bg-white text-slate-800 p-6 rounded-2xl border border-white/10 shadow-2xl" 
          >
            {navLinks.map((link) => (
               <button 
                key={link.href} 
                onClick={() => link.isRoute ? router.push(link.href) : scrollToSection(link.href)} 
                className="cursor-pointer text-left py-3 border-b border-white/5 hover:text-[#10B981] transition-colors"
               >
                {link.label}
               </button>
            ))}
            
            {isSignedIn && isAdmin && (
              <div className="flex flex-col gap-4 pt-4 mt-2">
                <button 
                  onClick={() => { router.push('/admin/dashboard'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 text-slate-800  font-bold py-2 cursor-pointer"
                >
                  <LayoutDashboard size={20} /> Dashboard
                </button>
                <div className="flex items-center gap-3 py-2">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-slate-800 text-base">Account Settings</span>
                </div>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}