"use client"
import { motion } from 'motion/react';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const socials = [
    { Icon: Facebook, link: "https://www.facebook.com/share/171jthvLEE/" },
    { Icon: Twitter, link: null },
    { Icon: Instagram, link: null },
    { Icon: Linkedin, link: null },
  ];

  const handleClick = (link: string | null) => {
    if (link) {
      window.open(link, "_blank");
    } else {
      toast("Not available right now");
    }
  };

  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900  pt-16 pb-8 relative overflow-hidden">

      {/* pattern (kept same, just color adjusted) */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* LOGO */}
          <div>
            <motion.div
              className="flex items-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={'/logo.png'}
                alt='logo'
                width={80}
                height={70}
                className='rounded-sm'
              />
              <h3 className="text-green-900 text-xl font-bold ml-2">
                Human Care
              </h3>
            </motion.div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              A voluntary, non-profit organisation rooted in Sylhet, Bangladesh — dedicated to people, community, and a more equitable future for all.
            </p>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl">🇧🇩</span>
              <span className="text-gray-700">Proudly serving Bangladesh</span>
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#10B981] rounded-full"></div>
              Quick Links
            </h4>

            <ul className="space-y-3">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'Our Focus', id: 'focus' },
                { label: 'Projects', id: 'projects' },
                { label: 'Updates', id: 'updates' },
                { label: 'Team', id: 'team' },
                { label: 'About Us', id: 'about' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-600 hover:text-[#10B981] transition-colors duration-300 text-sm flex items-center gap-2 cursor-pointer group"
                  >
                    <span className="w-0 h-0.5 bg-[#10B981] group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#10B981] rounded-full"></div>
              Get in Touch
            </h4>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-300">
                <MapPin className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span>49/A, Block-B, Main Road,<br />Shahjalal Uposhahar,Sylhet</span>
              </li>

              <li className="flex items-start gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-300">
                <Phone className="w-5 h-5 text-[#10B981]" />
                <span>+8801716691978</span>
              </li>

              <li className="flex items-start gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-300">
                <Mail className="w-5 h-5 text-[#10B981]" />
                <span>info@humancareorg.com</span>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#10B981] rounded-full"></div>
              Follow Us
            </h4>

            <div className="flex gap-3">
              {socials.map(({ Icon, link }, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleClick(link)}
                  className="w-10 h-10 bg-gray-100 hover:bg-[#10B981] rounded-lg flex items-center justify-center transition-colors duration-300 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5 text-gray-700" />
                </motion.button>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">

            <div className="flex items-center gap-2">
              <span>© 2026 Human Care.</span>
              <span className="hidden md:inline">All rights reserved.</span>
            </div>

            <div className="flex gap-6">
              <button className="hover:text-[#10B981] transition-colors duration-300 cursor-pointer">
                Privacy Policy
              </button>
              <button className="hover:text-[#10B981] transition-colors duration-300 cursor-pointer">
                Terms of Service
              </button>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-400 text-xs">
            Made with <Heart className="w-3 h-3 inline text-[#F59E0B]" fill="#F59E0B" /> for humanity
          </div>
        </div>

      </div>
    </footer>
  );
}