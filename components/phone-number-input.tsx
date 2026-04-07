"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getCountriesWithMalaysiaFirst } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface PhoneNumberInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  dialCodeName?: FieldPath<TFieldValues>;
  phoneNumberName?: FieldPath<TFieldValues>;
  label?: string;
  phonePlaceholder?: string;
  disabled?: boolean;
}

export function PhoneNumberInput<TFieldValues extends FieldValues>({
  control,
  dialCodeName = "dialCode" as FieldPath<TFieldValues>,
  phoneNumberName = "phoneNumber" as FieldPath<TFieldValues>,
  label = "Phone Number",
  phonePlaceholder = "123456789",
  disabled = false,
}: PhoneNumberInputProps<TFieldValues>) {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const allCountries = useMemo(() => getCountriesWithMalaysiaFirst(), []);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchValue) return allCountries;
    
    const searchLower = searchValue.toLowerCase();
    return allCountries.filter((country) => {
      return (
        country.name.toLowerCase().includes(searchLower) ||
        country.dialCode.includes(searchValue.replace(/\D/g, ""))
      );
    });
  }, [searchValue, allCountries]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex items-start gap-2">
        <FormField
          control={control}
          name={dialCodeName}
          render={({ field }) => {
            const selectedCountry = allCountries.find(
              (c) => String(c.dialCode) === field.value
            );

            const handleSelect = (dialCode: string) => {
              field.onChange(dialCode);
              setSearchValue("");
              setIsOpen(false);
            };

            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (!isOpen) {
                if (e.key === "ArrowDown" || e.key === "Enter") {
                  setIsOpen(true);
                  e.preventDefault();
                }
                return;
              }

              switch (e.key) {
                case "ArrowDown":
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev < filteredCountries.length - 1 ? prev + 1 : prev
                  );
                  break;
                case "ArrowUp":
                  e.preventDefault();
                  setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                  break;
                case "Enter":
                  e.preventDefault();
                  if (filteredCountries[highlightedIndex]) {
                    handleSelect(String(filteredCountries[highlightedIndex].dialCode));
                  }
                  break;
                case "Escape":
                  e.preventDefault();
                  setIsOpen(false);
                  setSearchValue("");
                  break;
              }
            };

            return (
              <FormItem className="relative">
                <FormControl>
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder={selectedCountry && !searchValue ? "" : "Search..."}
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setHighlightedIndex(0);
                        setIsOpen(true);
                      }}
                      onFocus={() => setIsOpen(true)}
                      onKeyDown={handleKeyDown}
                      disabled={disabled}
                      className="w-[5.25rem]"
                    />
                    {selectedCountry && !searchValue && (
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-sm">
                        {selectedCountry.flag} +{selectedCountry.dialCode}
                      </div>
                    )}
                    {isOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-50 mt-1 w-full min-w-[15rem] rounded-md border bg-popover shadow-md"
                        style={{ maxHeight: '300px', overflowY: 'auto' }}
                      >
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country, index) => (
                            <div
                              key={`${country.code}-${country.dialCode}`}
                              className={cn(
                                "cursor-pointer px-2.5 py-1.5 text-xs hover:bg-accent",
                                highlightedIndex === index && "bg-accent"
                              )}
                              onClick={() => handleSelect(String(country.dialCode))}
                              onMouseEnter={() => setHighlightedIndex(index)}
                            >
                              {country.flag} +{country.dialCode} {country.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-2.5 py-5 text-center text-xs text-muted-foreground">
                            No countries found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
        <div className="flex-1">
          <FormField
            control={control}
            name={phoneNumberName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={phonePlaceholder}
                    {...field}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
                      field.onChange(digits);
                    }}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </FormItem>
  );
}
