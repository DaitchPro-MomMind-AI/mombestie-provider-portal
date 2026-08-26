import { useState } from 'react'
import type { Screen } from '../App'
import FlagIcon from '../components/FlagIcon'

interface Props {
  navigate: (s: Screen) => void
  country: string
  countryCode: string
  /** MBPRV-44: reports which language was picked and whether it's a real
   * RTL language, so the app can actually apply an RTL layout -- previously
   * this selection was made and then discarded, with no onSelect at all. */
  onSelect: (languageCode: string, rtl: boolean) => void
}

// Real per-country official/native language data. Previously only 13 of the
// 150+ countries offered in CountrySelect had an entry here -- everything
// else silently fell back to "English / English" with no explanation,
// which is what the user saw and flagged for Italy. Expanded to cover every
// country code CountrySelect actually offers. English is always included
// alongside the native language(s) except where English already is the
// official language, or where local convention doesn't commonly pair it
// (e.g. Russian, Brazilian Portuguese, most Latin American Spanish).
const COUNTRY_LANGUAGES: Record<string, { code: string; name: string; native: string; rtl?: boolean }[]> = {
  BD: [{ code: 'bn', name: 'Bengali', native: 'বাংলা' }, { code: 'en', name: 'English', native: 'English' }],
  US: [{ code: 'en', name: 'English', native: 'English' }, { code: 'es', name: 'Spanish', native: 'Español' }],
  GB: [{ code: 'en', name: 'English', native: 'English' }],
  CA: [{ code: 'en', name: 'English', native: 'English' }, { code: 'fr', name: 'French', native: 'Français' }],
  AU: [{ code: 'en', name: 'English', native: 'English' }],
  IN: [{ code: 'hi', name: 'Hindi', native: 'हिन्दी' }, { code: 'en', name: 'English', native: 'English' }],
  PK: [{ code: 'ur', name: 'Urdu', native: 'اردو', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  AE: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  SA: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  QA: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  JP: [{ code: 'ja', name: 'Japanese', native: '日本語' }],
  KR: [{ code: 'ko', name: 'Korean', native: '한국어' }, { code: 'en', name: 'English', native: 'English' }],
  SG: [{ code: 'en', name: 'English', native: 'English' }, { code: 'zh', name: 'Mandarin Chinese', native: '中文' }],
  MY: [{ code: 'ms', name: 'Malay', native: 'Bahasa Melayu' }, { code: 'en', name: 'English', native: 'English' }],
  ID: [{ code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' }, { code: 'en', name: 'English', native: 'English' }],
  PH: [{ code: 'fil', name: 'Filipino', native: 'Filipino' }, { code: 'en', name: 'English', native: 'English' }],
  DE: [{ code: 'de', name: 'German', native: 'Deutsch' }, { code: 'en', name: 'English', native: 'English' }],
  FR: [{ code: 'fr', name: 'French', native: 'Français' }, { code: 'en', name: 'English', native: 'English' }],
  ES: [{ code: 'es', name: 'Spanish', native: 'Español' }, { code: 'en', name: 'English', native: 'English' }],
  IT: [{ code: 'it', name: 'Italian', native: 'Italiano' }, { code: 'en', name: 'English', native: 'English' }],
  NL: [{ code: 'nl', name: 'Dutch', native: 'Nederlands' }, { code: 'en', name: 'English', native: 'English' }],
  BE: [{ code: 'nl', name: 'Dutch', native: 'Nederlands' }, { code: 'fr', name: 'French', native: 'Français' }],
  SE: [{ code: 'sv', name: 'Swedish', native: 'Svenska' }, { code: 'en', name: 'English', native: 'English' }],
  NO: [{ code: 'no', name: 'Norwegian', native: 'Norsk' }, { code: 'en', name: 'English', native: 'English' }],
  DK: [{ code: 'da', name: 'Danish', native: 'Dansk' }, { code: 'en', name: 'English', native: 'English' }],
  FI: [{ code: 'fi', name: 'Finnish', native: 'Suomi' }, { code: 'sv', name: 'Swedish', native: 'Svenska' }],
  CH: [{ code: 'de', name: 'German', native: 'Deutsch' }, { code: 'fr', name: 'French', native: 'Français' }],
  AT: [{ code: 'de', name: 'German', native: 'Deutsch' }, { code: 'en', name: 'English', native: 'English' }],
  IE: [{ code: 'en', name: 'English', native: 'English' }, { code: 'ga', name: 'Irish', native: 'Gaeilge' }],
  PT: [{ code: 'pt', name: 'Portuguese', native: 'Português' }, { code: 'en', name: 'English', native: 'English' }],
  PL: [{ code: 'pl', name: 'Polish', native: 'Polski' }, { code: 'en', name: 'English', native: 'English' }],
  GR: [{ code: 'el', name: 'Greek', native: 'Ελληνικά' }, { code: 'en', name: 'English', native: 'English' }],
  TR: [{ code: 'tr', name: 'Turkish', native: 'Türkçe' }, { code: 'en', name: 'English', native: 'English' }],
  ZA: [{ code: 'en', name: 'English', native: 'English' }, { code: 'zu', name: 'Zulu', native: 'isiZulu' }],
  NG: [{ code: 'en', name: 'English', native: 'English' }, { code: 'ha', name: 'Hausa', native: 'Hausa' }],
  KE: [{ code: 'sw', name: 'Swahili', native: 'Kiswahili' }, { code: 'en', name: 'English', native: 'English' }],
  EG: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  MA: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'fr', name: 'French', native: 'Français' }],
  BR: [{ code: 'pt', name: 'Portuguese', native: 'Português' }],
  MX: [{ code: 'es', name: 'Spanish', native: 'Español' }, { code: 'en', name: 'English', native: 'English' }],
  AR: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  CL: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  CO: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  CZ: [{ code: 'cs', name: 'Czech', native: 'Čeština' }, { code: 'en', name: 'English', native: 'English' }],
  RO: [{ code: 'ro', name: 'Romanian', native: 'Română' }, { code: 'en', name: 'English', native: 'English' }],
  HU: [{ code: 'hu', name: 'Hungarian', native: 'Magyar' }, { code: 'en', name: 'English', native: 'English' }],
  UA: [{ code: 'uk', name: 'Ukrainian', native: 'Українська' }, { code: 'en', name: 'English', native: 'English' }],
  RU: [{ code: 'ru', name: 'Russian', native: 'Русский' }],
  IL: [{ code: 'he', name: 'Hebrew', native: 'עברית', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  JO: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  KW: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  BH: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  OM: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  LB: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'fr', name: 'French', native: 'Français' }],
  IQ: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'ku', name: 'Kurdish', native: 'کوردی', rtl: true }],
  IR: [{ code: 'fa', name: 'Persian', native: 'فارسی', rtl: true }],
  NP: [{ code: 'ne', name: 'Nepali', native: 'नेपाली' }, { code: 'en', name: 'English', native: 'English' }],
  LK: [{ code: 'si', name: 'Sinhala', native: 'සිංහල' }, { code: 'ta', name: 'Tamil', native: 'தமிழ்' }],
  MV: [{ code: 'dv', name: 'Dhivehi', native: 'ދިވެހި', rtl: true }],
  BT: [{ code: 'dz', name: 'Dzongkha', native: 'རྫོང་ཁ' }, { code: 'en', name: 'English', native: 'English' }],
  MM: [{ code: 'my', name: 'Burmese', native: 'မြန်မာဘာသာ' }],
  TH: [{ code: 'th', name: 'Thai', native: 'ไทย' }, { code: 'en', name: 'English', native: 'English' }],
  VN: [{ code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' }],
  KH: [{ code: 'km', name: 'Khmer', native: 'ខ្មែរ' }],
  LA: [{ code: 'lo', name: 'Lao', native: 'ລາວ' }],
  BN: [{ code: 'ms', name: 'Malay', native: 'Bahasa Melayu' }, { code: 'en', name: 'English', native: 'English' }],
  TL: [{ code: 'pt', name: 'Portuguese', native: 'Português' }, { code: 'tet', name: 'Tetum', native: 'Tetun' }],
  NZ: [{ code: 'en', name: 'English', native: 'English' }, { code: 'mi', name: 'Māori', native: 'Māori' }],
  PG: [{ code: 'en', name: 'English', native: 'English' }, { code: 'tpi', name: 'Tok Pisin', native: 'Tok Pisin' }],
  FJ: [{ code: 'en', name: 'English', native: 'English' }, { code: 'fj', name: 'Fijian', native: 'Vosa Vakaviti' }],
  TZ: [{ code: 'sw', name: 'Swahili', native: 'Kiswahili' }, { code: 'en', name: 'English', native: 'English' }],
  UG: [{ code: 'en', name: 'English', native: 'English' }, { code: 'sw', name: 'Swahili', native: 'Kiswahili' }],
  RW: [{ code: 'rw', name: 'Kinyarwanda', native: 'Ikinyarwanda' }, { code: 'en', name: 'English', native: 'English' }],
  ET: [{ code: 'am', name: 'Amharic', native: 'አማርኛ' }, { code: 'en', name: 'English', native: 'English' }],
  GH: [{ code: 'en', name: 'English', native: 'English' }, { code: 'ak', name: 'Twi', native: 'Twi' }],
  SN: [{ code: 'fr', name: 'French', native: 'Français' }, { code: 'wo', name: 'Wolof', native: 'Wolof' }],
  CI: [{ code: 'fr', name: 'French', native: 'Français' }],
  CM: [{ code: 'fr', name: 'French', native: 'Français' }, { code: 'en', name: 'English', native: 'English' }],
  TN: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'fr', name: 'French', native: 'Français' }],
  LY: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }],
  DZ: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'fr', name: 'French', native: 'Français' }],
  SD: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  SO: [{ code: 'so', name: 'Somali', native: 'Soomaali' }, { code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }],
  ZM: [{ code: 'en', name: 'English', native: 'English' }, { code: 'bem', name: 'Bemba', native: 'Bemba' }],
  ZW: [{ code: 'en', name: 'English', native: 'English' }, { code: 'sn', name: 'Shona', native: 'chiShona' }],
  BW: [{ code: 'en', name: 'English', native: 'English' }, { code: 'tn', name: 'Setswana', native: 'Setswana' }],
  MZ: [{ code: 'pt', name: 'Portuguese', native: 'Português' }],
  MG: [{ code: 'mg', name: 'Malagasy', native: 'Malagasy' }, { code: 'fr', name: 'French', native: 'Français' }],
  MU: [{ code: 'en', name: 'English', native: 'English' }, { code: 'fr', name: 'French', native: 'Français' }],
  SC: [{ code: 'en', name: 'English', native: 'English' }, { code: 'fr', name: 'French', native: 'Français' }],
  UY: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  PE: [{ code: 'es', name: 'Spanish', native: 'Español' }, { code: 'qu', name: 'Quechua', native: 'Runasimi' }],
  VE: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  EC: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  BO: [{ code: 'es', name: 'Spanish', native: 'Español' }, { code: 'qu', name: 'Quechua', native: 'Runasimi' }],
  PY: [{ code: 'es', name: 'Spanish', native: 'Español' }, { code: 'gn', name: 'Guaraní', native: "Avañe'ẽ" }],
  GY: [{ code: 'en', name: 'English', native: 'English' }],
  SR: [{ code: 'nl', name: 'Dutch', native: 'Nederlands' }],
  BB: [{ code: 'en', name: 'English', native: 'English' }],
  JM: [{ code: 'en', name: 'English', native: 'English' }],
  TT: [{ code: 'en', name: 'English', native: 'English' }],
  BS: [{ code: 'en', name: 'English', native: 'English' }],
  CR: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  PA: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  GT: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  HN: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  SV: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  NI: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  DO: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  CU: [{ code: 'es', name: 'Spanish', native: 'Español' }],
  HT: [{ code: 'fr', name: 'French', native: 'Français' }, { code: 'ht', name: 'Haitian Creole', native: 'Kreyòl Ayisyen' }],
  IS: [{ code: 'is', name: 'Icelandic', native: 'Íslenska' }, { code: 'en', name: 'English', native: 'English' }],
  LU: [{ code: 'lb', name: 'Luxembourgish', native: 'Lëtzebuergesch' }, { code: 'fr', name: 'French', native: 'Français' }],
  MT: [{ code: 'mt', name: 'Maltese', native: 'Malti' }, { code: 'en', name: 'English', native: 'English' }],
  CY: [{ code: 'el', name: 'Greek', native: 'Ελληνικά' }, { code: 'en', name: 'English', native: 'English' }],
  SK: [{ code: 'sk', name: 'Slovak', native: 'Slovenčina' }, { code: 'en', name: 'English', native: 'English' }],
  SI: [{ code: 'sl', name: 'Slovene', native: 'Slovenščina' }, { code: 'en', name: 'English', native: 'English' }],
  HR: [{ code: 'hr', name: 'Croatian', native: 'Hrvatski' }, { code: 'en', name: 'English', native: 'English' }],
  BA: [{ code: 'bs', name: 'Bosnian', native: 'Bosanski' }, { code: 'en', name: 'English', native: 'English' }],
  RS: [{ code: 'sr', name: 'Serbian', native: 'Српски' }, { code: 'en', name: 'English', native: 'English' }],
  MK: [{ code: 'mk', name: 'Macedonian', native: 'Македонски' }, { code: 'en', name: 'English', native: 'English' }],
  AL: [{ code: 'sq', name: 'Albanian', native: 'Shqip' }, { code: 'en', name: 'English', native: 'English' }],
  XK: [{ code: 'sq', name: 'Albanian', native: 'Shqip' }, { code: 'sr', name: 'Serbian', native: 'Српски' }],
  ME: [{ code: 'cnr', name: 'Montenegrin', native: 'Crnogorski' }, { code: 'en', name: 'English', native: 'English' }],
  BG: [{ code: 'bg', name: 'Bulgarian', native: 'Български' }, { code: 'en', name: 'English', native: 'English' }],
  MD: [{ code: 'ro', name: 'Romanian', native: 'Română' }, { code: 'ru', name: 'Russian', native: 'Русский' }],
  BY: [{ code: 'be', name: 'Belarusian', native: 'Беларуская' }, { code: 'ru', name: 'Russian', native: 'Русский' }],
  LT: [{ code: 'lt', name: 'Lithuanian', native: 'Lietuvių' }, { code: 'en', name: 'English', native: 'English' }],
  LV: [{ code: 'lv', name: 'Latvian', native: 'Latviešu' }, { code: 'en', name: 'English', native: 'English' }],
  EE: [{ code: 'et', name: 'Estonian', native: 'Eesti' }, { code: 'en', name: 'English', native: 'English' }],
  KZ: [{ code: 'kk', name: 'Kazakh', native: 'Қазақша' }, { code: 'ru', name: 'Russian', native: 'Русский' }],
  UZ: [{ code: 'uz', name: 'Uzbek', native: 'Oʻzbekcha' }, { code: 'ru', name: 'Russian', native: 'Русский' }],
  AZ: [{ code: 'az', name: 'Azerbaijani', native: 'Azərbaycan' }, { code: 'ru', name: 'Russian', native: 'Русский' }],
  GE: [{ code: 'ka', name: 'Georgian', native: 'ქართული' }, { code: 'en', name: 'English', native: 'English' }],
  AM: [{ code: 'hy', name: 'Armenian', native: 'Հայերեն' }, { code: 'ru', name: 'Russian', native: 'Русский' }],
  TM: [{ code: 'tk', name: 'Turkmen', native: 'Türkmençe' }, { code: 'ru', name: 'Russian', native: 'Русский' }],
  KG: [{ code: 'ky', name: 'Kyrgyz', native: 'Кыргызча' }, { code: 'ru', name: 'Russian', native: 'Русский' }],
  TJ: [{ code: 'tg', name: 'Tajik', native: 'Тоҷикӣ' }, { code: 'ru', name: 'Russian', native: 'Русский' }],
  AF: [{ code: 'ps', name: 'Pashto', native: 'پښتو', rtl: true }, { code: 'fa', name: 'Dari', native: 'دری', rtl: true }],
  YE: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }],
  SY: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }],
  PS: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  DEFAULT: [{ code: 'en', name: 'English', native: 'English' }],
}

// A well-known symbolic landmark per country, shown beside the flag so the
// country-confirmation chip feels concrete rather than a bare code. The
// emoji is decorative (Unicode has no dedicated glyph for most of these,
// e.g. no pyramid emoji) -- the landmark `name` text is always the real,
// accurate answer regardless of which emoji stands in for it.
const LANDMARKS: Record<string, { emoji: string; name: string }> = {
  BD: { emoji: '🏛️', name: 'Ahsan Manzil' }, US: { emoji: '🗽', name: 'Statue of Liberty' },
  GB: { emoji: '🏰', name: 'Big Ben' }, CA: { emoji: '🌊', name: 'Niagara Falls' },
  AU: { emoji: '🎭', name: 'Sydney Opera House' }, IN: { emoji: '🕌', name: 'Taj Mahal' },
  PK: { emoji: '🕌', name: 'Badshahi Mosque' }, AE: { emoji: '🏙️', name: 'Burj Khalifa' },
  SA: { emoji: '🕋', name: 'The Kaaba, Mecca' }, QA: { emoji: '🏛️', name: 'Museum of Islamic Art' },
  JP: { emoji: '🗻', name: 'Mount Fuji' }, KR: { emoji: '🏯', name: 'Gyeongbokgung Palace' },
  SG: { emoji: '🦁', name: 'Merlion' }, MY: { emoji: '🏙️', name: 'Petronas Towers' },
  ID: { emoji: '🛕', name: 'Borobudur Temple' }, PH: { emoji: '🏝️', name: 'Chocolate Hills' },
  DE: { emoji: '🏰', name: 'Neuschwanstein Castle' }, FR: { emoji: '🗼', name: 'Eiffel Tower' },
  ES: { emoji: '⛪', name: 'Sagrada Família' }, IT: { emoji: '🏛️', name: 'Colosseum' },
  NL: { emoji: '🌷', name: 'Windmills of Kinderdijk' }, BE: { emoji: '🏛️', name: 'Atomium' },
  SE: { emoji: '🏰', name: 'Stockholm Old Town' }, NO: { emoji: '🏔️', name: 'Geirangerfjord' },
  DK: { emoji: '🧜‍♀️', name: 'The Little Mermaid' }, FI: { emoji: '🎅', name: 'Santa Claus Village' },
  CH: { emoji: '🏔️', name: 'Matterhorn' }, AT: { emoji: '🏰', name: 'Schönbrunn Palace' },
  IE: { emoji: '🍀', name: 'Cliffs of Moher' }, PT: { emoji: '🏰', name: 'Belém Tower' },
  PL: { emoji: '🏰', name: 'Wawel Castle' }, GR: { emoji: '🏛️', name: 'The Parthenon' },
  TR: { emoji: '🕌', name: 'Hagia Sophia' }, ZA: { emoji: '⛰️', name: 'Table Mountain' },
  NG: { emoji: '🏙️', name: 'Zuma Rock' }, KE: { emoji: '🦒', name: 'Maasai Mara' },
  EG: { emoji: '🏜️', name: 'Pyramids of Giza' }, MA: { emoji: '🕌', name: 'Hassan II Mosque' },
  BR: { emoji: '🗿', name: 'Christ the Redeemer' }, MX: { emoji: '🛕', name: 'Chichén Itzá' },
  AR: { emoji: '💃', name: 'Obelisco de Buenos Aires' }, CL: { emoji: '🗿', name: 'Moai, Easter Island' },
  CO: { emoji: '☕', name: 'Coffee Cultural Landscape' }, CZ: { emoji: '🏰', name: 'Prague Castle' },
  RO: { emoji: '🏰', name: 'Bran Castle' }, HU: { emoji: '🏛️', name: 'Hungarian Parliament Building' },
  UA: { emoji: '⛪', name: 'Saint Sophia Cathedral' }, RU: { emoji: '⛪', name: "Saint Basil's Cathedral" },
  IL: { emoji: '🕍', name: 'Western Wall' }, JO: { emoji: '🏛️', name: 'Petra' },
  KW: { emoji: '🗼', name: 'Kuwait Towers' }, BH: { emoji: '🏛️', name: 'Bahrain Fort' },
  OM: { emoji: '🕌', name: 'Sultan Qaboos Grand Mosque' }, LB: { emoji: '🏛️', name: 'Baalbek Roman Ruins' },
  IQ: { emoji: '🏛️', name: 'Great Ziggurat of Ur' }, IR: { emoji: '🏛️', name: 'Persepolis' },
  NP: { emoji: '🏔️', name: 'Mount Everest' }, LK: { emoji: '⛰️', name: 'Sigiriya Rock Fortress' },
  MV: { emoji: '🏝️', name: 'Overwater villas, Malé Atoll' }, BT: { emoji: '⛰️', name: "Paro Taktsang (Tiger's Nest)" },
  MM: { emoji: '🛕', name: 'Shwedagon Pagoda' }, TH: { emoji: '🛕', name: 'Wat Arun' },
  VN: { emoji: '⛵', name: 'Ha Long Bay' }, KH: { emoji: '🛕', name: 'Angkor Wat' },
  LA: { emoji: '🛕', name: 'Pha That Luang' }, BN: { emoji: '🕌', name: 'Sultan Omar Ali Saifuddien Mosque' },
  TL: { emoji: '⛰️', name: 'Cristo Rei of Dili' }, NZ: { emoji: '🏔️', name: 'Milford Sound' },
  PG: { emoji: '🌋', name: 'Mount Wilhelm' }, FJ: { emoji: '🏝️', name: 'Fiji Islands' },
  TZ: { emoji: '🏔️', name: 'Mount Kilimanjaro' }, UG: { emoji: '🦍', name: 'Bwindi Impenetrable Forest' },
  RW: { emoji: '🌋', name: 'Volcanoes National Park' }, ET: { emoji: '⛪', name: 'Lalibela rock churches' },
  GH: { emoji: '🏰', name: 'Cape Coast Castle' }, SN: { emoji: '🗿', name: 'African Renaissance Monument' },
  CI: { emoji: '⛪', name: 'Basilica of Our Lady of Peace' }, CM: { emoji: '🌋', name: 'Mount Cameroon' },
  TN: { emoji: '🏛️', name: 'Amphitheatre of El Jem' }, LY: { emoji: '🏛️', name: 'Leptis Magna' },
  DZ: { emoji: '🏛️', name: 'Casbah of Algiers' }, SD: { emoji: '🏜️', name: 'Pyramids of Meroë' },
  SO: { emoji: '🏖️', name: 'Lido Beach, Mogadishu' }, ZM: { emoji: '💦', name: 'Victoria Falls' },
  ZW: { emoji: '💦', name: 'Victoria Falls' }, BW: { emoji: '🐘', name: 'Okavango Delta' },
  MZ: { emoji: '🏖️', name: 'Bazaruto Archipelago' }, MG: { emoji: '🌳', name: 'Avenue of the Baobabs' },
  MU: { emoji: '🏖️', name: 'Le Morne Brabant' }, SC: { emoji: '🏖️', name: "Anse Source d'Argent" },
  UY: { emoji: '🏙️', name: 'Palacio Salvo' }, PE: { emoji: '⛰️', name: 'Machu Picchu' },
  VE: { emoji: '💦', name: 'Angel Falls' }, EC: { emoji: '🐢', name: 'Galápagos Islands' },
  BO: { emoji: '🧂', name: 'Salar de Uyuni' }, PY: { emoji: '⛪', name: 'Jesuit Missions of La Santísima Trinidad' },
  GY: { emoji: '💦', name: 'Kaieteur Falls' }, SR: { emoji: '🏛️', name: 'Fort Zeelandia' },
  BB: { emoji: '🏖️', name: 'Bridgetown Garrison' }, JM: { emoji: '💦', name: "Dunn's River Falls" },
  TT: { emoji: '🏞️', name: 'Pitch Lake' }, BS: { emoji: '🏖️', name: 'Pink Sands Beach' },
  CR: { emoji: '🌋', name: 'Arenal Volcano' }, PA: { emoji: '🚢', name: 'Panama Canal' },
  GT: { emoji: '🛕', name: 'Tikal' }, HN: { emoji: '🛕', name: 'Copán Ruins' },
  SV: { emoji: '🌋', name: 'Santa Ana Volcano' }, NI: { emoji: '🌋', name: 'Masaya Volcano' },
  DO: { emoji: '🏖️', name: 'Punta Cana' }, CU: { emoji: '🏙️', name: 'Old Havana' },
  HT: { emoji: '🏰', name: 'Citadelle Laferrière' }, IS: { emoji: '🌋', name: 'Blue Lagoon' },
  LU: { emoji: '🏰', name: 'Luxembourg Old Quarters' }, MT: { emoji: '🏛️', name: 'Ħaġar Qim Temples' },
  CY: { emoji: '🏛️', name: 'Tombs of the Kings' }, SK: { emoji: '🏰', name: 'Bratislava Castle' },
  SI: { emoji: '🏞️', name: 'Lake Bled' }, HR: { emoji: '🏛️', name: "Diocletian's Palace" },
  BA: { emoji: '🌉', name: 'Stari Most, Mostar' }, RS: { emoji: '🏰', name: 'Belgrade Fortress' },
  MK: { emoji: '🏞️', name: 'Lake Ohrid' }, AL: { emoji: '🏛️', name: 'Butrint' },
  XK: { emoji: '🏛️', name: 'Gazimestan Monument' }, ME: { emoji: '🏞️', name: 'Bay of Kotor' },
  BG: { emoji: '⛪', name: 'Rila Monastery' }, MD: { emoji: '🍇', name: 'Orheiul Vechi' },
  BY: { emoji: '🏰', name: 'Mir Castle' }, LT: { emoji: '🏰', name: 'Trakai Island Castle' },
  LV: { emoji: '🏙️', name: 'Riga Old Town' }, EE: { emoji: '🏰', name: 'Tallinn Old Town' },
  KZ: { emoji: '🗼', name: 'Baiterek Tower' }, UZ: { emoji: '🕌', name: 'Registan, Samarkand' },
  AZ: { emoji: '🔥', name: 'Flame Towers, Baku' }, GE: { emoji: '⛪', name: 'Gergeti Trinity Church' },
  AM: { emoji: '⛪', name: 'Geghard Monastery' }, TM: { emoji: '🔥', name: 'Door to Hell, Darvaza' },
  KG: { emoji: '🏔️', name: 'Issyk-Kul Lake' }, TJ: { emoji: '🏔️', name: 'Pamir Mountains' },
  AF: { emoji: '🕌', name: 'Blue Mosque, Mazar-i-Sharif' }, YE: { emoji: '🏙️', name: "Old City of Sana'a" },
  SY: { emoji: '🏛️', name: 'Palmyra' }, PS: { emoji: '🕌', name: 'Dome of the Rock' },
  DEFAULT: { emoji: '🌍', name: 'Local landmark' },
}

export default function LanguageSelect({ navigate, country, countryCode, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const langs = COUNTRY_LANGUAGES[countryCode] ?? COUNTRY_LANGUAGES.DEFAULT
  const landmark = LANDMARKS[countryCode] ?? LANDMARKS.DEFAULT

  const handleSelect = (code: string) => {
    setSelected(code)
    const rtl = langs.find(l => l.code === code)?.rtl ?? false
    onSelect(code, rtl)
    setTimeout(() => navigate('providertype'), 400)
  }

  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      display: 'flex', flexDirection: 'column', padding: '52px 24px 32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button onClick={() => navigate('country')} style={{
          background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
          borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111A3A',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div style={{ flex: 1, display: 'flex', gap: 4 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= 2 ? '#246BFD' : 'rgba(17,26,58,0.12)' }}/>
          ))}
        </div>
      </div>

      {/* Country + landmark indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
        background: 'rgba(36,107,253,0.12)', border: '1px solid rgba(36,107,253,0.22)',
        borderRadius: 14, marginBottom: 28,
      }}>
        <FlagIcon code={countryCode} width={34} radius={5}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#111A3A' }}>{country}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.5)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {landmark.emoji} {landmark.name}
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800, color: '#111A3A', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
        Choose Your Language
      </h2>
      <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.4)', margin: '0 0 28px', lineHeight: 1.5 }}>
        Select the language you'd like to use for your MomBestie Provider experience.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {langs.map(lang => (
          <div
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            style={{
              padding: '20px 20px', borderRadius: 16, cursor: 'pointer',
              background: selected === lang.code ? 'rgba(36,107,253,0.2)' : 'rgba(17,26,58,0.06)',
              border: selected === lang.code ? '2px solid #246BFD' : '1.5px solid rgba(17,26,58,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: lang.rtl ? 20 : 18,
                fontWeight: 700, color: '#111A3A',
                direction: lang.rtl ? 'rtl' : 'ltr',
              }}>{lang.native}</div>
              {lang.native !== lang.name && (
                <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.45)' }}>
                  ({lang.name})
                </div>
              )}
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.3)' }}>
                {lang.rtl ? 'RTL · ' : ''}{lang.code.toUpperCase()}
              </div>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              border: selected === lang.code ? '2px solid #246BFD' : '2px solid rgba(17,26,58,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: selected === lang.code ? '#246BFD' : 'transparent',
              flexShrink: 0,
            }}>
              {selected === lang.code && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: '20px 0 0' }}>
        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
          fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.35)', lineHeight: 1.5,
        }}>
          Only languages officially enabled for <strong style={{ color: 'rgba(17,26,58,0.55)' }}>{country}</strong> are shown. More may be added as MomBestie expands.
        </div>
      </div>
    </div>
  )
}
