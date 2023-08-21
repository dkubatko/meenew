import React, { useState, useRef, useEffect } from 'react';

type InlineInputButtonProps = {
  onSubmit: (input: string) => void;
  className: string;
  initialValue?: string;
  children?: React.ReactNode;
};

export default function InlineInputButton({ onSubmit, className, initialValue, children }: InlineInputButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || '');

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
      onSubmit(value);
      handleBlur();
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
        </>
      )
      : (
        <button className={className} onClick={handleButtonClick}>
          {children}
        </button>
      )
  );
}