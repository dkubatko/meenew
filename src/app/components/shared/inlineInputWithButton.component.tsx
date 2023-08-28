import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import editIcon from "@/assets/icons/pencil-edit.svg";

type Styles = {
  [className: string]: string;
};

type InlineInputWithButtonProps = {
  onSubmit: (input: string) => void;
  onClick: () => void;
  styles: Styles;
  initialValue: string;
};

export default function InlineInputWithButton({
  onSubmit,
  onClick,
  styles,
  initialValue
}: InlineInputWithButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || '');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  

  const handleBlur = () => {
    setIsEditing(false);
    setValue(initialValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit(value);
      handleBlur();
    }
  };

  return (
    <div
      className={styles.subcategoryTitle}
    >
      {isEditing ? <input
        ref={inputRef}
        list="options"
        value={value}
        onChange={event => setValue(event.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={styles.titleInput}
      /> : <div
        onClick={onClick} 
        className={styles.titleText}>{value}
      </div>
      }
      {
        !isEditing && 
        <div
          className={styles.editIcon}
          onClick={() => setIsEditing(true)}
        >
          <Image src={editIcon} alt={"edit"} className={styles.icon}></Image>
        </div>
      }
    </div>
  );
}