import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Palette, Languages, Lightbulb, Trophy, Star, ArrowRight, MessageCircle, Award, GraduationCap, School, Users, CheckCircle } from 'lucide-react';
import HeroSlider from '@/components/common/HeroSlider';

const homeHeroImages = [
  "https://i.ibb.co/TqqGThfL/Chalkboard-Art-for-Little-Creators.jpg",
  "https://i.ibb.co/wNW23nyj/Vivid-Chalkboard-Creations.jpg",
  "https://i.ibb.co/VWVvXJyk/Crafting-Magic-with-Markers-Pencils.jpg",
  "https://i.ibb.co/QF8HzRfZ/Building-Self-Confidence.jpg"
];

const kidsImages = [
  {
    src: "https://i.ibb.co/DH9t0m0R/Kids-and-Creativity-The-Benefits-of-Drawing-with-Children.jpg",
    alt: "Kids and Creativity",
    title: "Kids and Creativity"
  },
  {
    src: "https://i.ibb.co/wxbXzJv/Foster-creativity-with-easy-DIY-crafts-like-sidewalk-chalk-art-and-fun-fall-activities.jpg",
    alt: "Foster creativity",
    title: "Foster creativity"
  },
  {
    src: "https://i.ibb.co/VWVvXJyk/Crafting-Magic-with-Markers-Pencils.jpg",
    alt: "Crafting Magic",
    title: "Crafting Magic"
  },
  {
    src: "https://i.ibb.co/QF8HzRfZ/Building-Self-Confidence.jpg",
    alt: "Building Self Confidence",
    title: "Building Self Confidence"
  },
  {
    src: "https://i.ibb.co/SX5YznQT/Is-there-anything-more-magical-than-the-naivety-of.jpg",
    alt: "Magical Naivety",
    title: "Magical Naivety"
  },
  {
    src: "https://i.ibb.co/W4Wq9mVR/Blogger.jpg",
    alt: "Blogger",
    title: "Blogger"
  }
];

const inspiringImages = [
  "https://i.ibb.co/23TzfJpM/IMG-20260513-WA0048.jpg",
  "https://i.ibb.co/7xZf8TC0/IMG-20260513-WA0049.jpg",
  "https://i.ibb.co/vxvVFLTm/IMG-20260513-WA0050.jpg",
  "https://i.ibb.co/4RNVG9VD/IMG-20260513-WA0051.jpg",
  "https://i.ibb.co/LdD5nrtz/IMG-20260513-WA0052.jpg",
  "https://i.ibb.co/CgwtC7y/IMG-20260513-WA0053.jpg",
  "https://i.ibb.co/chW4M9wf/IMG-20260513-WA0054.jpg",
  "https://i.ibb.co/Y4NDSyJM/IMG-20260513-WA0055.jpg",
  "https://i.ibb.co/Fby6PFR9/IMG-20260513-WA0056.jpg",
  "https://i.ibb.co/Xd055ZC/IMG-20260513-WA0057.jpg",
  "https://i.ibb.co/0R2wVhBz/IMG-20260513-WA0058.jpg",
  "https://i.ibb.co/t1wpf34/IMG-20260513-WA0059.jpg",
  "https://i.ibb.co/x8dFt7QH/IMG-20260513-WA0060.jpg",
  "https://i.ibb.co/TBCNhvnk/IMG-20260513-WA0061.jpg",
  "https://i.ibb.co/9k6KsKTF/IMG-20260513-WA0062.jpg",
  "https://i.ibb.co/tPYcKW7x/IMG-20260513-WA0063.jpg",
  "https://i.ibb.co/GfhRH2rm/IMG-20260513-WA0064.jpg",
  "https://i.ibb.co/4ZCY4stR/IMG-20260513-WA0065.jpg"
];

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-background border-b-[6px] border-transparent [border-image:linear-gradient(to_right,var(--color-destructive),var(--color-accent),var(--color-primary))_1]">
        <HeroSlider images={homeHeroImages} />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-8 py-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center max-w-4xl bg-background/95 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10"
          >
            <div className="mb-6 inline-block py-1.5 px-4 bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
              Est. 1990 — International Education
            </div>
            <h1 className="font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[0.95] tracking-tight mb-6 md:mb-8">
              <span className="bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] bg-clip-text text-transparent pb-2 inline-block">Raising Creative Thinkers and Problem Solvers for the Future</span>
            </h1>
            <p className="text-base md:text-xl text-foreground mb-8 md:mb-10 max-w-2xl leading-relaxed">
              An international art and educational competition platform dedicated to discovering, encouraging, and rewarding talented young minds in arts, language, creativity, and problem-solving across continents and cultures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link to="/register/student" className={buttonVariants({ size: "lg", className: "rounded-full text-base px-8 h-12 w-full sm:w-auto font-medium" })}>Register Now</Link>
              <Link to="/categories" className={buttonVariants({ size: "lg", variant: "outline", className: "rounded-full text-base px-8 h-12 w-full sm:w-auto font-medium bg-background" })}>Explore Competitions</Link>
            </div>
            <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-12 w-full pt-8 border-t border-border">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold">250k+</span>
                <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-tighter font-semibold">Students Registered</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold">15+</span>
                <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-tighter font-semibold">Countries Served</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold">$2M+</span>
                <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-tighter font-semibold">Scholarships Awarded</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IMAGE SHOWCASE STRIP */}
      <div className="w-full bg-slate-900 py-10 md:py-12 overflow-hidden flex flex-col gap-6">
         <div className="container mx-auto px-4 text-center mb-2 md:mb-4">
           <h3 className="text-white font-serif text-xl md:text-2xl italic">Inspiring the Next Generation</h3>
         </div>
         <div className="w-full overflow-hidden relative">
           <motion.div 
             className="flex gap-6 px-4 md:px-8 w-max"
             animate={{ x: ["0%", "-50%"] }}
             transition={{ ease: "linear", duration: 30, repeat: Infinity }}
           >
             {[...kidsImages, ...kidsImages].map((image, idx) => (
               <div key={idx} className="w-[280px] md:w-[320px] aspect-square rounded-3xl overflow-hidden shrink-0 shadow-xl border-4 border-white/10 relative group">
                 <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <span className="text-white font-bold text-lg">{image.title}</span>
                 </div>
               </div>
             ))}
           </motion.div>
         </div>

         {/* Second strip for inspiring images, horizontal scroll */}
         <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
           <div className="flex gap-4 px-4 md:px-8 w-max snap-x snap-mandatory">
             {inspiringImages.map((src, idx) => (
               <div key={`inspire-${idx}`} className="w-[180px] md:w-[220px] aspect-square rounded-2xl overflow-hidden shrink-0 shadow-lg snap-center">
                 <img src={src} alt={`Inspiring Activity ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
               </div>
             ))}
           </div>
         </div>
      </div>

      {/* GLOBAL REACH SECTION */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Global Reach</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">Connecting talented students from across the globe in a world-class platform.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {['Nigeria', 'United Kingdom', 'Canada', 'Ireland', 'Ghana', 'Cameroon', 'South Africa', 'United States', 'Europe'].map((country, i) => (
              <motion.div 
                key={country}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-center items-center p-6 bg-background/50 backdrop-blur border-border/50">
                  <Globe className="w-8 h-8 mb-4 text-primary opacity-80" />
                  <span className="font-medium text-center">{country}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Competition Categories</h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl">Discover where your talents shine brightest in our international categories.</p>
            </div>
            <Link to="/categories" className={buttonVariants({ variant: "ghost", className: "group" })}>View All Categories <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" /></Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:rotate-0 transition-transform duration-300 transform -rotate-3 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                  <Palette className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Art Drawing & Painting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">Pencil drawing, colour painting, nature drawing, cultural art, abstract art, and digital art.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Creative Illustration</li>
                  <li>• Digital Art</li>
                  <li>• Cultural Expression</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:rotate-0 transition-transform duration-300 transform rotate-2 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                  <Languages className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">French Spelling Bee & Writing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">French spelling, pronunciation, vocabulary development, essay writing, creative writing, and dictation open across Nursery, Primary, Junior Secondary, and Senior Secondary categories.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Oral Pronunciation</li>
                  <li>• Creative Essay Writing</li>
                  <li>• Vocabulary Challenges</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:rotate-0 transition-transform duration-300 transform -rotate-1 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Creative Problem Solving</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">Innovation, critical thinking, STEM creativity, and logical challenges.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• STEM Innovation</li>
                  <li>• Critical Logic</li>
                  <li>• Out-of-the-box Thinking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* OBJECTIVES OF THE COMPETITION */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Objectives of the Competition</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg hover:italic transition-all">Empowering students through structured creativity and international exposure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Creativity & Imagination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Encourage students to think freely, experiment boldly, and express themselves through art and language.</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Confidence & Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Develop self-assurance and strong communication skills that serve students throughout their academic and professional lives.</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">International Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Build lasting educational connections across nations, fostering cultural exchange through art and language.</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Talent Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Identify and reward exceptional young talents, giving them a platform to shine on an international stage.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* BENEFITS & AWARDS SECTION */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-background">Benefits of Participating</h2>
            <p className="text-muted max-w-2xl mx-auto text-sm md:text-lg opacity-80">A rewarding experience for both students and schools.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            <div className="bg-background/5 p-8 md:p-12 rounded-3xl border border-background/10 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <GraduationCap className="w-8 h-8 text-primary" />
                <h3 className="font-serif text-2xl font-bold text-background">Benefits to Students</h3>
              </div>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" /><span className="text-muted opacity-90">International recognition and exposure</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" /><span className="text-muted opacity-90">Certificates of participation</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" /><span className="text-muted opacity-90">Medals, trophies, and cash prizes</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" /><span className="text-muted opacity-90">Scholarship opportunities</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" /><span className="text-muted opacity-90">Exhibition and portfolio opportunities</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" /><span className="text-muted opacity-90">Confidence building and talent discovery</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" /><span className="text-muted opacity-90">Measurable academic improvement</span></li>
              </ul>
            </div>
            
            <div className="bg-background/5 p-8 md:p-12 rounded-3xl border border-background/10 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <School className="w-8 h-8 text-accent" />
                <h3 className="font-serif text-2xl font-bold text-background">Benefits to Schools</h3>
              </div>
              <ul className="space-y-4 mb-8 text-lg">
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" /><span className="text-muted opacity-90">Educational exposure on an international stage</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" /><span className="text-muted opacity-90">School recognition awards</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" /><span className="text-muted opacity-90">Improved student engagement and participation</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" /><span className="text-muted opacity-90">Promotion of a culture of creativity in schools</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" /><span className="text-muted opacity-90">Partnership and sponsorship opportunities</span></li>
              </ul>
              <div className="bg-accent/10 p-5 rounded-2xl border border-accent/20">
                <p className="text-base text-background opacity-90 leading-relaxed font-medium">
                  Schools that consistently participate are recognized with the <strong className="text-accent">Best Participating School Award</strong>, <strong className="text-accent">Most Creative School Award</strong>, and the <strong className="text-accent">Excellence in Language Development Award</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-background">Awards & Recognition</h2>
            <p className="text-muted max-w-2xl mx-auto text-sm md:text-lg opacity-80">Honoring excellence across all levels of participation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background/10 border-none text-background shadow-xl hover:bg-background/20 transition-colors pt-6">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-serif">Student Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-center text-muted opacity-90 text-lg">
                  <li>Gold, Silver & Bronze Medals</li>
                  <li>Certificates of Achievement</li>
                  <li>Scholarships & Gift Items</li>
                  <li>Cash Prizes up to ₦300,000</li>
                  <li>Laptops & Tablets</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-background/10 border-none text-background shadow-xl hover:bg-background/20 transition-colors pt-6">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-10 h-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-serif">School Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-center text-muted opacity-90 text-lg">
                  <li>Best Participating School Award</li>
                  <li>Most Creative School Award</li>
                  <li>Excellence in Language Development</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-background/10 border-none text-background shadow-xl hover:bg-background/20 transition-colors pt-6">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-10 h-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl font-serif">Supervisor Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-center text-muted opacity-90 text-lg">
                  <li>Recognition Certificates</li>
                  <li>Volunteer Appreciation Awards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* EXHIBITION & PRIZES SECTION */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="mb-12 md:mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-center">Student Art Exhibition</h2>
            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed text-center max-w-4xl mx-auto">
              Every competition cycle culminates in a prestigious Student Art Exhibition — both online and in-person — where the finest creative works are displayed for judges, families, and the international community to celebrate. Featured categories include Best Drawing, Best Painting, Best Creative Design, Best Cultural Artwork, Best French Writer, and Best French Speller.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 md:mb-10 text-center">Prize Structure</h2>
            <div className="overflow-x-auto rounded-3xl border border-border/50 shadow-xl bg-background/50 backdrop-blur mb-8 w-full max-w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-xs md:text-sm uppercase tracking-wider">
                    <th className="px-3 md:px-6 py-4 font-semibold border-b border-border/50">Category</th>
                    <th className="px-3 md:px-6 py-4 font-semibold border-b border-border/50">Position</th>
                    <th className="px-3 md:px-6 py-4 font-semibold border-b border-border/50">School</th>
                    <th className="px-3 md:px-6 py-4 font-semibold border-b border-border/50">Prizes Awarded</th>
                  </tr>
                </thead>
                <tbody className="bg-card text-foreground text-xs md:text-base">
                  <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-3 md:px-6 py-4 md:py-5 font-medium">Drawing Competition</td>
                    <td className="px-3 md:px-6 py-4 md:py-5 text-primary font-semibold">1st Place</td>
                    <td className="px-3 md:px-6 py-4 md:py-5 text-muted-foreground">TBA</td>
                    <td className="px-3 md:px-6 py-4 md:py-5">Scholarship, laptop, award plaque, medals & certificate</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-3 md:px-6 py-4 md:py-5 font-medium">Painting Competition</td>
                    <td className="px-3 md:px-6 py-4 md:py-5 text-primary font-semibold">2nd Place</td>
                    <td className="px-3 md:px-6 py-4 md:py-5 text-muted-foreground">TBA</td>
                    <td className="px-3 md:px-6 py-4 md:py-5">₦300k cash prize, tablet, award plaque, medals & certificate</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-3 md:px-6 py-4 md:py-5 font-medium">French Spelling Bee</td>
                    <td className="px-3 md:px-6 py-4 md:py-5 text-primary font-semibold">1st Place</td>
                    <td className="px-3 md:px-6 py-4 md:py-5 text-muted-foreground">TBA</td>
                    <td className="px-3 md:px-6 py-4 md:py-5">₦300k cash prize, tablet, award plaque, medals & certificate</td>
                  </tr>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="px-3 md:px-6 py-4 md:py-5 font-medium">Essay Writing</td>
                    <td className="px-3 md:px-6 py-4 md:py-5 text-primary font-semibold">2nd Place</td>
                    <td className="px-3 md:px-6 py-4 md:py-5 text-muted-foreground">TBA</td>
                    <td className="px-3 md:px-6 py-4 md:py-5">₦300k cash prize, tablet, award plaque, medals & certificate</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto italic">
              Exhibition artworks are displayed both online and physically. Winners' photos, certificates, and judges' appreciation notes are published on the official competition platform.
            </p>
          </div>
        </div>
      </section>

      {/* PARTNER & SPONSOR SECTION */}
      <section id="sponsor-section" className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 md:mb-6">Partner & Sponsor With Us</h2>
            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
              We actively seek partnerships with forward-thinking organizations that share our commitment to education, creativity, and youth empowerment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <Card className="rounded-3xl border-none shadow-xl bg-background/50 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl text-primary font-bold">We Welcome</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 md:space-y-4 text-muted-foreground text-sm md:text-lg">
                  <li className="flex items-center gap-3"><Star className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" /> Schools and academic institutions</li>
                  <li className="flex items-center gap-3"><Star className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" /> Educational organizations and NGOs</li>
                  <li className="flex items-center gap-3"><Star className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" /> Art institutions and galleries</li>
                  <li className="flex items-center gap-3"><Star className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" /> Corporate sponsors and foundations</li>
                  <li className="flex items-center gap-3"><Star className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" /> International partners and embassies</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-none shadow-xl bg-background/50 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl text-primary font-bold">Sponsorship Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 md:space-y-4 text-muted-foreground text-sm md:text-lg">
                  <li className="flex items-center gap-3"><Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" /> Brand visibility across international platforms</li>
                  <li className="flex items-center gap-3"><Globe className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" /> International recognition and media coverage</li>
                  <li className="flex items-center gap-3"><Languages className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" /> Direct educational impact on thousands of students</li>
                  <li className="flex items-center gap-3"><Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" /> Contribution to community and national development</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 md:mt-16 text-center">
            <p className="text-base md:text-lg font-medium">To explore partnership opportunities, contact us at:</p>
            <a href="mailto:worldthinkerscompetition@gmail.com" className="text-primary font-bold text-sm sm:text-base md:text-2xl hover:text-accent hover:underline hover:scale-105 transition-all mt-2 inline-block break-all">worldthinkerscompetition@gmail.com</a>
          </div>
        </div>
      </section>
      
      {/* ADDITIONAL SERVICES SECTION */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Additional Services: Visa Assistance & Online Registrations</h2>
            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
              Beyond our flagship educational competition, Thinkers and Problem Solvers Competition proudly extends a range of professional support services to students and adults seeking international opportunities or official business and regulatory registrations. Our experienced team guides you through every step from documentation to submission.
            </p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-primary">Visa & Relocation Assistance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Student Visa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We assist students in navigating the student visa application process to any country of choice including the UK, Canada, Ireland, the United States, South Africa, and more. Our team supports document preparation, application forms, and submission guidance to maximize approval chances.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Work Visa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Adults seeking employment opportunities abroad can access our dedicated work visa support service. We help with application requirements, employer documentation, and country-specific regulatory compliance to support a smooth transition to international employment.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Relocation Visa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Planning to relocate your family or yourself to a new country? Our relocation visa service covers all categories of movement from permanent residency applications to dependent visa support for any destination country of your choice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-accent">Online Business & Regulatory Registrations</h3>
            <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
              We also provide fast, reliable assistance with a range of official online registrations for individuals and businesses in Nigeria and beyond. Whether you're starting a new business, securing regulatory approvals, or fulfilling compliance requirements, our team handles the process efficiently on your behalf.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">CAC — Corporate Affairs Commission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Business name registration and company incorporation in Nigeria. We handle all documentation and filing on your behalf, ensuring your business is fully legally recognized.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">NAFDAC Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    National Agency for Food and Drug Administration and Control (NAFDAC) product registration for food, beverages, cosmetics, and pharmaceuticals. Full application support from documentation to approval.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">TIN — Tax Identification Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Obtain your Tax Identification Number quickly and correctly. Required for all businesses and individuals engaging in formal financial transactions in Nigeria.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-shadow bg-background/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">SCUML Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Special Control Unit Against Money Laundering (SCUML) registration for Designated Non-Financial Institutions (DNFIs). We guide eligible organizations through the registration requirements and compliance process.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-16 text-center bg-background/80 p-8 rounded-3xl border border-border shadow-md">
              <h4 className="text-xl font-bold mb-4 text-primary">Contact us today for any of these services:</h4>
              <p className="text-lg md:text-2xl font-medium mb-2">+234 810 383 3239</p>
              <a href="mailto:worldthinkerscompetition@gmail.com" className="text-accent hover:underline font-medium break-all">worldthinkerscompetition@gmail.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* ART STUDIO & SALES SECTION */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-primary">Art Materials, Studio Setup & Training</h2>
            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
              Equipping the next generation of creatives with top-tier materials and state-of-the-art facilities. We provide comprehensive setup services for schools and individuals, along with specialized training programs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <Card className="rounded-3xl border-none shadow-xl bg-accent/5 backdrop-blur overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-accent" />
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-serif">What We Sell & Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Art Materials, Tools & Equipment</h4>
                      <p className="text-muted-foreground text-sm">Premium supplies for professionals and students alike.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Art Studio Setup</h4>
                      <p className="text-muted-foreground text-sm">Complete physical and inspirational environments for creativity.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Drawing & Technical Labs</h4>
                      <p className="text-muted-foreground text-sm">Specialized setups for technical drawing and drafting laboratories.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-primary font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Computer Laboratories</h4>
                      <p className="text-muted-foreground text-sm">Modern tech setups optimized for digital art and general computing.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-xl bg-primary/5 backdrop-blur overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full -z-10" />
              <div className="h-2 bg-gradient-to-l from-primary to-accent" />
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-serif">Training & Development</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-background rounded-2xl shadow-sm border border-border/50 mb-6 relative z-10">
                  <h4 className="font-bold text-xl mb-3 text-primary">Specialized Children's Training</h4>
                  <p className="text-muted-foreground mb-4">
                    We run interactive, practical, and highly engaging training sessions specifically designed for children to develop essential creative and life skills:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="font-medium">Fine Arts & Crafts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="font-medium">Garment Making & Tailoring</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="font-medium">Foreign Language Acquisition</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center mt-6">
                   <p className="font-medium mb-2">Interested in our setups or training?</p>
                   <a href="mailto:worldthinkerscompetition@gmail.com" className="text-accent hover:underline font-bold">Contact us today</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8">Join the Next Generation<br/>of Global Creative Leaders</h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10">
            Secure your registration today to participate in the upcoming competition cycle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link to="/register/student" className={buttonVariants({ size: "lg", className: "rounded-full px-8 h-12 md:h-14 text-base md:text-lg w-full sm:w-auto" })}>Register a Student</Link>
            <a href="#sponsor-section" className={buttonVariants({ size: "lg", variant: "outline", className: "rounded-full px-8 h-12 md:h-14 text-base md:text-lg bg-background w-full sm:w-auto" })}>Become a Sponsor</a>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      </section>
    </div>
  );
}
