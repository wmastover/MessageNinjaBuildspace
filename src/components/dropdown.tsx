import React, { ChangeEvent } from 'react';
import { BiChevronDown } from 'react-icons/bi';

interface DropdownProps {
  options: string[];
  initialValue?: string;
  selectedOption: string | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, initialValue, selectedOption, setSelectedOption }) => {
  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="dropdown-container">
      <select className="selectBox" value={selectedOption || ''} onChange={handleDropdownChange}>
        <option value="" disabled>Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <BiChevronDown className='dropdown-icon'/>
    </div>
  );
};
