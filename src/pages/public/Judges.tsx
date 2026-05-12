import HeroSlider from '@/components/common/HeroSlider';

export default function Judges() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden bg-slate-900 border-b-[6px] border-transparent [border-image:linear-gradient(to_right,var(--color-destructive),var(--color-accent),var(--color-primary))_1]">
        <HeroSlider />
        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <div className="bg-background/95 p-6 md:p-12 rounded-[2rem] shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 max-w-4xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] bg-clip-text text-transparent pb-2 inline-block">PANEL OF JUDGES</h1>
            <p className="text-base md:text-xl text-foreground">World-class educators and artists evaluating talent.</p>
          </div>
        </div>
      </section>
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
             <div key={i} className="bg-white border text-center border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 overflow-hidden mb-4">
                  <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="Judge" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold">Judge {i}</h3>
                <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Art Director</p>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}
