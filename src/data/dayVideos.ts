import type { DayYoutubeVideo } from '../types';

/**
 * Kurirani follow-along YouTube videi za 10-dnevni izziv.
 * Challenge10 kanal nima vadbenih tutrialov – zato so to začetniške vadbe
 * brez opreme (MadFit, Body Coach, Yoga With Adriene, Lucy Wyndham-Read …).
 */
export const dayVideos: Record<number, DayYoutubeVideo> = {
  1: {
    videoId: 'HW9ZtzTGRTA',
    title: '10 min hoje doma',
    channel: 'Lucy Wyndham-Read',
    note: 'Lahko greste tudi ven – video je alternativa, če ostanete doma.',
  },
  2: {
    videoId: 'H2U3HwAyBXg',
    title: '20 min celotno telo – začetniki',
    channel: 'MadFit',
  },
  3: {
    videoId: 'FJA3R7n_594',
    title: '10 min noge in zadnjica',
    channel: 'MadFit',
    note: 'Tempo prilagodite – počasneje je OK.',
  },
  4: {
    videoId: 'RE5yzqSXDCI',
    title: '10 min zgornji del (tudi stena)',
    channel: 'MadFit',
  },
  5: {
    videoId: 'zGf-9VVgCDw',
    title: '10 min low-impact kardio – začetniki',
    channel: 'The Body Coach TV',
    note: 'Dopolnilo ali nadomestilo intervalne hoje.',
  },
  6: {
    videoId: '9PCGvkXV-Bo',
    title: '15 min celotno telo – brez skokov',
    channel: 'MadFit',
  },
  7: {
    videoId: 'j7rKKpwdXNE',
    title: '10 min joga za začetnike',
    channel: 'Yoga With Adriene',
    note: 'Dan regeneracije – nehajte, če kaj boli.',
  },
  8: {
    videoId: '2Z9g-AZinUc',
    title: '20 min celotno telo – močneje',
    channel: 'MadFit',
  },
  9: {
    videoId: 'xsvLYAplbXw',
    title: '10 min jedro – začetniki',
    channel: 'nourishmovelove',
    note: 'Hojo naredite zunaj ali po hodniku; video je za del z jedrom.',
  },
  10: {
    videoId: 'gwx0JOgW44w',
    title: '10 min zaključna vadba – celotno telo',
    channel: 'Freeletics',
  },
};

export function getDayVideo(dayNum: number): DayYoutubeVideo | undefined {
  return dayVideos[dayNum];
}

export function youtubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}
