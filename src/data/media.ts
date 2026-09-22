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
  // Show in black and white, with true color in a small circle around the cursor.
  colorSpot?: boolean;
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
    src: "/media/portrait.jpg",
    alt: "Joshua Gottus in front of an IEEE banner",
    hint: "Headshot or working portrait, square",
    aspect: "1 / 1",
    imgClassName: "grayscale pointer-fine:grayscale-0",
    colorSpot: true,
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

// Project detail pages, keyed by project slug. The cover runs full width
// under the title. Gallery items sit in a row further down the page.
// Projects missing here keep the typographic cover.
export interface ProjectMedia {
  cover: MediaSlot;
  gallery: MediaSlot[];
}

export const projectMedia: Record<string, ProjectMedia> = {
  "southeastcon-2026-ground-robot": {
    cover: {
      src: "/media/projects/secon-bench.mp4",
      alt: "The ground robot on the floor next to a laptop showing a firmware build",
      hint: "SECON robot, landscape",
      aspect: "16 / 9",
    },
    gallery: [
      {
        src: "/media/projects/secon-run.mp4",
        alt: "The robot driving on the SoutheastCon 2026 competition field",
        hint: "Robot on the field, portrait",
        aspect: "9 / 16",
        caption: "Demo Run on the competition field",
      },
      {
        src: "/media/projects/secon-team.jpg",
        alt: "Some of the Florida Poly team with the robot in front of the IEEE backdrop",
        hint: "Team photo, landscape",
        aspect: "16 / 9",
        caption: "Some of the SoutheastCon 2026 team",
      },
    ],
  },
  "microtransit-gps-tracker": {
    cover: {
      src: "/media/projects/gps-drive.mp4",
      alt: "The tracker board in a car while a laptop shows its position on a live map",
      hint: "Tracker on a live map, landscape",
      aspect: "16 / 9",
    },
    gallery: [
      {
        src: "/media/projects/gps-board.jpg",
        alt: "Tracker hardware: modem shield, GPS antenna, and LTE antenna",
        hint: "Tracker board, portrait",
        aspect: "9 / 16",
        caption: "Tracker hardware",
      },
    ],
  },
};
