export type Orientation = 'portrait' | 'landscape';

export interface GalleryImage {
  src: string;
  alt: string;
  o: Orientation;
  cap: string;
  meta: string;
  /** Where + in what light, e.g. "Boudhanath, Kathmandu · midday". */
  details: string;
  /** Grease-pencil circle on the contact sheet. */
  select?: boolean;
  /** Crossed out on the contact sheet. */
  reject?: boolean;
}

export interface ProjectCover {
  src: string;
  alt: string;
}

export interface Project {
  id: string;
  n: string;
  title: string;
  cat: string;
  catLabel: string;
  year: string;
  count: number;
  loc: string;
  light: string;
  desc: string;
  cover: ProjectCover;
  images: GalleryImage[];
}

/** Local frames from the photographer's own gallery. */
const G = (f: string): string => `/gallery/${f}`;

export const PROJECTS: Project[] = [
  { id: 'sacred-city', n: '01', title: 'City of Devotion', cat: 'heritage', catLabel: 'Heritage', year: '2025', count: 3, loc: 'Boudhanath · Kathmandu', light: 'Natural light · midday',
    desc: 'A midday walk around the great stupa — marigolds, prayer wheels, and pigeons circling ancient brick.',
    cover: { src: G('eye-of-buddha.jpeg'), alt: 'Boudhanath stupa with marigold offerings and prayer flags under a cloudy sky' },
    images: [
      { src: G('eye-of-buddha.jpeg'), alt: 'Boudhanath stupa with marigold offerings and prayer flags', o: 'portrait', cap: 'Marigold offerings', meta: 'Stupa circuit', details: 'Boudhanath · midday', select: true },
      { src: G('tower-of-heaven.jpeg'), alt: 'Dharahara tower rising into low monsoon clouds', o: 'portrait', cap: 'Tower in monsoon cloud', meta: 'New Dharahara', details: 'Kathmandu · overcast' },
      { src: G('f4bafb15-0bef-4072-a1b0-f8823320514a-1-105-c.jpeg'), alt: 'Rows of prayer wheels at Swoyambhunath', o: 'portrait', cap: 'Prayer wheels in a row', meta: 'Swoyambhunath', details: 'Kathmandu · midday', select: true },
    ] },
  { id: 'golden-hour', n: '02', title: 'Chasing Golden Hour', cat: 'sunsets', catLabel: 'Sunsets', year: '2025', count: 6, loc: 'Jhapa · Eastern Nepal', light: 'Natural light · golden hour',
    desc: 'Evenings in the east, when the whole district turns amber and every tree becomes a silhouette.',
    cover: { src: G('8314fc27-2406-47df-8eb7-3d46863446c7-1-105-c.jpeg'), alt: 'Tree silhouetted in ember-orange light at sunset' },
    images: [
      { src: G('ed3c90c6-03b1-4099-b604-1ac8bcf32008-1-105-c.jpeg'), alt: 'Evening light glowing through tall grass', o: 'landscape', cap: 'Light through tall grass', meta: 'Backlit field', details: 'Jhapa · evening', select: true },
      { src: G('8314fc27-2406-47df-8eb7-3d46863446c7-1-105-c.jpeg'), alt: 'Tree silhouetted in ember-orange light at sunset', o: 'portrait', cap: 'Ember-orange silhouette', meta: 'Lone tree', details: 'Jhapa · sunset', select: true },
      { src: G('3C1DEB58-CDEB-4445-A9A7-D19FA715206B.jpeg'), alt: 'Sun melting orange over rooftops at dusk', o: 'portrait', cap: 'Sun over rooftops', meta: 'Dusk descent', details: 'Jhapa · dusk' },
      { src: G('D46BE4BE-3D9D-45AA-BB50-BACAE5AE86F1.jpeg'), alt: 'Lone tree silhouetted against an orange sky', o: 'portrait', cap: 'Lone tree, low sun', meta: 'Silhouette study', details: 'Jhapa · sunset' },
      { src: G('d6aaa135-b3eb-4574-a2fc-92fa0941eadb-1-105-c.jpeg'), alt: 'Sun flaring through red fountain grass', o: 'portrait', cap: 'Flare through fountain grass', meta: 'Backlit bloom', details: 'Jhapa · golden hour' },
      { src: G('971b2ccc-321e-46d7-8e7b-e31630c6ce2a-1-105-c.jpeg'), alt: 'Sunlight streaming through branches at golden hour', o: 'portrait', cap: 'Sun through branches', meta: 'Canopy light', details: 'Jhapa · golden hour' },
    ] },
  { id: 'after-dark', n: '03', title: 'After Dark', cat: 'night', catLabel: 'Night', year: '2024', count: 8, loc: 'Jhapa · Night sky', light: 'Available light · night',
    desc: 'Moons, lit towers and a ferris wheel drawn in bulbs — the district after the lights come on.',
    cover: { src: G('9a02dab2-f0c7-4beb-8156-81b0d743184d-1-105-c.jpeg'), alt: 'Full moon in a clear black sky' },
    images: [
      { src: G('f070e163-6925-48f8-af1a-6e39a0720e30-1-105-c.jpeg'), alt: 'Copper moon glowing alone in a black night sky', o: 'portrait', cap: 'Copper moon', meta: 'Solo moon', details: 'Jhapa · night', select: true },
      { src: G('0fac4d6f-773b-4667-aba1-24a18199b411-1-201-a.jpeg'), alt: 'Moon glowing through dark tree branches', o: 'portrait', cap: 'Moon through branches', meta: 'Canopy filter', details: 'Jhapa · night' },
      { src: G('135eaaf0-17fd-48f6-8832-27fca6f049ce-1-105-c.jpeg'), alt: 'Thin crescent moon over a black treeline at dusk', o: 'portrait', cap: 'Crescent over treeline', meta: 'Blue hour', details: 'Jhapa · dusk' },
      { src: G('abbb11a1-f6f3-429e-bb73-d6488234b541-1-105-c.jpeg'), alt: 'Deep blue twilight just before full dark', o: 'portrait', cap: 'Last blue light', meta: 'Twilight', details: 'Jhapa · nightfall' },
      { src: G('9a02dab2-f0c7-4beb-8156-81b0d743184d-1-105-c.jpeg'), alt: 'Full moon in a clear black sky', o: 'portrait', cap: 'Full moon, clear sky', meta: 'Lunar portrait', details: 'Jhapa · midnight' },
      { src: G('cd04a413-cc25-4732-8517-ddb866804080-1-105-c.jpeg'), alt: 'Ferris wheel drawn in lights at night', o: 'portrait', cap: 'Ferris wheel in lights', meta: 'Fairground', details: 'Jhapa · night', select: true },
      { src: G('67dd1626-ae21-4811-94ee-5ea736d4648f-1-105-c.jpeg'), alt: 'Lit tower with a star on top against the night sky', o: 'portrait', cap: 'Tower with a star', meta: 'Lit spire', details: 'Jhapa · night' },
      { src: G('ba0ae3d0-6dbf-4ee2-b057-b31f7625bf5c-1-105-c.jpeg'), alt: 'Tree lit purple against the night', o: 'portrait', cap: 'Purple-lit tree', meta: 'Color wash', details: 'Jhapa · night' },
    ] },
  { id: 'streets-jhapa', n: '04', title: 'Streets of Jhapa', cat: 'streets', catLabel: 'Streets', year: '2025', count: 4, loc: 'Jhapa, Nepal', light: 'Natural light · dusk',
    desc: 'Flags, wires and pylons against dramatic skies — the everyday infrastructure of home, made monumental.',
    cover: { src: G('139e2e61-5835-498b-adbc-6fb9df32cc38-1-201-a.jpeg'), alt: 'National flag on a floodlight pole under a dramatic cloudy sky' },
    images: [
      { src: G('139e2e61-5835-498b-adbc-6fb9df32cc38-1-201-a.jpeg'), alt: 'National flag on a floodlight pole under a dramatic cloudy sky', o: 'portrait', cap: 'Flag over floodlights', meta: 'National colors', details: 'Jhapa · dusk', select: true },
      { src: G('49d4cba9-373e-4e65-a374-7813881188ec-1-105-c.jpeg'), alt: 'Power lines crossing a pink dusk sky', o: 'portrait', cap: 'Wires at pink dusk', meta: 'Grid lines', details: 'Jhapa · dusk' },
      { src: G('7b38e211-6b65-476a-b5cf-eac34a023ead-1-102-a.jpeg'), alt: 'Electricity pylon against a purple dusk sky', o: 'portrait', cap: 'Pylon in purple dusk', meta: 'Steel geometry', details: 'Jhapa · dusk' },
      { src: G('9df29076-7cf3-485d-a4ec-642b59f09606-1-201-a.jpeg'), alt: 'Transmission tower against a dramatic sky', o: 'portrait', cap: 'Tower, dramatic sky', meta: 'Monumental mundane', details: 'Jhapa · dusk', select: true },
    ] },
  { id: 'weather', n: '05', title: 'Sky Reports', cat: 'skies', catLabel: 'Skies', year: '2024', count: 8, loc: 'Eastern hills', light: 'Natural light · changing sky',
    desc: 'Monsoon architecture and quiet mornings — a year of looking up over the eastern hills.',
    cover: { src: G('7304dde5-8b3a-486a-a7f1-afacb688360d-1-105-c.jpeg'), alt: 'Sunbeams breaking through clouds over a bright sky' },
    images: [
      { src: G('17b1543f-25c8-4b09-909e-708bf220fd14-1-201-a.jpeg'), alt: 'Clouds stacking over green eastern hills', o: 'landscape', cap: 'Clouds over green hills', meta: 'Stacked weather', details: 'Eastern hills · day', select: true },
      { src: G('kingdom-of-sky.jpeg'), alt: 'Towering monsoon cloud like architecture in the sky', o: 'portrait', cap: 'Kingdom of sky', meta: 'Monsoon tower', details: 'Eastern hills · monsoon' },
      { src: G('7304dde5-8b3a-486a-a7f1-afacb688360d-1-105-c.jpeg'), alt: 'Sunbeams breaking through clouds over a bright sky', o: 'portrait', cap: 'Sunbeams break through', meta: 'Crepuscular rays', details: 'Eastern hills · morning', select: true },
      { src: G('78155cc7-9a2f-4095-be8d-9a6c29f12d5d-1-105-c.jpeg'), alt: 'Grey column of monsoon cloud over hills', o: 'portrait', cap: 'Grey monsoon column', meta: 'Storm building', details: 'Eastern hills · monsoon' },
      { src: G('ed480907-22f8-4cf5-84f6-ebdb0df76d2b-1-105-c.jpeg'), alt: 'White cloud parked above a green ridge', o: 'portrait', cap: 'Cloud parked on ridge', meta: 'Still air', details: 'Eastern hills · day' },
      { src: G('2afc0cc8-abab-48bf-a03c-5fef04d617da-1-201-a.jpeg'), alt: 'Pale sun glowing softly through humid haze', o: 'portrait', cap: 'Pale sun in haze', meta: 'Humid glow', details: 'Eastern hills · haze' },
      { src: G('e3cacfb9-acd1-4e76-8b3b-8755cb978e46-1-105-c.jpeg'), alt: 'Textured grey overcast cloud filling the sky', o: 'portrait', cap: 'Full overcast texture', meta: 'Grey study', details: 'Eastern hills · overcast' },
      { src: G('484d0841-f598-4788-820e-12c31ed5d46c-1-105-c.jpeg'), alt: 'Marigold flower held up against a blue sky', o: 'portrait', cap: 'Marigold against blue', meta: 'Flower to sky', details: 'Eastern hills · day' },
    ] },
  { id: 'small-suns', n: '06', title: 'Small Suns', cat: 'flowers', catLabel: 'Flowers & Macro', year: '2025', count: 8, loc: 'Home garden', light: 'Natural light · morning',
    desc: 'The home garden up close — dahlias, dew and petals photographed like portraits.',
    cover: { src: G('05933110-40c6-45cc-bbff-1af7beed4a22-1-201-a.jpeg'), alt: 'White dahlia glowing against the light' },
    images: [
      { src: G('garden-of-love.jpeg'), alt: 'Moss roses opening in morning light', o: 'landscape', cap: 'Moss roses opening', meta: 'Morning bed', details: 'Home garden · morning', select: true },
      { src: G('05933110-40c6-45cc-bbff-1af7beed4a22-1-201-a.jpeg'), alt: 'White dahlia glowing against the light', o: 'portrait', cap: 'Backlit white dahlia', meta: 'Glow study', details: 'Home garden · morning', select: true },
      { src: G('3da7fa31-df6b-49dd-bb5c-313309b536ae-1-105-c.jpeg'), alt: 'Chrysanthemum photographed like a portrait', o: 'portrait', cap: 'Chrysanthemum portrait', meta: 'Flower sitter', details: 'Home garden · morning' },
      { src: G('bf02d881-052d-41e2-b4f3-0bc6e6648eb7-1-105-c.jpeg'), alt: 'Twin dahlias on a dark backdrop', o: 'portrait', cap: 'Twin dahlias, dark', meta: 'Moody pair', details: 'Home garden · morning' },
      { src: G('c7d14acd-5677-421d-9338-17dc5d7c60b8-1-201-a.jpeg'), alt: 'Pink cosmos flowers against a green wall', o: 'portrait', cap: 'Cosmos on green', meta: 'Pastel wall', details: 'Home garden · morning' },
      { src: G('9bb21690-4ffd-4a52-8ebc-57db8440c49a-1-102-a.jpeg'), alt: 'Single water droplet balanced on a petal', o: 'portrait', cap: 'Droplet on petal', meta: 'Balanced drop', details: 'Home garden · morning' },
      { src: G('626a63af-6592-4978-9f87-0aedcde84524-1-105-c.jpeg'), alt: 'Dew-covered spider web backlit in the garden', o: 'landscape', cap: 'Web in morning dew', meta: 'Backlit silk', details: 'Home garden · dawn', select: true },
      { src: G('8631f32c-49ea-40ad-b587-dbccc36e1547-1-105-c.jpeg'), alt: 'Red hibiscus flower in macro', o: 'portrait', cap: 'Red hibiscus macro', meta: 'Close crop', details: 'Home garden · morning' },
    ] },
  { id: 'green-ridge', n: '07', title: 'Green Ridge Lines', cat: 'landscape', catLabel: 'Landscape', year: '2024', count: 7, loc: 'Eastern hills · Kathmandu valley', light: 'Natural light · monsoon',
    desc: 'Ridges, valleys and lone trees — monsoon-season landscapes from the eastern hills to the valley rim.',
    cover: { src: G('61fb3e37-3846-40bc-8e1c-480142d37e81-1-102-a.jpeg'), alt: 'Lone tall tree rising above the hills under clouds' },
    images: [
      { src: G('6926098c-d965-4d53-84e3-de02bfa4f530-1-201-a.jpeg'), alt: 'Green monsoon ridge stretching under a wide sky', o: 'landscape', cap: 'Monsoon ridge, wide sky', meta: 'Green season', details: 'Eastern hills · monsoon', select: true },
      { src: G('peace.jpeg'), alt: 'Single tree standing under a vast clear sky', o: 'portrait', cap: 'Peace', meta: 'One tree, big sky', details: 'Eastern hills · clear day' },
      { src: G('08d60c49-c96e-4a70-b7f4-d8778108fac6-1-105-c.jpeg'), alt: 'Layered blue hills fading into the distance', o: 'landscape', cap: 'Blue hills in layers', meta: 'Fading ridges', details: 'Eastern hills · haze' },
      { src: G('61fb3e37-3846-40bc-8e1c-480142d37e81-1-102-a.jpeg'), alt: 'Lone tall tree rising above the hills under clouds', o: 'portrait', cap: 'Lone tree over hills', meta: 'Sentinel', details: 'Eastern hills · clouds', select: true },
      { src: G('807ff731-ca54-4035-ab01-d0be768c1150-1-105-c.jpeg'), alt: 'Stacked stone cairn beside a waterfall trail', o: 'portrait', cap: 'Cairn by the falls', meta: 'Trail marker', details: 'Hills · monsoon' },
      { src: G('c757e6f3-e9e5-49d8-b0f7-a7a6f33c3696-1-105-c.jpeg'), alt: 'Kathmandu valley rooftops under moving clouds', o: 'portrait', cap: 'Valley under moving cloud', meta: 'Rooftop sea', details: 'Kathmandu valley · monsoon' },
      { src: G('4e70ca02-1469-4ac4-91e3-781bc82f78f3-1-105-c.jpeg'), alt: 'Figure standing still in a wide riverbed', o: 'portrait', cap: 'Still figure, wide river', meta: 'Scale study', details: 'Riverbed · day' },
    ] },
  { id: 'critics', n: '08', title: 'The Critics', cat: 'personal', catLabel: 'Personal', year: '2026', count: 2, loc: 'At home', light: 'Available light · indoors',
    desc: 'The toughest audience I know — two cats who review every edit by sitting on the keyboard.',
    cover: { src: G('a90c58ed-88a7-4c58-bb33-580981b5f65b-1-105-c.jpeg'), alt: 'Extreme close-up of a tabby cat staring into the lens' },
    images: [
      { src: G('a90c58ed-88a7-4c58-bb33-580981b5f65b-1-105-c.jpeg'), alt: 'Extreme close-up of a tabby cat staring into the lens', o: 'portrait', cap: 'The stare-down', meta: 'Quality control', details: 'At home · indoors', select: true },
      { src: G('dclassic-2026-02-07-14465313b22f807254.jpg'), alt: 'Two cats resting together in warm afternoon light', o: 'portrait', cap: 'Afternoon critics', meta: 'Resting panel', details: 'At home · afternoon' },
    ] },
];

export const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'heritage', label: 'Heritage' },
  { value: 'sunsets', label: 'Sunsets' },
  { value: 'night', label: 'Night' },
  { value: 'streets', label: 'Streets' },
  { value: 'skies', label: 'Skies' },
  { value: 'flowers', label: 'Flowers & Macro' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'personal', label: 'Personal' },
];
