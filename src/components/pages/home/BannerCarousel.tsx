import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { BannerPopulated } from '@/types/sanity.types';
import { getBannerLinkUrl, shouldOpenInNewTab } from '@/types/sanity.types';
import { urlFor } from '@/utils/sanity.utils';

interface BannerCarouselProps {
  banners: BannerPopulated[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 20,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-full overflow-hidden bg-gray-100 aspect-[16/5] md:aspect-[16/5]">
      {/* Embla Viewport */}
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {banners.map((banner) => {
            const linkUrl = getBannerLinkUrl(banner);
            const openInNewTab = shouldOpenInNewTab(banner.link);
            const imageUrl = urlFor(banner.imagen).width(1920).height(600).url();
            const imageSrcSet = `
              ${urlFor(banner.imagen).width(640).height(200).format('webp').url()} 640w,
              ${urlFor(banner.imagen).width(1024).height(320).format('webp').url()} 1024w,
              ${urlFor(banner.imagen).width(1920).height(600).format('webp').url()} 1920w
            `;

            return (
              <div
                key={banner._id}
                className="flex-[0_0_100%] min-w-0 relative"
              >
                {linkUrl ? (
                  <a
                    href={linkUrl}
                    target={openInNewTab ? '_blank' : undefined}
                    rel={openInNewTab ? 'noopener noreferrer' : undefined}
                    aria-label={`Ver ${banner.titulo}`}
                    className="block w-full h-full"
                  >
                    <img
                      src={imageUrl}
                      srcSet={imageSrcSet}
                      sizes="100vw"
                      alt={banner.imagen.alt || banner.titulo}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ) : (
                  <img
                    src={imageUrl}
                    srcSet={imageSrcSet}
                    sizes="100vw"
                    alt={banner.imagen.alt || banner.titulo}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 
                     w-12 h-12 flex items-center justify-center
                     bg-black/50 hover:bg-black/70 
                     text-white rounded-full
                     transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50
                     md:left-5 md:w-14 md:h-14"
            aria-label="Banner anterior"
            type="button"
          >
            <svg 
              className="w-6 h-6 md:w-7 md:h-7" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 
                     w-12 h-12 flex items-center justify-center
                     bg-black/50 hover:bg-black/70 
                     text-white rounded-full
                     transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50
                     md:right-5 md:w-14 md:h-14"
            aria-label="Siguiente banner"
            type="button"
          >
            <svg 
              className="w-6 h-6 md:w-7 md:h-7" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 md:bottom-5 md:gap-2.5">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`
                  w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50
                  ${
                    index === selectedIndex
                      ? 'bg-white scale-110'
                      : 'bg-white/50 hover:bg-white/75'
                  }
                `}
                aria-label={`Ir al banner ${index + 1}`}
                aria-current={index === selectedIndex}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}