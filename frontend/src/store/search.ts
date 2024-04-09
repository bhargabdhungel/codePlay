import { RefObject } from "react";
import { atom } from "recoil";
import { SearchOptions } from "../assets/searchData";

// implement search feature

export const showSearchBarAtom = atom({
  key: "showSearchBarAtom",
  default: false as boolean,
});

export const searchValueAtom = atom({
  key: "searchValueAtom",
  default: null as SearchOptions | null,
});

export const searchRefAtom = atom({
  key: "searchRefAtom",
  default: null as RefObject<HTMLDivElement> | null,
});

export const showUserAtom = atom({
  key: "showProfileAtom",
  default: false as boolean,
});

// auth store

export const loggedInAtom = atom({
  key: "loggedInAtom",
  default: false as boolean,
});
