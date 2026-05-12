import React from 'react';
import HeroSlider from '@/components/common/HeroSlider';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore } from '@/store';

const defaultArtworks = [
  'https://i.ibb.co/ZzcMHcf7/1.jpg',
  'https://i.ibb.co/g5L7mt9/2.jpg',
  'https://i.ibb.co/wF2r28kW/3.jpg',
  'https://i.ibb.co/VYHBqRy5/4.jpg',
  'https://i.ibb.co/8g51hzNh/5.jpg',
  'https://i.ibb.co/sdFj69Xc/6.jpg',
  'https://i.ibb.co/zTbtF5gt/7.jpg',
  'https://i.ibb.co/xtDpH4jD/8.jpg'
];

const ArtworkGrid = ({ items, title, defaultImages = [] }: { items: {url: string, title: string}[], title: string, defaultImages?: string[] }) => (
  <div className="mb-12 md:mb-20">
    <h2 className="text-xl md:text-3xl font-extrabold mb-6 md:mb-10 text-center uppercase tracking-widest text-primary">{title}</h2>
    {items.length === 0 && defaultImages.length === 0 ? (
      <p className="text-center text-muted-foreground italic">No artworks uploaded yet.</p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
         {items.map((item, i) => (
           <div key={`store-${i}`}>
             <Dialog>
               <DialogTrigger nativeButton={false} render={<div className="aspect-square bg-slate-100 rounded-xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all relative group cursor-pointer" />}>
                 <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 {item.title && (
                   <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end h-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <p className="text-white font-medium text-xs sm:text-sm truncate">{item.title}</p>
                   </div>
                 )}
               </DialogTrigger>
               <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none flex flex-col justify-center items-center">
                 <img src={item.url} alt={item.title} className="w-full h-auto max-h-[85vh] object-contain drop-shadow-2xl rounded-lg" />
                 {item.title && <p className="text-white text-lg font-medium mt-4 bg-black/50 px-4 py-2 rounded max-w-full text-center">{item.title}</p>}
               </DialogContent>
             </Dialog>
           </div>
         ))}
         {items.length === 0 && defaultImages.map((url, i) => (
           <div key={`default-${i}`}>
             <Dialog>
               <DialogTrigger nativeButton={false} render={<div className="aspect-square bg-slate-100 rounded-xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all relative group cursor-pointer" />}>
                 <img src={url} alt={`Artwork default ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               </DialogTrigger>
               <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none flex justify-center items-center">
                 <img src={url} alt={`Artwork default ${i}`} className="w-full h-auto max-h-[90vh] object-contain drop-shadow-2xl" />
               </DialogContent>
             </Dialog>
           </div>
         ))}
      </div>
    )}
  </div>
);

export default function WinnersArtwork() {
  const { winnersArtwork } = useAppStore();

  const grandPrizes = winnersArtwork.filter(w => w.type === 'GRAND_PRIZES').map(w => ({ url: w.imageUrl, title: `${w.title} | ${w.projectName || ''} | Age: ${w.age || ''} | ${w.personName || ''} | ${w.country || ''}` }));
  const specialAwards = winnersArtwork.filter(w => w.type === 'SPECIAL_AWARDS').map(w => ({ url: w.imageUrl, title: `${w.title} | ${w.projectName || ''} | Age: ${w.age || ''} | ${w.personName || ''} | ${w.country || ''}` }));
  const bestFinalists = winnersArtwork.filter(w => w.type === 'BEST_FINALISTS').map(w => ({ url: w.imageUrl, title: `${w.title} | ${w.projectName || ''} | Age: ${w.age || ''} | ${w.personName || ''} | ${w.country || ''}` }));

  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden bg-slate-900 border-b-[6px] border-transparent [border-image:linear-gradient(to_right,var(--color-destructive),var(--color-accent),var(--color-primary))_1]">
        <HeroSlider />
        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <div className="bg-background/95 p-6 md:p-12 rounded-[2rem] shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 max-w-4xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] bg-clip-text text-transparent pb-2 inline-block">WINNERS' ARTWORK</h1>
            <p className="text-base md:text-xl text-foreground">Celebrating the beautiful creations of our young global talents.</p>
          </div>
        </div>
      </section>
      <section className="py-24 container mx-auto px-4">
        <ArtworkGrid items={grandPrizes} defaultImages={defaultArtworks.slice(0, 2)} title="GRAND PRIZES" />
        <ArtworkGrid items={specialAwards} defaultImages={defaultArtworks.slice(2, 5)} title="SPECIAL AWARDS" />
        <ArtworkGrid items={bestFinalists} defaultImages={defaultArtworks.slice(5, 8)} title="BEST FINALISTS" />
      </section>
    </div>
  );
}
