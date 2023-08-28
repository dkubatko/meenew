import React, { useState, useRef, useEffect } from 'react';

type OptionType = {
  id: number;
  value: string;
}

type inlineOptionsInputButtonProps = {
  onSubmit: (id: number) => void;
  options: OptionType[];
  className: string;
};

export default function InlineOptionsInputButton({ onSubmit, options, className }: inlineOptionsInputButtonProps) {
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
            className={className}
          />
          <datalist id="options">
            {options.map((option, index) => (
              <option key={index} value={option.value} />
            ))}
          </datalist>
        </>
      )
      : (
        <button className={className} onClick={handleButtonClick}>
          Add
        </button>
      )
  );
}