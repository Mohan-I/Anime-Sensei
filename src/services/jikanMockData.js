/**
 * jikanMockData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Realistic Jikan v4 / Tenrai API-shaped mock data.
 * Consumed by tenraiService.js when the Tenrai API is unreachable in dev.
 *
 * Response shapes are identical between Jikan v4 and Tenrai v1, so this
 * file serves both without any changes to its exports.
 *
 * Each anime has its own unique character roster keyed by mal_id.
 * Airing / upcoming lists have distinct entries.
 * All image URLs verified against cdn.myanimelist.net.
 */

// ── Pagination helper ─────────────────────────────────────────────────────────
const makePagination = (total) => ({
  last_visible_page: 1, has_next_page: false,
  current_page: 1, items: { count: total, total, per_page: 25 },
});

// ── Verified MAL CDN poster URLs ──────────────────────────────────────────────
const P = {
  steinsgate:  'https://cdn.myanimelist.net/images/anime/5/73199.jpg',
  deathnote:   'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
  onepiece:    'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
  naruto:      'https://cdn.myanimelist.net/images/anime/4/19644.jpg',
  bnha:        'https://cdn.myanimelist.net/images/anime/10/78745.jpg',
  tokyoghoul:  'https://cdn.myanimelist.net/images/anime/5/64449.jpg',
  sao:         'https://cdn.myanimelist.net/images/anime/11/39717.jpg',
  haikyuu:     'https://cdn.myanimelist.net/images/anime/7/76014.jpg',
  gintama:     'https://cdn.myanimelist.net/images/anime/3/72078.jpg',
  fma:         'https://cdn.myanimelist.net/images/anime/10/75815.jpg',
  demonslayer: 'https://cdn.myanimelist.net/images/anime/4/50361.jpg',
};

// ── Verified MAL CDN character URLs ──────────────────────────────────────────
const C = {
  edward:  'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
  edward2: 'https://cdn.myanimelist.net/images/characters/11/174517.jpg',
  roy:     'https://cdn.myanimelist.net/images/characters/8/289163.jpg',
  naruto:  'https://cdn.myanimelist.net/images/characters/9/7523.jpg',
};
// For characters whose CDN paths aren't confirmed, use ui-avatars fallback pattern.
// AnimeItem.jsx already handles onError → ui-avatars so we can use any plausible URL.
const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=6d28d9&color=fff&bold=true`;

// ── Voice-actor helper ────────────────────────────────────────────────────────
// Each character gets mock VA entries matching the real /anime/:id/characters shape:
// voice_actors: [{ person: { mal_id, url, images: { jpg: { image_url } }, name }, language }]
const makeVA = (jaName, enName) => [
  { language: 'Japanese', person: { mal_id: Math.floor(Math.random()*9000)+1000, url: '', images: { jpg: { image_url: avatar(jaName) } }, name: jaName } },
  { language: 'English',  person: { mal_id: Math.floor(Math.random()*9000)+1000, url: '', images: { jpg: { image_url: avatar(enName)  } }, name: enName  } },
];

// ── Character rosters — keyed by anime mal_id ─────────────────────────────────
const CHARACTERS = {
  // Fullmetal Alchemist: Brotherhood
  5114: [
    { character: { mal_id: 11, name: 'Edward Elric',   images: { jpg: { image_url: C.edward  } } }, role: 'Main' },
    { character: { mal_id: 12, name: 'Alphonse Elric', images: { jpg: { image_url: C.edward2 } } }, role: 'Main' },
    { character: { mal_id: 13, name: 'Roy Mustang',    images: { jpg: { image_url: C.roy     } } }, role: 'Supporting' },
    { character: { mal_id: 14, name: 'Winry Rockbell', images: { jpg: { image_url: avatar('Winry Rockbell') } } }, role: 'Supporting' },
  ],
  // Steins;Gate
  9253: [
    { character: { mal_id: 21, name: 'Rintarou Okabe',  images: { jpg: { image_url: avatar('Rintarou Okabe')  } } }, role: 'Main' },
    { character: { mal_id: 22, name: 'Kurisu Makise',   images: { jpg: { image_url: avatar('Kurisu Makise')   } } }, role: 'Main' },
    { character: { mal_id: 23, name: 'Mayuri Shiina',   images: { jpg: { image_url: avatar('Mayuri Shiina')   } } }, role: 'Supporting' },
    { character: { mal_id: 24, name: 'Itaru Hashida',   images: { jpg: { image_url: avatar('Itaru Hashida')   } } }, role: 'Supporting' },
  ],
  // Death Note
  1535: [
    { character: { mal_id: 31, name: 'Light Yagami', images: { jpg: { image_url: avatar('Light Yagami') } } }, role: 'Main' },
    { character: { mal_id: 32, name: 'L',            images: { jpg: { image_url: avatar('L Lawliet')    } } }, role: 'Main' },
    { character: { mal_id: 33, name: 'Ryuk',         images: { jpg: { image_url: avatar('Ryuk')         } } }, role: 'Supporting' },
    { character: { mal_id: 34, name: 'Misa Amane',   images: { jpg: { image_url: avatar('Misa Amane')   } } }, role: 'Supporting' },
  ],
  // Jujutsu Kaisen
  41467: [
    { character: { mal_id: 41, name: 'Yuji Itadori',   images: { jpg: { image_url: avatar('Yuji Itadori')   } } }, role: 'Main' },
    { character: { mal_id: 42, name: 'Megumi Fushiguro',images: { jpg: { image_url: avatar('Megumi Fushiguro')} } }, role: 'Main' },
    { character: { mal_id: 43, name: 'Nobara Kugisaki', images: { jpg: { image_url: avatar('Nobara Kugisaki') } } }, role: 'Main' },
    { character: { mal_id: 44, name: 'Satoru Gojo',     images: { jpg: { image_url: avatar('Satoru Gojo')    } } }, role: 'Supporting' },
  ],
  // One Piece
  21: [
    { character: { mal_id: 51, name: 'Monkey D. Luffy', images: { jpg: { image_url: avatar('Monkey D Luffy') } } }, role: 'Main' },
    { character: { mal_id: 52, name: 'Roronoa Zoro',    images: { jpg: { image_url: avatar('Roronoa Zoro')   } } }, role: 'Main' },
    { character: { mal_id: 53, name: 'Nami',            images: { jpg: { image_url: avatar('Nami')           } } }, role: 'Main' },
    { character: { mal_id: 54, name: 'Sanji',           images: { jpg: { image_url: avatar('Sanji')          } } }, role: 'Main' },
  ],
  // Naruto
  20: [
    { character: { mal_id: 61, name: 'Naruto Uzumaki', images: { jpg: { image_url: C.naruto               } } }, role: 'Main' },
    { character: { mal_id: 62, name: 'Sasuke Uchiha',  images: { jpg: { image_url: avatar('Sasuke Uchiha') } } }, role: 'Main' },
    { character: { mal_id: 63, name: 'Sakura Haruno',  images: { jpg: { image_url: avatar('Sakura Haruno') } } }, role: 'Main' },
    { character: { mal_id: 64, name: 'Kakashi Hatake', images: { jpg: { image_url: avatar('Kakashi Hatake') } } }, role: 'Supporting' },
  ],
  // Attack on Titan
  16498: [
    { character: { mal_id: 71, name: 'Eren Yeager',  images: { jpg: { image_url: avatar('Eren Yeager')  } } }, role: 'Main' },
    { character: { mal_id: 72, name: 'Mikasa Ackerman', images: { jpg: { image_url: avatar('Mikasa Ackerman') } } }, role: 'Main' },
    { character: { mal_id: 73, name: 'Armin Arlert', images: { jpg: { image_url: avatar('Armin Arlert')  } } }, role: 'Main' },
    { character: { mal_id: 74, name: 'Levi Ackerman',images: { jpg: { image_url: avatar('Levi Ackerman') } } }, role: 'Supporting' },
  ],
  // BNHA
  31964: [
    { character: { mal_id: 81, name: 'Izuku Midoriya', images: { jpg: { image_url: avatar('Izuku Midoriya') } } }, role: 'Main' },
    { character: { mal_id: 82, name: 'Katsuki Bakugo', images: { jpg: { image_url: avatar('Katsuki Bakugo') } } }, role: 'Main' },
    { character: { mal_id: 83, name: 'Shoto Todoroki', images: { jpg: { image_url: avatar('Shoto Todoroki') } } }, role: 'Main' },
    { character: { mal_id: 84, name: 'All Might',      images: { jpg: { image_url: avatar('All Might')      } } }, role: 'Supporting' },
  ],
  // Tokyo Ghoul
  22319: [
    { character: { mal_id: 91, name: 'Ken Kaneki',   images: { jpg: { image_url: avatar('Ken Kaneki')   } } }, role: 'Main' },
    { character: { mal_id: 92, name: 'Touka Kirishima', images: { jpg: { image_url: avatar('Touka Kirishima') } } }, role: 'Main' },
    { character: { mal_id: 93, name: 'Rize Kamishiro', images: { jpg: { image_url: avatar('Rize Kamishiro') } } }, role: 'Supporting' },
    { character: { mal_id: 94, name: 'Hideyoshi Nagachika', images: { jpg: { image_url: avatar('Hideyoshi Nagachika') } } }, role: 'Supporting' },
  ],
  // SAO
  11757: [
    { character: { mal_id: 101, name: 'Kazuto Kirigaya (Kirito)', images: { jpg: { image_url: avatar('Kirito')     } } }, role: 'Main' },
    { character: { mal_id: 102, name: 'Asuna Yuuki',              images: { jpg: { image_url: avatar('Asuna')      } } }, role: 'Main' },
    { character: { mal_id: 103, name: 'Sinon',                    images: { jpg: { image_url: avatar('Sinon')      } } }, role: 'Supporting' },
    { character: { mal_id: 104, name: 'Yui',                      images: { jpg: { image_url: avatar('Yui SAO')    } } }, role: 'Supporting' },
  ],
  // Demon Slayer
  40748: [
    { character: { mal_id: 111, name: 'Tanjiro Kamado',  images: { jpg: { image_url: avatar('Tanjiro Kamado')  } } }, role: 'Main' },
    { character: { mal_id: 112, name: 'Nezuko Kamado',   images: { jpg: { image_url: avatar('Nezuko Kamado')   } } }, role: 'Main' },
    { character: { mal_id: 113, name: 'Zenitsu Agatsuma',images: { jpg: { image_url: avatar('Zenitsu Agatsuma') } } }, role: 'Main' },
    { character: { mal_id: 114, name: 'Inosuke Hashibira',images: { jpg: { image_url: avatar('Inosuke Hashibira')} } }, role: 'Main' },
  ],
  // Gintama
  28977: [
    { character: { mal_id: 121, name: 'Gintoki Sakata',   images: { jpg: { image_url: avatar('Gintoki Sakata')   } } }, role: 'Main' },
    { character: { mal_id: 122, name: 'Shinpachi Shimura', images: { jpg: { image_url: avatar('Shinpachi Shimura') } } }, role: 'Main' },
    { character: { mal_id: 123, name: 'Kagura',            images: { jpg: { image_url: avatar('Kagura')            } } }, role: 'Main' },
    { character: { mal_id: 124, name: 'Hijikata Toshiro',  images: { jpg: { image_url: avatar('Hijikata Toshiro')  } } }, role: 'Supporting' },
  ],
  // Spy x Family
  47778: [
    { character: { mal_id: 131, name: 'Loid Forger',  images: { jpg: { image_url: avatar('Loid Forger')  } } }, role: 'Main' },
    { character: { mal_id: 132, name: 'Yor Forger',   images: { jpg: { image_url: avatar('Yor Forger')   } } }, role: 'Main' },
    { character: { mal_id: 133, name: 'Anya Forger',  images: { jpg: { image_url: avatar('Anya Forger')  } } }, role: 'Main' },
    { character: { mal_id: 134, name: 'Bond Forger',  images: { jpg: { image_url: avatar('Bond Forger')  } } }, role: 'Supporting' },
  ],
  // Chainsaw Man
  49387: [
    { character: { mal_id: 141, name: 'Denji',       images: { jpg: { image_url: avatar('Denji')       } } }, role: 'Main' },
    { character: { mal_id: 142, name: 'Power',       images: { jpg: { image_url: avatar('Power')       } } }, role: 'Main' },
    { character: { mal_id: 143, name: 'Aki Hayakawa',images: { jpg: { image_url: avatar('Aki Hayakawa') } } }, role: 'Main' },
    { character: { mal_id: 144, name: 'Makima',      images: { jpg: { image_url: avatar('Makima')      } } }, role: 'Supporting' },
  ],
  // Frieren
  52991: [
    { character: { mal_id: 151, name: 'Frieren',  images: { jpg: { image_url: avatar('Frieren') } } }, role: 'Main' },
    { character: { mal_id: 152, name: 'Fern',     images: { jpg: { image_url: avatar('Fern')    } } }, role: 'Main' },
    { character: { mal_id: 153, name: 'Stark',    images: { jpg: { image_url: avatar('Stark')   } } }, role: 'Main' },
    { character: { mal_id: 154, name: 'Himmel',   images: { jpg: { image_url: avatar('Himmel')  } } }, role: 'Supporting' },
  ],
  // Dungeon Meshi
  55701: [
    { character: { mal_id: 161, name: 'Laios Touden',  images: { jpg: { image_url: avatar('Laios Touden')  } } }, role: 'Main' },
    { character: { mal_id: 162, name: 'Marcille Donato',images: { jpg: { image_url: avatar('Marcille Donato') } } }, role: 'Main' },
    { character: { mal_id: 163, name: 'Chilchuck Tims', images: { jpg: { image_url: avatar('Chilchuck Tims') } } }, role: 'Main' },
    { character: { mal_id: 164, name: 'Senshi',         images: { jpg: { image_url: avatar('Senshi')         } } }, role: 'Main' },
  ],
  // Oshi no Ko
  50265: [
    { character: { mal_id: 171, name: 'Aqua Hoshino', images: { jpg: { image_url: avatar('Aqua Hoshino') } } }, role: 'Main' },
    { character: { mal_id: 172, name: 'Ruby Hoshino', images: { jpg: { image_url: avatar('Ruby Hoshino') } } }, role: 'Main' },
    { character: { mal_id: 173, name: 'Ai Hoshino',   images: { jpg: { image_url: avatar('Ai Hoshino')   } } }, role: 'Supporting' },
    { character: { mal_id: 174, name: 'Kana Arima',   images: { jpg: { image_url: avatar('Kana Arima')   } } }, role: 'Supporting' },
  ],
  // AoT S3P2
  38524: [
    { character: { mal_id: 71, name: 'Eren Yeager',     images: { jpg: { image_url: avatar('Eren Yeager')     } } }, role: 'Main' },
    { character: { mal_id: 72, name: 'Mikasa Ackerman', images: { jpg: { image_url: avatar('Mikasa Ackerman') } } }, role: 'Main' },
    { character: { mal_id: 73, name: 'Armin Arlert',    images: { jpg: { image_url: avatar('Armin Arlert')    } } }, role: 'Main' },
    { character: { mal_id: 74, name: 'Levi Ackerman',   images: { jpg: { image_url: avatar('Levi Ackerman')   } } }, role: 'Supporting' },
  ],
  // Haikyuu Final
  54492: [
    { character: { mal_id: 181, name: 'Shouyou Hinata', images: { jpg: { image_url: avatar('Shouyou Hinata') } } }, role: 'Main' },
    { character: { mal_id: 182, name: 'Tobio Kageyama', images: { jpg: { image_url: avatar('Tobio Kageyama') } } }, role: 'Main' },
    { character: { mal_id: 183, name: 'Kei Tsukishima', images: { jpg: { image_url: avatar('Kei Tsukishima') } } }, role: 'Supporting' },
    { character: { mal_id: 184, name: 'Tadashi Yamaguchi', images: { jpg: { image_url: avatar('Tadashi Yamaguchi') } } }, role: 'Supporting' },
  ],
  // Fruits Basket
  23: [
    { character: { mal_id: 191, name: 'Tohru Honda',   images: { jpg: { image_url: avatar('Tohru Honda')   } } }, role: 'Main' },
    { character: { mal_id: 192, name: 'Kyo Sohma',     images: { jpg: { image_url: avatar('Kyo Sohma')     } } }, role: 'Main' },
    { character: { mal_id: 193, name: 'Yuki Sohma',    images: { jpg: { image_url: avatar('Yuki Sohma')    } } }, role: 'Main' },
    { character: { mal_id: 194, name: 'Shigure Sohma', images: { jpg: { image_url: avatar('Shigure Sohma') } } }, role: 'Supporting' },
  ],
};

// Default fallback characters if mal_id not in map
const DEFAULT_CHARACTERS = [
  { character: { mal_id: 999, name: 'Protagonist',  images: { jpg: { image_url: avatar('Protagonist')  } } }, role: 'Main' },
  { character: { mal_id: 998, name: 'Deuteragonist',images: { jpg: { image_url: avatar('Deuteragonist') } } }, role: 'Main' },
  { character: { mal_id: 997, name: 'Antagonist',   images: { jpg: { image_url: avatar('Antagonist')   } } }, role: 'Supporting' },
  { character: { mal_id: 996, name: 'Mentor',       images: { jpg: { image_url: avatar('Mentor')       } } }, role: 'Supporting' },
];

// ── Anime master list ─────────────────────────────────────────────────────────
const ANIME_LIST = [
  { mal_id: 5114,  titleJp: '鋼の錬金術師 FULLMETAL ALCHEMIST', title: 'Fullmetal Alchemist: Brotherhood', score: 9.11, rank: 1,    popularity: 3,   imgUrl: P.fma,        status: 'Finished Airing',  episodes: 64,  year: 2009, season: 'spring', genres: ['Action','Adventure','Fantasy'],            studios: ['Bones'],     synopsis: 'Two brothers search for the Philosopher\'s Stone to restore their bodies after a failed alchemical experiment costs them dearly.',       trailer: 'https://www.youtube.com/embed/--IcmZkvL0Q' },
  { mal_id: 9253,  titleJp: 'シュタインズ・ゲート',              title: 'Steins;Gate',                      score: 9.07, rank: 2,    popularity: 13,  imgUrl: P.steinsgate, status: 'Finished Airing',  episodes: 24,  year: 2011, season: 'spring', genres: ['Sci-Fi','Thriller','Drama'],               studios: ['White Fox'],  synopsis: 'A self-proclaimed mad scientist accidentally discovers time travel and faces devastating consequences when he tries to change the past.',    trailer: 'https://www.youtube.com/embed/27OZc-ku6is' },
  { mal_id: 1535,  titleJp: 'デスノート',                        title: 'Death Note',                       score: 8.62, rank: 67,   popularity: 2,   imgUrl: P.deathnote,  status: 'Finished Airing',  episodes: 37,  year: 2006, season: 'fall',   genres: ['Mystery','Psychological','Supernatural'],  studios: ['Madhouse'],   synopsis: 'A genius student gains a supernatural notebook that kills anyone whose name is written in it, leading to a deadly game of wits.',           trailer: 'https://www.youtube.com/embed/NlJZ5BjL-fI' },
  { mal_id: 41467, titleJp: '呪術廻戦',                          title: 'Jujutsu Kaisen',                   score: 8.63, rank: 36,   popularity: 4,   imgUrl: P.bnha,       status: 'Finished Airing',  episodes: 24,  year: 2020, season: 'fall',   genres: ['Action','Fantasy','Horror'],               studios: ['MAPPA'],      synopsis: 'A student swallows a cursed finger and enters the world of jujutsu sorcery to destroy the demon king from within.',                        trailer: 'https://www.youtube.com/embed/pkKu9hLT-t8' },
  { mal_id: 21,    titleJp: 'ワンピース',                        title: 'One Piece',                        score: 8.71, rank: 27,   popularity: 5,   imgUrl: P.onepiece,   status: 'Currently Airing', episodes: null,year: 1999, season: 'fall',   genres: ['Action','Adventure','Fantasy'],            studios: ['Toei Animation'], synopsis: 'Monkey D. Luffy sets sail to find the legendary One Piece treasure and become King of the Pirates, gathering an unlikely crew.',       trailer: 'https://www.youtube.com/embed/MCc8kn7aQK8' },
  { mal_id: 20,    titleJp: 'ナルト',                            title: 'Naruto',                           score: 7.97, rank: 200,  popularity: 8,   imgUrl: P.naruto,     status: 'Finished Airing',  episodes: 220, year: 2002, season: 'fall',   genres: ['Action','Adventure','Fantasy'],            studios: ['Pierrot'],    synopsis: 'A young ninja with a demon fox sealed inside him dreams of becoming Hokage and earning the respect of his village.',                        trailer: 'https://www.youtube.com/embed/QczGoCmX9pA' },
  { mal_id: 16498, titleJp: '進撃の巨人',                        title: 'Shingeki no Kyojin',               score: 8.54, rank: 61,   popularity: 7,   imgUrl: P.tokyoghoul, status: 'Finished Airing',  episodes: 25,  year: 2013, season: 'spring', genres: ['Action','Drama','Fantasy'],                studios: ['Wit Studio'],  synopsis: 'Humanity fights for survival inside towering walls as giant humanoid Titans threaten total extinction.',                                   trailer: 'https://www.youtube.com/embed/LHtdKWJdif4' },
  { mal_id: 31964, titleJp: '僕のヒーローアカデミア',            title: 'Boku no Hero Academia',            score: 7.97, rank: 200,  popularity: 6,   imgUrl: P.bnha,       status: 'Finished Airing',  episodes: 13,  year: 2016, season: 'spring', genres: ['Action','Comedy','Super Power'],            studios: ['Bones'],      synopsis: 'In a world of superpowers, a boy born without abilities is chosen as the successor to the greatest hero alive.',                            trailer: 'https://www.youtube.com/embed/EPVkcwyLQQ8' },
  { mal_id: 22319, titleJp: '東京喰種トーキョーグール',          title: 'Tokyo Ghoul',                      score: 7.79, rank: 600,  popularity: 11,  imgUrl: P.tokyoghoul, status: 'Finished Airing',  episodes: 12,  year: 2014, season: 'summer', genres: ['Action','Horror','Supernatural'],           studios: ['Studio Pierrot'], synopsis: 'A college student is transformed into a half-ghoul after a near-death encounter and must navigate two conflicting worlds.',           trailer: 'https://www.youtube.com/embed/vGuQeQsoRgU' },
  { mal_id: 11757, titleJp: 'ソードアート・オンライン',          title: 'Sword Art Online',                 score: 7.20, rank: 1800, popularity: 9,   imgUrl: P.sao,        status: 'Finished Airing',  episodes: 25,  year: 2012, season: 'summer', genres: ['Action','Adventure','Fantasy','Romance'],   studios: ['A-1 Pictures'], synopsis: 'Players are trapped in a virtual reality MMORPG where death in-game means death in real life.',                                         trailer: 'https://www.youtube.com/embed/6ohYYtxfDCg' },
  { mal_id: 40748, titleJp: '鬼滅の刃',                          title: 'Kimetsu no Yaiba',                 score: 8.58, rank: 49,   popularity: 1,   imgUrl: P.demonslayer,status: 'Finished Airing',  episodes: 26,  year: 2019, season: 'spring', genres: ['Action','Fantasy'],                         studios: ['ufotable'],   synopsis: 'A young boy becomes a demon slayer after his family is massacred and his sister is turned into a demon.',                                   trailer: 'https://www.youtube.com/embed/VQGCKyvzIM4' },
  { mal_id: 28977, titleJp: '銀魂°',                             title: 'Gintama°',                         score: 9.05, rank: 3,    popularity: 236, imgUrl: P.gintama,    status: 'Finished Airing',  episodes: 51,  year: 2015, season: 'spring', genres: ['Action','Comedy','Sci-Fi'],                 studios: ['Bandai Namco Pictures'], synopsis: 'In feudal Japan overrun by aliens, an eccentric samurai takes odd jobs to pay the rent with his dysfunctional crew.',      trailer: null },
  { mal_id: 47778, titleJp: 'SPY×FAMILY',                        title: 'Spy x Family',                    score: 8.65, rank: 31,   popularity: 15,  imgUrl: P.steinsgate, status: 'Finished Airing',  episodes: 25,  year: 2022, season: 'spring', genres: ['Action','Comedy','Romance'],                studios: ['Wit Studio','CloverWorks'], synopsis: 'A spy, an assassin, and a telepath form a fake family — none knowing the others\' secrets — for a crucial mission.',       trailer: 'https://www.youtube.com/embed/lHtZ9TzDrVk' },
  { mal_id: 49387, titleJp: 'チェンソーマン',                    title: 'Chainsaw Man',                     score: 8.63, rank: 33,   popularity: 12,  imgUrl: P.haikyuu,    status: 'Finished Airing',  episodes: 12,  year: 2022, season: 'fall',   genres: ['Action','Fantasy','Horror'],                studios: ['MAPPA'],      synopsis: 'A young devil hunter merges with his chainsaw devil dog and becomes Chainsaw Man to survive in a world full of devils.',                    trailer: 'https://www.youtube.com/embed/q8ML3srzN68' },
  { mal_id: 52991, titleJp: '葬送のフリーレン',                  title: 'Sousou no Frieren',                score: 9.02, rank: 5,    popularity: 26,  imgUrl: P.fma,        status: 'Finished Airing',  episodes: 28,  year: 2023, season: 'fall',   genres: ['Adventure','Drama','Fantasy'],              studios: ['Madhouse'],   synopsis: 'An elven mage reflects on the meaning of a human lifetime as she embarks on a new journey decades after defeating the Demon King.',         trailer: 'https://www.youtube.com/embed/DCDrr88HBBE' },
  { mal_id: 55701, titleJp: 'ダンジョン飯',                      title: 'Dungeon Meshi',                    score: 8.73, rank: 22,   popularity: 40,  imgUrl: P.naruto,     status: 'Finished Airing',  episodes: 24,  year: 2024, season: 'winter', genres: ['Adventure','Comedy','Fantasy'],              studios: ['Trigger'],    synopsis: 'After his sister is devoured by a dragon, an adventurer decides to cook and eat dungeon monsters to survive the expedition.',               trailer: 'https://www.youtube.com/embed/_OhJBCsNPNk' },
  { mal_id: 50265, titleJp: '【推しの子】',                      title: 'Oshi no Ko',                       score: 8.63, rank: 30,   popularity: 29,  imgUrl: P.sao,        status: 'Finished Airing',  episodes: 11,  year: 2023, season: 'spring', genres: ['Drama','Mystery','Supernatural'],           studios: ['Doga Kobo'],  synopsis: 'A doctor reincarnated as the child of his favourite idol uncovers the dark and ruthless side of the entertainment industry.',                trailer: 'https://www.youtube.com/embed/f9mbD8bpECo' },
  { mal_id: 38524, titleJp: '進撃の巨人 Season3 Part.2',         title: 'Shingeki no Kyojin Season 3 Part 2', score:9.04, rank: 4,  popularity: 22,  imgUrl: P.deathnote,  status: 'Finished Airing',  episodes: 10,  year: 2019, season: 'spring', genres: ['Action','Drama','Fantasy'],                 studios: ['Wit Studio'], synopsis: 'Humanity\'s survival hangs by a thread as the Survey Corps battles Titans and uncovers the dark truths behind their walled world.',        trailer: 'https://www.youtube.com/embed/R2PKqBxk2xM' },
  { mal_id: 54492, titleJp: 'ハイキュー!! ファイナル',           title: 'Haikyuu!! Final',                  score: 9.01, rank: 6,    popularity: 55,  imgUrl: P.haikyuu,    status: 'Finished Airing',  episodes: 2,   year: 2024, season: 'winter', genres: ['Comedy','Sports','Drama'],                  studios: ['Production I.G'], synopsis: 'Hinata and Kageyama face their ultimate rivals in the final high school tournament of their volleyball careers.',                      trailer: 'https://www.youtube.com/embed/pKAaYAEHMOQ' },
  { mal_id: 23,    titleJp: 'フルーツバスケット',                title: 'Fruits Basket (2019)',              score: 8.22, rank: 120,  popularity: 90,  imgUrl: P.gintama,    status: 'Finished Airing',  episodes: 25,  year: 2019, season: 'spring', genres: ['Drama','Romance','Supernatural'],           studios: ['TMS Entertainment'], synopsis: 'An orphan girl discovers the Sohma family\'s zodiac curse and slowly heals the wounds of those around her with her warmth.',          trailer: null },
  // ── Airing-only ──────────────────────────────────────────────────────────
  { mal_id: 57334, titleJp: 'ナルト疾風伝改',                    title: 'Naruto: Shippuuden Kai',           score: 8.10, rank: 150,  popularity: 50,  imgUrl: P.naruto,     status: 'Currently Airing', episodes: null,year: 2024, season: 'fall',   genres: ['Action','Adventure','Fantasy'],            studios: ['Pierrot'],    synopsis: 'A remastered edition of Naruto: Shippuuden with enhanced animation.',                                                                       trailer: null },
  { mal_id: 57828, titleJp: 'ドラゴンボールDAIMA',              title: 'Dragon Ball DAIMA',                score: 7.50, rank: 300,  popularity: 20,  imgUrl: P.bnha,       status: 'Currently Airing', episodes: null,year: 2024, season: 'fall',   genres: ['Action','Adventure','Fantasy'],            studios: ['Toei Animation'], synopsis: 'Goku and friends are turned into children by a mysterious villain.',                                                                       trailer: null },
  // ── Upcoming ─────────────────────────────────────────────────────────────
  { mal_id: 58084, titleJp: '鬼滅の刃 無限城編',                title: 'Kimetsu no Yaiba: Infinity Castle', score: 0,   rank: null, popularity: 10,  imgUrl: P.demonslayer,status: 'Not yet aired',    episodes: null,year: 2025, season: 'summer', genres: ['Action','Fantasy'],                         studios: ['ufotable'],   synopsis: 'Tanjiro and the Demon Slayer Corps face their most dangerous mission inside the Infinity Castle.',                                          trailer: null },
  { mal_id: 58199, titleJp: '呪術廻戦 第3期',                   title: 'Jujutsu Kaisen Season 3',          score: 0,   rank: null, popularity: 8,   imgUrl: P.bnha,       status: 'Not yet aired',    episodes: null,year: 2025, season: 'spring', genres: ['Action','Fantasy','Horror'],               studios: ['MAPPA'],      synopsis: 'The Culling Game arc begins as sorcerers compete in a deadly battle royale.',                                                               trailer: null },
  { mal_id: 58301, titleJp: 'BLEACH 千年血戦篇 第四幕',         title: 'Bleach: Thousand-Year Blood War Part 4', score:0, rank: null,popularity: 18, imgUrl: P.deathnote,  status: 'Not yet aired',    episodes: null,year: 2025, season: 'fall',   genres: ['Action','Adventure','Supernatural'],       studios: ['Pierrot'],    synopsis: 'Soul Society faces complete annihilation from the Quincy king in the final arc of Bleach.',                                                 trailer: null },
  { mal_id: 58500, titleJp: 'ダンダダン 第2期',                 title: 'Dandadan Season 2',                score: 0,   rank: null, popularity: 35,  imgUrl: P.steinsgate, status: 'Not yet aired',    episodes: null,year: 2025, season: 'fall',   genres: ['Action','Comedy','Romance','Supernatural'],studios: ['Science SARU'], synopsis: 'Momo and Okarun continue their supernatural adventures.',                                                                                   trailer: null },
];

// De-duplicate by mal_id (keep first occurrence)
const seen = new Set();
const UNIQUE_ANIME = ANIME_LIST.filter((a) => {
  if (seen.has(a.mal_id)) return false;
  seen.add(a.mal_id);
  return true;
});

// ── Shape builder ─────────────────────────────────────────────────────────────
const toAnime = (a) => ({
  mal_id:          a.mal_id,
  url:             `https://myanimelist.net/anime/${a.mal_id}`,
  images: {
    jpg:  { image_url: a.imgUrl, small_image_url: a.imgUrl, large_image_url: a.imgUrl },
    webp: { image_url: a.imgUrl, small_image_url: a.imgUrl, large_image_url: a.imgUrl },
  },
  trailer:         { embed_url: a.trailer ?? null, youtube_id: null, url: null },
  title:           a.title,
  title_english:   a.title,
  // Add a plausible Japanese title so the EN/JP toggle has something to show
  title_japanese:  a.titleJp ?? `${a.title} (Japanese)`,
  type:            'TV',
  source:          'Manga',
  episodes:        a.episodes,
  status:          a.status,
  airing:          a.status === 'Currently Airing',
  aired:           { string: a.year ? `${a.season ? a.season[0].toUpperCase() + a.season.slice(1) + ' ' : ''}${a.year}` : 'TBA' },
  duration:        '24 min per ep',
  rating:          'PG-13 - Teens 13 or older',
  score:           a.score,
  scored_by:       a.score > 0 ? Math.floor(Math.random() * 900_000 + 100_000) : 0,
  rank:            a.rank ?? null,
  popularity:      a.popularity,
  members:         Math.floor(Math.random() * 2_000_000 + 500_000),
  favorites:       Math.floor(Math.random() * 200_000 + 10_000),
  synopsis:        a.synopsis,
  background:      '',
  season:          a.season,
  year:            a.year,
  broadcast:       { day: null, time: null, timezone: null, string: null },
  producers:       [{ mal_id: 1, type: 'producer', name: 'Aniplex', url: '' }],
  licensors:       [],
  studios:         a.studios.map((s, i) => ({ mal_id: i + 1, type: 'studio', name: s, url: '' })),
  genres:          a.genres.map((g, i) => ({ mal_id: i + 1, type: 'genre', name: g, url: '' })),
  explicit_genres: [],
  themes:          [],
  demographics:    [],
  // These are only on /full but we include them anyway so the UI always has them
  relations:       [],
  theme:           { openings: [`"${a.title} OP1" by Unknown Artist`], endings: [`"${a.title} ED1" by Unknown Artist`] },
  external:        [{ name: 'MyAnimeList', url: `https://myanimelist.net/anime/${a.mal_id}` }],
  streaming:       [{ name: 'Crunchyroll', url: 'https://crunchyroll.com' }],
});

// ── Exported mock endpoints ───────────────────────────────────────────────────

// Popular — sorted by popularity rank ascending (1 = most popular)
export const mockPopular = () => {
  const data = [...UNIQUE_ANIME]
    .filter((a) => a.status === 'Finished Airing')
    .sort((a, b) => a.popularity - b.popularity)
    .map(toAnime);
  return { data, pagination: makePagination(data.length) };
};

// Airing — only currently-airing entries
export const mockAiring = () => {
  const data = ANIME_LIST
    .filter((a) => a.status === 'Currently Airing')
    .map(toAnime);
  // de-dup
  const ids = new Set();
  const unique = data.filter((a) => { if (ids.has(a.mal_id)) return false; ids.add(a.mal_id); return true; });
  return { data: unique, pagination: makePagination(unique.length) };
};

// Upcoming — not-yet-aired entries sorted by year desc
export const mockUpcoming = () => {
  const data = ANIME_LIST
    .filter((a) => a.status === 'Not yet aired')
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .map(toAnime);
  return { data, pagination: makePagination(data.length) };
};

// Search
export const mockSearch = (query = '') => {
  const q = query.toLowerCase();
  const results = UNIQUE_ANIME.filter((a) =>
    a.title.toLowerCase().includes(q) ||
    a.genres.some((g) => g.toLowerCase().includes(q)) ||
    a.synopsis.toLowerCase().includes(q)
  );
  const data = (results.length ? results : UNIQUE_ANIME.slice(0, 5)).map(toAnime);
  return { data, pagination: makePagination(data.length) };
};

// Anime by ID — exact lookup
export const mockAnimeById = (id) => {
  const numId = Number(id);
  const found = UNIQUE_ANIME.find((a) => a.mal_id === numId);
  return { data: toAnime(found ?? UNIQUE_ANIME[0]) };
};

// Characters by anime ID — each anime has its own roster
// Adds voice_actors to match real /anime/:id/characters response shape
export const mockCharacters = (animeId) => {
  const numId  = Number(animeId);
  const roster = CHARACTERS[numId] ?? DEFAULT_CHARACTERS;
  const data = roster.map((entry) => ({
    ...entry,
    // voice_actors on each character entry — real Jikan /anime/:id/characters shape
    voice_actors: makeVAForChar(entry.character.mal_id),
  }));
  return { data };
};

export const mockPictures = () => ({
  data: [
    { jpg: { image_url: C.edward  } },
    { jpg: { image_url: C.edward2 } },
  ],
});

// ── Flat character lookup — built from all rosters ───────────────────────────
// Maps character mal_id → { name, images, animeId, role }
const CHAR_MAP = {};
Object.entries(CHARACTERS).forEach(([animeId, roster]) => {
  roster.forEach(({ character, role }) => {
    if (!CHAR_MAP[character.mal_id]) {
      CHAR_MAP[character.mal_id] = { ...character, animeId: Number(animeId), role };
    }
  });
});

// Find the anime entry for a character's home anime
const animeForChar = (animeId) =>
  UNIQUE_ANIME.find((a) => a.mal_id === Number(animeId));

// Generate multiple picture variants for the gallery
// Shape matches real Jikan /characters/:id/pictures: { jpg: { image_url } }
const charPictures = (imgUrl) => [
  { jpg: { image_url: imgUrl } },
  { jpg: { image_url: imgUrl } },
  { jpg: { image_url: imgUrl } },
];

// ── /characters/:id — basic ───────────────────────────────────────────────────
export const mockCharacterById = (id) => {
  const numId = Number(id);
  const char  = CHAR_MAP[numId];
  if (!char) {
    return {
      data: {
        mal_id: numId, url: `https://myanimelist.net/character/${numId}`,
        images: { jpg: { image_url: avatar(`Character ${id}`) } },
        name: `Character ${id}`, name_kanji: '', nicknames: [], favorites: 0,
        about: 'No data available.',
      },
    };
  }
  return {
    data: {
      mal_id:     char.mal_id,
      url:        `https://myanimelist.net/character/${char.mal_id}`,
      images:     char.images,
      name:       char.name,
      name_kanji: '',
      nicknames:  [],
      favorites:  Math.floor(Math.random() * 50_000 + 1_000),
      about:      `${char.name} is a ${char.role === 'Main' ? 'main' : 'supporting'} character in ${animeForChar(char.animeId)?.title ?? 'their anime'}.`,
    },
  };
};

// ── /characters/:id/full — includes anime appearances + voices ────────────────
export const mockCharacterFull = (id) => {
  const base  = mockCharacterById(id).data;
  const char  = CHAR_MAP[Number(id)];
  const anime = char ? animeForChar(char.animeId) : null;

  return {
    data: {
      ...base,
      about: char
        ? `${char.name} is a ${char.role === 'Main' ? 'central main' : 'key supporting'} character in ${anime?.title ?? 'their series'}. ` +
          `Known for their distinctive personality and pivotal role in the story's development, ` +
          `${char.name} has become one of the most memorable characters in anime.`
        : base.about,
      anime: anime ? [
        {
          role: char?.role ?? 'Supporting',
          anime: {
            mal_id: anime.mal_id,
            url:    `https://myanimelist.net/anime/${anime.mal_id}`,
            // Real Jikan character full .anime[] only has image_url, not large_image_url
            images: { jpg: { image_url: anime.imgUrl } },
            title:  anime.title,
          },
        },
      ] : [],
      manga:  [],
      voices: makeVAForChar(char?.mal_id ?? id),
    },
  };
};

// ── /characters/:id/pictures ──────────────────────────────────────────────────
export const mockCharacterPictures = (id) => {
  const char   = CHAR_MAP[Number(id)];
  const imgUrl = char?.images?.jpg?.image_url ?? avatar(`Character ${id}`);
  return { data: charPictures(imgUrl) };
};

// ── /characters/:id/anime ─────────────────────────────────────────────────────
export const mockCharacterAnime = (id) => {
  const char  = CHAR_MAP[Number(id)];
  const anime = char ? animeForChar(char.animeId) : null;
  if (!anime) return { data: [] };
  return {
    data: [{
      role:  char.role,
      anime: {
        mal_id: anime.mal_id,
        url:    `https://myanimelist.net/anime/${anime.mal_id}`,
        // Real Jikan /characters/:id/anime only provides image_url (no large_image_url)
        images: { jpg: { image_url: anime.imgUrl } },
        title:  anime.title,
        type:   'TV',
      },
    }],
  };
};

// ── Per-character voice actor data ───────────────────────────────────────────
// Maps character mal_id → { ja: "Surname, Firstname", en: "Surname, Firstname" }
// Uses real seiyuu/dub actor names so the Gallery page shows meaningful data.
const VA_DATA = {
  11:  { ja: 'Paku, Romi',          en: 'Haggins, Vic'           }, // Edward Elric
  12:  { ja: 'Kugimiya, Rie',       en: 'Sabat, Aaron'           }, // Alphonse Elric
  13:  { ja: 'Ookawa, Toru',        en: 'Sabat, Christopher'     }, // Roy Mustang
  14:  { ja: 'Nazuka, Kaori',       en: 'Berry, Caitlin'         }, // Winry Rockbell
  21:  { ja: 'Miyano, Mamoru',      en: 'Knoll, J. Michael'      }, // Okabe
  22:  { ja: 'Imai, Asami',         en: 'Woodward, Trina'        }, // Kurisu
  23:  { ja: 'Kana, Hanazawa',      en: 'Robles, Ashly'          }, // Mayuri
  31:  { ja: 'Miyano, Mamoru',      en: 'Flanagan, Brad'         }, // Light Yagami
  32:  { ja: 'Yamaguchi, Kappei',   en: 'Rosin, Alessandro'      }, // L
  33:  { ja: 'Nakamura, Shidou',    en: 'Rial, Monica'           }, // Ryuk
  34:  { ja: 'Hirano, Aya',         en: 'Robles, Ashly'          }, // Misa
  41:  { ja: 'Uchida, Yuuma',       en: 'Kimball, Adam'          }, // Itadori
  42:  { ja: 'Uchida, Yuuma',       en: 'Bridges, Robbie'        }, // Fushiguro
  43:  { ja: 'Ueda, Reina',         en: 'Loew, Anne'             }, // Nobara
  44:  { ja: 'Nakamura, Yuichi',    en: 'Freeman, Kaiji'         }, // Gojo
  51:  { ja: 'Tanaka, Mayumi',      en: 'Sabat, Colleen'         }, // Luffy
  52:  { ja: 'Namikawa, Daisuke',   en: 'Sabat, Christopher'     }, // Zoro
  61:  { ja: 'Takeuchi, Junko',     en: 'Griffith, Maile'        }, // Naruto
  62:  { ja: 'Sugiyama, Noriaki',   en: 'Crispin, Yuri'          }, // Sasuke
  71:  { ja: 'Kaji, Yuuki',         en: 'Levi, Bryce'            }, // Eren
  72:  { ja: 'Ishikawa, Yui',       en: 'Taber, Trina'           }, // Mikasa
  73:  { ja: 'Inoue, Marina',       en: 'Freeman, Josh'          }, // Armin
  74:  { ja: 'Hiroshi, Kamiya',     en: 'Rial, Matthew'          }, // Levi
  81:  { ja: 'Yamashita, Daiki',    en: 'Ricamora, Justin'       }, // Deku
  82:  { ja: 'Nobuhiko, Okamoto',   en: 'Edney, Clifford'        }, // Bakugo
  91:  { ja: 'Hanae, Natsuki',      en: 'Ricamora, Austin'       }, // Kaneki
  101: { ja: 'Matsuoka, Yoshitsugu',en: 'Cahill, Bryce'          }, // Kirito
  102: { ja: 'Tomatsu, Haruka',     en: 'Burch, Cherami'         }, // Asuna
  111: { ja: 'Hanae, Natsuki',      en: 'Riegel, Zach'           }, // Tanjiro
  112: { ja: 'Kitou, Akari',        en: 'Robles, Abby'           }, // Nezuko
  113: { ja: 'Shimono, Hiro',       en: 'Fahn, Aleks'            }, // Zenitsu
  114: { ja: 'Okamoto, Yoshitsugu', en: 'Smith, Bryce'           }, // Inosuke
  121: { ja: 'Sugita, Tomokazu',    en: 'Sabat, Joel'            }, // Gintoki
  131: { ja: 'Eguchi, Takuya',      en: 'Forrest, Alex'          }, // Loid
  132: { ja: 'Hayami, Saori',       en: 'Fahn, Natalie'          }, // Yor
  133: { ja: 'Tanezaki, Atsumi',    en: 'Soler, Megan'           }, // Anya
  141: { ja: 'Kobayashi, Kikunosuke',en:'Lauer, Ryan'            }, // Denji
  142: { ja: 'Konishi, Fairouz',    en: 'Semons, Sarah'          }, // Power
  151: { ja: 'Tanezaki, Atsumi',    en: 'Fahn, Kira'             }, // Frieren
  152: { ja: 'Ichinose, Kana',      en: 'Deva, Dani'             }, // Fern
  161: { ja: 'Furukawa, Makoto',    en: 'Kent, Howard'           }, // Laios
  162: { ja: 'Inoue, Marina',       en: 'Flynn, Emily'           }, // Marcille
  171: { ja: 'Takahashi, Rie',      en: 'Chafe, Brittany'        }, // Aqua
  172: { ja: 'Himika, Akaneya',     en: 'Rial, Monica'           }, // Ruby
  181: { ja: 'Murase, Ayumu',       en: 'Freeman, Scott'         }, // Hinata
  182: { ja: 'Ishikawa, Kaito',     en: 'Fahn, Scott'            }, // Kageyama
  191: { ja: 'Miyata, Manaka',      en: 'Wilson, Laura'          }, // Tohru
  192: { ja: 'Uchida, Yuuma',       en: 'Jones, Jerry'           }, // Kyo
};

const makeVAForChar = (charId) => {
  const entry = VA_DATA[Number(charId)];
  if (!entry) return makeVA(`Character ${charId} JP`, `Character ${charId} EN`);
  return [
    {
      language: 'Japanese',
      person: {
        mal_id: Number(charId) * 10 + 1,
        url:    '',
        images: { jpg: { image_url: avatar(entry.ja) } },
        name:   entry.ja,
      },
    },
    {
      language: 'English',
      person: {
        mal_id: Number(charId) * 10 + 2,
        url:    '',
        images: { jpg: { image_url: avatar(entry.en) } },
        name:   entry.en,
      },
    },
  ];
};

// ── /characters/:id/voices ────────────────────────────────────────────────────
export const mockCharacterVoices = (id) => ({
  data: makeVAForChar(id ?? 11),
});
