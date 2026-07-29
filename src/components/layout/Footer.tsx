import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const sponsors = [
    { name: "Inspired By 1", src: "https://i.ibb.co/N27BZcm2/IMG-20260728-WA0021.jpg" },
    { name: "Inspired By 2", src: "https://i.ibb.co/4ZRQ9hC4/IMG-20260728-WA0022.jpg" },
    { name: "Inspired By 3", src: "https://i.ibb.co/tTs8fDwn/IMG-20260728-WA0024.jpg" },
    { name: "Inspired By 4", src: "https://i.ibb.co/qF1tdVRq/IMG-20260728-WA0025.jpg" },
    { name: "Inspired By 5", src: "https://i.ibb.co/1fBnnT0R/IMG-20260728-WA0026.jpg" },
    { name: "Inspired By 6", src: "https://i.ibb.co/GvSmrBM4/IMG-20260728-WA0027.jpg" },
    { name: "Inspired By 7", src: "https://i.ibb.co/fj7p9ng/IMG-20260728-WA0028.jpg" },
    { name: "Inspired By 8", src: "https://i.ibb.co/twJsh34d/IMG-20260728-WA0029.jpg" },
    { name: "Inspired By 9", src: "https://i.ibb.co/DDjD4wzd/IMG-20260728-WA0030.jpg" },
    { name: "Inspired By 10", src: "https://i.ibb.co/SXqWxzBy/IMG-20260728-WA0031.jpg" },
    { name: "Inspired By 11", src: "https://i.ibb.co/B2qNzsd3/IMG-20260728-WA0032.jpg" },
    { name: "Inspired By 12", src: "https://i.ibb.co/vxXk5qrG/IMG-20260728-WA0033.jpg" },
    { name: "Inspired By 13", src: "https://i.ibb.co/MxWSG8ZN/IMG-20260728-WA0034.jpg" },
    { name: "Inspired By 14", src: "https://i.ibb.co/W4kVxnt3/IMG-20260728-WA0035.jpg" },
    { name: "Inspired By 15", src: "https://i.ibb.co/n8zQByfR/IMG-20260728-WA0036.jpg" },
    { name: "Inspired By 16", src: "https://i.ibb.co/rKbYF43P/IMG-20260723-WA0036.jpg" }
  ];

  return (
    <footer className="w-full border-t bg-background py-12 md:py-16">
      {/* Inspired By Section */}
      <div className="mb-12 border-b pb-12">
        <div className="mx-auto px-0 sm:px-0">
          <h3 className="font-serif text-lg md:text-3xl font-bold text-center mb-10">Inspired By:</h3>
          <div className="w-full overflow-hidden bg-gradient-to-r from-transparent via-white to-transparent">
            <motion.div
              className="flex gap-2 md:gap-4"
              initial={{ x: 0 }}
              animate={{ x: -2200 }}
              transition={{ ease: "linear", duration: 50, repeat: Infinity }}
            >
              {sponsors.map((sponsor, idx) => (
                <div key={idx} className="w-[90px] md:w-[115px] flex-shrink-0 flex items-center justify-center bg-white rounded-md p-2 md:p-3 shadow-sm hover:shadow-md transition-shadow">
                  <img src={sponsor.src} alt={sponsor.name} className="w-full h-auto object-contain max-h-10 md:max-h-14" />
                </div>
              ))}
              {sponsors.map((sponsor, idx) => (
                <div key={`repeat-${idx}`} className="w-[90px] md:w-[115px] flex-shrink-0 flex items-center justify-center bg-white rounded-md p-2 md:p-3 shadow-sm hover:shadow-md transition-shadow">
                  <img src={sponsor.src} alt={sponsor.name} className="w-full h-auto object-contain max-h-10 md:max-h-14" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold">Thinkers and Problem Solvers Competition</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An international art and educational platform discovering and rewarding talented young minds.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-2 text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link to="/skill-acquisition" className="hover:text-primary transition">Skill Acquisition</Link></li>
              <li><Link to="/about" className="hover:text-primary transition">About Contest</Link></li>
              <li><Link to="/winners-artwork" className="hover:text-primary transition">Winners' Artwork</Link></li>
              <li><Link to="/activities" className="hover:text-primary transition">Activities in Each Country</Link></li>
              <li><Link to="/judges" className="hover:text-primary transition">Panel of Judges</Link></li>
              <li><Link to="/video-gallery" className="hover:text-primary transition">Video Gallery</Link></li>
              <li><Link to="/artwork-gallery" className="hover:text-primary transition">Artwork Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-widest uppercase">Global Locations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>United Kingdom</li>
              <li>Canada</li>
              <li>Ireland</li>
              <li>Africa</li>
              <li>United States & Europe</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-widest uppercase">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Tel: +2348103833239</li>
              <li>Email: worldthinkerscompetition@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-[11px] font-medium text-muted-foreground uppercase tracking-widest flex flex-col md:flex-row justify-between items-center">
          <p>Thinkers and Problem Solvers Competition — Founded 1990. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 italic">"Building Creative Minds for Global Solutions."</p>
        </div>
      </div>
    </footer>
  );
}
