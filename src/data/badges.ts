/** Definicija bedža (NTC-style zbirka) */
export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  /** Kratka oznaka v mreži */
  mark: string;
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first-day',
    title: 'Prvi dan',
    description: 'Opravi prvi dan 10-dnevnega izziva.',
    mark: '01',
  },
  {
    id: 'challenge-half',
    title: 'Na pol poti',
    description: 'Opravi 5 od 10 dni izziva.',
    mark: '5/10',
  },
  {
    id: 'challenge-done',
    title: 'Izziv končan',
    description: 'Opravi vseh 10 dni.',
    mark: '10',
  },
  {
    id: 'streak-3',
    title: '3 dni niza',
    description: 'Trije zaporedni aktivni dnevi.',
    mark: '3×',
  },
  {
    id: 'streak-7',
    title: '7 dni niza',
    description: 'Sedem zaporednih aktivnih dni.',
    mark: '7×',
  },
  {
    id: 'first-morning',
    title: 'Dober jutro',
    description: 'Opravi prvo jutranjo rutino.',
    mark: 'AM',
  },
  {
    id: 'morning-5',
    title: 'Jutranji blok 5×',
    description: 'Pet opravljenih jutranjih sej.',
    mark: '5×',
  },
  {
    id: 'first-treadmill',
    title: 'Prva steza',
    description: 'Zaključi prvo vadbo na stezi.',
    mark: 'ST',
  },
  {
    id: 'treadmill-10',
    title: '10 sej steze',
    description: 'Deset sej na tekalni stezi.',
    mark: '10',
  },
  {
    id: 'km-20',
    title: '20 km',
    description: 'Skupaj 20 km na stezi.',
    mark: '20',
  },
];
