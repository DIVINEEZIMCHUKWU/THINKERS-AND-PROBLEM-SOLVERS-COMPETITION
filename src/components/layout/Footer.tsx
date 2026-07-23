import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const sponsors = [
    { name: "Toyota", src: "/Images/Toyota.PNG" },
    { name: "Toyota", src: "/Images/Toyota.PNG" },
    { name: "Toyota", src: "/Images/Toyota.PNG" },
    { name: "Toyota", src: "/Images/Toyota.PNG" },
    { name: "Toyota", src: "/Images/Toyota.PNG" },
    { name: "Toyota", src: "/Images/Toyota.PNG" },
    { name: "Toyota", src: "/Images/Toyota.PNG" },
    { name: "Toyota", src: "/Images/Toyota.PNG" }
  ];

  return (
    <footer className="w-full border-t bg-background py-12 md:py-16">
      {/* Inspired By Section */}
      <div className="mb-12 border-b pb-12">
        <div className="mx-auto px-0 sm:px-0">
          <h3 className="font-serif text-lg md:text-3xl font-bold text-center mb-10">Inspired By:</h3>
          <div className="w-full overflow-hidden bg-gradient-to-r from-transparent via-white to-transparent">
            <motion.div
              className="flex gap-8"
              initial={{ x: 0 }}
              animate={{ x: -1000 }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            >
              {sponsors.map((sponsor, idx) => (
                <div key={idx} className="w-[280px] md:w-[340px] flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                  <img src={sponsor.src} alt={sponsor.name} className="w-full h-auto object-contain max-h-40" />
                </div>
              ))}
              {sponsors.map((sponsor, idx) => (
                <div key={`repeat-${idx}`} className="w-[280px] md:w-[340px] flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                  <img src={sponsor.src} alt={sponsor.name} className="w-full h-auto object-contain max-h-40" />
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
