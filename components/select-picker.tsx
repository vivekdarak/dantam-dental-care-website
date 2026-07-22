"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import "./select-picker.css";

export type SelectPickerOption = {
  value: string;
  label: string;
  description?: string;
};

export function SelectPicker({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  options: SelectPickerOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div className={`select-picker ${className}`} ref={rootRef}>
      <span className="select-picker-label">{label}</span>
      <button
        className="select-picker-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          <strong>{selected?.label || "Select"}</strong>
          {selected?.description && <small>{selected.description}</small>}
        </span>
        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="select-picker-menu" id={id} role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={isSelected ? "selected" : ""}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>
                  <strong>{option.label}</strong>
                  {option.description && <small>{option.description}</small>}
                </span>
                {isSelected && <Check size={18} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

