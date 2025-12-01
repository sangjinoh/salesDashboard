import { useEffect, useRef, useState } from 'react';

export const useAutoHideScrollbar = (hideDelay: number = 2000) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      setIsScrolling(true);
      
      // 기존 타이머 클리어
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // 새로운 타이머 설정
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, hideDelay);
    };

    element.addEventListener('scroll', handleScroll);
    
    // 초기 상태에서 잠시 스크롤바를 보여주고 숨김
    setIsScrolling(true);
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, hideDelay);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hideDelay]);

  return {
    elementRef,
    isScrolling,
    scrollbarClass: isScrolling ? 'scrollbar-visible' : 'scrollbar-hidden'
  };
};