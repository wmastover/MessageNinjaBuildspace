import React, { useState, ChangeEvent } from 'react';

interface DropdownProps {
  options: string[];
}

export const Dropdown: React.FC<DropdownProps> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <select value={selectedOption || ''} onChange={handleDropdownChange}>
        <option value="" disabled>Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      {selectedOption && <div>You selected: {selectedOption}</div>}
    </div>
  );
};