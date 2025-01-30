'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, CircleXIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';

import { cn } from './../utils';
import { MouseEvent, MouseEventHandler, useCallback, useState } from 'react';

export type ComboboxItem = {
  label: string;
  value: string;
};

interface ComboboxProps {
  className?: string;
  items: ComboboxItem[];
  defaultValue?: string | number;
  disabled?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  hiddenItems?: string[];
  clearable?: boolean;
}

export function Combobox({
  className,
  items,
  defaultValue,
  disabled,
  onChange,
  placeholder,
  emptyText,
  searchPlaceholder,
  hiddenItems,
  clearable,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? '');

  const onSelect = useCallback(
    (value: string) => {
      setValue(value);
      setOpen(false);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );

  const onClear = (e: MouseEvent) => {
    e.preventDefault();
    onSelect('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200px] justify-between', className)}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder ?? 'Select...'}
          <div className="flex flex-row">
            {clearable && value && (
              <CircleXIcon onClick={onClear} className="opacity-50 mr-2" />
            )}
            <ChevronsUpDown className="opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[200px] p-0', className)}>
        <Command className="md:min-w-[250px]">
          <CommandInput
            placeholder={searchPlaceholder ?? 'Search...'}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{emptyText ?? 'Not found.'}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  className={cn({
                    hidden: hiddenItems?.includes(item.value),
                  })}
                  key={item.value}
                  value={item.label}
                  onSelect={() => {
                    onSelect(item.value);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
