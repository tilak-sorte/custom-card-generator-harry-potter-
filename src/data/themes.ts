export interface ThemeDef {
  id: string;
  name: string;
  blurb: string;
  emoji: string;
  gradient: string;
  ready: boolean;
}

export const THEMES: ThemeDef[] = [
  {
    id: 'hogwarts',
    name: 'Hogwarts Witchcraft ID',
    blurb: 'Sort yourself into a house & get your official badge',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg,#740001 0%,#eeba30 50%,#0e1a40 100%)',
    ready: true,
  },
];
