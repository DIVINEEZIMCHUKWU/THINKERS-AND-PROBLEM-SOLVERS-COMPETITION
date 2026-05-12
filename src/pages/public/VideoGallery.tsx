import HeroSlider from '@/components/common/HeroSlider';
import { useAppStore } from '@/store';

function getEmbedUrl(url: string, type: 'youtube' | 'drive') {
  if (type === 'youtube') {
    // extract youtube ID
    let videoId = '';
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    if (match && match[1]) {
      videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (type === 'drive') {
    // extract drive ID
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }
  return url; // fallback
}

export default function VideoGallery() {
  const { videos } = useAppStore();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden bg-slate-900 border-b-[6px] border-transparent [border-image:linear-gradient(to_right,var(--color-destructive),var(--color-accent),var(--color-primary))_1]">
        <HeroSlider />
        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <div className="bg-background/95 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] bg-clip-text text-transparent pb-2 inline-block">VIDEO GALLERY</h1>
            <p className="text-xl text-foreground">Witness the energy and excitement of our creative youth.</p>
          </div>
        </div>
      </section>
      <section className="py-24 container mx-auto px-4 text-center">
        {videos.length === 0 ? (
          <p className="text-muted-foreground text-xl">No videos are currently available for display.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(v => {
              const embedUrl = getEmbedUrl(v.videoUrl, v.type);
              const isEmbed = embedUrl.includes('embed') || embedUrl.includes('preview');
              
              return (
                <div key={v.id} className="bg-muted/10 border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-transform group">
                  {isEmbed ? (
                    <div className="aspect-video w-full bg-black">
                      <iframe 
                        src={embedUrl} 
                        className="w-full h-full" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-slate-200 flex items-center justify-center p-4">
                      <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all whitespace-normal">
                        Click here to view video link
                      </a>
                    </div>
                  )}
                  <div className="p-4 text-left border-t bg-background">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2">{v.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{v.type}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
