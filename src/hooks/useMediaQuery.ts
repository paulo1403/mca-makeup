import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkIsMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export const useIsSmallMobile = () => {
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkIsSmallMobile = () => {
      setIsSmallMobile(window.innerWidth < 640);
    };

    // Check on mount
    checkIsSmallMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsSmallMobile);

    return () => {
      window.removeEventListener('resize', checkIsSmallMobile);
    };
  }, []);

  return isSmallMobile;
};
