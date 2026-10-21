import localFont from "next/font/local";

// urbanist-normal.ttf is Urbanist Light (300), not Regular.
export const urbanist = localFont({
  src: [
    { path: "./urbanist-thin.ttf", weight: "100", style: "normal" },
    { path: "./urbanist-normal.ttf", weight: "300", style: "normal" },
    { path: "./urbanist-black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-urbanist",
  display: "swap",
});
