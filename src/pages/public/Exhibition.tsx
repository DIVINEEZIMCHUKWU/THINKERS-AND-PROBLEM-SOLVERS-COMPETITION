import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import HeroSlider from '@/components/common/HeroSlider'

export default function Exhibition() {
  const artworks = [
    { id: 1, title: 'The Future City', artist: 'Amara N.', country: 'Nigeria', category: 'Painting', awards: 'Best Creative Design', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&sig=1' },
    { id: 2, title: 'Connection', artist: 'Liam Smith', country: 'United Kingdom', category: 'Abstract', awards: '1st Place', img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400&sig=2' },
    { id: 3, title: 'Nature\'s Harmony', artist: 'Chloe B.', country: 'Canada', category: 'Pencil Drawing', awards: '2nd Place', img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=400&sig=3' },
    { id: 4, title: 'The Global Dream', artist: 'Kofi F.', country: 'Ghana', category: 'Painting', awards: 'Best Use of Color', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400&sig=4' },
    { id: 5, title: 'Urban Light', artist: 'Sophie L.', country: 'United States', category: 'Digital Art', awards: 'Innovation Award', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400&sig=5' },
    { id: 6, title: 'Heritage', artist: 'Buhle M.', country: 'South Africa', category: 'Cultural Art', awards: 'Top Regional', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&sig=6' },
  ]

  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden bg-slate-900 border-b-[6px] border-transparent [border-image:linear-gradient(to_right,var(--color-destructive),var(--color-accent),var(--color-primary))_1]">
        <HeroSlider />
        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <div className="bg-background/95 p-6 md:p-12 rounded-[2rem] shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 max-w-4xl">
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] bg-clip-text text-transparent pb-2 inline-block">ARTWORK GALLERY</h1>
            <p className="text-base md:text-xl text-foreground">
              Every competition cycle culminates in this prestigious exhibition, where the finest creative works are displayed for judges, families, and the international community.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {artworks.map((art, i) => (
            <motion.div 
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all h-full group border-2 border-slate-100 flex flex-col">
                <div className="aspect-square md:aspect-[4/3] bg-muted relative overflow-hidden flex items-center justify-center shrink-0">
                  <img src={art.img} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <CardContent className="p-3 md:p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div>
                      <h3 className="font-serif text-sm md:text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">{art.title}</h3>
                      <p className="text-[10px] md:text-sm font-semibold text-slate-500 uppercase tracking-wide md:tracking-widest line-clamp-1">{art.artist} — {art.country}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-2 mt-auto">
                    <Badge variant="secondary" className="text-[9px] md:text-xs px-1.5 md:px-2.5">{art.category}</Badge>
                    <Badge className="bg-accent text-accent-foreground border-accent text-[9px] md:text-xs px-1.5 md:px-2.5">{art.awards}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
