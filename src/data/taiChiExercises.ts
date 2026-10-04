import type { Exercise, ExercisePhase } from '../types';

function mediaFolder(slug: string) {
  return {
    thumbnail: `media/tai-chi/${slug}/thumbnail.webp`,
    loop: `media/tai-chi/${slug}/loop.webm`,
  };
}

function phase(
  id: string,
  title: string,
  instruction: string,
  image?: string,
): ExercisePhase {
  return { id, title, instruction, image };
}

function move(
  partial: Omit<Exercise, 'category' | 'style' | 'instructions'> & {
    instructions?: string[];
    category?: Exercise['category'];
  },
): Exercise {
  return {
    ...partial,
    category: partial.category ?? 'mobility',
    style: 'taichi',
    instructions: partial.instructions ?? [],
  };
}

/** Knjižnica sedečih Tai Chi gibov – enkrat definirani, več dni jih ponovno uporabi */
export const taiChiExercises = {
  'tai-opening': move({
    id: 'tai-opening',
    name: 'Odpiranje',
    englishName: 'Opening',
    description:
      'Miren začetek vadbe: pokončna drža, stabilna stopala in mehko odpiranje rok na stolu.',
    durationSeconds: 60,
    side: 'none',
    media: mediaFolder('opening'),
    howTo: [
      'Sedi pokončno na sprednjem delu stola. Stopala postavi stabilno na tla in sprosti ramena.',
      'Roki počasi dvigni pred trebuh in ju mehko zaokroži.',
      'Roki počasi odpri navzven. Komolci ostanejo mehki, ramena pa sproščena.',
      'Zaključi gib brez napetosti in ohrani pokončno, sproščeno držo.',
    ],
    breathing:
      'Vdihni počasi, ko se roke dvigujejo in odpirajo. Izdihni sproščeno ob zaključku giba. Dihanja ne zadržuj.',
    tips: [
      'Ramena naj ostanejo spuščena.',
      'Komolci naj bodo mehki.',
      'Gib naj bo počasen in tekoč.',
      'Ne dviguj rok višje, kot je udobno.',
      'Stopala naj ostanejo stabilno na tleh.',
    ],
    phases: [
      phase(
        'op-1',
        'Začetni položaj',
        'Sedi pokončno na sprednjem delu stola. Stopala postavi stabilno na tla in sprosti ramena.',
        'media/tai-chi/opening/01-start.webp',
      ),
      phase(
        'op-2',
        'Roki pred trebuhom',
        'Roki počasi dvigni pred trebuh in ju mehko zaokroži.',
        'media/tai-chi/opening/02-hands-front.webp',
      ),
      phase(
        'op-3',
        'Počasi odpri roke',
        'Roki počasi odpri navzven. Komolci ostanejo mehki, ramena pa sproščena.',
        'media/tai-chi/opening/03-open.webp',
      ),
      phase(
        'op-4',
        'Zaključni položaj',
        'Zaključi gib brez napetosti in ohrani pokončno, sproščeno držo.',
        'media/tai-chi/opening/04-finish.webp',
      ),
    ],
  }),

  'tai-rising-hands': move({
    id: 'tai-rising-hands',
    name: 'Dvig rok',
    englishName: 'Rising Hands',
    description:
      'Počasen dvig in spust rok, povezan z mirnim dihanjem in sproščeno držo.',
    durationSeconds: 75,
    side: 'none',
    media: mediaFolder('rising-hands'),
    howTo: [
      'Sedi pokončno na sprednjem delu stola.',
      'Stopala postavi stabilno na tla.',
      'Roki sproščeno spusti ob telo oziroma pred stegna.',
      'Z mehko zaobljenimi rokami začni počasen dvig.',
      'Dlani naj bodo obrnjene navzdol oziroma rahlo proti telesu.',
      'Roki dvigni približno do višine prsnega koša ali ramen.',
      'Ramena naj ostanejo spuščena.',
      'Komolci naj bodo ves čas mehki.',
      'Nato roki počasi spusti nazaj.',
      'Gib ponavljaj tekoče in brez sunkov.',
    ],
    breathing:
      'Počasi vdihni med dvigovanjem rok. Mirno izdihni med spuščanjem rok. Dihanja ne zadržuj in ga ne prilagajaj na silo.',
    tips: [
      'Ne dviguj ramen proti ušesom.',
      'Komolcev ne zaklepaj.',
      'Roki dvigni samo tako visoko, kot je udobno.',
      'Trup naj ostane pokončen.',
      'Gib naj bo počasen in neprekinjen.',
    ],
    phases: [
      phase(
        'rh-1',
        'Začetni položaj',
        'Sedi pokončno, sprosti ramena in pusti roki mehko pred stegni.',
        'media/tai-chi/rising-hands/01-start.webp',
      ),
      phase(
        'rh-2',
        'Dvig rok',
        'Roki počasi dviguj pred telesom. Komolci ostanejo mehki.',
        'media/tai-chi/rising-hands/02-rising.webp',
      ),
      phase(
        'rh-3',
        'Zgornji položaj',
        'Roki ustavi približno v višini prsnega koša ali ramen, brez dvigovanja ramen.',
        'media/tai-chi/rising-hands/03-top.webp',
      ),
      phase(
        'rh-4',
        'Spust rok',
        'Roki počasi in sproščeno spusti proti začetnemu položaju.',
        'media/tai-chi/rising-hands/04-lowering.webp',
      ),
    ],
  }),

  'tai-cloud-hands': move({
    id: 'tai-cloud-hands',
    name: 'Oblačne roke',
    englishName: 'Cloud Hands',
    description:
      'Počasno izmenično kroženje rok z nežno rotacijo trupa. Roke se premikajo usklajeno s trupom in dihanjem.',
    durationSeconds: 105,
    side: 'alternating',
    media: mediaFolder('cloud-hands'),
    howTo: [
      'Sedi pokončno in sprosti ramena.',
      'Stopala naj ostanejo stabilno na tleh.',
      'Eno roko postavi približno pred prsni koš, drugo nižje pred trebuh.',
      'Počasi obrni trup v levo.',
      'Roke naj sledijo rotaciji trupa.',
      'Ne izvajaj giba samo z rokami.',
      'Pri vračanju skozi sredino počasi zamenjaj višino rok.',
      'Nadaljuj z nežno rotacijo proti desni.',
      'Pogled lahko mehko sledi zgornji roki.',
      'Nadaljuj izmenično levo in desno.',
      'Gib naj bo neprekinjen in brez sunkov.',
    ],
    breathing:
      'Dihaj počasi in naravno. Vdih lahko spremlja prehod skozi sredino. Izdih lahko spremlja nežna rotacija v stran. Dihanja ne zadržuj.',
    tips: [
      'Ne dviguj ramen.',
      'Ne premikaj samo rok.',
      'Ne nagibaj trupa v stran.',
      'Komolci naj ostanejo mehki.',
      'Gib naj bo počasen in krožen.',
    ],
    phases: [
      phase(
        'ch-1',
        'Začetni položaj',
        'Ena roka je višje pred prsnim košem, druga nižje pred trebuhom.',
        'media/tai-chi/cloud-hands/01-start.webp',
      ),
      phase(
        'ch-2',
        'Obrat v levo',
        'Nežno obrni trup v levo. Roke sledijo gibanju trupa.',
        'media/tai-chi/cloud-hands/02-left.webp',
      ),
      phase(
        'ch-3',
        'Menjava rok',
        'Pri prehodu skozi sredino zamenjaj višino rok in ohrani tekoč gib.',
        'media/tai-chi/cloud-hands/03-transition.webp',
      ),
      phase(
        'ch-4',
        'Obrat v desno',
        'Nadaljuj z nežno rotacijo v desno. Pogled lahko mehko sledi zgornji roki.',
        'media/tai-chi/cloud-hands/04-right.webp',
      ),
    ],
  }),

  'tai-brush-knee': move({
    id: 'tai-brush-knee',
    name: 'Očisti koleno in potisni',
    englishName: 'Brush Knee and Push',
    description:
      'Ena roka mehko zdrsne mimo kolena, druga pa iz sproščenega položaja počasi potisne naprej.',
    durationSeconds: 105,
    side: 'alternating',
    media: mediaFolder('brush-knee'),
    howTo: [
      'Začni v pokončnem sedečem položaju.',
      'Sprosti ramena in komolce.',
      'Pripravi roki ob eni strani telesa.',
      'Ena roka začne potovati navzdol in diagonalno proti nasprotnemu kolenu.',
      'Z dlanjo mehko nadaljuj mimo kolena.',
      'Istočasno druga roka potuje naprej.',
      'Dlan sprednje roke počasi obrni naprej.',
      'Izvedi nežen potisk.',
      'Trup se lahko rahlo obrne v smer potiska.',
      'Vrni se v sredino.',
      'Ponovi na drugi strani.',
    ],
    breathing:
      'Vdihni med pripravo giba. Mirno izdihni med potiskom. Dih naj ostane sproščen in neprekinjen.',
    tips: [
      'Potisk ni silovit.',
      'Ramena naj ostanejo spuščena.',
      'Ne zaklepaj komolca.',
      'Ne nagibaj se močno naprej.',
      'Gib rok poveži z nežno rotacijo trupa.',
    ],
    phases: [
      phase(
        'bk-1',
        'Priprava',
        'Roki pripravi ob strani telesa in sprosti ramena.',
        'media/tai-chi/brush-knee/01-start.webp',
      ),
      phase(
        'bk-2',
        'Gib mimo kolena',
        'Spodnja roka mehko potuje diagonalno mimo kolena.',
        'media/tai-chi/brush-knee/02-brush.webp',
      ),
      phase(
        'bk-3',
        'Potisk',
        'Druga roka počasi potisne naprej, komolec pa ostane mehak.',
        'media/tai-chi/brush-knee/03-push.webp',
      ),
      phase(
        'bk-4',
        'Zaključek',
        'Zaključi potisk brez zaklepanja komolca in se pripravi na drugo stran.',
        'media/tai-chi/brush-knee/04-finish.webp',
      ),
    ],
  }),

  'tai-ward-off': move({
    id: 'tai-ward-off',
    name: 'Peng – odboj',
    englishName: 'Ward Off',
    description:
      'Zaobljen dvig podlakti pred telo z občutkom širjenja ter stabilnega in sproščenega trupa.',
    durationSeconds: 75,
    side: 'alternating',
    media: mediaFolder('ward-off'),
    howTo: [
      'Sedi pokončno in sproščeno.',
      'Roki spusti pred telo.',
      'Predstavljaj si, da med rokama držiš veliko mehko žogo.',
      'Eno podlaket počasi dvigni pred prsni koš.',
      'Komolec naj ostane spuščen in zaobljen.',
      'Druga roka ostane nižje in podpira obliko giba.',
      'Trup lahko nežno obrneš proti dvignjeni roki.',
      'Ohrani občutek širine v rokah.',
      'Ne napenjaj ramen.',
      'Vrni se v sredino.',
      'Ponovi na drugi strani.',
    ],
    breathing:
      'Vdihni med pripravo. Mirno izdihni med oblikovanjem položaja Peng. Ramena, vrat in čeljust naj ostanejo sproščeni.',
    tips: [
      'Komolca ne dviguj previsoko.',
      'Ne napenjaj rame.',
      'Roka naj ostane mehko zaobljena.',
      'Ne potiskaj z močjo.',
      'Ohrani pokončno sedečo držo.',
    ],
    phases: [
      phase(
        'wo-1',
        'Začetek',
        'Roki sta sproščeni pred telesom, ramena pa spuščena.',
        'media/tai-chi/ward-off/01-start.webp',
      ),
      phase(
        'wo-2',
        'Drži žogo',
        'Roki zaokroži, kot da med njima držiš veliko mehko žogo.',
        'media/tai-chi/ward-off/02-ball.webp',
      ),
      phase(
        'wo-3',
        'Dvig',
        'Eno podlaket počasi dvigni pred prsni koš.',
        'media/tai-chi/ward-off/03-lift.webp',
      ),
      phase(
        'wo-4',
        'Peng',
        'Zaključi z zaobljeno roko, mehkim komolcem in sproščenim ramenom.',
        'media/tai-chi/ward-off/04-peng.webp',
      ),
    ],
  }),

  'tai-repulse-monkey': move({
    id: 'tai-repulse-monkey',
    name: 'Odganjanje opice',
    englishName: 'Repulse Monkey',
    description:
      'Izmenični sedeči Tai Chi gib, pri katerem se ena roka umakne nazaj, nato pa počasi potuje naprej, medtem ko se druga roka vrača proti telesu.',
    durationSeconds: 105,
    side: 'alternating',
    media: mediaFolder('repulse-monkey'),
    howTo: [
      'Začni z rokama sproščeno pred telesom.',
      'Nežno obrni trup v eno stran.',
      'Eno roko počasi odpelji nazaj ob telo.',
      'Dlan zadnje roke obrni naprej.',
      'Začni vračati trup proti sredini.',
      'Zadnja roka začne potovati naprej.',
      'Izvedi mehak potisk naprej.',
      'Druga roka se istočasno sproščeno umakne proti telesu.',
      'Komolci naj ostanejo mehki.',
      'Gib zaključi brez sunkov.',
      'Ponovi na drugi strani.',
      'Nadaljuj izmenično in tekoče.',
    ],
    breathing:
      'Vdihni med odpiranjem in umikom roke. Med počasnim potiskom naprej izdihni. Dihanje naj ostane naravno in sproščeno.',
    tips: [
      'Trupa ne obračaj predaleč.',
      'Rame ne vleci močno nazaj.',
      'Potisk naj ostane mehak.',
      'Komolca ne zaklepaj.',
      'Stopala naj ostanejo stabilna.',
      'Gib rok poveži z nežno rotacijo trupa.',
    ],
    phases: [
      phase(
        'rm-1',
        'Začetni položaj',
        'Roki sta sproščeni pred telesom, trup pa pokončen.',
        'media/tai-chi/repulse-monkey/01-start.webp',
      ),
      phase(
        'rm-2',
        'Roka nazaj',
        'Nežno obrni trup in eno roko počasi odpelji nazaj.',
        'media/tai-chi/repulse-monkey/02-reach-back.webp',
      ),
      phase(
        'rm-3',
        'Prehod',
        'Dlan zadnje roke obrni naprej in začni vračati trup proti sredini.',
        'media/tai-chi/repulse-monkey/03-transition.webp',
      ),
      phase(
        'rm-4',
        'Potisk',
        'Roka počasi potuje naprej, druga pa se sproščeno umakne proti telesu.',
        'media/tai-chi/repulse-monkey/04-push.webp',
      ),
    ],
  }),

  'tai-roll-back': move({
    id: 'tai-roll-back',
    name: 'Umik nazaj',
    englishName: 'Roll Back',
    description:
      'Mehak krožen umik rok v stran in nazaj, povezan z nežno rotacijo trupa.',
    durationSeconds: 75,
    side: 'alternating',
    media: mediaFolder('roll-back'),
    howTo: [
      'Sedi pokončno z obema stopaloma stabilno na tleh.',
      'Ramena in komolce sprosti.',
      'Roki postavi pred telo v mehko zaobljen položaj.',
      'Nežno obrni trup v eno stran.',
      'Roki naj sledita rotaciji trupa.',
      'Sprednja roka se začne mehko umikati navznoter.',
      'Druga roka spremlja gib nižje ob telesu.',
      'Predstavljaj si, da silo nežno vodiš mimo sebe, ne da bi jo vlekel z rokami.',
      'Ne nagibaj trupa nazaj.',
      'Vrni se proti sredini.',
      'Ponovi na drugi strani.',
    ],
    breathing:
      'Vdihni med pripravo. Med počasnim umikom in rotacijo mirno izdihni. Dihanje naj ostane naravno in neprekinjeno.',
    tips: [
      'Ne vleci rok z močjo.',
      'Ne nagibaj se nazaj.',
      'Ramena naj ostanejo spuščena.',
      'Rotacija naj prihaja iz trupa.',
      'Stopala naj ostanejo stabilna.',
    ],
    phases: [
      phase(
        'rb-1',
        'Priprava',
        'Roki drži mehko zaobljeni pred telesom in sprosti ramena.',
        'media/tai-chi/roll-back/01-start.webp',
      ),
      phase(
        'rb-2',
        'Obrat',
        'Nežno obrni trup v stran in dovoli, da roki sledita gibanju.',
        'media/tai-chi/roll-back/02-turn.webp',
      ),
      phase(
        'rb-3',
        'Umik',
        'Roki mehko vodi nazaj in v stran, kot da gib usmerjaš mimo telesa.',
        'media/tai-chi/roll-back/03-rollback.webp',
      ),
      phase(
        'rb-4',
        'Zaključek',
        'Zaključi rotacijo brez nagibanja nazaj in se počasi vrni proti sredini.',
        'media/tai-chi/roll-back/04-finish.webp',
      ),
    ],
  }),

  'tai-press': move({
    id: 'tai-press',
    name: 'Pritisk',
    englishName: 'Press',
    description:
      'Roki se združita pred telesom in skupaj izvedeta počasen, nadzorovan pritisk naprej.',
    durationSeconds: 75,
    side: 'none',
    media: mediaFolder('press'),
    howTo: [
      'Sedi pokončno in sproščeno.',
      'Roki pripravi pred prsnim košem.',
      'Eno dlan približaj notranji strani druge podlakti oziroma dlani.',
      'Komolci naj ostanejo mehki in spuščeni.',
      'Roki poveži v enoten zaobljen položaj.',
      'Počasi ju pomakni naprej.',
      'Gib naj spremlja zelo nežen premik trupa naprej iz kolkov.',
      'Hrbta ne zaokrožuj.',
      'Komolcev ne zaklepaj.',
      'Nato roki počasi vrni proti telesu.',
    ],
    breathing:
      'Vdihni med pripravo rok. Med počasnim pritiskom naprej izdihni. Ob vračanju ponovno mirno vdihni.',
    tips: [
      'Ne potiskaj z močjo.',
      'Komolcev ne zaklepaj.',
      'Ramena naj ostanejo spuščena.',
      'Ne zaokrožuj hrbta.',
      'Obe roki naj delujeta kot povezana celota.',
    ],
    phases: [
      phase(
        'pr-1',
        'Priprava',
        'Roki sproščeno pripravi pred prsnim košem.',
        'media/tai-chi/press/01-start.webp',
      ),
      phase(
        'pr-2',
        'Poveži roki',
        'Roki približaj in oblikuj povezan, zaobljen položaj.',
        'media/tai-chi/press/02-connect.webp',
      ),
      phase(
        'pr-3',
        'Pritisk naprej',
        'Obe roki počasi pomakni naprej, komolci pa ostanejo mehki.',
        'media/tai-chi/press/03-press.webp',
      ),
      phase(
        'pr-4',
        'Zaključek',
        'Zaključi gib brez zaklepanja komolcev in ohrani sproščena ramena.',
        'media/tai-chi/press/04-finish.webp',
      ),
    ],
  }),

  'tai-push': move({
    id: 'tai-push',
    name: 'Potisk',
    englishName: 'Push',
    description:
      'Obe dlani iz sproščenega položaja počasi potujeta naprej in se nato vrneta proti telesu.',
    durationSeconds: 75,
    side: 'none',
    media: mediaFolder('push'),
    howTo: [
      'Sedi pokončno.',
      'Stopala naj ostanejo stabilno na tleh.',
      'Roki pripravi pred telesom.',
      'Dlani počasi obrni naprej.',
      'Komolci naj ostanejo mehki.',
      'Obe dlani začni počasi pomikati naprej.',
      'Gib naj bo enakomeren in brez sunkov.',
      'Ne iztegni komolcev do zaklepa.',
      'Trup lahko zelo nežno sledi gibu naprej.',
      'Nato sproščeno vrni roki proti telesu.',
      'Ponovi v počasnem ritmu.',
    ],
    breathing:
      'Vdihni med pripravo in vračanjem rok. Med počasnim potiskom naprej izdihni. Ne zadržuj diha.',
    tips: [
      'Potisk naj bo mehak, ne silovit.',
      'Komolcev ne zaklepaj.',
      'Ne dviguj ramen.',
      'Ne nagibaj se močno naprej.',
      'Zapestja naj ostanejo sproščena.',
    ],
    phases: [
      phase(
        'pu-1',
        'Začetni položaj',
        'Roki pripravi pred telesom in sprosti ramena.',
        'media/tai-chi/push/01-start.webp',
      ),
      phase(
        'pu-2',
        'Dlani naprej',
        'Dlani počasi obrni naprej, komolci pa ostanejo mehki.',
        'media/tai-chi/push/02-palms.webp',
      ),
      phase(
        'pu-3',
        'Potisk',
        'Obe dlani počasi pomakni naprej brez zaklepanja komolcev.',
        'media/tai-chi/push/03-push.webp',
      ),
      phase(
        'pu-4',
        'Vračanje',
        'Roki sproščeno vrni proti telesu in se pripravi na naslednjo ponovitev.',
        'media/tai-chi/push/04-return.webp',
      ),
    ],
  }),

  'tai-part-mane': move({
    id: 'tai-part-mane',
    name: 'Razčesavanje grive',
    englishName: "Part the Wild Horse's Mane",
    description:
      'Izmenično odpiranje rok diagonalno – ena roka naprej-navzgor, druga nazaj-navzdol, s nežno rotacijo trupa.',
    durationSeconds: 90,
    side: 'alternating',
    howTo: [
      'Sedi pokončno z obema stopaloma stabilno na tleh.',
      'Roke pred trebuhom, kot da držiš žogo.',
      'Eno roko počasi vodi diagonalno naprej in rahlo navzgor.',
      'Druga roka potone nazaj ob bok.',
      'Trup se rahlo obrne v smer sprednje roke.',
      'Vrni se in zamenjaj strani.',
      'Gib naj bo tekoč, brez sunkov.',
    ],
    breathing: 'Vdih v sredini, izdih ob odpiranju v stran. Dihanja ne zadržuj.',
    tips: [
      'Ne dviguj sprednje rame.',
      'Gib naj bo širok, a mehak.',
      'Oči lahko sledijo sprednji dlani.',
      'Komolci ostanejo mehki.',
    ],
  }),

  'tai-white-crane': move({
    id: 'tai-white-crane',
    name: 'Beli žerjav širi krila',
    englishName: 'White Crane Spreads Wings',
    description:
      'Ena roka se dvigne, druga potone – odpiranje prsi z občutkom lahkotnosti in sproščenosti.',
    durationSeconds: 75,
    side: 'alternating',
    howTo: [
      'Sedi pokončno in sprosti ramena.',
      'Iz sredine počasi dvigni eno roko navzgor-vstran.',
      'Druga roka se spusti navzdol ob stran telesa.',
      'Prsni koš se rahlo odpre, ramena ostanejo mehka.',
      'Zadrži trenutek, nato zamenjaj strani.',
    ],
    breathing: 'Vdih ob odpiranju, izdih ob menjavi / spustu. Dihaj naravno.',
    tips: [
      'Ne zvrzi se v ledveni del.',
      'Vrat ostane dolg, brada rahlo notri.',
      'Komolci niso zaklenjeni.',
      'Ne dviguj ramen k ušesom.',
    ],
  }),

  'tai-single-whip': move({
    id: 'tai-single-whip',
    name: 'Enotni bič',
    englishName: 'Single Whip',
    description:
      'Ena roka se iztegne v stran oziroma naprej, druga se mehko umakne, gib pa spremlja nežna rotacija trupa.',
    durationSeconds: 75,
    side: 'alternating',
    media: mediaFolder('single-whip'),
    howTo: [
      'Sedi pokončno z obema stopaloma stabilno na tleh.',
      'Ramena sprosti in komolce ohrani mehke.',
      'Roki pripravi pred telesom.',
      'Nežno obrni trup proti eni strani.',
      'Ena roka se začne mehko umikati proti telesu.',
      'Drugo roko počasi iztegni v stran oziroma diagonalno naprej.',
      'Dlan iztegnjene roke naj ostane sproščena.',
      'Ne zaklepaj komolca.',
      'Pogled lahko nežno sledi iztegnjeni roki.',
      'Vrni se proti sredini.',
      'Ponovi na drugi strani.',
    ],
    breathing:
      'Vdihni med pripravo in prehodom skozi sredino. Med počasnim iztegom roke mirno izdihni. Dihanja ne zadržuj.',
    tips: [
      'Ne dviguj ramen.',
      'Komolca ne zaklepaj.',
      'Ne obračaj trupa predaleč.',
      'Ne nagibaj se v stran.',
      'Gib naj bo počasen in tekoč.',
    ],
    phases: [
      phase(
        'sw-1',
        'Začetni položaj',
        'Roki sproščeno pripravi pred telesom in ohrani pokončno sedečo držo.',
        'media/tai-chi/single-whip/01-start.webp',
      ),
      phase(
        'sw-2',
        'Umik roke',
        'Nežno obrni trup in eno roko mehko umakni proti telesu.',
        'media/tai-chi/single-whip/02-withdraw.webp',
      ),
      phase(
        'sw-3',
        'Izteg',
        'Drugo roko počasi iztegni v stran oziroma diagonalno naprej. Komolec ostane mehak.',
        'media/tai-chi/single-whip/03-extend.webp',
      ),
      phase(
        'sw-4',
        'Zaključek',
        'Zaključi gib brez napetosti v ramenih in se počasi pripravi na drugo stran.',
        'media/tai-chi/single-whip/04-finish.webp',
      ),
    ],
  }),

  'tai-fair-lady': move({
    id: 'tai-fair-lady',
    name: 'Gospa dela na statvah',
    englishName: 'Fair Lady Works at Shuttles',
    description:
      'Izmenični sedeči gib z nežno rotacijo trupa, pri katerem roki usklajeno potujeta naprej in nazaj.',
    durationSeconds: 105,
    side: 'alternating',
    media: mediaFolder('fair-lady'),
    howTo: [
      'Sedi pokončno in sprosti ramena.',
      'Roki pripravi pred prsnim košem.',
      'Nežno obrni trup v eno stran.',
      'Eno roko počasi dvigni in usmeri naprej.',
      'Druga roka ostane bližje telesu.',
      'Dlan sprednje roke naj bo sproščena.',
      'Nato začni tekoč prehod skozi sredino.',
      'Roki postopoma zamenjata vlogi.',
      'Obrni trup proti drugi strani.',
      'Druga roka sedaj potuje naprej.',
      'Nadaljuj izmenično brez sunkov.',
    ],
    breathing:
      'Vdihni med prehodom skozi sredino. Med nežnim iztegom roke izdihni. Dih naj ostane miren in naraven.',
    tips: [
      'Ne izvajaj giba samo z rokami.',
      'Ramena naj ostanejo spuščena.',
      'Ne zaklepaj komolcev.',
      'Rotacija trupa naj bo majhna in udobna.',
      'Gib naj bo tekoč.',
    ],
    phases: [
      phase(
        'fl-1',
        'Začetek',
        'Roki sproščeno pripravi pred telesom.',
        'media/tai-chi/fair-lady/01-start.webp',
      ),
      phase(
        'fl-2',
        'Prva stran',
        'Nežno obrni trup in eno roko počasi usmeri naprej.',
        'media/tai-chi/fair-lady/02-first-shuttle.webp',
      ),
      phase(
        'fl-3',
        'Druga stran',
        'S tekočim prehodom zamenjaj roki in gib ponovi proti drugi strani.',
        'media/tai-chi/fair-lady/03-second-shuttle.webp',
      ),
      phase(
        'fl-4',
        'Zaključek',
        'Vrni se proti sredini in ohrani sproščena ramena ter mehke komolce.',
        'media/tai-chi/fair-lady/04-finish.webp',
      ),
    ],
  }),

  'tai-diagonal-flying': move({
    id: 'tai-diagonal-flying',
    name: 'Diagonalni leteči gib',
    englishName: 'Diagonal Flying',
    description:
      'Roki se mehko razpreta diagonalno v nasprotni smeri, gib pa spremlja nežna rotacija trupa.',
    durationSeconds: 75,
    side: 'alternating',
    media: mediaFolder('diagonal-flying'),
    howTo: [
      'Sedi pokončno in stabilno.',
      'Roki pripravi pred telesom.',
      'Ramena naj ostanejo sproščena.',
      'Začni nežno rotacijo trupa.',
      'Eno roko počasi dvigni diagonalno navzgor.',
      'Druga roka se istočasno spusti diagonalno navzdol.',
      'Ustvari občutek širjenja v dveh nasprotnih smereh.',
      'Komolcev ne zaklepaj.',
      'Ne nagibaj trupa v stran.',
      'Počasi se vrni proti sredini.',
      'Ponovi v drugo smer.',
    ],
    breathing:
      'Vdihni med pripravo. Med diagonalnim odpiranjem rok počasi izdihni. Ob vračanju proti sredini ponovno mirno vdihni.',
    tips: [
      'Ne dviguj rame skupaj z zgornjo roko.',
      'Ne zaklepaj komolcev.',
      'Ne nagibaj se v stran.',
      'Gib naj bo širok, vendar udoben.',
      'Obe roki naj se premikata usklajeno.',
    ],
    phases: [
      phase(
        'df-1',
        'Začetek',
        'Roki pripravi pred telesom in sprosti ramena.',
        'media/tai-chi/diagonal-flying/01-start.webp',
      ),
      phase(
        'df-2',
        'Diagonalni dvig',
        'Eno roko počasi dvigni diagonalno navzgor, drugo pa spusti v nasprotno smer.',
        'media/tai-chi/diagonal-flying/02-diagonal-lift.webp',
      ),
      phase(
        'df-3',
        'Razteg',
        'Ohrani občutek širjenja med rokama brez napenjanja ramen.',
        'media/tai-chi/diagonal-flying/03-open.webp',
      ),
      phase(
        'df-4',
        'Zaključek',
        'Počasi vrni roki proti sredini in se pripravi na drugo stran.',
        'media/tai-chi/diagonal-flying/04-finish.webp',
      ),
    ],
  }),

  'tai-embrace-tiger': move({
    id: 'tai-embrace-tiger',
    name: 'Objem tigra',
    englishName: 'Embrace Tiger',
    description:
      'Roki se zaokrožita pred telesom, kot da objemata veliko žogo, nato se mehko odpreta in počasi potisneta naprej.',
    durationSeconds: 75,
    side: 'none',
    media: mediaFolder('embrace-tiger'),
    howTo: [
      'Sedi pokončno in sproščeno.',
      'Roki pripravi pred telesom.',
      'Zaokroži ju, kot da objemaš veliko mehko žogo.',
      'Komolci naj ostanejo spuščeni in mehki.',
      'Za trenutek ohrani zaobljeno obliko.',
      'Nato roki počasi odpri v stran.',
      'Ne odpiraj ju preko udobnega obsega.',
      'Dlani nato postopoma obrni naprej.',
      'Roki počasi približaj nazaj pred telo.',
      'Zaključi z mehkim potiskom naprej.',
      'Komolcev ne zaklepaj.',
    ],
    breathing:
      'Med oblikovanjem objema počasi vdihni. Med odpiranjem in mehkim potiskom izdihni. Dih naj ostane miren in brez napenjanja.',
    tips: [
      'Ramena naj ostanejo spuščena.',
      'Ne odpiraj rok predaleč.',
      'Komolcev ne zaklepaj.',
      'Ne potiskaj z močjo.',
      'Ohrani občutek zaokroženosti in mehkobe.',
    ],
    phases: [
      phase(
        'et-1',
        'Začetek',
        'Roki sproščeno pripravi pred telesom.',
        'media/tai-chi/embrace-tiger/01-start.webp',
      ),
      phase(
        'et-2',
        'Objem',
        'Roki mehko zaokroži, kot da objemaš veliko žogo.',
        'media/tai-chi/embrace-tiger/02-embrace.webp',
      ),
      phase(
        'et-3',
        'Odpiranje',
        'Roki počasi odpri v stran in ohrani spuščena ramena.',
        'media/tai-chi/embrace-tiger/03-open.webp',
      ),
      phase(
        'et-4',
        'Potisk',
        'Dlani obrni naprej in zaključi z mehkim, nadzorovanim potiskom.',
        'media/tai-chi/embrace-tiger/04-push.webp',
      ),
    ],
  }),

  'tai-silk-reeling': move({
    id: 'tai-silk-reeling',
    name: 'Navijanje svile',
    englishName: 'Silk Reeling',
    description:
      'Krožno in tekoče gibanje rok, povezano z nežno rotacijo trupa in sproščenim dihanjem.',
    durationSeconds: 105,
    side: 'alternating',
    media: mediaFolder('silk-reeling'),
    howTo: [
      'Sedi pokončno z obema stopaloma stabilno na tleh.',
      'Sprosti ramena, vrat in komolce.',
      'Roki pripravi pred telesom v mehko zaobljen položaj.',
      'Začni počasen krožen gib.',
      'Ena roka se postopoma dviguje.',
      'Druga se istočasno spušča.',
      'Trup lahko nežno sledi smeri kroženja.',
      'Ko dosežeš zgornji del kroga, nadaljuj brez ustavljanja.',
      'Roki postopoma zamenjata vlogi.',
      'Nadaljuj v tekočem krogu.',
      'Gib naj bo neprekinjen in brez sunkov.',
      'Po nekaj ponovitvah zamenjaj smer.',
    ],
    breathing:
      'Dihaj počasi in naravno. Vdih lahko spremlja odpiranje in dvig rok. Izdih lahko spremlja spuščanje in zaključevanje kroga. Dihanja ne prilagajaj na silo.',
    tips: [
      'Ne riši kroga samo z rokami.',
      'Dovoli nežno sodelovanje trupa.',
      'Ramena naj ostanejo spuščena.',
      'Komolci naj bodo mehki.',
      'Ne pospešuj giba.',
      'Krog naj ostane tekoč in udoben.',
    ],
    phases: [
      phase(
        'sr-1',
        'Začetni položaj',
        'Roki sproščeno pripravi pred telesom in ohrani pokončno sedečo držo.',
        'media/tai-chi/silk-reeling/01-start.webp',
      ),
      phase(
        'sr-2',
        'Začetek kroga',
        'Ena roka se počasi dviguje po krožni poti, druga pa se istočasno spušča.',
        'media/tai-chi/silk-reeling/02-circle.webp',
      ),
      phase(
        'sr-3',
        'Nadaljevanje',
        'Nadaljuj kroženje brez ustavljanja in dovoli nežno rotacijo trupa.',
        'media/tai-chi/silk-reeling/03-continue.webp',
      ),
      phase(
        'sr-4',
        'Zaključek kroga',
        'Zaključi krog mehko in tekoče ter se pripravi na naslednjo ponovitev ali spremembo smeri.',
        'media/tai-chi/silk-reeling/04-finish.webp',
      ),
    ],
  }),

  'tai-closing': move({
    id: 'tai-closing',
    name: 'Zaključek',
    englishName: 'Closing',
    description:
      'Umirjen zaključek vadbe, pri katerem se roki počasi spustita, telo sprosti in dihanje umiri.',
    durationSeconds: 55,
    side: 'none',
    category: 'cooldown',
    media: mediaFolder('closing'),
    howTo: [
      'Sedi pokončno in sproščeno.',
      'Stopala naj ostanejo stabilno na tleh.',
      'Roki drži sproščeno pred telesom.',
      'Naredi miren vdih.',
      'Roki začni počasi spuščati.',
      'Ramena naj se dodatno sprostijo.',
      'Dlani počasi približaj stegnom.',
      'Roki položi na stegna.',
      'Sprosti čeljust in vrat.',
      'Ostani nekaj trenutkov v mirnem sedečem položaju.',
      'Dihaj enakomerno.',
      'Vadbo zaključi brez hitrega vstajanja.',
    ],
    breathing:
      'Počasi vdihni skozi nos. Med spuščanjem rok naredi dolg in sproščen izdih. Nato nekaj trenutkov dihaj naravno in enakomerno.',
    tips: [
      'Ne spuščaj rok sunkovito.',
      'Ramena naj bodo sproščena.',
      'Ne zadržuj diha.',
      'Po koncu ostani nekaj trenutkov pri miru.',
      'Če vstaneš, vstani počasi.',
    ],
    phases: [
      phase(
        'cl-1',
        'Začetek',
        'Roki sproščeno drži pred telesom in umiri gibanje.',
        'media/tai-chi/closing/01-start.webp',
      ),
      phase(
        'cl-2',
        'Spuščanje',
        'Ob mirnem izdihu počasi spusti roki proti stegnom.',
        'media/tai-chi/closing/02-lowering.webp',
      ),
      phase(
        'cl-3',
        'Počitek',
        'Dlani sproščeno položi na stegna in zmehčaj ramena, vrat ter čeljust.',
        'media/tai-chi/closing/03-rest.webp',
      ),
      phase(
        'cl-4',
        'Zaključek',
        'Ostani nekaj trenutkov pri miru in dihaj počasi ter enakomerno.',
        'media/tai-chi/closing/04-finish.webp',
      ),
    ],
  }),
} as const satisfies Record<string, Exercise>;

export type TaiChiExerciseId = keyof typeof taiChiExercises;

export function getTaiChiExercise(id: TaiChiExerciseId): Exercise {
  return taiChiExercises[id];
}

/** Celoten canonical Chair Tai Chi flow (brez Silk Reeling) */
export const TAI_CHI_FULL_FLOW: TaiChiExerciseId[] = [
  'tai-opening',
  'tai-rising-hands',
  'tai-part-mane',
  'tai-white-crane',
  'tai-brush-knee',
  'tai-ward-off',
  'tai-roll-back',
  'tai-press',
  'tai-push',
  'tai-repulse-monkey',
  'tai-cloud-hands',
  'tai-single-whip',
  'tai-fair-lady',
  'tai-diagonal-flying',
  'tai-embrace-tiger',
  'tai-closing',
];

/** Sestavi seznam vaj iz knjižnice (brez podvajanja definicij) */
export function taiChiMoves(...ids: TaiChiExerciseId[]): Exercise[] {
  return ids.map((id) => taiChiExercises[id]);
}
