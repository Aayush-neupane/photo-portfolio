export interface Post {
  id: string;
  cat: string;
  date: string;
  read: string;
  title: string;
  img: { src: string; alt: string };
  ex: string;
  cap: string;
  body: string[];
}

export const POSTS: Post[] = [
  { id: 'behind-lens', cat: 'Process', date: 'Feb 12, 2026', read: '6 min read', title: 'What I look for before I lift the camera',
    img: { src: '/gallery/626a63af-6592-4978-9f87-0aedcde84524-1-105-c.jpeg', alt: 'Backlit spider web covered in morning dew' },
    ex: 'Light first, subject second, story always. How a frame gets chosen in the garden.',
    cap: 'Morning garden, backlit.',
    body: [
      'Every frame in this journal starts the same way: I notice the light before I notice the subject. A spider web is invisible until the sun gets low enough to draw it.',
      'That morning the dew did half the work. My job was only to not get in the way — low angle, steady hands, and the patience to wait for the wind to pause.',
      'I shoot the garden most mornings because it forgives beginners and rewards regulars. The same bush looks different every single day.',
      'If you take one thing from this: go back to the same small place ten times. The tenth visit beats the first trip anywhere.',
    ] },
  { id: 'ktm-morning', cat: 'Travel', date: 'Jan 28, 2026', read: '4 min read', title: 'A morning circuit of Boudhanath',
    img: { src: '/gallery/eye-of-buddha.jpeg', alt: 'Boudhanath stupa with marigold offerings under a cloudy sky' },
    ex: 'One kora around the great stupa with a camera — marigolds, pigeons, and midday crowds.',
    cap: 'Boudhanath at midday.',
    body: [
      'Boudhanath at midday is chaos in the best way: pilgrims circling, pigeons erupting off the dome, marigold sellers restocking by the minute.',
      'The trick is to walk the circuit twice. First round with no camera — just watch where the light lands and where people gather.',
      'Second round you already know the three frames you want. The stupa does the rest; it has been photogenic for fourteen centuries.',
      'Best hour for this walk: late morning, when the clouds break and the gold catches fire for about twenty minutes.',
    ] },
  { id: 'finding-light', cat: 'Craft', date: 'Nov 16, 2025', read: '5 min read', title: 'Golden hour is a fifteen-minute appointment',
    img: { src: '/gallery/c16e6414-d1c5-46fa-a8e8-21ca15fcbeb5-1-105-c.jpeg', alt: 'Morning light filtering through green leaves' },
    ex: 'Why the best light of the day is shorter than you think, and how to be ready for it.',
    cap: 'Leaves, first light.',
    body: [
      'Everyone says golden hour lasts an hour. In Jhapa it lasts about fifteen minutes — the sun drops fast behind the hills and the amber goes with it.',
      'So the work happens before: location picked the day prior, battery charged, settings roughly dialed in the dark.',
      'When the light arrives you do not think, you point. Thinking is for the ninety minutes of blue dusk that follows.',
      'Missed it? Go tomorrow. The sun is the most reliable collaborator you will ever have.',
    ] },
  { id: 'moon-watch', cat: 'Night', date: 'Sep 02, 2025', read: '4 min read', title: 'Notes on photographing the moon alone',
    img: { src: '/gallery/f070e163-6925-48f8-af1a-6e39a0720e30-1-105-c.jpeg', alt: 'Copper moon glowing alone in a black night sky' },
    ex: 'The moon is brighter than your meter thinks, and night air is steadier than it feels.',
    cap: 'Copper moon, black sky.',
    body: [
      'The moon is a sunlit rock: expose for daylight and you get detail instead of a white coin. Start around 1/250th and go from there.',
      'A tripod helps, but a wall, a railing, or ten steady seconds of holding still works when the tripod stays home.',
      'Branches make the best foregrounds. A bare moon is astronomy; a moon tangled in a tree is a photograph.',
      'Check the phase before you go out. A full moon washes the sky clean; a crescent leaves the stars in.',
    ] },
  { id: 'story-frame', cat: 'Stories', date: 'Jun 20, 2025', read: '4 min read', title: 'Why I print the keepers',
    img: { src: '/gallery/eye-of-buddha.jpeg', alt: 'Boudhanath stupa with marigold offerings under a cloudy sky' },
    ex: 'Screens forgive everything. Paper forgives nothing — which is exactly why it matters.',
    cap: 'Printed, not just posted.',
    body: [
      'A photo that lives only on a phone is a rumor. Printing it — even small, even cheap — turns it into evidence.',
      'The keepers from these series exist as prints first and pixels second. Editing for paper changed how I shoot: cleaner edges, truer blacks.',
      'You do not need a fine-art lab. A decent local print shop and matte paper will teach you more than any tutorial.',
      'If one frame here moved you, ask about prints. Some walls are still waiting for their picture.',
    ] },
];
