import { atom } from "nanostores";

export const activeProduct = atom({
  thumbnail: null,
  name: "",
  price: "",
});

export const productVariations = atom([]);
export const productExtraPrice = atom(0);
export const showContact = atom(false);

export function setCookie(value) {
  cookies.set(value);
}
