"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "motion/react";

function NavSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between">
        <div className="w-32 h-8 bg-white/10 rounded animate-pulse" />
        <div className="hidden lg:flex gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-14 h-4 bg-white/10 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </header>
  );
}

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, isSignedIn, isLoaded } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin";
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  useEffect(() => {
    setMounted(true);

    if (!isHomePage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      router.push(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "hero" },
    { label: "Projects", href: "projects" },
    { label: "Team", href: "/team", isRoute: true },
    { label: "Gallery", href: "/gallery", isRoute: true },
    { label: "About", href: "about" },
  ];

  if (!mounted || !isLoaded) return <NavSkeleton />;

  const transparent = isHomePage && !isScrolled;

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${
          transparent
            ? "bg-transparent text-white"
            : "bg-white/80 backdrop-blur-md text-slate-800 shadow-sm border-b border-slate-100"
        }
      `}
    >
      <div className="container mx-auto px-6 py-1">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <Image
                src="/logo.png"
                alt="Human Care"
                width={70}
                height={60}
                className="rounded-sm"
              />

              <span
                className={`
                  font-bold text-xl tracking-tight transition-colors duration-300
                  ${transparent ? "text-white" : "text-emerald-500"}
                `}
              >
                Human Care
              </span>
            </motion.div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-base tracking-wider font-medium transition-colors duration-300 cursor-pointer
                    ${transparent
                      ? "text-white/80 hover:text-emerald-400"
                      : "text-slate-600 hover:text-emerald-500"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`
                    text-base tracking-wider font-medium transition-colors duration-300 cursor-pointer
                    ${transparent
                      ? "text-white/80 hover:text-emerald-400"
                      : "text-slate-600 hover:text-emerald-500"
                    }
                  `}
                >
                  {link.label}
                </button>
              )
            )}

            {/* ACTION */}
            <div className="flex items-center gap-4 ml-4">
              {isSignedIn && isAdmin && (
                <UserButton afterSignOutUrl="/" />
              )}

              <button
                onClick={() => scrollToSection("contact")}
                className="
                  bg-emerald-500
                  hover:bg-emerald-600
                  text-white
                  px-6 py-2.5
                  rounded-full
                  text-base font-semibold
                  transition-colors
                  duration-300
                  cursor-pointer
                "
              >
                Act Now
              </button>
            </div>
          </nav>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`
              lg:hidden p-2 rounded-md cursor-pointer transition-colors duration-300
              ${transparent ? "text-white" : "text-slate-800"}
            `}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="
                lg:hidden mt-4
                bg-white
                rounded-2xl
                shadow-lg
                border
                border-slate-100
                overflow-hidden
              "
            >
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() =>
                    link.isRoute
                      ? (router.push(link.href), setIsMobileMenuOpen(false))
                      : scrollToSection(link.href)
                  }
                  className="
                    w-full text-left
                    px-5 py-4
                    text-slate-700
                    hover:bg-emerald-50
                    hover:text-emerald-500
                    border-b border-slate-100
                    last:border-0
                    cursor-pointer
                    transition-colors
                    duration-300
                  "
                >
                  {link.label}
                </button>
              ))}

              <div className="p-4">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="
                    w-full
                    bg-emerald-500
                    hover:bg-emerald-600
                    text-white
                    py-3
                    rounded-full
                    font-semibold
                    cursor-pointer
                    transition-colors
                    duration-300
                  "
                >
                  Act Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}