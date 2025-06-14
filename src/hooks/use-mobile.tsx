
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Set initial value
    checkMobile();
    
    // Listen for resize events with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener("resize", debouncedCheck);
    window.addEventListener("orientationchange", checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedCheck);
      window.removeEventListener("orientationchange", checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    return width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
  });

  React.useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };
    
    // Set initial value
    checkTablet();
    
    // Listen for resize events with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkTablet, 100);
    };
    
    window.addEventListener("resize", debouncedCheck);
    window.addEventListener("orientationchange", checkTablet);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedCheck);
      window.removeEventListener("orientationchange", checkTablet);
      clearTimeout(timeoutId);
    };
  }, []);

  return isTablet;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= TABLET_BREAKPOINT;
  });

  React.useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= TABLET_BREAKPOINT);
    };
    
    // Set initial value
    checkDesktop();
    
    // Listen for resize events with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDesktop, 100);
    };
    
    window.addEventListener("resize", debouncedCheck);
    window.addEventListener("orientationchange", checkDesktop);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedCheck);
      window.removeEventListener("orientationchange", checkDesktop);
      clearTimeout(timeoutId);
    };
  }, []);

  return isDesktop;
}
