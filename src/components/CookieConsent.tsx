import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [show, setShow] = showCookiesBanner();

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t bg-background/95 backdrop-blur shadow-lg border-border">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p className="font-medium mb-1">🍪 We use cookies!</p>
          <p className="text-muted-foreground text-xs">
            Our website uses cookies (like local storage) to ensure you get the best experience on our app, 
            understand how our site is being used, and securely keep your session active. 
            By clicking "Accept All", you consent to our use of these technologies.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" size="sm" onClick={() => setShow(false)}>Decline Optional</Button>
          <Button size="sm" onClick={() => {
            localStorage.setItem('cookieConsent', 'true');
            setShow(false);
          }}>Accept All</Button>
        </div>
      </div>
    </div>
  );
}

function showCookiesBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setShow(true);
    }
  }, []);
  return [show, setShow] as const;
}
