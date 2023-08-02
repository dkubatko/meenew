import React, { useState, useRef, useEffect } from 'react';
import sharedStyles from '@/app/components/shared/shared.module.css';

type OptionType = {
  id: number;
  value: string;
}

type AddInputButtonProps = {
  onSubmit: (id: number) => void;
  options: OptionType[];
};

export default function AddInputButton({ onSubmit, options }: AddInputButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleButtonClick = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    setValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const selectedOption = options.find(option => option.value === value);
      if (selectedOption) {
        onSubmit(selectedOption.id);
        handleBlur();
      } else {
        alert('Invalid option');
      }
    }
  };

  return (
    isEditing
      ? (
        <>
          <input
            ref={inputRef}
            list="options"
            value={value}
            onChange={event => setValue(event.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={sharedStyles.smallButton}
          />
          <datalist id="options">
            {options.map((option, index) => (
              <option key={index} value={option.value} />
            ))}
          </datalist>
        </>
      )
      : (
        <button className={sharedStyles.smallButton} onClick={handleButtonClick}>
          Add
        </button>
      )
  );
}