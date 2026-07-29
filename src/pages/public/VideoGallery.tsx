import React, { useEffect, useState } from 'react';
import HeroSlider from '@/components/common/HeroSlider';
import { useAppStore } from '@/store';
import { fetchVideos } from '@/lib/supabase';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Maximize2, Play, ExternalLink } from 'lucide-react';

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
  const { _hasHydrated, videos } = useAppStore();
  const [activeOpenIndex, setActiveOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const hydrate = async () => {
      try {
        const rows = await fetchVideos();
        if (cancelled) return;
        if (Array.isArray(rows) && rows.length > 0) {
          useAppStore.setState((prev: any) => ({
            videos: rows,
            _lastSyncedAt: Date.now(),
          }));
        }
      } catch (err) { console.error('VideoGallery hydrate error:', err); }
    };
    const guard = { ran: false };
    const once = () => {
      if (guard.ran || cancelled) return;
      guard.ran = true;
      hydrate();
    };
    if (_hasHydrated) once();
    timers.push(setTimeout(once, 250));
    timers.push(setTimeout(once, 1200));
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [_hasHydrated]);

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
            {videos.map((v, idx) => {
              const embedUrl = getEmbedUrl(v.videoUrl, v.type);
              const isEmbed = embedUrl.includes('embed') || embedUrl.includes('preview');
              const dialogOpen = activeOpenIndex === idx;
              const iframeAllow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
              
              return (
                <div key={v.id} className="bg-muted/10 border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    {isEmbed ? (
                      <>
                        <iframe
                          key={`thumb-${v.id}`}
                          src={embedUrl}
                          className="w-full h-full pointer-events-none select-none"
                          aria-hidden={dialogOpen}
                          tabIndex={-1}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                            <Dialog open={dialogOpen} onOpenChange={o => setActiveOpenIndex(o ? idx : null)}>
                              <DialogTrigger asChild>
                                <button
                                  type="button"
                                  aria-label={`Maximize ${v.title || 'video'} in full preview`}
                                  title="Full preview (no redirect)"
                                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-black/30 px-5 py-3 font-bold text-sm sm:text-base">
                                  <Maximize2 className="w-5 h-5" />
                                  <span>Full Preview</span>
                                </button>
                              </DialogTrigger>
                              <DialogContent className="w-[95vw] max-w-[1100px] p-0 border-none shadow-2xl bg-black rounded-2xl overflow-hidden">
                                <DialogTitle className="sr-only">
                                  {v.title || 'Video full preview'}
                                </DialogTitle>
                                <div className="w-full bg-black">
                                  <div className="aspect-video w-full bg-black">
                                    {dialogOpen && (
                                      <iframe
                                        key={`full-${v.id}-${dialogOpen}`}
                                        src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`}
                                        className="w-full h-full border-0"
                                        allow={iframeAllow}
                                        allowFullScreen
                                        referrerPolicy="no-referrer"
                                        title={v.title || 'Video full preview'}
                                      />
                                    )}
                                  </div>
                                </div>
                                {(v.title || !isEmbed) && (
                                  <div className="p-5 sm:p-6 bg-background border-t text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                      <h3 className="font-bold text-base sm:text-lg leading-tight">
                                        {v.title || 'Untitled video'}
                                      </h3>
                                      {!isEmbed ? (
                                        <a
                                          href={v.videoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 hover:underline">
                                          Open link <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                      ) : (
                                        <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground border rounded-full px-3 py-1 bg-muted/40">
                                          <Play className="w-3 h-3" />
                                          {v.type}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="aspect-video w-full bg-slate-200 flex items-center justify-center p-4">
                        <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all whitespace-normal inline-flex items-center gap-2 font-semibold">
                          <ExternalLink className="w-4 h-4" />
                          Click here to view video link
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-left border-t bg-background">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg leading-tight line-clamp-2">{v.title}</h3>
                        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{v.type}</p>
                      </div>
                      {isEmbed && (
                        <Dialog open={dialogOpen} onOpenChange={o => setActiveOpenIndex(o ? idx : null)}>
                          <DialogTrigger asChild>
                            <button
                              type="button"
                              aria-label={`Maximize ${v.title || 'video'} in full preview`}
                              title="Maximize for full preview"
                              className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-primary hover:text-primary hover:bg-primary/5 text-muted-foreground transition-colors">
                              <Maximize2 className="w-4 h-4" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-[1100px] p-0 border-none shadow-2xl bg-black rounded-2xl overflow-hidden">
                            <DialogTitle className="sr-only">{v.title || 'Video full preview'}</DialogTitle>
                            <div className="w-full bg-black">
                              <div className="aspect-video w-full bg-black">
                                {dialogOpen && (
                                  <iframe
                                    key={`full-${v.id}-${dialogOpen}-2`}
                                    src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`}
                                    className="w-full h-full border-0"
                                    allow={iframeAllow}
                                    allowFullScreen
                                    referrerPolicy="no-referrer"
                                    title={v.title || 'Video full preview'}
                                  />
                                )}
                              </div>
                            </div>
                            {(v.title || !isEmbed) && (
                              <div className="p-5 sm:p-6 bg-background border-t text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                  <h3 className="font-bold text-base sm:text-lg leading-tight">
                                    {v.title || 'Untitled video'}
                                  </h3>
                                  <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground border rounded-full px-3 py-1 bg-muted/40">
                                    <Play className="w-3 h-3" />
                                    {v.type}
                                  </span>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
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
