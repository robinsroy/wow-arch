import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitText(text: string) {
  return text.split('').map((char, i) => ({
    char: char === ' ' ? '\u00A0' : char,
    index: i,
  }));
}

export function splitWords(text: string) {
  return text.split(' ').map((word, i) => ({
    word,
    index: i,
  }));
}
