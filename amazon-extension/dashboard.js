// Amazon Spending Analysis / Ausgaben-Analyse – Dashboard 5.5
// EN: Analyzes Amazon order data – categories, charts, exports (Excel/PDF), bilingual (DE/EN)
// DE: Analysiert Amazon-Bestelldaten – Kategorien, Charts, Exporte (Excel/PDF), zweisprachig (DE/EN)
// External JS file (required by Chrome Extension CSP)

// ─── CATEGORIES ──────────────────────────────────────────
var CATS={elektronik:{label:"Elektronik",icon:"\u26A1",color:"#4C9EEB"},haus_garten:{label:"Haus & Garten",icon:"\uD83C\uDFE0",color:"#E8723A"},kleidung:{label:"Kleidung",icon:"\uD83D\uDC55",color:"#D4A843"},gesundheit:{label:"Gesundheit",icon:"\uD83D\uDC8A",color:"#2D9D78"},medien:{label:"Medien",icon:"\uD83D\uDCDA",color:"#9B6CD1"},kinder:{label:"Kinder",icon:"\uD83E\uDDF8",color:"#E85D75"},werkzeug:{label:"Werkzeug",icon:"\uD83D\uDD27",color:"#8B6914"},koerperpflege:{label:"K\u00F6rperpflege",icon:"\uD83E\uDDF4",color:"#3AAFB9"},sport_outdoor:{label:"Sport & Outdoor",icon:"\uD83C\uDFC3",color:"#6B8E23"},lebensmittel:{label:"Lebensmittel",icon:"\uD83E\uDD66",color:"#228B22"},tickets:{label:"Tickets",icon:"\uD83C\uDFAB",color:"#FF6347"},auto_motorrad:{label:"Auto & Motorrad",icon:"\uD83D\uDE97",color:"#5B7FA5"},buero:{label:"B\u00FCro & Schreibwaren",icon:"\uD83D\uDCDD",color:"#7A8B6D"},haustier:{label:"Haustier",icon:"\uD83D\uDC3E",color:"#C07830"},abo_digital:{label:"Abo & Digital",icon:"\uD83D\uDCF1",color:"#8E5FB0"},kueche:{label:"K\u00FCche & Haushalt",icon:"\uD83C\uDF73",color:"#C4683A"},geschenke:{label:"Geschenke & Gutscheine",icon:"\uD83C\uDF81",color:"#D4577A"},sonstiges:{label:"Sonstiges",icon:"\uD83D\uDCE6",color:"#6B7B8D"}};
var CK=Object.keys(CATS);

// ─── SCORING-BASED CATEGORIZATION ───────────────────────
// Each keyword has an optional weight (default 1). Longer/more-specific keywords
// score higher via length bonus. The category with the highest total score wins.
// This replaces the old "first match wins" approach.
var KW={
  elektronik:[
    // Marken & Geräte (hohe Gewichtung für eindeutige Treffer)
    {w:'kopfhörer',s:3},{w:'bluetooth lautsprecher',s:4},{w:'jbl',s:2},{w:'gopro',s:3},{w:'fire tv',s:3},{w:'pixel watch',s:3},{w:'google pixel',s:3},{w:'samsung galaxy',s:3},{w:'smartwatch',s:3},{w:'microsd',s:2},{w:'sd-karte',s:2},{w:'ladekabel',s:2},{w:'selfie stick',s:2},{w:'watch band',s:2},{w:'buds',s:2},{w:'lautsprecher',s:2},{w:'usb-c',s:2},{w:'usb',s:1},{w:'hdmi',s:2},{w:'adapter',s:1},{w:'charger',s:2},{w:'powerbank',s:3},{w:'power bank',s:3},{w:'headset',s:3},{w:'router',s:2},{w:'wlan',s:2},{w:'alexa',s:2},{w:'echo dot',s:3},{w:'echo show',s:3},{w:'kindle',s:2},{w:'tablet',s:2},{w:'laptop',s:3},{w:'notebook',s:2},{w:'monitor',s:2},{w:'ssd',s:2},{w:'festplatte',s:2},{w:'smart home',s:3},{w:'steckdose',s:1},{w:'fernbedienung',s:2},{w:'luna-controller',s:3},{w:'luna premium',s:3},{w:'airtag',s:3},{w:'apple air',s:2},{w:'smartthings',s:3},{w:'zigbee',s:3},{w:'wassersensor',s:2},{w:'stromzähler',s:2},{w:'instax',s:2},{w:'kamera',s:2},{w:'akku',s:1},{w:'xbox',s:3},{w:'nintendo',s:3},{w:'playstation',s:3},{w:'gaming',s:2},{w:'controller',s:1},
    // Erweitert
    {w:'iphone',s:3},{w:'ipad',s:3},{w:'macbook',s:3},{w:'airpods',s:3},{w:'apple watch',s:3},{w:'anker',s:2},{w:'baseus',s:2},{w:'displayport',s:2},{w:'thunderbolt',s:2},{w:'ethernet',s:2},{w:'netzwerk',s:1},{w:'switch',s:1},{w:'raspberry pi',s:3},{w:'arduino',s:3},{w:'drohne',s:3},{w:'drone',s:3},{w:'e-reader',s:3},{w:'soundbar',s:3},{w:'subwoofer',s:3},{w:'beamer',s:3},{w:'projektor',s:3},{w:'webcam',s:2},{w:'mikrofon',s:2},{w:'streamer',s:2},{w:'hub',s:1},{w:'docking',s:2},{w:'tastatur',s:2},{w:'keyboard',s:2},{w:'maus ',s:2},{w:'mouse',s:2},{w:'grafikkarte',s:3},{w:'cpu',s:2},{w:'ram ',s:2},{w:'mainboard',s:3},{w:'gehäuse',s:1},{w:'netzteil',s:2},{w:'drucker',s:2},{w:'scanner',s:2},{w:'toner',s:2},{w:'tinten',s:2},{w:'patrone',s:2},{w:'speicherkarte',s:2},{w:'card reader',s:2},{w:'nas ',s:2},{w:'dashcam',s:3},{w:'action cam',s:3},{w:'oculus',s:3},{w:'vr brille',s:3},{w:'smart plug',s:3},{w:'steckdosenleiste',s:1},{w:'verlängerungskabel',s:1},{w:'ringlampe',s:2},{w:'ring light',s:2},{w:'led strip',s:2},{w:'led-streifen',s:2},{w:'philips hue',s:3},{w:'sonos',s:3},{w:'bose',s:3},{w:'sennheiser',s:3},{w:'sony wh',s:3},{w:'sony wf',s:3},{w:'marshall',s:2},{w:'denon',s:2},{w:'fire stick',s:3},{w:'chromecast',s:3},{w:'roku',s:3},{w:'steam deck',s:3}
  ],
  haus_garten:[
    {w:'trinkflasche',s:2},{w:'camelbak',s:2},{w:'ion8',s:2},{w:'wasserflasche',s:2},{w:'reinigungsbürste',s:2},{w:'fugenbürste',s:2},{w:'toilettentücher',s:2},{w:'tempo feuchte',s:2},{w:'geldkassette',s:2},{w:'waschmittel',s:2},{w:'spülmittel',s:2},{w:'müllbeutel',s:2},{w:'staubsauger',s:3},{w:'besen',s:1},{w:'schwamm',s:1},{w:'aufbewahrung',s:1},{w:'regal',s:1},{w:'gardine',s:2},{w:'vorhang',s:2},{w:'bettwäsche',s:2},{w:'handtuch',s:2},{w:'kerze',s:1},{w:'vase',s:1},{w:'kleiderbügel',s:2},{w:'wandsticker',s:2},{w:'wandtattoo',s:2},{w:'magnethalter',s:1},{w:'zylinder',s:1},{w:'schloss',s:1},{w:'leselampe',s:2},{w:'nachtlicht',s:2},{w:'teppich',s:2},{w:'läufer',s:1},{w:'matratzenschoner',s:2},{w:'verdunkelungsrollo',s:3},{w:'dachfenster',s:2},{w:'velux',s:2},{w:'schneeschaufel',s:2},{w:'wasserkanister',s:2},{w:'pavillon',s:2},{w:'strandmuschel',s:2},{w:'aqua dicht',s:2},{w:'dichtmasse',s:2},{w:'saugschlauch',s:2},{w:'tauchpumpe',s:2},{w:'rauchmelder',s:2},{w:'feuermelder',s:2},
    // Erweitert
    {w:'blumentopf',s:2},{w:'pflanzgefäß',s:2},{w:'gartenschlauch',s:2},{w:'rasenmäher',s:3},{w:'heckenschere',s:2},{w:'gartenmöbel',s:3},{w:'sonnenschirm',s:2},{w:'grill',s:2},{w:'grillzubehör',s:2},{w:'blumenerde',s:2},{w:'dünger',s:2},{w:'saatgut',s:2},{w:'hochbeet',s:2},{w:'gewächshaus',s:3},{w:'gartenwerkzeug',s:2},{w:'schubkarre',s:2},{w:'kompost',s:2},{w:'bewässerung',s:2},{w:'pool',s:1},{w:'planschbecken',s:2},{w:'matratze',s:2},{w:'kopfkissen',s:2},{w:'bettdecke',s:2},{w:'spannbettlaken',s:2},{w:'duschvorhang',s:2},{w:'badezimmer',s:1},{w:'wäschekorb',s:2},{w:'bügeleisen',s:2},{w:'wäscheständer',s:2},{w:'kleiderhaken',s:2},{w:'türmatte',s:2},{w:'fußmatte',s:2},{w:'bilderrahmen',s:2},{w:'wanduhr',s:2},{w:'spiegel',s:1},{w:'lampe',s:1},{w:'lichterkette',s:2},{w:'möbel',s:1},{w:'schrank',s:1},{w:'kommode',s:2},{w:'stuhl',s:1},{w:'tisch',s:1},{w:'sofa',s:2},{w:'kissen',s:1},{w:'decke',s:1},{w:'luftentfeuchter',s:2},{w:'luftreiniger',s:2},{w:'ventilator',s:2},{w:'heizlüfter',s:2},{w:'thermostat',s:2},{w:'wärme',s:1},{w:'isolier',s:1},{w:'dichtung',s:1},{w:'silikon',s:1},{w:'klebeband',s:1},{w:'mülleimer',s:2},{w:'papierkorb',s:1},{w:'insekten',s:1},{w:'mückenschutz',s:2},{w:'fliegengitter',s:2}
  ],
  kleidung:[
    {w:'t-shirt',s:3},{w:'hose',s:2},{w:'jacke',s:2},{w:'mantel',s:2},{w:'socken',s:2},{w:'unterwäsche',s:3},{w:'schuh',s:2},{w:'sneaker',s:3},{w:'mütze',s:2},{w:'schal',s:2},{w:'handschuh',s:2},{w:'gürtel',s:2},{w:'kleid',s:2},{w:'pullover',s:2},{w:'hoodie',s:3},{w:'jeans',s:3},{w:'shorts',s:2},{w:'jogginghose',s:3},{w:'wanderschuhe',s:3},{w:'mammut',s:2},{w:'crocs',s:3},{w:'stiefel',s:2},{w:'sandalen',s:2},{w:'fleece',s:2},{w:'regenjacke',s:3},{w:'clogs',s:2},{w:'boots',s:2},
    // Erweitert
    {w:'hemd',s:2},{w:'bluse',s:2},{w:'rock',s:1},{w:'anzug',s:2},{w:'kostüm',s:1},{w:'weste',s:2},{w:'parka',s:3},{w:'anorak',s:3},{w:'daunenjacke',s:3},{w:'winterjacke',s:3},{w:'badehose',s:3},{w:'badeanzug',s:3},{w:'bikini',s:3},{w:'leggings',s:3},{w:'strumpfhose',s:3},{w:'unterhemd',s:2},{w:'boxershort',s:3},{w:'slip',s:1},{w:'bh ',s:2},{w:'sport-bh',s:3},{w:'laufschuh',s:3},{w:'turnschuh',s:3},{w:'pantoffel',s:2},{w:'hausschuh',s:3},{w:'slipper',s:2},{w:'pumps',s:2},{w:'absatz',s:1},{w:'schnürsenkel',s:2},{w:'einlegesohle',s:2},{w:'gummistiefel',s:3},{w:'arbeitsschuh',s:3},{w:'sicherheitsschuh',s:3},{w:'kappe',s:1},{w:'basecap',s:3},{w:'beanie',s:3},{w:'stirnband',s:2},{w:'krawatte',s:2},{w:'fliege',s:1},{w:'hosenträger',s:2},{w:'geldbörse',s:2},{w:'portemonnaie',s:3},{w:'rucksack',s:2},{w:'tasche',s:1},{w:'handtasche',s:3},{w:'sporttasche',s:3},{w:'koffer',s:2},{w:'nike',s:2},{w:'adidas',s:2},{w:'puma',s:2},{w:'new balance',s:3},{w:'levi',s:2},{w:'jack wolfskin',s:3},{w:'north face',s:3},{w:'patagonia',s:3},{w:'tommy hilfiger',s:3},{w:'ralph lauren',s:3},{w:'lacoste',s:3},{w:'carhartt',s:3}
  ],
  gesundheit:[
    {w:'vitamin',s:2},{w:'biotin',s:3},{w:'kulturen komplex',s:4},{w:'kbe',s:2},{w:'bakterien',s:2},{w:'cosphera',s:3},{w:'basilikum',s:1},{w:'haarkur',s:2},{w:'zahnbürste',s:2},{w:'zahncreme',s:2},{w:'oral-b',s:3},{w:'curasept',s:3},{w:'creatine',s:3},{w:'kreatin',s:3},{w:'beatmungsmaske',s:3},{w:'magnesium',s:2},{w:'doppelherz',s:3},{w:'omega',s:2},{w:'kollagen',s:3},{w:'probiotik',s:3},{w:'ashwagandha',s:3},{w:'kurkuma',s:2},{w:'regenerat imun',s:4},{w:'dr. jacob',s:3},{w:'schlafmaske',s:2},{w:'nackenstützkissen',s:3},{w:'alpecin',s:3},{w:'coffein-liquid',s:3},
    // Erweitert
    {w:'nahrungsergänzung',s:3},{w:'supplement',s:3},{w:'protein',s:2},{w:'eiweiß',s:1},{w:'zink',s:2},{w:'eisen',s:1},{w:'calcium',s:2},{w:'folsäure',s:3},{w:'b12',s:2},{w:'d3',s:2},{w:'vitamin c',s:3},{w:'vitamin d',s:3},{w:'mundspülung',s:3},{w:'zahnseide',s:3},{w:'zahnpflege',s:2},{w:'munddusche',s:3},{w:'waterpik',s:3},{w:'blutdruckmessgerät',s:3},{w:'fieberthermometer',s:3},{w:'inhalator',s:3},{w:'pulsoximeter',s:3},{w:'verbandmaterial',s:3},{w:'pflaster',s:2},{w:'erste hilfe',s:3},{w:'medikament',s:2},{w:'tabletten',s:1},{w:'salbe',s:1},{w:'tropfen',s:1},{w:'nasenspray',s:2},{w:'hustensaft',s:3},{w:'erkältung',s:2},{w:'allergie',s:2},{w:'antihistamin',s:3},{w:'melatonin',s:3},{w:'baldrian',s:2},{w:'johanniskraut',s:3},{w:'spirulina',s:3},{w:'chlorella',s:3},{w:'flohsamenschalen',s:3},{w:'opc',s:2},{w:'msm',s:2},{w:'glucosamin',s:3},{w:'hyaluron',s:3},{w:'retinol',s:2},{w:'niacinamid',s:3},{w:'kompressionsstrümpfe',s:3},{w:'bandage',s:2},{w:'orthopädisch',s:2},{w:'massagepistole',s:3},{w:'faszienrolle',s:3},{w:'akupressur',s:3},{w:'hörgerät',s:3},{w:'kontaktlinsen',s:3},{w:'brille',s:1}
  ],
  medien:[
    {w:'buch',s:1},{w:'bücher',s:2},{w:'dvd',s:2},{w:'blu-ray',s:3},{w:'vinyl',s:2},{w:'poster',s:1},{w:'kalender',s:1},{w:'puzzle',s:2},{w:'laser maze',s:3},{w:'kakebo',s:3},{w:'weinführer',s:3},{w:'abundance',s:2},{w:'collapse',s:2},{w:'oppenheimer',s:2},{w:'john wick',s:3},{w:'sniper:',s:2},{w:'einziger tag',s:3},{w:'minecraft film',s:3},{w:'star wars',s:3},{w:'battlefront',s:3},{w:'force unleashed',s:3},{w:'clone wars',s:3},{w:'nexus',s:1},{w:'revolution aller zeiten',s:4},{w:'pippi langstrumpf',s:3},
    // Erweitert
    {w:'taschenbuch',s:3},{w:'hardcover',s:3},{w:'hörbuch',s:3},{w:'audible',s:3},{w:'roman',s:2},{w:'krimi',s:2},{w:'thriller',s:1},{w:'sachbuch',s:3},{w:'ratgeber',s:2},{w:'comic',s:2},{w:'manga',s:3},{w:'graphic novel',s:3},{w:'atlas',s:2},{w:'lexikon',s:2},{w:'cd ',s:2},{w:'schallplatte',s:3},{w:'lp ',s:1},{w:'album',s:1},{w:'soundtrack',s:3},{w:'musik',s:1},{w:'film',s:1},{w:'serie ',s:1},{w:'staffel',s:2},{w:'season',s:1},{w:'edition',s:1},{w:'collector',s:2},{w:'steelbook',s:3},{w:'4k uhd',s:3},{w:'uhd',s:2},{w:'brettspiel',s:3},{w:'kartenspiel',s:3},{w:'gesellschaftsspiel',s:3},{w:'würfelspiel',s:3},{w:'monopoly',s:3},{w:'catan',s:3},{w:'codenames',s:3},{w:'ravensburger',s:2},{w:'kosmos',s:2},{w:'schmidt spiele',s:3},{w:'wandkalender',s:3},{w:'tageskalender',s:3},{w:'notizbuch',s:2},{w:'journal',s:1},{w:'planer',s:1},{w:'sticker',s:1}
  ],
  kinder:[
    {w:'edurino',s:3},{w:'tiptoi',s:3},{w:'nerf',s:3},{w:'lego',s:3},{w:'ninjago',s:3},{w:'kinderkostüm',s:3},{w:'mandalorian',s:2},{w:'simba',s:2},{w:'arztkoffer',s:3},{w:'spielzeug',s:3},{w:'ballons',s:2},{w:'ballongas',s:3},{w:'lichtschwerter',s:3},{w:'playmobil',s:3},{w:'barbie',s:3},{w:'puppe',s:2},{w:'tonies',s:3},{w:'carrera',s:2},{w:'hot wheels',s:3},{w:'duplo',s:3},{w:'schleich',s:2},{w:'geburtstag',s:1},
    // Erweitert
    {w:'kinderbuch',s:3},{w:'bilderbuch',s:3},{w:'kinderspiel',s:3},{w:'baby',s:1},{w:'windel',s:3},{w:'schnuller',s:3},{w:'babyflasche',s:3},{w:'stillkissen',s:3},{w:'wickeltasche',s:3},{w:'strampler',s:3},{w:'kinderwagen',s:3},{w:'buggy',s:2},{w:'autositz',s:2},{w:'kindersitz',s:3},{w:'babyphone',s:3},{w:'lernspielzeug',s:3},{w:'kinderfahrrad',s:3},{w:'tretroller',s:2},{w:'bobby car',s:3},{w:'sandkasten',s:3},{w:'schaukel',s:2},{w:'rutsche',s:2},{w:'trampolin',s:2},{w:'kuscheltier',s:3},{w:'stofftier',s:3},{w:'kinderkleidung',s:3},{w:'kindermode',s:3},{w:'kindergarten',s:2},{w:'schulranzen',s:3},{w:'schultüte',s:3},{w:'buntstift',s:2},{w:'malkasten',s:3},{w:'knete',s:2},{w:'bastelset',s:3},{w:'paw patrol',s:3},{w:'frozen',s:2},{w:'disney',s:1},{w:'peppa pig',s:3},{w:'feuerwehrmann sam',s:3},{w:'conni',s:2},{w:'raupe nimmersatt',s:3},{w:'fisher-price',s:3},{w:'vtech',s:3},{w:'haba',s:2},{w:'sigikid',s:3},{w:'lego technic',s:4},{w:'lego city',s:4},{w:'lego friends',s:4},{w:'lego star wars',s:4},{w:'marvel',s:1},{w:'pokemon',s:2},{w:'pikachu',s:3}
  ],
  werkzeug:[
    {w:'bosch professional',s:4},{w:'makita',s:3},{w:'maßband',s:2},{w:'magnetic wristband',s:3},{w:'taschenlampe',s:2},{w:'schraube',s:2},{w:'dübel',s:2},{w:'bohrer',s:2},{w:'säge',s:2},{w:'hammer',s:2},{w:'zange',s:2},{w:'schraubendreher',s:2},{w:'kabelbinder',s:1},{w:'werkzeug',s:2},{w:'winkelschleifer',s:3},{w:'scie circulaire',s:3},
    // Erweitert
    {w:'akkuschrauber',s:3},{w:'bohrhammer',s:3},{w:'stichsäge',s:3},{w:'kreissäge',s:3},{w:'kettensäge',s:3},{w:'schleifmaschine',s:3},{w:'hobel',s:2},{w:'fräse',s:2},{w:'lötkolben',s:3},{w:'lötstation',s:3},{w:'multimeter',s:3},{w:'spannungsprüfer',s:3},{w:'wasserwaage',s:2},{w:'zollstock',s:2},{w:'schraubzwinge',s:3},{w:'werkbank',s:3},{w:'werkzeugkoffer',s:3},{w:'bit-set',s:3},{w:'steckschlüssel',s:3},{w:'ratsche',s:2},{w:'inbus',s:2},{w:'schraubenschlüssel',s:3},{w:'maulschlüssel',s:3},{w:'ringschlüssel',s:3},{w:'cutter',s:1},{w:'messer',s:1},{w:'stanley',s:2},{w:'knipex',s:3},{w:'wera',s:3},{w:'festool',s:3},{w:'dewalt',s:3},{w:'milwaukee',s:3},{w:'metabo',s:3},{w:'einhell',s:2},{w:'dremel',s:3},{w:'heißklebepistole',s:3},{w:'kleber',s:1},{w:'schmirgelpapier',s:2},{w:'schleifpapier',s:2},{w:'farbe',s:1},{w:'lack',s:1},{w:'pinsel',s:1},{w:'rolle',s:1},{w:'abdeckfolie',s:2},{w:'kreppband',s:2}
  ],
  koerperpflege:[
    {w:'shampoo',s:3},{w:'duschgel',s:3},{w:'seife',s:2},{w:'creme',s:1},{w:'deo',s:2},{w:'zahnpasta',s:3},{w:'parfüm',s:3},{w:'lotion',s:2},{w:'sonnencreme',s:3},{w:'rasierer',s:3},{w:'bartpflege',s:3},{w:'bodygroomer',s:3},{w:'barttrimmer',s:3},{w:'oneblade',s:3},{w:'philips one',s:3},{w:'purize',s:2},{w:'aktivkohle',s:2},{w:'pfefferspray',s:2},{w:'braun all-in-one',s:3},
    // Erweitert
    {w:'haargel',s:3},{w:'haarspray',s:3},{w:'haarbürste',s:2},{w:'kamm',s:1},{w:'glätteisen',s:3},{w:'lockenstab',s:3},{w:'haartrockner',s:3},{w:'fön',s:2},{w:'haarfarbe',s:3},{w:'tönung',s:2},{w:'nagellack',s:3},{w:'nagelpflege',s:3},{w:'nagelknipser',s:3},{w:'nagelfeile',s:2},{w:'make-up',s:3},{w:'foundation',s:3},{w:'concealer',s:3},{w:'mascara',s:3},{w:'lippenstift',s:3},{w:'lidschatten',s:3},{w:'rouge',s:2},{w:'puder',s:2},{w:'wimperntusche',s:3},{w:'abschminktücher',s:3},{w:'mizellenwasser',s:3},{w:'gesichtscreme',s:3},{w:'tagescreme',s:3},{w:'nachtcreme',s:3},{w:'augencreme',s:3},{w:'gesichtsmaske',s:2},{w:'peeling',s:2},{w:'serum',s:2},{w:'bodylotion',s:3},{w:'handcreme',s:3},{w:'fußcreme',s:3},{w:'deodorant',s:3},{w:'antitranspirant',s:3},{w:'rasierschaum',s:3},{w:'rasiergel',s:3},{w:'aftershave',s:3},{w:'eau de toilette',s:4},{w:'eau de parfum',s:4},{w:'duft',s:1},{w:'wattestäbchen',s:2},{w:'wattepads',s:2},{w:'taschentücher',s:2},{w:'toilettenpapier',s:2},{w:'feuchttücher',s:2},{w:'epilierer',s:3},{w:'ipl',s:2},{w:'enthaarungscreme',s:3},{w:'nivea',s:2},{w:'dove',s:2},{w:'olay',s:2},{w:'garnier',s:2},{w:'loreal',s:2},{w:"l'oreal",s:2},{w:'burt',s:1},{w:'weleda',s:2},{w:'rituals',s:2}
  ],
  sport_outdoor:[
    {w:'tauchen',s:2},{w:'steinschleuder',s:2},{w:'tonkugeln',s:2},{w:'schleuder',s:1},{w:'armbrust',s:3},{w:'fitness',s:2},{w:'yoga',s:2},{w:'camping',s:2},{w:'fahrrad',s:2},{w:'tauchschule',s:3},{w:'wandern',s:2},{w:'klettern',s:2},{w:'schwimm',s:2},{w:'tennis',s:2},{w:'tauchkompass',s:3},{w:'mares',s:2},{w:'outdoor',s:1},
    // Erweitert
    {w:'sportschuhe',s:3},{w:'trainingsanzug',s:3},{w:'sportshirt',s:3},{w:'funktionsshirt',s:3},{w:'laufhose',s:3},{w:'sporttight',s:3},{w:'sportbh',s:3},{w:'trinkgürtel',s:3},{w:'stirnlampe',s:3},{w:'hantel',s:3},{w:'kurzhantel',s:3},{w:'langhantel',s:3},{w:'kettlebell',s:3},{w:'widerstandsband',s:3},{w:'theraband',s:3},{w:'yogamatte',s:3},{w:'gymnastikmatte',s:3},{w:'springseil',s:2},{w:'boxsack',s:3},{w:'boxhandschuh',s:3},{w:'skibrille',s:3},{w:'skihandschuh',s:3},{w:'skisocken',s:3},{w:'snowboard',s:3},{w:'schlitten',s:2},{w:'fernglas',s:2},{w:'kompass',s:2},{w:'isomatte',s:3},{w:'schlafsack',s:3},{w:'zelt',s:2},{w:'campingkocher',s:3},{w:'trekking',s:3},{w:'wanderstock',s:3},{w:'camelback',s:3},{w:'trinkblase',s:3},{w:'fahrradhelm',s:3},{w:'fahrradschloss',s:3},{w:'fahrradlicht',s:3},{w:'fahrradtasche',s:3},{w:'radtrikot',s:3},{w:'badminton',s:3},{w:'volleyball',s:3},{w:'fußball',s:2},{w:'basketball',s:3},{w:'handball',s:2},{w:'tischtennis',s:3},{w:'dart',s:2},{w:'angeln',s:2},{w:'angel',s:1},{w:'kajak',s:3},{w:'paddel',s:2},{w:'sup ',s:2},{w:'surfboard',s:3},{w:'neopren',s:3},{w:'taucherbrille',s:3},{w:'schnorchel',s:3},{w:'flossen',s:2},{w:'garmin',s:2},{w:'fitbit',s:3},{w:'polar',s:1},{w:'suunto',s:3},{w:'wahoo',s:3},{w:'tacx',s:3},{w:'ergometer',s:3},{w:'laufband',s:3},{w:'crosstrainer',s:3},{w:'rudergerät',s:3},{w:'klimmzugstange',s:3},{w:'trx',s:3},{w:'resistance band',s:3},{w:'foam roller',s:3}
  ],
  lebensmittel:[
    {w:'kaffee',s:2},{w:'tee',s:1},{w:'müsli',s:2},{w:'haferflocken',s:3},{w:'nudel',s:1},{w:'reis',s:1},{w:'gewürz',s:1},{w:'schokolade',s:2},{w:'snack',s:1},{w:'riegel',s:1},{w:'nuss',s:1},{w:'wein',s:1},{w:'bier',s:1},{w:'getränk',s:1},
    // Erweitert
    {w:'espresso',s:3},{w:'kaffeebohnen',s:3},{w:'kaffeekapseln',s:3},{w:'nespresso',s:3},{w:'senseo',s:3},{w:'tassimo',s:3},{w:'dolce gusto',s:3},{w:'teebeutel',s:3},{w:'matcha',s:3},{w:'kakao',s:2},{w:'zucker',s:1},{w:'mehl',s:1},{w:'backpulver',s:2},{w:'hefe',s:1},{w:'olivenöl',s:2},{w:'öl',s:1},{w:'essig',s:1},{w:'sauce',s:1},{w:'ketchup',s:2},{w:'senf',s:1},{w:'mayonnaise',s:3},{w:'salz',s:1},{w:'pfeffer',s:1},{w:'chili',s:1},{w:'honig',s:1},{w:'marmelade',s:2},{w:'nutella',s:3},{w:'erdnussbutter',s:3},{w:'müsliriegel',s:3},{w:'proteinriegel',s:3},{w:'energy drink',s:3},{w:'iso-drink',s:3},{w:'wasser',s:1},{w:'saft',s:1},{w:'limonade',s:2},{w:'sirup',s:1},{w:'chips',s:2},{w:'popcorn',s:2},{w:'gummibärchen',s:3},{w:'haribo',s:3},{w:'bonbon',s:2},{w:'keks',s:1},{w:'cookie',s:1},{w:'cracker',s:2},{w:'trockenobst',s:3},{w:'studentenfutter',s:3},{w:'mandeln',s:2},{w:'cashew',s:3},{w:'paranuss',s:3},{w:'kokosöl',s:3},{w:'leinsamen',s:3},{w:'chiasamen',s:3},{w:'quinoa',s:3},{w:'couscous',s:3},{w:'bulgur',s:3},{w:'sojasauce',s:3},{w:'fischsauce',s:3},{w:'sriracha',s:3},{w:'tabasco',s:3},{w:'konserve',s:1},{w:'dose ',s:1},{w:'bio ',s:1},{w:'vegan',s:1}
  ],
  tickets:[
    {w:'ticket',s:2},{w:'eintracht',s:2},{w:'kino',s:2},{w:'konzert',s:3},
    // Erweitert
    {w:'eintrittskarte',s:3},{w:'veranstaltung',s:2},{w:'festival',s:2},{w:'theater',s:2},{w:'oper',s:2},{w:'musical',s:3},{w:'stadion',s:2},{w:'vip',s:1},{w:'freizeitpark',s:3},{w:'zoo ',s:2},{w:'messe',s:1},{w:'gutschein',s:1},{w:'erlebnis',s:1}
  ],
  // ─── NEUE KATEGORIEN ──────────────────────────────────────
  auto_motorrad:[
    {w:'autositz',s:2},{w:'scheibenwischer',s:3},{w:'motoröl',s:3},{w:'bremsflüssigkeit',s:3},{w:'kühlmittel',s:3},{w:'zündkerze',s:3},{w:'ölfilter',s:3},{w:'luftfilter',s:2},{w:'pollenfilter',s:3},{w:'autoladegerät',s:3},{w:'kfz',s:3},{w:'auto ',s:1},{w:'pkw',s:2},{w:'motorrad',s:3},{w:'helm ',s:2},{w:'handyhalterung auto',s:4},{w:'navigationsgerät',s:3},{w:'reifendruck',s:3},{w:'wagenheber',s:3},{w:'abschleppseil',s:3},{w:'starthilfe',s:3},{w:'autobatterie',s:3},{w:'dachbox',s:3},{w:'fahrradträger',s:3},{w:'anhängerkupplung',s:3},{w:'frostschutz',s:3},{w:'enteiser',s:3},{w:'autopflege',s:3},{w:'autoshampoo',s:3},{w:'politur',s:2},{w:'mikrofasertuch',s:2},{w:'sitzauflage',s:2},{w:'lenkrad',s:2},{w:'fußmatten auto',s:4},{w:'organizer auto',s:4},{w:'sonnenschutz auto',s:4},{w:'parkscheibe',s:3},{w:'warnweste',s:2},{w:'warndreieck',s:3},{w:'verbandskasten',s:3},{w:'schneekette',s:3},{w:'eiskratzer',s:3},{w:'sonax',s:3},{w:'meguiars',s:3},{w:'liqui moly',s:3}
  ],
  buero:[
    {w:'druckerpapier',s:3},{w:'kopierpapier',s:3},{w:'briefumschlag',s:3},{w:'ordner',s:2},{w:'hefter',s:2},{w:'locher',s:2},{w:'büroklammer',s:3},{w:'textmarker',s:3},{w:'kugelschreiber',s:3},{w:'bleistift',s:2},{w:'filzstift',s:2},{w:'edding',s:3},{w:'tintenkiller',s:3},{w:'lineal',s:2},{w:'radiergummi',s:2},{w:'anspitzer',s:2},{w:'tischkalender',s:3},{w:'schreibtisch',s:2},{w:'bürostuhl',s:3},{w:'monitor-arm',s:3},{w:'mauspad',s:3},{w:'schreibunterlage',s:3},{w:'aktenvernichter',s:3},{w:'laminiergerät',s:3},{w:'etiketten',s:2},{w:'klarsichthülle',s:3},{w:'haftnotiz',s:3},{w:'post-it',s:3},{w:'whiteboard',s:3},{w:'flipchart',s:3},{w:'präsentationsmappe',s:3},{w:'visitenkarte',s:3},{w:'stempel',s:2},{w:'stempelkissen',s:3},{w:'briefwaage',s:3},{w:'tischlampe büro',s:4},{w:'ergonomisch',s:2},{w:'fußstütze',s:3},{w:'handgelenkauflage',s:3}
  ],
  haustier:[
    {w:'napfunterlage',s:3},{w:'hundebett',s:3},{w:'katze',s:2},{w:'hund',s:1},{w:'haustier',s:3},{w:'futter',s:2},{w:'krallenschere',s:3},{w:'napf',s:2},
    // Erweitert
    {w:'hundeleine',s:3},{w:'hundehalsband',s:3},{w:'hundegeschirr',s:3},{w:'hundespielzeug',s:3},{w:'hundefutter',s:3},{w:'katzenfutter',s:3},{w:'katzenstreu',s:3},{w:'katzentoilette',s:3},{w:'katzenklappe',s:3},{w:'kratzbrett',s:3},{w:'kratzbaum',s:3},{w:'katzenspielzeug',s:3},{w:'aquarium',s:3},{w:'fischfutter',s:3},{w:'vogelkäfig',s:3},{w:'vogelfutter',s:3},{w:'hamsterkäfig',s:3},{w:'hamsterrad',s:3},{w:'nagerhaus',s:3},{w:'terrarium',s:3},{w:'leckerli',s:3},{w:'hundeknochen',s:3},{w:'kaustange',s:3},{w:'flohhalsband',s:3},{w:'zeckenschutz',s:3},{w:'wurmkur',s:3},{w:'tierarzt',s:2},{w:'transportbox',s:2},{w:'hundemantel',s:3},{w:'regenmantel hund',s:4},{w:'hundepfoten',s:3},{w:'pfotenschutz',s:3},{w:'futterautomat',s:3},{w:'trinkbrunnen',s:2}
  ],
  abo_digital:[
    // Amazon-eigene Dienste (exakte Muster, hohe Gewichtung)
    {w:'amazon prime',s:4},{w:'prime video',s:4},{w:'prime membership',s:4},{w:'amazon photos',s:5},{w:'amazon kids',s:5},{w:'amazon kids+',s:6},{w:'amazon music',s:4},{w:'amazon fresh',s:3},{w:'amazon luna',s:5},{w:'luna premium',s:5},{w:'luna+',s:5},{w:'amazon drive',s:5},{w:'amazon family',s:5},{w:'amazon baby',s:4},{w:'amazon household',s:5},{w:'amazon freetime',s:5},{w:'kindle unlimited',s:4},{w:'audible',s:3},{w:'audible abo',s:5},{w:'audible hörbuch',s:5},
    // Abo-Indikatoren
    {w:'subscribe & save',s:4},{w:'spar-abo',s:4},{w:'abo',s:2},{w:'mitgliedschaft',s:2},{w:'membership',s:2},{w:'subscription',s:3},{w:'monatlich',s:1},{w:'jährlich',s:1},{w:'monthly',s:1},{w:'yearly',s:1},{w:'annual',s:1},{w:'renewal',s:3},{w:'verlängerung',s:3},{w:'plan',s:1},{w:'tarif',s:2},{w:'premium plan',s:4},{w:'basic plan',s:4},{w:'family plan',s:4},{w:'einzel-abo',s:5},{w:'einzelabo',s:5},{w:'familienabo',s:5},
    // Digital allgemein
    {w:'digital',s:1},{w:'download',s:1},{w:'streaming',s:2},{w:'cloud',s:1},{w:'aws',s:2},{w:'software',s:2},{w:'lizenz',s:2},{w:'app ',s:1},{w:'in-app',s:2},{w:'e-book',s:2},{w:'ebook',s:2}
  ],
  kueche:[
    {w:'topf',s:2},{w:'pfanne',s:2},{w:'bratpfanne',s:3},{w:'kochtopf',s:3},{w:'schneidebrett',s:3},{w:'messerblock',s:3},{w:'küchenmesser',s:3},{w:'kochmesser',s:3},{w:'schälmesser',s:3},{w:'brotmesser',s:3},{w:'mixer',s:2},{w:'standmixer',s:3},{w:'stabmixer',s:3},{w:'küchenmaschine',s:3},{w:'thermomix',s:3},{w:'kaffeemaschine',s:3},{w:'espressomaschine',s:3},{w:'wasserkocher',s:3},{w:'toaster',s:3},{w:'mikrowelle',s:3},{w:'backofen',s:2},{w:'backform',s:3},{w:'springform',s:3},{w:'auflaufform',s:3},{w:'backblech',s:3},{w:'teigschaber',s:3},{w:'schneebesen',s:3},{w:'kochlöffel',s:3},{w:'pfannenwender',s:3},{w:'sieb',s:1},{w:'nudelsieb',s:3},{w:'reibe',s:1},{w:'schäler',s:2},{w:'dosenöffner',s:3},{w:'korkenzieher',s:3},{w:'flaschenöffner',s:3},{w:'brotkasten',s:3},{w:'vorratsdose',s:3},{w:'frischhaltebox',s:3},{w:'tupperware',s:3},{w:'eiswürfelform',s:3},{w:'backpapier',s:3},{w:'frischhaltefolie',s:3},{w:'alufolie',s:2},{w:'geschirrtuch',s:3},{w:'spüllappen',s:3},{w:'schwammtuch',s:3},{w:'geschirrspüler',s:2},{w:'spülmaschine',s:2},{w:'geschirr',s:1},{w:'teller',s:1},{w:'tasse',s:1},{w:'becher',s:1},{w:'glas ',s:1},{w:'gläser',s:2},{w:'besteck',s:2},{w:'löffel',s:1},{w:'gabel',s:1},{w:'serviette',s:1},{w:'tischdecke',s:2},{w:'platzset',s:3},{w:'wmf',s:2},{w:'zwilling',s:2},{w:'tefal',s:3},{w:'le creuset',s:3},{w:'silit',s:3},{w:'fissler',s:3},{w:'emsa',s:2},{w:'gemüseschneider',s:3},{w:'spiralschneider',s:3},{w:'entsafter',s:3},{w:'brotbackautomat',s:3},{w:'sous vide',s:3},{w:'heißluftfritteuse',s:3},{w:'airfryer',s:3},{w:'slow cooker',s:3},{w:'multikocher',s:3},{w:'instant pot',s:3},{w:'meal prep',s:3},{w:'bento box',s:3},{w:'thermobecher',s:3},{w:'isolierbecher',s:3},{w:'thermoskanne',s:3}
  ],
  geschenke:[
    {w:'gutschein',s:2},{w:'geschenkgutschein',s:4},{w:'geschenkkarte',s:4},{w:'gift card',s:4},{w:'geschenkbox',s:3},{w:'geschenkset',s:3},{w:'geschenkpapier',s:3},{w:'geschenkband',s:3},{w:'schleife',s:1},{w:'grußkarte',s:3},{w:'glückwunschkarte',s:3},{w:'weihnachtskarte',s:3},{w:'geburtstagskarte',s:3},{w:'adventskalender',s:3},{w:'nikolaus',s:2},{w:'weihnachts',s:1},{w:'oster',s:1},{w:'valentinstag',s:3},{w:'muttertag',s:3},{w:'vatertag',s:3}
  ]
};

// Convert simple-string keywords to object format for backward compatibility
// and build optimized lookup
(function(){
  for(var c in KW){
    var arr=KW[c];
    for(var i=0;i<arr.length;i++){
      if(typeof arr[i]==='string') arr[i]={w:arr[i],s:1};
    }
  }
})();

// ─── PATTERN-BASED PRE-RULES ────────────────────────────
// High-confidence patterns that should bypass keyword scoring.
// Tested BEFORE the scoring loop. Each rule: regex → category.
var CAT_PATTERNS=[
  // Amazon subscription services (the main pain point)
  {r:/amazon\s+(photos|kids|music|prime|luna|drive|family|baby|household|freetime)/i, c:'abo_digital'},
  {r:/kindle\s+unlimited/i, c:'abo_digital'},
  {r:/audible/i, c:'abo_digital'},
  {r:/\b(abo|subscription|mitgliedschaft|membership|spar-abo)\b/i, c:'abo_digital'},
  {r:/\b(monthly|yearly|annual|monatl|jährl)\b.*\b(plan|tarif|abo)\b/i, c:'abo_digital'},
  {r:/\bplan\b.*\b(tb|gb)\b/i, c:'abo_digital'},
  {r:/\b\d+\s*tb\s*(plan|tarif|storage|speicher)\b/i, c:'abo_digital'},
  // Gift cards / Gutscheine
  {r:/geschenk(gutschein|karte)|gift\s*card/i, c:'geschenke'},
  // Tickets with clear event context
  {r:/\b(eintrittskarte|konzertkarte|festivalkarte)\b/i, c:'tickets'},
];

// ─── USER KEYWORDS (editable layer over built-in keywords) ─
// Stored in localStorage as array of {w, s, c} where c = category key
var USER_KW_STORAGE_KEY='amz-user-keywords';
var userKeywords=[];

function loadUserKeywords(){
  try{var d=localStorage.getItem(USER_KW_STORAGE_KEY);if(d)userKeywords=JSON.parse(d);}catch(e){userKeywords=[];}
}
function saveUserKeywords(){
  try{localStorage.setItem(USER_KW_STORAGE_KEY,JSON.stringify(userKeywords));}catch(e){}
}

// Build a merged keyword map: base + user overrides
// User keywords override base keywords with same word in same category,
// and can also add entirely new keyword→category mappings.
function getMergedKW(){
  // Deep-clone base KW
  var merged={};
  for(var c in KW){
    merged[c]=[];
    for(var i=0;i<KW[c].length;i++){
      merged[c].push({w:KW[c][i].w, s:KW[c][i].s});
    }
  }
  // Apply user keywords: each has {w, s, c}
  userKeywords.forEach(function(uk){
    var cat=uk.c;
    if(!CATS[cat] || cat==='sonstiges') return;
    if(!merged[cat]) merged[cat]=[];
    // Check if keyword already exists in this category → override weight
    var found=false;
    for(var i=0;i<merged[cat].length;i++){
      if(merged[cat][i].w===uk.w){merged[cat][i].s=uk.s;found=true;break;}
    }
    // Also remove from other categories (user is reassigning)
    for(var oc in merged){
      if(oc===cat) continue;
      merged[oc]=merged[oc].filter(function(k){return k.w!==uk.w;});
    }
    if(!found) merged[cat].push({w:uk.w, s:uk.s});
  });
  return merged;
}

// Export full keyword list (base + user merged) as CSV string
function exportKeywordsCSV(){
  var merged=getMergedKW();
  // Track which keywords are user-modified
  var userMap={};
  userKeywords.forEach(function(uk){userMap[uk.w+'|'+uk.c]=true;});
  var lines=['Keyword;'+t('category')+';'+t('kwWeight')+';'+t('kwSource')];
  var catKeys=CK.filter(function(k){return k!=='sonstiges';});
  catKeys.forEach(function(cat){
    var kws=merged[cat]||[];
    kws.forEach(function(kw){
      var src=userMap[kw.w+'|'+cat]?t('kwUser'):t('kwBuiltin');
      lines.push('"'+kw.w.replace(/"/g,'""')+'";'+catLabel(cat)+';'+kw.s+';'+src);
    });
  });
  return '\uFEFF'+lines.join('\n');
}

// Parse uploaded keyword CSV and extract user modifications
function parseKeywordsCSV(text){
  var lines=text.trim().split('\n');
  if(lines.length<2) return null;
  var sep=lines[0].indexOf(';')>=0?';':',';
  // Build reverse label→key map
  var labelToKey={};
  CK.forEach(function(k){
    labelToKey[catLabel(k).toLowerCase()]=k;
    labelToKey[CATS[k].label.toLowerCase()]=k;
  });
  // Also support EN labels if in DE mode and vice versa
  for(var lang in I18N){
    if(I18N[lang].catLabels){
      for(var k in I18N[lang].catLabels){
        labelToKey[I18N[lang].catLabels[k].toLowerCase()]=k;
      }
    }
  }
  // Build base keyword lookup: word → array of {cat, score}
  // Keywords can exist in multiple base categories
  var baseMap={};
  for(var c in KW){
    KW[c].forEach(function(kw){
      if(!baseMap[kw.w]) baseMap[kw.w]=[];
      baseMap[kw.w].push({c:c,s:kw.s});
    });
  }
  var newUserKW=[];
  for(var i=1;i<lines.length;i++){
    var cols=[],cur='',inQ=false;
    for(var j=0;j<lines[i].length;j++){
      var ch=lines[i][j];
      if(ch==='"'){inQ=!inQ;continue;}
      if(ch===sep&&!inQ){cols.push(cur);cur='';continue;}
      cur+=ch;
    }
    cols.push(cur);
    if(cols.length<3) continue;
    // Keyword: preserve trailing spaces (intentional for word-boundary matching)
    var word=cols[0].toLowerCase().replace(/^["'\s]+/,'').replace(/["']+$/,'');
    if(word.replace(/\s/g,'').length===0) continue;
    var catStr=cols[1].trim().toLowerCase();
    var score=parseInt(cols[2])||2;
    var catKey=labelToKey[catStr];
    if(!catKey || catKey==='sonstiges') continue;
    // Check if this matches ANY base entry for this word
    var bases=baseMap[word];
    var matchesBase=false;
    if(bases){
      for(var bi=0;bi<bases.length;bi++){
        if(bases[bi].c===catKey && bases[bi].s===score){matchesBase=true;break;}
      }
    }
    if(!matchesBase){
      newUserKW.push({w:word, s:score, c:catKey});
    }
  }
  return newUserKW;
}

// Recategorize all items (respecting _userCat flags)
function recategorizeAll(){
  var changed=false;
  orders.forEach(function(o){
    o.items.forEach(function(it){
      if(!it._userCat){
        var newCat=categorize(it.name);
        if(newCat!==it.category){it.category=newCat;changed=true;}
      }
    });
  });
  if(changed) saveOrders();
  return changed;
}

function categorize(name){
  var l=name.toLowerCase();

  // Phase 1: Pattern rules (high-confidence, bypass scoring)
  for(var p=0;p<CAT_PATTERNS.length;p++){
    if(CAT_PATTERNS[p].r.test(l)) return CAT_PATTERNS[p].c;
  }

  // Phase 2: Scoring-based keyword matching (merged base + user)
  var merged=getMergedKW();
  var bestCat='sonstiges', bestScore=0;

  for(var c in merged){
    if(c==='sonstiges') continue;
    var kws=merged[c];
    var catScore=0;
    for(var i=0;i<kws.length;i++){
      var kw=kws[i];
      if(l.indexOf(kw.w)>=0){
        // Score = base weight + length bonus for specificity
        var lengthBonus=kw.w.length>10?2:kw.w.length>6?1:0;
        catScore+=kw.s+lengthBonus;
      }
    }
    if(catScore>bestScore){
      bestScore=catScore;
      bestCat=c;
    }
  }
  return bestCat;
}
// fmtE, fmtD, fmtM provided by i18n.js
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ─── STATE ───────────────────────────────────────────────
var orders=[];
var view='dashboard', subView='overview', yearFilter='all', filterCat=null, filterMonth=null, search='', selectedOrderId=null, editingItem=null;
var multiSelect=false, selectedOrderIds={};

// ─── STORAGE ─────────────────────────────────────────────
function loadOrders(cb){
  try{var d=localStorage.getItem('amz-orders-v2');if(d)orders=JSON.parse(d);}catch(e){}
  loadUserKeywords();
  // Auto-recategorize with latest keywords (base + user)
  recategorizeAll();
  cb();
}
function saveOrders(){
  try{localStorage.setItem('amz-orders-v2',JSON.stringify(orders));}catch(e){}
}

// ─── CSV PARSER ──────────────────────────────────────────
function parseCSV(text){
  var lines=text.trim().split('\n');if(lines.length<2)return[];
  var sep=lines[0].indexOf(';')>=0?';':lines[0].indexOf('\t')>=0?'\t':',';
  var hdr=lines[0].split(sep).map(function(h){return h.trim().toLowerCase().replace(/["\uFEFF]/g,'');});
  var dI=-1,oI=-1,nI=-1,pI=-1,qI=-1;
  for(var i=0;i<hdr.length;i++){
    if(/datum|date/.test(hdr[i]))dI=i;
    if(/bestell|order/.test(hdr[i]))oI=i;
    if(/artikel|produkt|name|item/.test(hdr[i]))nI=i;
    if(/preis|price/.test(hdr[i]))pI=i;
    if(/menge|qty/.test(hdr[i]))qI=i;
  }
  if(nI===-1||pI===-1)return[];
  var om={};
  for(var i=1;i<lines.length;i++){
    var cols=[],cur='',inQ=false;
    for(var j=0;j<lines[i].length;j++){
      var ch=lines[i][j];
      if(ch==='"'){inQ=!inQ;continue;}
      if(ch===sep[0]&&!inQ){cols.push(cur.trim());cur='';continue;}
      cur+=ch;
    }
    cols.push(cur.trim());
    if(cols.length<=Math.max(nI,pI))continue;
    var oid=oI>=0?cols[oI]:'imp-'+i;
    var date=dI>=0?cols[dI]:new Date().toISOString().slice(0,10);
    var name=cols[nI];
    var price=parseFloat(cols[pI].replace(',','.'))||0;
    var qty=qI>=0?parseInt(cols[qI])||1:1;
    if(!name||price<0)continue;
    if(!om[oid])om[oid]={id:oid,date:date,total:0,items:[]};
    om[oid].items.push({name:name,price:price,qty:qty,category:categorize(name)});
    om[oid].total+=price*qty;
  }
  var result=[];for(var k in om)result.push(om[k]);
  result.sort(function(a,b){return b.date.localeCompare(a.date);});
  return result;
}

// ─── ANALYTICS ───────────────────────────────────────────
function analyze(){
  var f=orders;
  if(yearFilter!=='all')f=orders.filter(function(o){return o.date.indexOf(yearFilter)===0;});
  var catT={};CK.forEach(function(k){catT[k]=0;});
  var total=0,items=0,monthly={};
  f.forEach(function(o){
    var m=o.date.slice(0,7);if(!monthly[m])monthly[m]=0;
    o.items.forEach(function(it){var a=it.price*it.qty;catT[it.category]=(catT[it.category]||0)+a;total+=a;items+=it.qty;monthly[m]+=a;});
  });
  var catData=CK.filter(function(k){return catT[k]>0;}).sort(function(a,b){return catT[b]-catT[a];}).map(function(k){return{key:k,label:catLabel(k),icon:CATS[k].icon,color:CATS[k].color,value:catT[k]};});
  var months=Object.keys(monthly).sort();
  var monthlyData=months.map(function(m){return{month:m,total:monthly[m]};});
  var sonstigesCount=f.reduce(function(s,o){return s+o.items.filter(function(it){return it.category==='sonstiges';}).length;},0);
  var topAll=[];f.forEach(function(o){o.items.forEach(function(it){topAll.push({name:it.name,price:it.price,qty:it.qty,category:it.category,date:o.date,orderId:o.id,total:it.price*it.qty});});});
  topAll.sort(function(a,b){return b.total-a.total;});
  return{catT:catT,catData:catData,total:total,items:items,monthlyData:monthlyData,count:f.length,filtered:f,sonstigesCount:sonstigesCount,topAll:topAll};
}

// ─── IMPORT ──────────────────────────────────────────────
function doImport(text){
  var parsed=parseCSV(text);
  if(!parsed.length){alert(t('csvError'));return;}
  var ids={};orders.forEach(function(o){ids[o.id]=true;});
  var added=0;
  parsed.forEach(function(o){if(!ids[o.id]){orders.push(o);ids[o.id]=true;added++;}});
  orders.sort(function(a,b){return b.date.localeCompare(a.date);});
  saveOrders();view='dashboard';render();
  alert(tReplace('importSuccess',{count:added,total:orders.length}));
}

function doRestoreBackup(text){
  try {
    var data=JSON.parse(text);
    // New format: {orders: [...], userKeywords: [...]}
    if(data && !Array.isArray(data) && data.orders){
      if(!Array.isArray(data.orders)||data.orders.length===0){alert(t('backupInvalid'));return;}
      orders=data.orders;
      if(Array.isArray(data.userKeywords)){
        userKeywords=data.userKeywords;
        saveUserKeywords();
      }
    }
    // Legacy format: plain array of orders
    else if(Array.isArray(data)&&data.length>0){
      if(!data[0].id||!data[0].date||!data[0].items){alert(t('backupFormatError'));return;}
      orders=data;
    } else {
      alert(t('backupInvalid'));return;
    }
    orders.sort(function(a,b){return b.date.localeCompare(a.date);});
    saveOrders();recategorizeAll();saveOrders();
    view='dashboard';render();
    var kwInfo=userKeywords.length>0?' + '+userKeywords.length+' '+t('kwUserRules'):'';
    alert(tReplace('backupRestored',{count:orders.length})+kwInfo);
  } catch(e) {
    alert(t('backupReadError')+e.message);
  }
}

function bindRestoreBtn(fileId,btnId){
  document.getElementById(btnId).addEventListener('click',function(){document.getElementById(fileId).click();});
  document.getElementById(fileId).addEventListener('change',function(e){
    var f=e.target.files[0];if(!f)return;
    var r=new FileReader();r.onload=function(ev){doRestoreBackup(ev.target.result);};r.readAsText(f);
  });
}

// ─── RENDER ──────────────────────────────────────────────
function render(){
  // Empty state
  if(orders.length===0){
    document.getElementById('nav').innerHTML='';
    document.getElementById('years').innerHTML='';
    // Lang switch even on empty state
    document.querySelectorAll('.lang-btn').forEach(function(b){
      b.classList.toggle('active',b.getAttribute('data-lang')===LANG);
      b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'));render();});
    });
    document.getElementById('app').innerHTML=
      '<div style="text-align:center;padding:60px 24px;max-width:480px;margin:0 auto">'+
      '<div style="font-size:64px;margin-bottom:16px">\uD83D\uDCCA</div>'+
      '<h1 style="font-size:24px;font-weight:800;margin-bottom:8px;font-family:var(--mono)">'+t('emptyTitle')+' 5.5</h1>'+
      '<p style="color:var(--t2);line-height:1.7;margin-bottom:24px">'+t('emptyDesc')+'</p>'+
      '<div class="card" style="text-align:left">'+
      '<div class="label">'+t('csvImport')+'</div>'+
      '<input type="file" accept=".csv,.tsv,.txt" class="file-input" id="csv-file-empty">'+
      '<textarea class="textarea" id="csv-text-empty" placeholder="'+t('csvPaste')+'" style="margin-top:8px"></textarea>'+
      '<button class="btn btn-primary" id="import-btn-empty" style="margin-top:10px;width:100%">'+t('importBtn')+'</button>'+
      '</div>'+
      '<div class="card" style="text-align:left;margin-top:12px">'+
      '<div class="label">'+t('restoreBackup')+'</div>'+
      '<p style="font-size:12px;color:var(--t2);margin-bottom:8px">'+t('restoreDesc')+'</p>'+
      '<input type="file" accept=".json" id="restore-file-empty" style="display:none">'+
      '<button class="btn btn-ghost" id="restore-btn-empty" style="width:100%">'+t('loadBackupFile')+'</button>'+
      '</div></div>';
    document.getElementById('csv-file-empty').addEventListener('change',function(e){
      var f=e.target.files[0];if(!f)return;
      var r=new FileReader();r.onload=function(ev){document.getElementById('csv-text-empty').value=ev.target.result;doImport(ev.target.result);};r.readAsText(f);
    });
    document.getElementById('import-btn-empty').addEventListener('click',function(){doImport(document.getElementById('csv-text-empty').value);});
    bindRestoreBtn('restore-file-empty','restore-btn-empty');
    return;
  }

  var a=analyze();
  var yearsSet={};orders.forEach(function(o){yearsSet[o.date.slice(0,4)]=true;});
  var yearList=['all'].concat(Object.keys(yearsSet).sort().reverse());

  // Nav
  var navHtml='';
  [['dashboard',t('dashboard')],['orders',t('orders')],['import',t('import')]].forEach(function(p){
    navHtml+='<button class="nav-btn '+(view===p[0]?'active':'')+'" data-view="'+p[0]+'">'+p[1]+'</button>';
  });
  document.getElementById('nav').innerHTML=navHtml;
  document.querySelectorAll('[data-view]').forEach(function(b){b.addEventListener('click',function(){view=b.getAttribute('data-view');filterCat=null;filterMonth=null;search='';subView='overview';selectedOrderId=null;render();});});

  // Years
  var yrHtml='';
  yearList.forEach(function(y){yrHtml+='<button class="yr-btn '+(yearFilter===y?'active':'')+'" data-yr="'+y+'">'+(y==='all'?t('all'):y)+'</button>';});
  document.getElementById('years').innerHTML=yrHtml;
  document.querySelectorAll('[data-yr]').forEach(function(b){b.addEventListener('click',function(){yearFilter=b.getAttribute('data-yr');render();});});

  // Lang switch
  document.querySelectorAll('.lang-btn').forEach(function(b){
    b.classList.toggle('active',b.getAttribute('data-lang')===LANG);
    b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'));render();});
  });
  // Update logo and title
  var logoEl=document.getElementById('logo-text');
  if(logoEl) logoEl.innerHTML=t('appTitle')+' <span style="font-size:10px;color:var(--t3);font-weight:400">5.5</span>';
  document.title=t('analysis')+' 5.5';

  var app=document.getElementById('app');

  // ─── DASHBOARD ─────────────────────────────────────────
  if(view==='dashboard'){
    var html=donateBannerHTML();
    html+='<div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;align-items:center">';
    [['overview',t('overview')],['top',t('topSpending')]].forEach(function(p){
      html+='<button class="pill '+(subView===p[0]?'active':'')+'" data-sub="'+p[0]+'">'+p[1]+'</button>';
    });
    html+=exportButtonsHTML('dash');
    html+='</div>';

    if(subView==='overview'){
      var avg=a.monthlyData.length>0?fmtE(a.total/a.monthlyData.length):'\u2013';
      html+='<div class="kpi-grid">';
      [{v:fmtE(a.total),l:t('spending'),c:'var(--accent)'},{v:a.count,l:t('orderCount'),c:'var(--accent2)'},{v:a.items,l:t('articles'),c:'#E8723A'},{v:avg,l:t('avgPerMonth'),c:'#9B6CD1'}].forEach(function(k){
        html+='<div class="card"><div class="kpi-val" style="color:'+k.c+'">'+k.v+'</div><div class="kpi-label">'+k.l+'</div></div>';
      });
      html+='</div>';

      var useLineChart = a.monthlyData.length > 14;

      // Yearly data
      var yearlyMap = {};
      a.filtered.forEach(function(o) {
        var yr = o.date.slice(0,4);
        if(!yearlyMap[yr]) yearlyMap[yr] = 0;
        o.items.forEach(function(it) { yearlyMap[yr] += it.price * it.qty; });
      });
      var yearlyKeys = Object.keys(yearlyMap).sort();
      var hasYearly = yearlyKeys.length > 1;
      var hasMonthly = a.monthlyData.length > 1;

      if(hasYearly){
        // "Alle" view: Kategorien + Jährliche side by side
        html+='<div class="chart-grid" style="grid-template-columns:1fr 1fr">';
        // Donut
        html+='<div class="card"><div class="label">'+t('categories')+'</div><div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap"><canvas id="donut" width="200" height="200" style="flex-shrink:0"></canvas><div style="display:grid;gap:3px;flex:1;min-width:140px">';
        a.catData.forEach(function(c){html+='<div class="cat-row" data-cat="'+c.key+'"><span class="cat-dot" style="background:'+c.color+'"></span><span class="cat-name">'+c.icon+' '+catLabel(c.key)+'</span><span class="cat-val">'+fmtE(c.value)+'</span></div>';});
        html+='</div></div></div>';
        // Yearly bars
        html+='<div class="card"><div class="label">'+t('yearlySpending')+'</div><canvas id="yearly-bars" width="500" height="200" style="width:100%;height:200px"></canvas></div>';
        html+='</div>';
        // Monthly line below (full width)
        if(hasMonthly){
          html+='<div class="card"><div class="label">'+t('monthlySpending')+'</div><canvas id="monthly-line" width="700" height="200" style="width:100%;height:200px;cursor:pointer"></canvas></div>';
        }
      } else {
        // Year page: Kategorien + Monthly side by side
        html+='<div class="chart-grid" style="grid-template-columns:'+(hasMonthly?'1fr 1.2fr':'1fr')+'">';
        // Donut
        html+='<div class="card"><div class="label">'+t('categories')+'</div><div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap"><canvas id="donut" width="200" height="200" style="flex-shrink:0"></canvas><div style="display:grid;gap:3px;flex:1;min-width:140px">';
        a.catData.forEach(function(c){html+='<div class="cat-row" data-cat="'+c.key+'"><span class="cat-dot" style="background:'+c.color+'"></span><span class="cat-name">'+c.icon+' '+catLabel(c.key)+'</span><span class="cat-val">'+fmtE(c.value)+'</span></div>';});
        html+='</div></div></div>';
        // Monthly bars (right of Kategorien)
        if(hasMonthly){
          html+='<div class="card"><div class="label">'+t('monthlySpending')+'</div><canvas id="monthly-bars" width="700" height="200" style="width:100%;height:200px;cursor:pointer"></canvas></div>';
        }
        html+='</div>';
      }

      // Recent
      html+='<div class="card"><div class="label" style="display:flex;justify-content:space-between"><span>'+t('recentOrders')+'</span><span class="nav-btn" data-view="orders" style="font-size:10px;cursor:pointer">'+t('allArrow')+'</span></div>';
      a.filtered.slice(0,6).forEach(function(o){
        var tot=o.items.reduce(function(s,it){return s+it.price*it.qty;},0);
        html+='<div class="order-row" data-oid="'+esc(o.id)+'"><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600">'+fmtD(o.date)+'</div><div style="font-size:11px;color:var(--t3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+o.items.map(function(it){return esc(it.name.slice(0,30));}).join(' \u00B7 ')+'</div></div><div style="font-family:var(--mono);font-weight:700;font-size:13px;color:var(--accent);flex-shrink:0;margin-left:12px">'+fmtE(tot)+'</div></div>';
      });
      html+='</div>';

      // Delete year button (only on year pages, not "Alle")
      if(yearFilter!=='all'){
        html+='<div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.05)"><button class="btn btn-ghost" id="delete-year-btn" style="color:#E85D75;border-color:rgba(232,93,117,0.3);font-size:12px">'+tReplace('deleteYearBtn',{year:yearFilter})+'</button></div>';
      }
    }

    if(subView==='top'){
      html+='<div class="card"><div class="label">'+t('topSpendingItems')+'</div><div style="display:grid;gap:4px">';
      a.topAll.slice(0,30).forEach(function(it,i){
        var medal=i<3?['\uD83E\uDD47','\uD83E\uDD48','\uD83E\uDD49'][i]:(i+1);
        var mc=i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'var(--t3)';
        var cat=CATS[it.category]||CATS.sonstiges;
        html+='<div class="top-row" style="background:'+(i<3?'var(--bg4)':'var(--bg3)')+'"><div style="width:24px;text-align:center;font-size:'+(i<3?16:12)+'px;font-weight:800;font-family:var(--mono);color:'+mc+'">'+medal+'</div><span style="font-size:14px">'+cat.icon+'</span><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(it.name.slice(0,65))+'</div><div style="font-size:10px;color:var(--t3)">'+fmtD(it.date)+' \u00B7 '+catLabel(it.category)+'</div></div><div style="font-family:var(--mono);font-weight:800;font-size:14px;color:var(--accent);flex-shrink:0">'+fmtE(it.total)+'</div></div>';
      });
      html+='</div></div>';
    }

    app.innerHTML=html;
    document.querySelectorAll('[data-sub]').forEach(function(b){b.addEventListener('click',function(){subView=b.getAttribute('data-sub');render();});});
    document.querySelectorAll('[data-cat]').forEach(function(b){b.addEventListener('click',function(){filterCat=b.getAttribute('data-cat');view='orders';render();});});
    document.querySelectorAll('[data-view]').forEach(function(b){b.addEventListener('click',function(){view=b.getAttribute('data-view');filterCat=null;filterMonth=null;search='';render();});});
    document.querySelectorAll('[data-oid]').forEach(function(b){b.addEventListener('click',function(){selectedOrderId=b.getAttribute('data-oid');renderModal();});});
    var delYrBtn=document.getElementById('delete-year-btn');
    if(delYrBtn) delYrBtn.addEventListener('click',function(){
      if(!confirm(tReplace('deleteYearConfirm',{year:yearFilter}))) return;
      orders=orders.filter(function(o){return o.date.indexOf(yearFilter)!==0;});
      saveOrders();yearFilter='all';render();
    });
    document.getElementById('dash-excel').addEventListener('click',exportDashboardExcel);
    document.getElementById('dash-pdf').addEventListener('click',exportDashboardPDF);
    if(subView==='overview'){
      drawDonut(a.catData);
      if(document.getElementById('monthly-line')){
        drawMonthlyLine(a.monthlyData);
      }
      if(document.getElementById('monthly-bars')){
        drawMonthlyBars(a.monthlyData);
      }
      if(document.getElementById('yearly-bars')){
        var ym={};
        a.filtered.forEach(function(o){
          var yr=o.date.slice(0,4);if(!ym[yr])ym[yr]=0;
          o.items.forEach(function(it){ym[yr]+=it.price*it.qty;});
        });
        drawYearlyBars(ym);
      }
    }
  }

  // ─── ORDERS ────────────────────────────────────────────
  if(view==='orders'){
    var fl=a.filtered;
    if(filterCat)fl=fl.map(function(o){return{id:o.id,date:o.date,total:o.total,items:o.items.filter(function(it){return it.category===filterCat;})};}).filter(function(o){return o.items.length>0;});
    if(filterMonth){
      var mo=String(filterMonth).padStart(2,'0');
      fl=fl.filter(function(o){return o.date.slice(5,7)===mo;});
    }
    if(search){var s=search.toLowerCase();fl=fl.filter(function(o){return o.date.indexOf(s)>=0||o.items.some(function(it){return it.name.toLowerCase().indexOf(s)>=0;})||o.id.indexOf(s)>=0;});}

    var MNAMES=t('months');
    // Count how many selected
    var selCount=0; for(var sk in selectedOrderIds){if(selectedOrderIds[sk])selCount++;}

    var html='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;align-items:center"><input class="search-input" id="search-box" placeholder="'+t('search')+'" value="'+esc(search)+'">';
    CK.forEach(function(k){if(!a.catT[k])return;
      html+='<button class="filter-btn" data-fcat="'+k+'" style="background:'+(filterCat===k?CATS[k].color+'25':'var(--bg3)')+';color:'+(filterCat===k?CATS[k].color:'var(--t3)')+'">'+CATS[k].icon+' '+catLabel(k)+'</button>';
    });
    html+='</div>';
    // Month filter row
    html+='<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">';
    for(var mi=1;mi<=12;mi++){
      html+='<button class="filter-btn" data-fmonth="'+mi+'" style="padding:3px 8px;font-size:10px;background:'+(filterMonth===mi?'rgba(76,158,235,0.2)':'var(--bg3)')+';color:'+(filterMonth===mi?'#4C9EEB':'var(--t3)')+'">'+MNAMES[mi-1]+'</button>';
    }
    html+='</div>';
    // Filters active
    var hasFilters = filterCat || filterMonth || search;
    if(hasFilters){
      html+='<div style="margin-bottom:8px"><button class="filter-btn" id="clear-filters" style="background:rgba(232,93,117,0.15);color:#E85D75;border-color:rgba(232,93,117,0.3)">'+t('clearFilters')+'</button></div>';
    }
    var flTotal=fl.reduce(function(s,o){return s+o.items.reduce(function(ss,it){return ss+it.price*it.qty;},0);},0);
    // Info row: multiselect left, count center, export buttons right
    html+='<div style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--t3);margin-bottom:12px;flex-wrap:wrap">';
    html+='<button class="filter-btn" id="toggle-multiselect" style="background:'+(multiSelect?'rgba(76,158,235,0.2)':'var(--bg3)')+';color:'+(multiSelect?'#4C9EEB':'var(--t3)')+';font-size:10px;padding:3px 10px">\u2611 '+t('multiSelect')+'</button>';
    html+='<span>'+fl.length+' '+t('orderCount')+' \u00B7 '+fmtE(flTotal)+(hasFilters?' ('+t('filtered')+')':'')+'</span>';
    html+=exportButtonsHTML('orders');
    html+='</div>';

    // ── Bulk action bar (when multiselect active and items selected) ──
    if(multiSelect && selCount>0){
      html+='<div id="bulk-bar" style="position:sticky;top:0;z-index:50;background:var(--bg2);border:1px solid var(--accent);border-radius:10px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">';
      html+='<span style="font-size:12px;font-weight:700;color:var(--accent)">'+selCount+' '+t('selected')+'</span>';
      html+='<span style="font-size:11px;color:var(--t3)">\u2192 '+t('assignTo')+':</span>';
      CK.forEach(function(k){
        if(k==='sonstiges') return;
        var c=CATS[k];
        html+='<button class="filter-btn bulk-cat-btn" data-bulkcat="'+k+'" style="padding:2px 8px;font-size:10px;background:'+c.color+'15;color:'+c.color+';border-color:'+c.color+'30">'+c.icon+' '+catLabel(k)+'</button>';
      });
      html+='<button class="filter-btn" id="bulk-deselect" style="margin-left:auto;padding:2px 8px;font-size:10px;background:rgba(232,93,117,0.15);color:#E85D75">\u2715 '+t('deselectAll')+'</button>';
      html+='</div>';
    }

    // ── Select all visible single-item orders ──
    if(multiSelect){
      var singleItemIds=[];
      fl.forEach(function(o){if(o.items.length===1) singleItemIds.push(o.id);});
      if(singleItemIds.length>0){
        var allChecked=singleItemIds.every(function(id){return selectedOrderIds[id];});
        html+='<div style="margin-bottom:8px;display:flex;gap:8px;align-items:center">';
        html+='<label style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t3);cursor:pointer"><input type="checkbox" id="select-all-single" '+(allChecked?'checked':'')+' style="cursor:pointer"> '+t('selectAllSingle')+' ('+singleItemIds.length+')</label>';
        html+='</div>';
      }
    }

    fl.forEach(function(o){
      var tot=o.items.reduce(function(s,it){return s+it.price*it.qty;},0);
      var isSingle=o.items.length===1;
      var isChecked=!!selectedOrderIds[o.id];
      html+='<div class="card" style="cursor:pointer;padding:14px;'+(isChecked?'outline:2px solid var(--accent);outline-offset:-2px;':'')+(multiSelect&&!isSingle?'opacity:0.5;':'')+'" '+(multiSelect&&isSingle?'data-msoid="'+esc(o.id)+'"':'')+' data-oid="'+esc(o.id)+'">';
      html+='<div style="display:flex;justify-content:space-between;margin-bottom:6px;align-items:center"><div style="display:flex;align-items:center;gap:8px">';
      if(multiSelect && isSingle){
        html+='<input type="checkbox" class="ms-check" data-msid="'+esc(o.id)+'" '+(isChecked?'checked':'')+' style="cursor:pointer;width:16px;height:16px;flex-shrink:0" onclick="event.stopPropagation()">';
      }
      html+='<span style="font-weight:700">'+fmtD(o.date)+'</span><span style="font-size:10px;color:var(--t3);font-family:var(--mono)">'+(o.id.length>22?esc(o.id.slice(0,22))+'\u2026':esc(o.id))+'</span></div>';
      html+='<span style="font-family:var(--mono);font-weight:800;color:var(--accent)">'+fmtE(tot)+'</span></div>';
      html+='<div style="display:flex;gap:4px;flex-wrap:wrap">';
      o.items.forEach(function(it){var cat=CATS[it.category]||CATS.sonstiges;html+='<span class="tag" style="background:'+cat.color+'15;color:'+cat.color+'">'+cat.icon+' '+esc(it.name.slice(0,35))+(it.name.length>35?'\u2026':'')+'</span>';});
      html+='</div></div>';
    });

    app.innerHTML=html;
    // Fix search: use keyup + refocus instead of re-rendering on every keystroke
    var searchBox=document.getElementById('search-box');
    var searchTimer=null;
    searchBox.addEventListener('input',function(e){
      clearTimeout(searchTimer);
      var val=e.target.value;
      searchTimer=setTimeout(function(){
        search=val;
        render();
        // Restore focus after render
        var sb=document.getElementById('search-box');
        if(sb){sb.focus();sb.setSelectionRange(sb.value.length,sb.value.length);}
      },300);
    });
    document.querySelectorAll('[data-fcat]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-fcat');filterCat=(filterCat===v?null:v);render();});});
    document.querySelectorAll('[data-fmonth]').forEach(function(b){b.addEventListener('click',function(){var v=parseInt(b.getAttribute('data-fmonth'));filterMonth=(filterMonth===v?null:v);render();});});
    var clearBtn=document.getElementById('clear-filters');
    if(clearBtn) clearBtn.addEventListener('click',function(){filterCat=null;filterMonth=null;search='';render();});
    document.getElementById('orders-excel').addEventListener('click',function(){exportOrdersExcel(fl);});
    document.getElementById('orders-pdf').addEventListener('click',function(){exportOrdersPDF(fl);});

    // Multiselect toggle
    document.getElementById('toggle-multiselect').addEventListener('click',function(){
      multiSelect=!multiSelect;
      if(!multiSelect) selectedOrderIds={};
      render();
    });

    // Checkboxes for single-item orders
    document.querySelectorAll('.ms-check').forEach(function(cb){
      cb.addEventListener('change',function(){
        var oid=cb.getAttribute('data-msid');
        if(cb.checked) selectedOrderIds[oid]=true;
        else delete selectedOrderIds[oid];
        render();
      });
    });

    // Click on card in multiselect mode toggles checkbox for single-item
    document.querySelectorAll('[data-msoid]').forEach(function(card){
      card.addEventListener('click',function(e){
        if(e.target.tagName==='INPUT') return;
        var oid=card.getAttribute('data-msoid');
        if(selectedOrderIds[oid]) delete selectedOrderIds[oid];
        else selectedOrderIds[oid]=true;
        render();
      });
    });

    // Normal click on orders (non-multiselect or multi-item orders)
    document.querySelectorAll('[data-oid]').forEach(function(b){
      if(b.hasAttribute('data-msoid') && multiSelect) return; // handled above
      b.addEventListener('click',function(){selectedOrderId=b.getAttribute('data-oid');renderModal();});
    });

    // Select all single-item
    var selAllBox=document.getElementById('select-all-single');
    if(selAllBox){
      selAllBox.addEventListener('change',function(){
        fl.forEach(function(o){
          if(o.items.length===1){
            if(selAllBox.checked) selectedOrderIds[o.id]=true;
            else delete selectedOrderIds[o.id];
          }
        });
        render();
      });
    }

    // Bulk category assignment
    document.querySelectorAll('[data-bulkcat]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var newCat=btn.getAttribute('data-bulkcat');
        var changed=0;
        for(var oid in selectedOrderIds){
          if(!selectedOrderIds[oid]) continue;
          for(var i=0;i<orders.length;i++){
            if(orders[i].id===oid && orders[i].items.length===1){
              orders[i].items[0].category=newCat;
              orders[i].items[0]._userCat=true;
              changed++;
              break;
            }
          }
        }
        if(changed>0){
          saveOrders();
          selectedOrderIds={};
          render();
        }
      });
    });

    // Deselect all
    var deselBtn=document.getElementById('bulk-deselect');
    if(deselBtn) deselBtn.addEventListener('click',function(){selectedOrderIds={};render();});
  }

  // ─── IMPORT ────────────────────────────────────────────
  if(view==='import'){
    var kwCountInfo=userKeywords.length>0?' <span style="color:var(--accent);font-weight:700">('+userKeywords.length+' '+t('kwUserRules')+')</span>':'';
    app.innerHTML='<div class="import-area">'+
      '<div class="card"><div class="label">'+t('csvImport')+'</div><p style="font-size:12px;color:var(--t2);margin-bottom:10px;line-height:1.6">'+t('csvFormat')+'</p><input type="file" accept=".csv,.tsv,.txt" class="file-input" id="csv-file"><textarea class="textarea" id="csv-text" placeholder="'+t('csvPaste')+'"></textarea><div style="display:flex;gap:8px;margin-top:10px"><button class="btn btn-primary" id="import-btn">'+t('importBtn')+'</button><button class="btn btn-ghost" id="back-btn">'+t('back')+'</button></div><p style="font-size:11px;color:var(--t3);margin-top:10px">'+t('duplicatesAuto')+'</p></div>'+
      // ── Keyword Management Card ──
      '<div class="card" style="border-color:rgba(142,95,176,0.3)">'+
        '<div class="label" style="display:flex;align-items:center;gap:8px">\uD83D\uDD27 '+t('kwTitle')+kwCountInfo+'</div>'+
        '<p style="font-size:12px;color:var(--t2);margin-bottom:12px;line-height:1.7">'+t('kwDesc')+'</p>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">'+
          '<button class="btn btn-ghost" id="kw-download">\u2B07 '+t('kwDownload')+'</button>'+
          '<input type="file" accept=".csv,.tsv,.txt" id="kw-file" style="display:none">'+
          '<button class="btn btn-primary" id="kw-upload">\u2B06 '+t('kwUpload')+'</button>'+
          (userKeywords.length>0?'<button class="btn btn-ghost" id="kw-reset" style="color:#E85D75">\u21BA '+t('kwReset')+'</button>':'')+
        '</div>'+
        '<p style="font-size:11px;color:var(--t3);line-height:1.6">'+t('kwFormat')+'</p>'+
      '</div>'+
      // ── Backup/Restore + Daten verwalten (combined) ──
      '<div class="card"><div class="label">'+t('dataManage')+'</div><p style="font-size:12px;color:var(--t2);margin-bottom:8px">'+t('restoreDesc')+'</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost" id="backup-btn">'+t('backupBtn')+'</button><input type="file" accept=".json" id="restore-file-import" style="display:none"><button class="btn btn-ghost" id="restore-btn-import">'+t('loadBackupFile')+'</button><button class="btn btn-ghost" id="clear-btn">'+t('deleteBtn')+'</button></div></div>'+
      donateImportHTML()+'</div>';
    document.getElementById('csv-file').addEventListener('change',function(e){
      var f=e.target.files[0];if(!f)return;
      var r=new FileReader();r.onload=function(ev){document.getElementById('csv-text').value=ev.target.result;doImport(ev.target.result);};r.readAsText(f);
    });
    document.getElementById('import-btn').addEventListener('click',function(){doImport(document.getElementById('csv-text').value);});
    document.getElementById('back-btn').addEventListener('click',function(){view='dashboard';render();});
    bindRestoreBtn('restore-file-import','restore-btn-import');
    document.getElementById('clear-btn').addEventListener('click',function(){if(confirm(t('deleteConfirm'))){orders=[];saveOrders();render();}});
    document.getElementById('backup-btn').addEventListener('click',function(){
      var backupData={orders:orders};
      if(userKeywords.length>0) backupData.userKeywords=userKeywords;
      var b=new Blob([JSON.stringify(backupData,null,2)],{type:'application/json'});
      var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='amazon-backup.json';a.click();
    });

    // ── Keyword Management Handlers ──
    document.getElementById('kw-download').addEventListener('click',function(){
      var csv=exportKeywordsCSV();
      var blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
      var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='amazon-keywords.csv';a.click();
    });
    document.getElementById('kw-upload').addEventListener('click',function(){
      document.getElementById('kw-file').click();
    });
    document.getElementById('kw-file').addEventListener('change',function(e){
      var f=e.target.files[0];if(!f)return;
      var r=new FileReader();
      r.onload=function(ev){
        var parsed=parseKeywordsCSV(ev.target.result);
        if(!parsed){alert(t('kwParseError'));return;}
        userKeywords=parsed;
        saveUserKeywords();
        var changed=recategorizeAll();
        if(changed) saveOrders();
        render();
        alert(tReplace('kwImportSuccess',{count:parsed.length}));
      };
      r.readAsText(f);
    });
    var kwResetBtn=document.getElementById('kw-reset');
    if(kwResetBtn){
      kwResetBtn.addEventListener('click',function(){
        if(!confirm(t('kwResetConfirm')))return;
        userKeywords=[];
        saveUserKeywords();
        recategorizeAll();saveOrders();
        render();
      });
    }
  }
}

// ─── DONUT ───────────────────────────────────────────────
function drawDonut(data){
  var canvas=document.getElementById('donut');if(!canvas)return;
  var s=200;
  var dpr=window.devicePixelRatio||1;
  canvas.width=s*dpr;canvas.height=s*dpr;
  canvas.style.width=s+'px';canvas.style.height=s+'px';
  canvas.style.cursor='pointer';

  var total=data.reduce(function(d,x){return d+x.value;},0);
  if(!total)return;

  // Pre-compute segments
  var segs=[];var cum=-Math.PI/2;
  data.forEach(function(d){
    var slice=(d.value/total)*Math.PI*2;
    segs.push({start:cum,end:cum+slice,color:d.color,label:d.label,icon:d.icon,value:d.value,pct:d.value/total});
    cum+=slice;
  });

  var cx=s/2,cy=s/2,r=s*0.36,lw=s*0.17;
  var hovIdx=-1;

  function paint(){
    var ctx=canvas.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,s,s);

    // Draw segments
    segs.forEach(function(seg,i){
      ctx.beginPath();
      ctx.arc(cx,cy,r,seg.start,seg.end);
      ctx.strokeStyle=seg.color;
      ctx.lineWidth=(hovIdx===i)?lw+6:lw;
      ctx.globalAlpha=(hovIdx>=0&&hovIdx!==i)?0.3:1;
      ctx.stroke();
      ctx.globalAlpha=1;
    });

    // Center text
    if(hovIdx>=0){
      var h=segs[hovIdx];
      var valText=fmtE(h.value);
      var valSize=valText.length>10?14:valText.length>8?16:18;
      ctx.fillStyle='#8896A7';ctx.font='400 10px "DM Sans",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(h.label,cx,cy-14);
      ctx.fillStyle='#E6EDF3';ctx.font='800 '+valSize+'px "DM Mono",monospace';
      ctx.fillText(valText,cx,cy+3);
      ctx.fillStyle=h.color;ctx.font='700 11px "DM Sans",sans-serif';
      ctx.fillText((h.pct*100).toFixed(1)+'%',cx,cy+19);
    } else {
      var totText=fmtE(total);
      var totSize=totText.length>10?14:totText.length>8?16:18;
      ctx.fillStyle='#8896A7';ctx.font='400 10px "DM Sans",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(t('total'),cx,cy-10);
      ctx.fillStyle='#E6EDF3';ctx.font='800 '+totSize+'px "DM Mono",monospace';
      ctx.fillText(totText,cx,cy+8);
    }
  }

  // Hit test: is point inside donut ring?
  function hitTest(mx,my){
    var dx=mx-cx,dy=my-cy;
    var dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<r-lw/2||dist>r+lw/2) return -1;
    var angle=Math.atan2(dy,dx);
    // Normalize angle to match our segments (starting at -PI/2)
    for(var i=0;i<segs.length;i++){
      var seg=segs[i];
      var start=seg.start,end=seg.end;
      // Handle angle wrapping
      var a=angle;
      if(a<start) a+=Math.PI*2;
      if(a>=start&&a<end) return i;
      // Try again with +2PI
      a=angle+Math.PI*2;
      if(a>=start&&a<end) return i;
    }
    return -1;
  }

  canvas.addEventListener('mousemove',function(e){
    var rect=canvas.getBoundingClientRect();
    var mx=(e.clientX-rect.left)*(s/rect.width);
    var my=(e.clientY-rect.top)*(s/rect.height);
    var newHov=hitTest(mx,my);
    if(newHov!==hovIdx){hovIdx=newHov;paint();}
  });

  canvas.addEventListener('mouseleave',function(){
    if(hovIdx!==-1){hovIdx=-1;paint();}
  });

  // Click to filter by category
  canvas.addEventListener('click',function(e){
    var rect=canvas.getBoundingClientRect();
    var mx=(e.clientX-rect.left)*(s/rect.width);
    var my=(e.clientY-rect.top)*(s/rect.height);
    var idx=hitTest(mx,my);
    if(idx>=0){
      filterCat=data[idx].key;
      view='orders';
      render();
    }
  });

  paint();
}

// ─── MONTHLY BAR CHART (Canvas, with avg line + click) ──
function drawMonthlyBars(monthlyData){
  var canvas=document.getElementById('monthly-bars');if(!canvas)return;
  var dpr=window.devicePixelRatio||1;
  var W=canvas.clientWidth, H=canvas.clientHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  var ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);

  var pad={top:15,right:10,bottom:28,left:10};
  var cw=W-pad.left-pad.right, ch=H-pad.top-pad.bottom;
  var n=monthlyData.length;
  var max=Math.max.apply(null,monthlyData.map(function(d){return d.total;}))||1;
  var avg=monthlyData.reduce(function(s,d){return s+d.total;},0)/n;
  var barW=cw/n;

  // Store bar rects for click detection
  var barRects=[];

  // Bars
  monthlyData.forEach(function(d,i){
    var bw=barW*0.7;
    var x=pad.left+i*barW+(barW-bw)/2;
    var h=(d.total/max)*ch;
    var y=pad.top+ch-h;
    var isHigh=d.total>avg*1.3;

    var grad=ctx.createLinearGradient(x,y,x,pad.top+ch);
    if(isHigh){ grad.addColorStop(0,'#E85D75'); grad.addColorStop(1,'#E8723A'); }
    else { grad.addColorStop(0,'#4C9EEB'); grad.addColorStop(1,'#2D9D78'); }
    ctx.fillStyle=grad;

    // Rounded top
    var r=Math.min(3,bw/4);
    ctx.beginPath();
    ctx.moveTo(x,pad.top+ch);
    ctx.lineTo(x,y+r);
    ctx.arcTo(x,y,x+r,y,r);
    ctx.arcTo(x+bw,y,x+bw,y+r,r);
    ctx.lineTo(x+bw,pad.top+ch);
    ctx.closePath();
    ctx.fill();

    barRects.push({x:x,y:y,w:bw,h:h,month:d.month});

    // Value above bar
    if(d.total>50){
      ctx.fillStyle='#8896A7';ctx.font='9px "DM Mono",monospace';ctx.textAlign='center';ctx.textBaseline='bottom';
      ctx.fillText(Math.round(d.total),x+bw/2,y-3);
    }

    // Month label
    ctx.fillStyle='#5E6B80';ctx.font='9px "DM Sans",sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText(fmtM(d.month),pad.left+i*barW+barW/2,pad.top+ch+6);
  });

  // Average dashed line
  var avgY=pad.top+ch-ch*(avg/max);
  ctx.setLineDash([4,4]);ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(pad.left,avgY);ctx.lineTo(W-pad.right,avgY);ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle='#5E6B80';ctx.font='9px "DM Mono",monospace';ctx.textAlign='right';ctx.textBaseline='bottom';
  ctx.fillText(t('avg')+' '+Math.round(avg)+' \u20AC',W-pad.right,avgY-3);

  // Click handler
  canvas.addEventListener('click',function(e){
    var rect=canvas.getBoundingClientRect();
    var mx=(e.clientX-rect.left)*(canvas.width/dpr/rect.width);
    var my=(e.clientY-rect.top)*(canvas.height/dpr/rect.height);
    for(var i=0;i<barRects.length;i++){
      var b=barRects[i];
      if(mx>=b.x && mx<=b.x+b.w && my>=b.y && my<=pad.top+ch){
        search=b.month; view='orders'; filterCat=null; render();
        return;
      }
    }
  });
}

// ─── MONTHLY LINE CHART ─────────────────────────────────
function drawMonthlyLine(monthlyData){
  var canvas=document.getElementById('monthly-line');if(!canvas)return;
  var dpr=window.devicePixelRatio||1;
  var W=canvas.clientWidth, H=canvas.clientHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  var ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);

  var pad={top:20,right:15,bottom:28,left:55};
  var cw=W-pad.left-pad.right, ch=H-pad.top-pad.bottom;
  var max=Math.max.apply(null,monthlyData.map(function(d){return d.total;}))||1;
  var avg=monthlyData.reduce(function(s,d){return s+d.total;},0)/monthlyData.length;
  var n=monthlyData.length;

  // Y-axis labels
  ctx.fillStyle='#5E6B80'; ctx.font='10px "DM Mono",monospace'; ctx.textAlign='right'; ctx.textBaseline='middle';
  for(var i=0;i<=4;i++){
    var val=max*(i/4);
    var y=pad.top+ch-ch*(i/4);
    ctx.fillText(Math.round(val)+' \u20AC',pad.left-8,y);
    ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(W-pad.right,y); ctx.stroke();
  }

  // Avg dashed line
  var avgY=pad.top+ch-ch*(avg/max);
  ctx.setLineDash([4,4]); ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(pad.left,avgY); ctx.lineTo(W-pad.right,avgY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle='#5E6B80'; ctx.font='9px "DM Mono",monospace'; ctx.textAlign='right';
  ctx.fillText(t('avg')+' '+Math.round(avg)+' \u20AC',W-pad.right-4,avgY-5);

  // Line + gradient fill
  ctx.beginPath();
  var points=[];
  for(var i=0;i<n;i++){
    var x=pad.left+(i/(n-1))*cw;
    var y=pad.top+ch-ch*(monthlyData[i].total/max);
    points.push({x:x,y:y});
    if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='#4C9EEB'; ctx.lineWidth=2; ctx.stroke();

  // Fill under line
  var grad=ctx.createLinearGradient(0,pad.top,0,pad.top+ch);
  grad.addColorStop(0,'rgba(76,158,235,0.2)'); grad.addColorStop(1,'rgba(76,158,235,0)');
  ctx.lineTo(points[n-1].x,pad.top+ch); ctx.lineTo(points[0].x,pad.top+ch); ctx.closePath();
  ctx.fillStyle=grad; ctx.fill();

  // Dots
  points.forEach(function(p){
    ctx.beginPath(); ctx.arc(p.x,p.y,2.5,0,Math.PI*2); ctx.fillStyle='#4C9EEB'; ctx.fill();
  });

  // X-axis labels (show every Nth)
  ctx.fillStyle='#5E6B80'; ctx.font='9px "DM Sans",sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
  var step=Math.max(1,Math.floor(n/12));
  for(var i=0;i<n;i+=step){
    var x=pad.left+(i/(n-1))*cw;
    ctx.fillText(fmtM(monthlyData[i].month),x,pad.top+ch+8);
  }
  // Always show last label
  if((n-1)%step!==0){
    ctx.fillText(fmtM(monthlyData[n-1].month),pad.left+cw,pad.top+ch+8);
  }

  // Click handler: find nearest point
  canvas.addEventListener('click',function(e){
    var rect=canvas.getBoundingClientRect();
    var mx=(e.clientX-rect.left)*(W/rect.width);
    var closest=-1, closestDist=999;
    points.forEach(function(p,i){
      var dist=Math.abs(mx-p.x);
      if(dist<closestDist){ closestDist=dist; closest=i; }
    });
    if(closest>=0 && closestDist<30){
      search=monthlyData[closest].month; view='orders'; filterCat=null; render();
    }
  });
}

// ─── YEARLY BAR CHART ────────────────────────────────────
function drawYearlyBars(yearlyMap){
  var canvas=document.getElementById('yearly-bars');if(!canvas)return;
  var dpr=window.devicePixelRatio||1;
  var W=canvas.clientWidth, H=canvas.clientHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  var ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);

  var keys=Object.keys(yearlyMap).sort();
  var vals=keys.map(function(k){return yearlyMap[k];});
  var max=Math.max.apply(null,vals)||1;
  var n=keys.length;
  var pad={top:20,right:15,bottom:30,left:55};
  var cw=W-pad.left-pad.right, ch=H-pad.top-pad.bottom;
  var barW=Math.min(60,cw/n*0.6);
  var gap=(cw-barW*n)/(n+1);

  // Y-axis
  ctx.fillStyle='#5E6B80'; ctx.font='10px "DM Mono",monospace'; ctx.textAlign='right'; ctx.textBaseline='middle';
  for(var i=0;i<=3;i++){
    var val=max*(i/3);
    var y=pad.top+ch-ch*(i/3);
    ctx.fillText(Math.round(val)+' \u20AC',pad.left-8,y);
    ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(W-pad.right,y); ctx.stroke();
  }

  // Bars
  keys.forEach(function(yr,i){
    var x=pad.left+gap+(barW+gap)*i;
    var h=ch*(vals[i]/max);
    var y=pad.top+ch-h;
    var grad=ctx.createLinearGradient(x,y,x,pad.top+ch);
    grad.addColorStop(0,'#4C9EEB'); grad.addColorStop(1,'#2D9D78');
    ctx.fillStyle=grad;
    ctx.beginPath();
    // Rounded top
    var r=Math.min(4,barW/4);
    ctx.moveTo(x,pad.top+ch);
    ctx.lineTo(x,y+r);
    ctx.arcTo(x,y,x+r,y,r);
    ctx.arcTo(x+barW,y,x+barW,y+r,r);
    ctx.lineTo(x+barW,pad.top+ch);
    ctx.closePath();
    ctx.fill();

    // Value on top
    ctx.fillStyle='#E6EDF3'; ctx.font='bold 11px "DM Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.fillText(fmtE(vals[i]),x+barW/2,y-4);

    // Year label
    ctx.fillStyle='#5E6B80'; ctx.font='11px "DM Sans",sans-serif'; ctx.textBaseline='top';
    ctx.fillText(yr,x+barW/2,pad.top+ch+8);
  });

  // Click handler: navigate to year page
  canvas.style.cursor='pointer';
  canvas.addEventListener('click',function(e){
    var rect=canvas.getBoundingClientRect();
    var mx=(e.clientX-rect.left)*(W/rect.width);
    for(var i=0;i<keys.length;i++){
      var x=pad.left+gap+(barW+gap)*i;
      if(mx>=x && mx<=x+barW){
        yearFilter=keys[i]; render();
        return;
      }
    }
  });
}

// ─── MODAL ───────────────────────────────────────────────
function renderModal(){
  var existing=document.getElementById('modal-container');if(existing)existing.remove();
  if(!selectedOrderId)return;
  var order=null;for(var i=0;i<orders.length;i++){if(orders[i].id===selectedOrderId){order=orders[i];break;}}
  if(!order)return;
  var div=document.createElement('div');div.id='modal-container';
  var tot=order.items.reduce(function(s,it){return s+it.price*it.qty;},0);

  var html='<div class="modal-bg" id="modal-bg"><div class="modal" id="modal-inner">';
  html+='<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px"><div><div style="font-size:18px;font-weight:800">'+fmtD(order.date)+'</div><div style="font-size:10px;color:var(--t3);font-family:var(--mono);margin-top:2px">'+esc(order.id)+'</div></div><button id="modal-close" style="background:var(--bg3);border:none;color:var(--t2);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">\u00D7</button></div>';
  html+='<table><thead><tr><th>'+t('article')+'</th><th>'+t('category')+'</th><th style="text-align:right">'+t('price')+'</th></tr></thead><tbody>';

  order.items.forEach(function(it,idx){
    var cat=CATS[it.category]||CATS.sonstiges;
    html+='<tr><td style="font-weight:500">'+esc(it.name)+(it.qty>1?'<div style="font-size:10px;color:var(--t3)">\u00D7 '+it.qty+'</div>':'')+'</td><td>';
    if(editingItem===idx){
      html+='<div class="cat-picker">';
      CK.forEach(function(k){var c=CATS[k];html+='<button class="cat-pick-btn" data-setcat="'+k+'" data-idx="'+idx+'" style="background:'+(it.category===k?c.color+'25':'var(--bg3)')+';color:'+(it.category===k?c.color:'var(--t3)')+';border-color:'+(it.category===k?c.color+'40':'transparent')+'">'+c.icon+' '+catLabel(k)+'</button>';});
      html+='<button class="cat-pick-btn" data-cancel="1" style="color:var(--t3)">\u2715</button></div>';
    } else {
      html+='<span class="filter-btn" data-edititem="'+idx+'" style="background:'+cat.color+'25;color:'+cat.color+';border-color:'+cat.color+'40;cursor:pointer">'+cat.icon+' '+catLabel(it.category)+' \u270E</span>';
    }
    html+='</td><td style="text-align:right;font-family:var(--mono);font-weight:600">'+fmtE(it.price*it.qty)+'</td></tr>';
  });

  html+='</tbody><tfoot><tr><td colspan="2" style="padding:12px 10px;font-weight:800;border-top:var(--border)">'+t('totalSum')+'</td><td style="padding:12px 10px;text-align:right;font-family:var(--mono);font-weight:800;font-size:16px;color:var(--accent);border-top:var(--border)">'+fmtE(tot)+'</td></tr></tfoot></table></div></div>';

  div.innerHTML=html;
  document.body.appendChild(div);

  // Close on background click (but NOT on inner modal clicks)
  document.getElementById('modal-bg').addEventListener('click',function(e){
    if(e.target.id==='modal-bg'){selectedOrderId=null;editingItem=null;div.remove();render();}
  });
  document.getElementById('modal-close').addEventListener('click',function(e){
    e.stopPropagation();
    selectedOrderId=null;editingItem=null;div.remove();render();
  });

  // Scope all handlers to the modal container (div), not document
  div.querySelectorAll('[data-edititem]').forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      editingItem=parseInt(b.getAttribute('data-edititem'));
      renderModal();
    });
  });
  div.querySelectorAll('[data-setcat]').forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      var idx=parseInt(b.getAttribute('data-idx'));
      var cat=b.getAttribute('data-setcat');
      for(var i=0;i<orders.length;i++){
        if(orders[i].id===selectedOrderId){
          orders[i].items[idx].category=cat;
          orders[i].items[idx]._userCat=true;
          break;
        }
      }
      saveOrders();
      editingItem=null;
      renderModal();
      // Don't call render() here - it destroys/rebuilds the page and breaks the modal
    });
  });
  div.querySelectorAll('[data-cancel]').forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      editingItem=null;
      renderModal();
    });
  });
}

// ─── EXPORT HELPERS ──────────────────────────────────────

function getExportTitle() {
  return yearFilter === 'all' ? 'Alle Jahre' : yearFilter;
}

// ─── XLSX GENERATOR (minimal, no dependencies) ──────────
// XLSX = ZIP of XML files. We build the ZIP manually.

function crc32(buf){var t=new Int32Array(256);for(var i=0;i<256;i++){var c=i;for(var j=0;j<8;j++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[i]=c;}var crc=0xFFFFFFFF;for(var i=0;i<buf.length;i++)crc=t[(crc^buf[i])&0xFF]^(crc>>>8);return(crc^0xFFFFFFFF)>>>0;}

function strToU8(s){return new TextEncoder().encode(s);}

function buildZip(files){
  var localParts=[],centralParts=[],offset=0;
  files.forEach(function(f){
    var data=strToU8(f.content);var name=strToU8(f.name);var crc=crc32(data);
    // Local file header
    var lh=new Uint8Array(30+name.length);var v=new DataView(lh.buffer);
    v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(8,0,true);
    v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);
    v.setUint16(26,name.length,true);lh.set(name,30);
    // Central directory
    var cd=new Uint8Array(46+name.length);var cv=new DataView(cd.buffer);
    cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);
    cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);
    cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);cd.set(name,46);
    localParts.push(lh,data);centralParts.push(cd);
    offset+=lh.length+data.length;
  });
  var cdSize=centralParts.reduce(function(s,c){return s+c.length;},0);
  var eocd=new Uint8Array(22);var ev=new DataView(eocd.buffer);
  ev.setUint32(0,0x06054b50,true);ev.setUint16(8,files.length,true);ev.setUint16(10,files.length,true);
  ev.setUint32(12,cdSize,true);ev.setUint32(16,offset,true);
  var all=localParts.concat(centralParts,[eocd]);
  var total=all.reduce(function(s,a){return s+a.length;},0);
  var result=new Uint8Array(total);var pos=0;
  all.forEach(function(a){result.set(a,pos);pos+=a.length;});
  return result;
}

function escXml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function buildXLSX(sheets){
  var sheetXmls=[];
  var sheetRels='';
  var sheetEntries='';

  // Styles: 0=normal, 1=header(bold,green bg,white), 2=number(#,##0.00€), 3=title(bold,16pt), 4=subtitle(bold,gray), 5=number+bold, 6=percent
  var styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  styles+='<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
  styles+='<numFmts count="2">';
  styles+='<numFmt numFmtId="164" formatCode="#,##0.00\\ &quot;\u20AC&quot;"/>';
  styles+='<numFmt numFmtId="165" formatCode="0.0%"/>';
  styles+='</numFmts>';
  styles+='<fonts count="5">';
  styles+='<font><sz val="11"/><name val="Calibri"/></font>';              // 0: normal
  styles+='<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>';  // 1: header white bold
  styles+='<font><b/><sz val="14"/><name val="Calibri"/></font>';          // 2: title
  styles+='<font><b/><sz val="11"/><color rgb="FF666666"/><name val="Calibri"/></font>';  // 3: subtitle
  styles+='<font><b/><sz val="11"/><name val="Calibri"/></font>';          // 4: bold
  styles+='</fonts>';
  styles+='<fills count="3">';
  styles+='<fill><patternFill patternType="none"/></fill>';
  styles+='<fill><patternFill patternType="gray125"/></fill>';
  styles+='<fill><patternFill patternType="solid"><fgColor rgb="FF2D9D78"/></patternFill></fill>';  // 2: green
  styles+='</fills>';
  styles+='<borders count="2">';
  styles+='<border><left/><right/><top/><bottom/><diagonal/></border>';
  styles+='<border><left/><right/><top/><bottom style="thin"><color rgb="FFDDDDDD"/></bottom><diagonal/></border>';
  styles+='</borders>';
  styles+='<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>';
  styles+='<cellXfs count="7">';
  styles+='<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>';                                           // 0: normal
  styles+='<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1"/>';               // 1: header
  styles+='<xf numFmtId="164" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyBorder="1"/>';   // 2: number €
  styles+='<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1"/>';                             // 3: title
  styles+='<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1"/>';                             // 4: subtitle
  styles+='<xf numFmtId="164" fontId="4" fillId="0" borderId="1" applyNumberFormat="1" applyFont="1" applyBorder="1"/>'; // 5: number € bold
  styles+='<xf numFmtId="165" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyBorder="1"/>';   // 6: percent
  styles+='</cellXfs>';
  styles+='</styleSheet>';

  // Style ID map
  var SID={normal:0,hdr:1,num:2,title:3,subtitle:4,numBold:5,pct:6};

  function colRef(ci){
    if(ci<26) return String.fromCharCode(65+ci);
    return String.fromCharCode(64+Math.floor(ci/26))+String.fromCharCode(65+(ci%26));
  }

  sheets.forEach(function(sheet,si){
    var xml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    xml+='<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';

    // sheetViews MUST come first
    if(sheet.freezeRow){
      xml+='<sheetViews><sheetView tabSelected="'+(si===0?1:0)+'" workbookViewId="0"><pane ySplit="'+sheet.freezeRow+'" topLeftCell="A'+(sheet.freezeRow+1)+'" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';
    }

    // Column widths
    if(sheet.colWidths){
      xml+='<cols>';
      sheet.colWidths.forEach(function(w,i){
        xml+='<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>';
      });
      xml+='</cols>';
    }

    xml+='<sheetData>';
    sheet.rows.forEach(function(row,ri){
      var ht=row.height?' ht="'+row.height+'" customHeight="1"':'';
      xml+='<row r="'+(ri+1)+'"'+ht+'>';
      row.cells.forEach(function(cell,ci){
        var ref=colRef(ci)+(ri+1);
        var s=cell.style?SID[cell.style]||0:0;
        if(cell.type==='Number'){
          xml+='<c r="'+ref+'" s="'+s+'"><v>'+(cell.value||0)+'</v></c>';
        } else {
          xml+='<c r="'+ref+'" s="'+s+'" t="inlineStr"><is><t>'+escXml(cell.value!==undefined?cell.value:'')+'</t></is></c>';
        }
      });
      xml+='</row>';
    });
    xml+='</sheetData>';

    xml+='</worksheet>';
    sheetXmls.push(xml);
    sheetRels+='<Relationship Id="rId'+(si+2)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="sheet'+(si+1)+'.xml"/>';
    sheetEntries+='<sheet name="'+escXml(sheet.name.slice(0,31))+'" sheetId="'+(si+1)+'" r:id="rId'+(si+2)+'"/>';
  });

  var contentTypes='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">';
  contentTypes+='<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>';
  contentTypes+='<Default Extension="xml" ContentType="application/xml"/>';
  contentTypes+='<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>';
  contentTypes+='<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
  sheets.forEach(function(_,i){contentTypes+='<Override PartName="/xl/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';});
  contentTypes+='</Types>';

  var rels='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';

  var workbook='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+sheetEntries+'</sheets></workbook>';

  var wbRels='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+sheetRels+'</Relationships>';

  var files=[
    {name:'[Content_Types].xml',content:contentTypes},
    {name:'_rels/.rels',content:rels},
    {name:'xl/workbook.xml',content:workbook},
    {name:'xl/_rels/workbook.xml.rels',content:wbRels},
    {name:'xl/styles.xml',content:styles}
  ];
  sheetXmls.forEach(function(xml,i){files.push({name:'xl/sheet'+(i+1)+'.xml',content:xml});});

  return buildZip(files);
}

function downloadExcel(sheets, filename) {
  var data = buildXLSX(sheets);
  var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename.replace(/\.xls$/, '.xlsx');
  a.click();
}

function openPrintPage(title, htmlContent) {
  var win = window.open('', '_blank');
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + esc(title) + '</title>');
  win.document.write('<style>');
  win.document.write('body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:11px;color:#222;margin:20px;line-height:1.4}');
  win.document.write('h1{font-size:18px;margin:0 0 4px}h2{font-size:13px;color:#666;margin:0 0 16px;font-weight:400}h3{font-size:13px;margin:18px 0 8px}');
  win.document.write('table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:10px}');
  win.document.write('th{background:#2D9D78;color:#fff;padding:6px 8px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:0.05em}');
  win.document.write('td{padding:5px 8px;border-bottom:1px solid #eee}');
  win.document.write('tr:nth-child(even){background:#f8f8f8}');
  win.document.write('.right{text-align:right}.mono{font-family:monospace}');
  win.document.write('.kpi-row{display:flex;gap:16px;margin-bottom:16px}.kpi{border:1px solid #ddd;border-radius:6px;padding:10px 16px;flex:1;text-align:center}');
  win.document.write('.kpi-val{font-size:20px;font-weight:800;font-family:monospace}.kpi-lbl{font-size:9px;color:#888;text-transform:uppercase}');
  win.document.write('.footer{margin-top:20px;font-size:9px;color:#999;text-align:center}');
  win.document.write('@media print{body{margin:10px}@page{size:A4;margin:15mm}.donate-footer{page-break-inside:avoid}}');
  win.document.write('</style></head><body>');
  win.document.write(htmlContent);
  win.document.write('<div class="footer">' + t('analysis') + ' \u2022 ' + t('exportedOn') + ' ' + fmtDateExport() + '</div>');
  win.document.write('<div class="donate-footer" style="margin-top:30px;padding:16px;border:1px solid #ddd;border-radius:8px;display:flex;align-items:center;gap:16px"><img src="'+DONATE_QR_BASE64+'" style="width:80px;height:80px"/><div><div style="font-weight:700;font-size:12px;margin-bottom:4px">'+dt('pdfFooter')+'</div><a href="'+PAYPAL_URL+'" style="color:#2D9D78;font-size:11px">'+PAYPAL_URL+'</a></div></div>');
  win.document.write('</body></html>');
  win.document.close();
  setTimeout(function() { win.print(); }, 500);
}

// ─── DASHBOARD EXPORT ────────────────────────────────────
function exportDashboardExcel() {
  var a = analyze();
  var title = t('appTitle') + ' ' + getExportTitle();
  var avg = a.monthlyData.length > 0 ? (a.total / a.monthlyData.length) : 0;

  var rows = [];
  rows.push({ cells: [{ value: title, style: 'title' }] });
  rows.push({ cells: [{ value: t('exportedOn') + ' ' + fmtDateExport() }] });
  rows.push({ cells: [] });
  rows.push({ cells: [{ value: t('metrics'), style: 'subtitle' }] });
  rows.push({ cells: [{ value: t('totalSpending') }, { value: a.total, type: 'Number', style: 'num' }] });
  rows.push({ cells: [{ value: t('orderCount') }, { value: a.count, type: 'Number' }] });
  rows.push({ cells: [{ value: t('articles') }, { value: a.items, type: 'Number' }] });
  rows.push({ cells: [{ value: t('avgPerMonth') }, { value: Math.round(avg * 100) / 100, type: 'Number', style: 'num' }] });
  rows.push({ cells: [] });
  rows.push({ cells: [{ value: t('category'), style: 'hdr' }, { value: t('amount'), style: 'hdr' }, { value: t('share'), style: 'hdr' }] });
  a.catData.forEach(function(c) {
    rows.push({ cells: [{ value: c.icon + ' ' + catLabel(c.key) }, { value: c.value, type: 'Number', style: 'num' }, { value: c.value / a.total, type: 'Number', style: 'pct' }] });
  });
  rows.push({ cells: [{ value: t('totalSum'), style: 'subtitle' }, { value: a.total, type: 'Number', style: 'numBold' }, { value: '' }] });
  rows.push({ cells: [] });
  rows.push({ cells: [{ value: t('month'), style: 'hdr' }, { value: t('spending'), style: 'hdr' }] });
  a.monthlyData.forEach(function(m) {
    rows.push({ cells: [{ value: fmtM(m.month) }, { value: m.total, type: 'Number', style: 'num' }] });
  });

  var yearlyMap = {};
  a.filtered.forEach(function(o) { var yr = o.date.slice(0, 4); yearlyMap[yr] = (yearlyMap[yr] || 0); o.items.forEach(function(it) { yearlyMap[yr] += it.price * it.qty; }); });
  var yearlyKeys = Object.keys(yearlyMap).sort();
  if (yearlyKeys.length > 1) {
    rows.push({ cells: [] });
    rows.push({ cells: [{ value: t('year'), style: 'hdr' }, { value: t('spending'), style: 'hdr' }] });
    yearlyKeys.forEach(function(yr) { rows.push({ cells: [{ value: yr }, { value: yearlyMap[yr], type: 'Number', style: 'num' }] }); });
  }

  var topRows = [];
  topRows.push({ cells: [{ value: t('topSpendingItems') + ' ' + getExportTitle(), style: 'title' }] });
  topRows.push({ cells: [] });
  topRows.push({ cells: [{ value: t('rank'), style: 'hdr' }, { value: t('article'), style: 'hdr' }, { value: t('category'), style: 'hdr' }, { value: t('date'), style: 'hdr' }, { value: t('amount'), style: 'hdr' }] });
  a.topAll.slice(0, 30).forEach(function(it, i) {
    var cat = CATS[it.category] || CATS.sonstiges;
    topRows.push({ cells: [{ value: i + 1, type: 'Number' }, { value: it.name }, { value: catLabel(it.category) }, { value: fmtD(it.date) }, { value: it.total, type: 'Number', style: 'num' }] });
  });

  var sheetName1 = LANG === 'en' ? 'Overview' : '\u00DCbersicht';
  var sheetName2 = LANG === 'en' ? 'Top Spending' : 'Top-Ausgaben';
  downloadExcel([
    { name: sheetName1, rows: rows, colWidths: [30, 18, 12] },
    { name: sheetName2, rows: topRows, colWidths: [6, 55, 20, 14, 16], freezeRow: 3 }
  ], 'Amazon-' + (LANG==='en'?'Spending':'Ausgaben') + '-' + getExportTitle() + '.xlsx');
}

function exportDashboardPDF() {
  var a = analyze();
  var title = t('analysis') + ' \u2013 ' + getExportTitle();
  var avg = a.monthlyData.length > 0 ? fmtE(a.total / a.monthlyData.length) : '\u2013';
  var html = '';

  html += '<h1>\uD83D\uDCCA ' + esc(title) + '</h1>';
  html += '<h2>' + getExportTitle() + '</h2>';

  html += '<div class="kpi-row">';
  html += '<div class="kpi"><div class="kpi-val">' + fmtE(a.total) + '</div><div class="kpi-lbl">' + t('spending') + '</div></div>';
  html += '<div class="kpi"><div class="kpi-val">' + a.count + '</div><div class="kpi-lbl">' + t('orderCount') + '</div></div>';
  html += '<div class="kpi"><div class="kpi-val">' + a.items + '</div><div class="kpi-lbl">' + t('articles') + '</div></div>';
  html += '<div class="kpi"><div class="kpi-val">' + avg + '</div><div class="kpi-lbl">' + t('avgPerMonth') + '</div></div>';
  html += '</div>';

  html += '<h3>' + t('categories') + '</h3><table><tr><th>' + t('category') + '</th><th class="right">' + t('amount') + '</th><th class="right">' + t('share') + '</th></tr>';
  a.catData.forEach(function(c) {
    html += '<tr><td>' + c.icon + ' ' + esc(catLabel(c.key)) + '</td><td class="right mono">' + fmtE(c.value) + '</td><td class="right">' + (c.value / a.total * 100).toFixed(1) + '%</td></tr>';
  });
  html += '</table>';

  html += '<h3>' + t('monthlySpending') + '</h3><table><tr><th>' + t('month') + '</th><th class="right">' + t('spending') + '</th></tr>';
  a.monthlyData.forEach(function(m) {
    html += '<tr><td>' + fmtM(m.month) + '</td><td class="right mono">' + fmtE(m.total) + '</td></tr>';
  });
  html += '</table>';

  var yearlyMap = {};
  a.filtered.forEach(function(o) { var yr = o.date.slice(0, 4); yearlyMap[yr] = (yearlyMap[yr] || 0); o.items.forEach(function(it) { yearlyMap[yr] += it.price * it.qty; }); });
  var yearlyKeys = Object.keys(yearlyMap).sort();
  if (yearlyKeys.length > 1) {
    html += '<h3>' + t('yearlySpending') + '</h3><table><tr><th>' + t('year') + '</th><th class="right">' + t('spending') + '</th></tr>';
    yearlyKeys.forEach(function(yr) { html += '<tr><td>' + yr + '</td><td class="right mono">' + fmtE(yearlyMap[yr]) + '</td></tr>'; });
    html += '</table>';
  }

  html += '<div style="page-break-before:always"></div>';
  html += '<h1>\uD83C\uDFC6 ' + t('topSpendingItems') + ' \u2013 ' + getExportTitle() + '</h1>';
  html += '<table><tr><th>' + t('rank') + '</th><th>' + t('article') + '</th><th>' + t('category') + '</th><th>' + t('date') + '</th><th class="right">' + t('amount') + '</th></tr>';
  a.topAll.slice(0, 30).forEach(function(it, i) {
    var cat = CATS[it.category] || CATS.sonstiges;
    html += '<tr><td>' + (i + 1) + '</td><td>' + esc(it.name.slice(0, 60)) + '</td><td>' + cat.icon + ' ' + esc(catLabel(it.category)) + '</td><td>' + fmtD(it.date) + '</td><td class="right mono">' + fmtE(it.total) + '</td></tr>';
  });
  html += '</table>';

  openPrintPage(title, html);
}

// ─── ORDERS EXPORT ───────────────────────────────────────
function exportOrdersExcel(filteredOrders) {
  var rows = [];
  rows.push({ cells: [{ value: t('appTitle') + ' ' + t('orders') + ' ' + getExportTitle(), style: 'title' }] });
  rows.push({ cells: [{ value: filteredOrders.length + ' ' + t('orderCount') }] });
  rows.push({ cells: [] });
  rows.push({ cells: [{ value: t('date'), style: 'hdr' }, { value: t('orderNr'), style: 'hdr' }, { value: t('article'), style: 'hdr' }, { value: t('category'), style: 'hdr' }, { value: t('price'), style: 'hdr' }] });
  filteredOrders.forEach(function(o) {
    o.items.forEach(function(it) {
      rows.push({ cells: [{ value: fmtD(o.date) }, { value: o.id }, { value: it.name }, { value: catLabel(it.category) }, { value: it.price * it.qty, type: 'Number', style: 'num' }] });
    });
  });
  var sumTotal=filteredOrders.reduce(function(s,o){return s+o.items.reduce(function(ss,it){return ss+it.price*it.qty;},0);},0);
  rows.push({ cells: [{ value: '' }, { value: '' }, { value: '' }, { value: t('totalSum'), style: 'subtitle' }, { value: sumTotal, type: 'Number', style: 'numBold' }] });
  var sheetName = LANG === 'en' ? 'Orders' : 'Bestellungen';
  downloadExcel([
    { name: sheetName, rows: rows, colWidths: [14, 24, 55, 20, 14], freezeRow: 4 }
  ], 'Amazon-' + sheetName + '-' + getExportTitle() + '.xlsx');
}

function exportOrdersPDF(filteredOrders) {
  var title = t('appTitle') + ' ' + t('orders') + ' \u2013 ' + getExportTitle();
  var html = '<h1>\uD83D\uDCE6 ' + esc(title) + '</h1>';
  html += '<h2>' + filteredOrders.length + ' ' + t('orderCount') + '</h2>';
  html += '<table><tr><th>' + t('date') + '</th><th>' + t('orderNr') + '</th><th>' + t('article') + '</th><th>' + t('category') + '</th><th class="right">' + t('price') + '</th></tr>';
  filteredOrders.forEach(function(o) {
    o.items.forEach(function(it) {
      html += '<tr><td>' + fmtD(o.date) + '</td><td style="font-size:9px">' + esc(o.id.slice(0, 20)) + '</td><td>' + esc(it.name.slice(0, 50)) + '</td><td>' + CATS[it.category].icon + ' ' + esc(catLabel(it.category)) + '</td><td class="right mono">' + fmtE(it.price * it.qty) + '</td></tr>';
    });
  });
  var sumTotal=filteredOrders.reduce(function(s,o){return s+o.items.reduce(function(ss,it){return ss+it.price*it.qty;},0);},0);
  html += '<tr style="font-weight:bold;border-top:2px solid #2D9D78"><td colspan="4" style="text-align:right;padding-top:8px">' + t('totalSum') + '</td><td class="right mono" style="padding-top:8px">' + fmtE(sumTotal) + '</td></tr>';
  html += '</table>';
  openPrintPage(title, html);
}

// ─── EXPORT BUTTONS HTML HELPER ─────────────────────────
function exportButtonsHTML(prefix) {
  return '<div style="display:flex;gap:6px;margin-left:auto"><button class="export-btn" id="' + prefix + '-excel" title="Excel Export">\uD83D\uDCCA Excel</button><button class="export-btn" id="' + prefix + '-pdf" title="PDF Export">\uD83D\uDCC4 PDF</button></div>';
}

function donateBannerHTML() {
  return '<div class="donate-banner"><a href="'+PAYPAL_URL+'" target="_blank" rel="noopener" class="donate-link">'+dt('banner')+'</a></div>';
}

function donateImportHTML() {
  return '<div class="card" style="border-color:rgba(232,93,117,0.2);background:linear-gradient(135deg,rgba(232,93,117,0.05),rgba(76,158,235,0.05))">'+
    '<div class="label">'+dt('importTitle')+'</div>'+
    '<p style="font-size:12px;color:var(--t2);margin-bottom:12px;line-height:1.7">'+dt('importText')+'</p>'+
    '<a href="'+PAYPAL_URL+'" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-block;text-decoration:none;text-align:center;background:linear-gradient(135deg,#E85D75,#4C9EEB)">'+dt('button')+'</a>'+
    '</div>';
}

// ─── INIT ────────────────────────────────────────────────
loadOrders(function(){ render(); });
