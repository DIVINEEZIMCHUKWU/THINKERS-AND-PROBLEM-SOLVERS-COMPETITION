import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold">Thinkers and Problem Solvers Competition</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An international art and educational platform discovering and rewarding talented young minds.
            </p>
            <p className="text-xs text-muted-foreground pt-4">Est. 1990</p>
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
