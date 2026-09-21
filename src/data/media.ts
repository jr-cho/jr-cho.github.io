// Photo and video slots across the site.
// To fill a slot, put the file in public/media/ and set `src`, e.g.
//   src: "/media/secon-field.jpg"
// A .mp4 src plays as a muted loop. Empty slots show a labelled placeholder.

export interface MediaSlot {
  src?: string;
  alt: string;
  // What to shoot. Shown on the placeholder until `src` is set.
  hint: string;
  // Frame shape as CSS aspect-ratio, e.g. "4 / 3".
  aspect: string;
  caption?: string;
  imgClassName?: string;
}

export const media = {
  heroWide: {
    alt: "The SoutheastCon 2026 robot on the competition field",
    hint: "SECON robot on the field, landscape",
    aspect: "16 / 10",
    caption: "SoutheastCon 2026",
  },
  heroTall: {
    alt: "Working at the bench",
    hint: "You at the bench: board, scope, or soldering. Portrait",
    aspect: "4 / 5",
    caption: "Bench",
  },
  portrait: {
    src: "/assets/musashi.svg",
    alt: "Ink portrait of Miyamoto Musashi",
    hint: "Headshot or working portrait, square",
    aspect: "1 / 1",
    imgClassName: "invert",
  },
  flightControl: {
    alt: "Flight Control Data Bus hardware",
    hint: "Flight controller board, or a wiring or task diagram. Portrait",
    aspect: "4 / 5",
    caption: "Flight Control Data Bus",
  },
  secon: {
    alt: "SoutheastCon 2026 ground robot close-up",
    hint: "SECON robot close-up or the team at the event. Landscape",
    aspect: "3 / 2",
    caption: "SoutheastCon 2026 Ground Robot",
  },
  microtransit: {
    alt: "MicroTransit GPS Tracker board and live map",
    hint: "Tracker board with modem, or the live map on a screen. Square",
    aspect: "1 / 1",
    caption: "MicroTransit GPS Tracker",
  },
  skills: {
    alt: "Oscilloscope trace on the bench",
    hint: "Oscilloscope trace, logic analyzer, or bench setup. Portrait",
    aspect: "3 / 4",
  },
  education: {
    alt: "Florida Polytechnic University campus",
    hint: "Florida Poly campus or lab. Landscape",
    aspect: "4 / 3",
  },
  closing: {
    alt: "The robot driving on the competition field",
    hint: "Short video loop (MP4, 5 to 15 s) of the robot driving, or a wide photo",
    aspect: "21 / 9",
  },
} satisfies Record<string, MediaSlot>;

// Project detail pages use these slots, keyed by project slug.
export const projectMedia: Record<string, MediaSlot> = {
  "flight-control-data-bus": media.flightControl,
  "southeastcon-2026-ground-robot": media.secon,
  "microtransit-gps-tracker": media.microtransit,
};
