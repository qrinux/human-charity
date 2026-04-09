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
    {
      Icon: Facebook,
      link: "https://www.facebook.com/share/171jthvLEE/",
    },
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
    <footer className="bg-[#0F172A] text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <motion.div
              className="flex items-center  mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className=" flex items-center justify-center">
                <span>
                  <Image
                    src={'/logo.png'}
                    alt='logo'
                    width={80}
                    height={70}
                    className='rounded-sm'
                  />
                </span>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold leading-tight">Human Care</h3>
              </div>
            </motion.div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              A voluntary, non-profit organisation rooted in Sylhet, Bangladesh — dedicated to people, community, and a more equitable future for all.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl">🇧🇩</span>
              <span className="text-white/80">Proudly serving Bangladesh</span>
            </div>
          </div>
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
                    className="text-white/70 hover:text-[#10B981] transition-colors cursor-pointer duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 cursor-pointer bg-[#10B981] group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#10B981] rounded-full"></div>
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/70 hover:text-white transition-colors duration-300">
                <MapPin className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span>49/A, Block-B, Main Road,<br />Shahjalal Uposhahar,Sylhet</span>
              </li>
              <li className="flex items-start gap-3 text-white/70 hover:text-white transition-colors duration-300">
                <Phone className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span> +8801716691978</span>
              </li>
              <li className="flex items-start gap-3 text-white/70 hover:text-white transition-colors duration-300">
                <Mail className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span>info@humancareorg.com</span>
              </li>
            </ul>
          </div>
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
                  className="w-10 h-10  bg-white/10 hover:bg-[#10B981] rounded-lg flex items-center justify-center transition-colors duration-300 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        {/* <motion.div
          className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-8 mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Heart className="w-12 h-12 mx-auto mb-4" fill="white" />
          <h3 className="text-2xl mb-3">Make a Difference Today</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Your contribution directly supports our programs and changes lives. Every donation counts.
          </p>
        </motion.div> */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span>© 2026 Human Care.</span>
              <span className="hidden md:inline">All rights reserved.</span>
            </div>

            <div className="flex gap-6">
              <button className="hover:text-[#10B981] transition-colors duration-300">
                Privacy Policy
              </button>
              <button className="hover:text-[#10B981] transition-colors duration-300">
                Terms of Service
              </button>
            </div>
          </div>
          <div className="text-center mt-6 text-white/40 text-xs">
            Made with <Heart className="w-3 h-3 inline text-[#F59E0B]" fill="#F59E0B" /> for humanity
          </div>
        </div>
      </div>
    </footer>
  );
}
