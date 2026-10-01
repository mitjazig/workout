import type { Exercise, Program, TaskCategory, TrainingDay, TreadmillPrescription } from '../types';

function ex(
  id: string,
  name: string,
  description: string,
  category: TaskCategory,
  howTo: string[],
  tips: string[],
  durationSeconds: number,
  instructions: string[] = [],
  treadmill?: TreadmillPrescription,
): Exercise {
  return { id, name, description, category, howTo, tips, durationSeconds, instructions, treadmill };
}

function day(
  dayNum: number,
  title: string,
  summary: string,
  focus: TaskCategory,
  estimatedMinutes: number,
  exercises: Exercise[],
): TrainingDay {
  return {
    id: `c10-d${dayNum}`,
    week: dayNum <= 7 ? 1 : 2,
    day: dayNum,
    title,
    summary,
    focus,
    estimatedMinutes,
    exercises,
  };
}

/** 10-dnevni vadbeni izziv – samo gibanje, brez prehrane/mindseta */
export const challengeProgram: Program = {
  id: 'challenge-10',
  name: 'Izziv 10 – Vadbe',
  description:
    '10 dni kratkih vadb doma: ogrevanje, moč, kardio in mobilnost. 15–30 minut na dan – brez opreme.',
  weeks: 2,
  days: [
    day(1, 'Začetek – hoja in mobilnost', 'Lahek uvod: ogrevanje, 15 min hoje, razteg.', 'cardio', 20, [
      ex('c10-d1-e1', 'Ogrevanje sklepov', 'Zavrti ramena, kolke in kolena – počasi, 2 minuti.', 'warmup',
        ['Stojte ali sedite pokončno.', '10× krogi z rameni naprej, 10× nazaj.', '10× krogi s kolki.', 'Nežno upognite kolena gor-dol.'],
        ['Brez bolečine – manjši obseg giba je OK.'], 120, ['Dihajte enakomerno.']),
      ex('c10-d1-e2', '15 min hoje', 'Zmerni tempo – lahko govorite, a ste aktivni.', 'cardio',
        ['Udobna obutev.', 'Ven ali po hodniku / stopnicah.', 'Tempo: zadihanost 4/10.', 'Če treba: 2× 8 minut z odmorom.'],
        ['Bolje 15 min danes kot 0.'], 900, ['Roke zanihajte naravno.'],
        {
          speedKmh: 4.5,
          inclinePercent: 1,
          note: 'Zmeren tempo – lahko govorite.',
          howTo: [
            'Nastavi 4,5 km/h in naklon 1 %.',
            'Ohodi 15 minut enakomerno.',
            'Če je preveč: znižaj na 4,0 km/h.',
          ],
        }),
      ex('c10-d1-e3', 'Razteg nog in hrbta', 'Nežno raztegni zadnje stegenske in spodnji hrbet.', 'cooldown',
        ['Predklon s pokrčenimi koleni – 30 s.', 'Izteg ene noge naprej, rahlo predklon – 30 s na stran.', 'Ležite ali sedite 30 s in umirite dih.'],
        ['Ne sunki – samo zadrži.'], 180),
    ]),

    day(2, 'Celotno telo – lahkotno', 'Osnovna moč: počepi ob stol, stena, most.', 'strength', 22, [
      ex('c10-d2-e1', 'Ogrevanje – koraki na mestu', '2 minuti korakanja + krogi z rokami.', 'warmup',
        ['Korakajte na mestu.', 'Dvignite kolena do udobne višine.', 'Dodajte kroge z rokami.'],
        [], 120),
      ex('c10-d2-e2', 'Počepi ob stol', '12–15 počepov – stol za varnost.', 'strength',
        ['Stopala v širini ramen.', 'Spustite se, kot da bi sedli na stol – lahko se ga dotaknete.', 'Vstanite skozi pete.', 'Ponovite 12–15×, 2 seriji z 45 s odmora.'],
        ['Kolena naj sledijo prstom – ne navznoter.'], 300, ['Prsni koš pokončen.']),
      ex('c10-d2-e3', 'Skleci ob steni', '10–12 sklec z rokami na steni.', 'strength',
        ['Roke na steno v višini prsi.', 'Telo v ravni črti.', 'Pokrivajte komolce, prsi proti steni.', '10–12×, 2 seriji.'],
        ['Bolj oddaljene noge = težje.'], 240),
      ex('c10-d2-e4', 'Most (glute bridge)', '12× dvig medenice leže na hrbtu.', 'strength',
        ['Lezite, kolena pokrčena, stopala na tleh.', 'Dvignite medenico, stisnite zadnjico.', 'Spustite počasi.', '12×, 2 seriji.'],
        [], 240),
      ex('c10-d2-e5', 'Sprostitev dihanja', '1 minuta mirnega dihanja.', 'cooldown',
        ['Sedite ali lezite.', '4 s vdih, 6 s izdih.', 'Ramena spustite.'],
        [], 60),
    ]),

    day(3, 'Noge in jedro', 'Počepi, izpadni koraki, plank.', 'strength', 25, [
      ex('c10-d3-e1', 'Ogrevanje nog', 'Krogi s kolki + lahki počepi.', 'warmup',
        ['10× krogi s kolki v vsako smer.', '10 lahkih počepov.'],
        [], 120),
      ex('c10-d3-e2', 'Počepi', '2× 15 počepov.', 'strength',
        ['Stopala ramen širine.', 'Spust in vzpon v 2 s.', '15×, odmor 45 s, še enkrat.'],
        ['Držite se stola, če potrebujete ravnotežje.'], 300),
      ex('c10-d3-e3', 'Izpadni koraki (ali korak nazaj)', '8× na nogo – blago.', 'strength',
        ['Korak nazaj z eno nogo.', 'Spustite zadnje koleno proti tlom.', 'Vstanite, zamenjajte nogo.', '8× na stran, 2 seriji.'],
        ['Krajši korak = lažje za kolena.'], 300),
      ex('c10-d3-e4', 'Plank na kolenih ali prstih', '20–40 sekund zadržanja.', 'strength',
        ['Komolci pod rameni.', 'Telo v črti – ne ugrezajte ledja.', 'Zadržite 20–40 s, 2×.'],
        ['Na kolenih je popolnoma OK.'], 180, ['Stisnite trebuh.']),
      ex('c10-d3-e5', 'Razteg prednje stegenske', '30 s na nogo.', 'cooldown',
        ['Stoje: prijemite nogo nazaj (ali pas).', 'Kolena skupaj, medenica naprej.', 'Zamenjajte stran.'],
        [], 90),
    ]),

    day(4, 'Zgornji del telesa', 'Stena, miza, hrbet – moč rok in ramen.', 'strength', 22, [
      ex('c10-d4-e1', 'Ogrevanje ramen', 'Krogi in »odpiranje« prsi.', 'warmup',
        ['15× krogi z rameni.', 'Roke za hrbet, odprite prsni koš 20 s.', 'Roke naprej, zaokrožite hrbet 20 s.'],
        [], 120),
      ex('c10-d4-e2', 'Skleci ob mizi ali steni', '2× 10–12.', 'strength',
        ['Roke na mizo ali steno.', 'Počasen spust in potisk.', '10–12×, 2 seriji.'],
        ['Miza = težje kot stena.'], 240),
      ex('c10-d4-e3', 'Veslanje z brisačo / nahrbtnikom', 'Poteg proti sebi – 12×.', 'strength',
        ['Brisačo okoli kljuke ali uporabite nahrbtnik.', 'Potegnite k rebrom, stisnite lopatice.', '12×, 2 seriji.'],
        ['Brez sunkov.'], 240),
      ex('c10-d4-e4', 'Superman / ptič-pes', 'Krepitev hrbta – 10×.', 'strength',
        ['Na trebuhu: rahlo dvignite roke in noge ALI na štiri: nasprotna roka+noga.', '10× počasi.'],
        ['Vrat v podaljšku hrbtenice.'], 180),
      ex('c10-d4-e5', 'Razteg prsi v vratih', '30 s na stran.', 'cooldown',
        ['Podlaket na podboj.', 'Rahlo zasukajte trup stran od roke.', 'Zamenjajte.'],
        [], 90),
    ]),

    day(5, 'Kardio intervali', 'Hoja z menjavo tempa – 20 minut.', 'cardio', 25, [
      ex('c10-d5-e1', 'Ogrevalna hoja', '5 minut lahkega tempa.', 'warmup',
        ['Začnite počasi.', 'Dihajte skozi nos, če gre.'],
        [], 300, [],
        {
          speedKmh: 4.0,
          inclinePercent: 0,
          howTo: ['Nastavi 4,0 km/h, naklon 0 %.', '5 minut lahkega ogrevanja.'],
        }),
      ex('c10-d5-e2', 'Intervali 1–2', '1 min hitreje, 2 min počasneje – ponovi 5×.', 'cardio',
        ['Hitrejši del: zadihanost 6–7/10 (še vedno lahko izgovorite kratke stavke).', 'Počasni del: sprehajalni tempo.', 'Ponovite cikel 5×.'],
        ['Če je preveč: skrajšajte hitri del na 30 s.'], 900, ['Ne sprintajte – samo pospešite.'],
        {
          speedKmh: 6.0,
          speedEasyKmh: 4.0,
          inclinePercent: 1,
          note: '1 min hitreje / 2 min počasneje × 5',
          howTo: [
            'Hitreje: 6,0 km/h, naklon 1 % (1 min).',
            'Počasneje: 4,0 km/h, naklon 0–1 % (2 min).',
            'Ponovi 5×. Ne sprintaj – samo pospeši.',
          ],
        }),
      ex('c10-d5-e3', 'Umirjanje', '3 minute zelo počasne hoje + dih.', 'cooldown',
        ['Tempo 2/10.', 'Ramena spustite.', 'Na koncu 5 globokih vdihov.'],
        [], 180, [],
        {
          speedKmh: 3.5,
          inclinePercent: 0,
          howTo: ['Znižaj na 3,5 km/h.', '3 minute umirjanja + globok dih.'],
        }),
    ]),

    day(6, 'Krog – moč doma', 'Krog: počep, stena, most, plank – 3 krogi.', 'strength', 28, [
      ex('c10-d6-e1', 'Ogrevanje', 'Koraki + lahki počepi + skleci ob steni.', 'warmup',
        ['1 min korakanje.', '8 lahkih počepov.', '8 sklec ob steni.'],
        [], 150),
      ex('c10-d6-e2', 'Krog 1–3', 'Počep 12× · stena 10× · most 12× · plank 20 s. Odmor 60 s. 3×.', 'strength',
        ['Naredite vse 4 vaje zaporedoma.', 'Odmor 60 s.', 'Ponovite še 2× (skupaj 3 krogi).', 'Tempo kontroliran.'],
        ['Med krogi pijte vodo.'], 900, ['Kakovost pred hitrostjo.']),
      ex('c10-d6-e3', 'Razteg celotnega telesa', 'Noge, prsi, hrbet – 3 minute.', 'cooldown',
        ['Predklon 30 s.', 'Prsi v vratih 30 s.', 'Mačka-krava 8×.', 'Dih 30 s.'],
        [], 180),
    ]),

    day(7, 'Aktivni počitek', 'Mobilnost in lahek sprehod – regeneracija.', 'mobility', 20, [
      ex('c10-d7-e1', 'Mobilnost hrbtenice', 'Mačka-krava in zasuki.', 'mobility',
        ['Na štiri: mačka-krava 10×.', 'Sedeči zasuk trupa 8× na stran.', 'Počasi.'],
        [], 180),
      ex('c10-d7-e2', '10 min lahke hoje', 'Sprehod za prekrvavitev – brez intervalov.', 'cardio',
        ['Zelo lahek tempo.', 'Uživajte v gibanju.'],
        ['Danes ni dan za rekorde.'], 600, [],
        {
          speedKmh: 3.8,
          inclinePercent: 0,
          note: 'Regeneracija – brez intervalov.',
          howTo: ['Nastavi 3,8 km/h, naklon 0 %.', '10 minut zelo lahke hoje.'],
        }),
      ex('c10-d7-e3', 'Dolgi raztegi', 'Zadrži vsak položaj 40–45 s.', 'cooldown',
        ['Zadnje stegenske.', 'Boki / upogibalci kolka.', 'Prsi.', 'Vrat – nežno levo-desno.'],
        ['Brez bolečine.'], 240),
    ]),

    day(8, 'Močnejši krog', 'Isti krog kot dan 6, a več ponovitev.', 'strength', 30, [
      ex('c10-d8-e1', 'Ogrevanje', '3 minute: koraki, počepi, stena.', 'warmup',
        ['1,5 min korakanje.', '10 počepov.', '10 sklec ob steni.'],
        [], 180),
      ex('c10-d8-e2', 'Krog 1–3 (napredno)', 'Počep 15× · stena/miza 12× · most 15× · plank 30 s. Odmor 45 s. 3×.', 'strength',
        ['Trije krogi z 45 s odmora.', 'Če gre: zadnji krog plank na prstih.'],
        ['Skrajšajte število, če forma pade.'], 960, ['Trebuh aktiven.']),
      ex('c10-d8-e3', 'Stranski plank (po želji)', '15–20 s na stran.', 'strength',
        ['Na komolcu, kolena ali stopala.', 'Boki gor.', 'Zamenjajte stran.'],
        ['Preskočite, če boli ramo.'], 120),
      ex('c10-d8-e4', 'Razteg', '2–3 minute.', 'cooldown',
        ['Noge, prsi, boki.'],
        [], 150),
    ]),

    day(9, 'Kardio + jedro', '22 min hoje + kratko jedro.', 'cardio', 28, [
      ex('c10-d9-e1', 'Ogrevanje', '3 min lahke hoje.', 'warmup',
        ['Počasi pospešujte.'],
        [], 180, [],
        {
          speedKmh: 4.0,
          inclinePercent: 0,
          howTo: ['Začni pri 4,0 km/h.', '3 minute ogrevanja.'],
        }),
      ex('c10-d9-e2', '22 min hoje', 'Zmeren do živahen tempo (5–6/10).', 'cardio',
        ['Držite tempo, kjer zadihate, a zdržite.', 'Lahko 11 + 11 z 1 min pavze.'],
        [], 1320, [],
        {
          speedKmh: 5.0,
          inclinePercent: 1,
          note: 'Zmeren do živahen tempo.',
          howTo: [
            'Nastavi 5,0 km/h in naklon 1 %.',
            'Drži 22 minut (ali 11 + 11 z 1 min pavze).',
            'Če gre: zadnji 5 min 5,3 km/h.',
          ],
        }),
      ex('c10-d9-e3', 'Jedro – mrtva žuželka', '8× na stran, počasi.', 'strength',
        ['Na hrbtu, kolena 90°.', 'Nasprotna roka in noga stran, hrbet na tleh.', '8× na stran.'],
        ['Ledja naj ostanejo na tleh.'], 180),
      ex('c10-d9-e4', 'Umirjanje', 'Dih + lahek razteg.', 'cooldown',
        ['1 min dihanja.', 'Predklon 30 s.'],
        [], 90),
    ]),

    day(10, 'Zaključna vadba', 'Celotni trening: ogrevanje, krog, kardio finiš, razteg.', 'strength', 30, [
      ex('c10-d10-e1', 'Ogrevanje', '3 minute polnega ogrevanja.', 'warmup',
        ['Koraki 1 min.', 'Krogi sklepov 1 min.', 'Lahki počepi + stena 1 min.'],
        [], 180),
      ex('c10-d10-e2', 'Zaključni krog', '2 kroga: počep 15 · stena 12 · most 15 · plank 30 s. Odmor 60 s.', 'strength',
        ['Dva kvalitetna kroga.', 'Praznujte vsako ponovitev.'],
        ['To je vaš 10. dan – doslednost šteje.'], 600),
      ex('c10-d10-e3', '8 min žive hoje', 'Zaključni kardio – energično.', 'cardio',
        ['Tempo 6/10.', 'Zadnji 2 minuti lahko malo hitreje.'],
        [], 480, [],
        {
          speedKmh: 5.5,
          inclinePercent: 1,
          note: 'Živahen finiš.',
          howTo: [
            'Nastavi 5,5 km/h, naklon 1 %.',
            '8 minut; zadnji 2 minuti lahko 6,0 km/h.',
          ],
        }),
      ex('c10-d10-e4', 'Razteg in zaključek', '3 minute raztega celotnega telesa.', 'cooldown',
        ['Noge, boki, prsi, hrbet.', 'Zadnjih 30 s: miren dih, zahvala sebi za 10 dni.'],
        [], 180),
    ]),
  ],
};

export function dayHasTreadmillCardio(day: TrainingDay): boolean {
  return day.exercises.some((e) => Boolean(e.treadmill));
}
