import { RefObject } from "react";

export const useDropdownPosition = (ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>) => {
    const getdropdownPosition = () => {
        if(!ref.current) {
            return {
                top: 0,
                left: 0
            }
        };

        const rect = ref.current.getBoundingClientRect();
        const dropdownWidth = 240; //width of dropdown

        // calculate initial position
        let left = rect.left + window.scrollX;
        const top = rect.bottom + window.scrollY;

    // Check if dropdown would go off the right edge of the viewport
        const viewportWidth = window.innerWidth;
        if (left + dropdownWidth > viewportWidth) {
        left = rect.right + window.scrollX - dropdownWidth ; 

        // if still off screen align to right edge of viewport with some padding
        if (left < 0) {
            left = window.innerWidth - dropdownWidth - 16;
        }


        }

        // Ensure left doesn't go negative (off the left side)
        if (left < 0) {
        left = 16; // 16px padding from left edge
        }

        return { top, left };        

    }

    return {
        getdropdownPosition
    }
}