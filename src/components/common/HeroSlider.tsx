import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultImages = [
  "https://i.ibb.co/DH9t0m0R/Kids-and-Creativity-The-Benefits-of-Drawing-with-Children.jpg",
  "https://i.ibb.co/wxbXzJv/Foster-creativity-with-easy-DIY-crafts-like-sidewalk-chalk-art-and-fun-fall-activities.jpg",
  "https://i.ibb.co/RTcKtbsm/love-it-photography-is-My-Passion.jpg",
  "https://i.ibb.co/CKngw4ph/How-to-Improve-Critical-Thinking-Skills-with-Fun-Activities.jpg",
  "https://i.ibb.co/wNS0Mfgs/Teach-kids-creativity-with-DIY-crafts-like-chalk-art-toy-making-and-hands-on-projects.jpg",
  "https://i.ibb.co/tpxPz0QJ/Frozen-Paint-Art.jpg",
  "https://i.ibb.co/XxT9njkz/hello-Sania-here-this-beautiful-starry-nights.jpg",
  "https://i.ibb.co/FL3C8mTd/16-Creative-Ideas-for-Inside-Birthday-Parties.jpg",
  "https://i.ibb.co/SDxBVFBM/Messy-and-Fun-Finger-Painting-Ideas-for-Kids-Summer-Art-Activities.jpg",
  "https://i.ibb.co/mV7HTHZG/The-kids-want-to-help-decorate-for-the-holidays-Maybe-they-could-paint-turkeys-and-you-can-call-the.jpg"
];

export default function HeroSlider({ images = defaultImages }: { images?: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * images.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden w-full h-full z-0">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex]}
            alt={`Hero Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/60 z-10" />
    </div>
  );
}
