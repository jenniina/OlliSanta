import type { OnBeforePrerenderStartSync } from "vike/types"

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = () => {
  // Only public pages; protected/admin routes are intentionally excluded.
  return [
    "/",
    "/en",

    "/tietoa",
    "/en/about",

    "/yhteys",
    "/yhteys/sovitus",
    "/yhteys/savellys",
    "/yhteys/osien-nauhoitukset",
    "/yhteys/nuottikirjoitus",

    "/en/contact",
    "/en/contact/arrangement",
    "/en/contact/composition",
    "/en/contact/parts",
    "/en/contact/notation",

    "/login",
  ]
}
