// types/index.ts
export interface User {
  id: string;
  username: string;
  role: "admin" | "librarian";
  full_name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  quantity: number;
  available: number;
  createdAt?: string;
}

export interface Student {
  id: string;
  name: string;
  action: string;
  number: string;
}

export interface AuthCredential {
  username: string;
  password: string;
  id: string;
  role: "admin" | "librarian";
}

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  en: Translation;
  km: Translation;
}

export interface payload {
  quantity: number;
  category: string;
  id: number;

}