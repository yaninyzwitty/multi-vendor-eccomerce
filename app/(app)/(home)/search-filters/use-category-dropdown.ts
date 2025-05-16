import {useRef, useState} from "react";
import {useDropdownPosition} from "./use-dropdown-position";
import {FlattenedCategory} from "@/types";

interface useCategoryDropdownProps {
  category: FlattenedCategory;
}
export const useCategoryDropdown = ({category}: useCategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {getdropdownPosition} = useDropdownPosition(dropdownRef);
  const dropdownPosition = getdropdownPosition();


  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const toggleDown = () => {
       if(category.subcategories?.length) {
      setIsOpen(!isOpen)
    }

  }

  const onMouseLeave = () => setIsOpen(false);

  return {
    isOpen,
    dropdownPosition,
    onMouseEnter,
    onMouseLeave,
    dropdownRef,
    toggleDown
  };
};
