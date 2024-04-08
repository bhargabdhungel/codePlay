import React, { useEffect } from "react";

export default function useOutsideClick(
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      console.log(ref);
      if (ref && ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
