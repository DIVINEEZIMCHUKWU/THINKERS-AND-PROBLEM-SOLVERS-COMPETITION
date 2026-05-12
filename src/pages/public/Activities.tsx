import HeroSlider from '@/components/common/HeroSlider';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore } from '@/store';

const allCategories = ["DRAWING WORKSHOP & EVENT", "AWARD EVENT", "ARTWORK EXHIBITION", "OTHERS"];
const allContests = ["7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th"];
const allCountries = [
  "Algeria", "Angola", "Argentina", "Australia", "Bahrain", "Bangladesh", "Bhutan", "Bolivia", "Botswana", "Brazil", 
  "Brunei", "Cambodia", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Curacao", "Dominican Republic", "Ecuador", 
  "Egypt", "El Salvador", "Ethiopia", "Fiji", "France", "Gabon", "Ghana", "Guatemala", "Honduras", "Hong Kong", 
  "India", "Indonesia", "Iraq", "Ivory Coast", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", 
  "Laos", "Lebanon", "Lesotho", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mauritius", "Mexico", "Mongolia", 
  "Morocco", "Myanmar", "Namibia", "Nepal", "New Zealand", "Nicaragua", "Nigeria", "Oman", "Pakistan", "Panama", 
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Puerto Rico", "Qatar", "Russia", "Rwanda", "Saudi Arabia", 
  "Senegal", "Singapore", "South Africa", "South Korea", "Sri Lanka", "Swaziland", "Taiwan", "Tajikistan", "Tanzania", 
  "Thailand", "Turkey", "UAE", "Uganda", "UK", "Uruguay", "USA", "Uzbekistan", "Venezuela", "Vietnam", "Zambia", "Zimbabwe"
].sort();

const defaultActivities = [
  { id: '1', region: 'Asia', country: 'Japan', contest: '18th', category: 'AWARD EVENT', title: 'Kid Showcasing Artwork', image: 'https://i.ibb.co/DH9t0m0R/Kids-and-Creativity-The-Benefits-of-Drawing-with-Children.jpg', date: '2023-11-20' },
];

export default function Activities() {
  const { activities } = useAppStore();
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedContest, setSelectedContest] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeRegion, setActiveRegion] = useState<string>("all");

  const regions = ['Europe', 'Africa', 'Asia', 'Americas'];
  
  const activitiesData = useMemo(() => {
    const storeMapped = activities.map(item => ({
      id: item.id,
      region: 'Others',
      country: item.country || 'Global',
      contest: item.contestNumber || 'Latest',
      category: 'AWARD EVENT',
      title: item.title,
      image: item.imageUrl,
      date: new Date().toISOString().split('T')[0],
    }));

    // if store has elements, default might also be appended or we just show both
    return [...storeMapped, ...defaultActivities];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activitiesData.filter(activity => {
      if (selectedCountry !== 'all' && activity.country !== selectedCountry && activity.country !== 'Global') return false;
      if (selectedContest !== 'all' && activity.contest !== selectedContest && activity.contest !== 'Latest') return false;
      if (selectedCategory !== 'all' && activity.category !== selectedCategory) return false;
      if (activeRegion !== 'all' && activity.region !== activeRegion && activity.region !== 'Others') return false;
      return true;
    });
  }, [selectedCountry, selectedContest, selectedCategory, activeRegion, activitiesData]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden bg-slate-900 border-b-[6px] border-transparent [border-image:linear-gradient(to_right,var(--color-destructive),var(--color-accent),var(--color-primary))_1]">
        <HeroSlider />
        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <div className="bg-background/95 p-6 md:p-12 rounded-[2rem] shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 max-w-4xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] bg-clip-text text-transparent pb-2 inline-block">ACTIVITIES IN EACH COUNTRY</h1>
            <p className="text-base md:text-xl text-foreground">Explore what young thinkers are doing globally.</p>
          </div>
        </div>
      </section>

      {/* Filter Section directly matching reference style */}
      <section className="bg-muted py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full md:w-[200px] bg-background">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Countries</SelectItem>
                {allCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedContest} onValueChange={setSelectedContest}>
              <SelectTrigger className="w-full md:w-[200px] bg-background">
                <SelectValue placeholder="All Contests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contests</SelectItem>
                {allContests.map(c => <SelectItem key={c} value={c}>{c} Contest</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-background">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 container mx-auto px-4 flex flex-col md:flex-row gap-12 items-start">
        {/* Main Grid View */}
        <div className="flex-1 w-full order-2 md:order-1">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 pb-4 border-b">National Contest</h2>
          
          <AnimatePresence mode="popLayout">
            {filteredActivities.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center text-muted-foreground bg-muted/30 rounded-2xl border border-dashed"
              >
                No activities found matching your criteria.
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full overflow-hidden flex flex-col hover:shadow-xl transition-all group border-border/50">
                      <Dialog>
                        <DialogTrigger nativeButton={false} render={<div className="aspect-[4/3] bg-muted relative overflow-hidden shrink-0 cursor-pointer" />}>
                          <img 
                            src={activity.image} 
                            alt={activity.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="bg-background/90 backdrop-blur text-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                              {activity.country}
                            </span>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none flex flex-col justify-center items-center">
                          <img src={activity.image} alt={activity.title} className="w-full h-auto max-h-[85vh] object-contain drop-shadow-2xl rounded-lg" />
                          <p className="text-white text-lg font-medium mt-4 bg-black/50 px-4 py-2 rounded max-w-full text-center">{activity.title}</p>
                        </DialogContent>
                      </Dialog>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                          {activity.contest} Contest • {activity.category}
                        </div>
                        <h3 className="font-bold text-lg mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {activity.title}
                        </h3>
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/40 text-muted-foreground text-sm cursor-pointer hover:text-primary">
                          <span>{activity.date}</span>
                          <span className="flex items-center font-medium text-xs uppercase tracking-wider">
                            Details <ChevronRight className="w-3 h-3 ml-1" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Region Sidebar */}
        <aside className="w-full md:w-64 shrink-0 order-1 md:order-2 md:sticky md:top-28">
           <div className="bg-muted/50 p-6 rounded-3xl border border-border/50">
            <h3 className="font-extrabold text-lg mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Region
            </h3>
            <ul className="space-y-2">
               {/*...*/}
              <li>
                <button
                  onClick={() => setActiveRegion('all')}
                  className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all ${
                    activeRegion === 'all' 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'hover:bg-background bg-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All Regions
                </button>
              </li>
              {regions.map(region => (
                <li key={region}>
                  <button
                    onClick={() => setActiveRegion(region)}
                    className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all ${
                      activeRegion === region 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'hover:bg-background bg-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {region}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
