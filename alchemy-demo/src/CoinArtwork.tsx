import React from 'react';

export function CoinArtwork({id='alchemy-coin',variant='decorated'}:{id?:string,variant?:'dark'|'decorated'}) {
  if(variant==='dark') return <DarkCoinArtwork id={id}/>;
  const innerChips = [
    'M-22 -29L-18 -35L-14 -30L-17 -25L-22 -25Z',
    'M-6 -36L1 -41L5 -37L2 -33L-3 -31Z',
    'M13 -31L20 -35L25 -29L20 -25L13 -25Z',
    'M-33 -19L-30 -23L-27 -18L-30 -15Z',
    'M-37 -3L-33 -7L-30 -2L-31 3L-37 2Z',
    'M-33 17L-31 12L-26 14L-27 20Z',
    'M-23 16L-20 19L-19 24L-23 25L-26 20Z',
    'M-17 24L-11 26L-4 30L-5 33L-12 32L-20 28Z',
    'M14 -3L19 -12L24 -5L23 7L15 8L11 6Z',
    'M33 -15L39 -24L44 -24L43 -13L39 -9L32 -8Z',
    'M27 13L34 17L43 14L47 11L45 19L37 22L28 20Z',
    'M20 12L25 14L23 25L20 29L17 26Z',
    'M-38 34L-34 31L-29 37L-30 43L-34 44Z',
    'M-52 32L-48 36L-49 43L-54 47L-58 43L-56 37Z',
    'M-47 53L-41 55L-35 58L-28 57L-27 61L-36 65L-46 59Z',
    'M-28 48L-23 44L-18 48L-19 53L-26 55Z',
    'M-12 46L-7 41L-4 46L-8 49Z',
    'M-8 62L-4 55L2 53L4 60L1 65Z',
    'M14 47L17 40L22 40L24 48L21 52L14 53Z',
    'M30 31L38 28L44 30L42 34L33 37Z',
    'M47 29L52 26L56 33L54 38L49 36Z',
    'M50 -8L53 -13L58 -7L56 3L53 8L51 4Z',
    'M59 -38L62 -44L66 -41L65 -34Z',
    'M-45 -65L-37 -69L-34 -64L-39 -59Z',
    'M-57 -53L-52 -60L-47 -57L-50 -49Z',
    'M-65 -37L-62 -43L-57 -38L-58 -33Z',
    'M-68 -22L-63 -24L-60 -17L-64 -11L-69 -13Z',
    'M-68 2L-64 -1L-60 5L-65 9Z',
    'M-67 19L-64 17L-60 22L-63 27Z',
    'M-10 74L-3 69L3 71L1 74Z',
    'M21 65L28 60L33 62L28 67Z',
    'M42 52L46 44L51 46L48 54Z',
  ];
  return <g>
    <defs>
      <filter id={`${id}-edge`} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".37" numOctaves="3" seed="46" result="coarse"/>
        <feDisplacementMap in="SourceGraphic" in2="coarse" scale="5.6" xChannelSelector="R" yChannelSelector="G" result="ragged"/>
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="14" result="fine"/>
        <feDisplacementMap in="ragged" in2="fine" scale="1.4" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id={`${id}-pale-grain`} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="3" seed="34" result="noise"/>
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 13 -5.8" result="grain"/>
        <feComposite in="SourceGraphic" in2="grain" operator="in"/>
      </filter>
      <filter id={`${id}-rim-grain`} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="1.25" numOctaves="2" seed="48" result="noise"/>
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 20 -3" result="grain"/>
        <feComposite in="SourceGraphic" in2="grain" operator="in"/>
      </filter>
      <filter id={`${id}-detail-grain`} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="36" result="noise"/>
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 15 -5.3" result="grain"/>
        <feComposite in="SourceGraphic" in2="grain" operator="in"/>
      </filter>
    </defs>
    <g filter={`url(#${id}-edge)`}>
      <path fill="#000" d="M-95 -51C-91 -70 -75 -81 -55 -87C-36 -100 -15 -110 9 -105C42 -103 64 -91 83 -66C99 -45 110 -20 107 7C108 35 96 61 78 79C55 99 26 111 -3 108C-34 107 -62 97 -80 77C-99 57 -110 30 -108 2C-108 -18 -102 -35 -95 -51Z"/>
      <g filter={`url(#${id}-rim-grain)`}>
        <path fill="#fff" fillRule="evenodd" d="M-85 -47C-70 -76 -36 -96 -6 -100C24 -104 56 -87 76 -63C92 -42 101 -14 101 12C96 43 83 65 62 82C38 99 8 106 -19 99C-47 96 -74 80 -89 55C-102 33 -103 4 -99 -15L-96 -31ZM-72 -38C-57 -62 -33 -78 -7 -80C19 -84 45 -70 61 -50C78 -29 82 -4 78 19C72 44 58 63 37 73C15 83 -10 83 -33 73C-55 64 -72 43 -79 21C-84 0 -81 -21 -72 -38Z"/>
        <g fill="#000">
          {[[16,-91,5,6],[43,-81,5,5],[68,-64,5,6],[84,-40,6,5],[92,-13,5,6],[89,17,5,5],[78,44,6,5],[59,69,5,6],[33,87,6,5],[3,95,5,5],[-26,88,6,5],[-54,75,5,6],[-76,53,6,5],[-91,26,5,5],[-94,0,5,5],[-88,-25,5,5]].map(([cx,cy,rx,ry],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${i*19} ${cx} ${cy})`}/>)}
          <path d="M-99 -26L-83 -39L-80 -53L-67 -58L-63 -73L-46 -76L-39 -90L-49 -96L-78 -82L-96 -54Z"/>
          <path d="M13 -100L19 -96L18 -89L13 -87L10 -91ZM46 -86L52 -82L49 -77L43 -78ZM72 -66L77 -62L74 -57L70 -60ZM89 -39L94 -36L91 -30L86 -32ZM97 -7L102 -3L98 2L93 -1ZM93 23L96 28L92 33L87 30ZM77 52L83 55L80 62L73 59ZM56 76L61 79L56 85L51 81ZM27 92L33 94L29 100L24 97ZM-5 96L-1 103L-8 105L-12 101ZM-39 89L-35 94L-41 97L-45 91ZM-66 73L-63 80L-69 82L-74 74ZM-88 47L-82 49L-83 55L-91 55ZM-98 16L-91 18L-92 23L-101 23ZM-100 -9L-94 -9L-92 -4L-101 -2Z"/>
        </g>
      </g>
      <g fill="#fff" filter={`url(#${id}-pale-grain)`}>
        <path d="M-57 -54C-31 -75 -6 -81 20 -69C36 -66 45 -60 50 -52C27 -59 5 -58 -16 -52C-31 -47 -43 -47 -54 -39Z"/>
        <path d="M-61 -47C-76 -20 -80 9 -67 29L-64 18C-69 -3 -62 -20 -54 -31L-55 -42Z"/>
        <path d="M52 -45C68 -25 72 4 62 30C56 48 43 60 26 66L29 62C48 51 56 34 57 14C64 -5 56 -29 49 -36Z"/>
        <path d="M-54 50C-43 67 -18 78 9 75C26 72 41 66 53 54L49 64C27 80 -2 83 -27 74C-41 69 -51 61 -56 53Z"/>
        <path d="M-30 29C-25 44 -9 48 1 40M-39 45C-23 63 8 58 17 39M-57 12C-54 23 -50 24 -48 25M31 -48C40 -48 47 -43 47 -40" fill="none" stroke="#fff" strokeWidth="2.8"/>
      </g>
      <g fill="#fff" filter={`url(#${id}-detail-grain)`}>{innerChips.map((d,i)=><path key={i} d={d}/>)}</g>
      <path fill="#fff" d="M-1 -3L3 -5L7 -2L7 2L4 6L0 4L-2 1Z"/>
      <g fill="#fff" opacity=".75" filter={`url(#${id}-pale-grain)`}>
        <path d="M-60 -78L-57 -80L-56 -76L-60 -74ZM-54 -72L-51 -77L-49 -71L-52 -69ZM-48 -80L-46 -83L-43 -80L-46 -77ZM-66 -67L-65 -72L-63 -68L-63 -65ZM-59 -63L-56 -65L-55 -61L-58 -60ZM-42 -76L-39 -75L-40 -72L-43 -73Z"/>
        <path d="M-43 -8L-40 -10L-39 -7L-42 -5ZM-50 12L-47 10L-46 13L-48 16ZM-20 -45L-18 -43L-19 -41L-22 -42ZM7 -50L10 -51L11 -49L8 -48ZM39 5L43 4L42 8L39 10ZM3 33L6 30L8 33L5 36ZM-16 67L-12 65L-10 67L-14 70Z"/>
      </g>
    </g>
  </g>;
}

function DarkCoinArtwork({id}:{id:string}) {
  return <g>
    <defs>
      <filter id={`${id}-dark-edge`} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".64" numOctaves="3" seed="36" result="edge"/>
        <feDisplacementMap in="SourceGraphic" in2="edge" scale="4" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id={`${id}-dark-cuts`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".74" numOctaves="3" seed="34" result="grain"/>
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 20 -5.8" result="alpha"/>
        <feComposite in="SourceGraphic" in2="alpha" operator="in" result="cut"/>
        <feDisplacementMap in="cut" in2="grain" scale="4.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
    <g filter={`url(#${id}-dark-edge)`}>
      <path fill="#000" d="M-100 -33C-91 -69 -62 -94 -24 -104C6 -111 40 -103 64 -85C90 -65 104 -36 107 -5L107 23C98 62 69 92 34 104C2 114 -36 108 -63 91C-92 72 -108 40 -108 9C-111 -7 -104 -20 -100 -33Z"/>
      <g fill="#fff" filter={`url(#${id}-dark-cuts)`}>
        <path d="M-62 -29C-52 -51 -37 -66 -15 -71C7 -77 32 -69 48 -58L43 -59C20 -73 -8 -74 -30 -62C-46 -55 -55 -42 -62 -29Z"/>
        <path d="M-33 -64L-38 -58L-40 -67L-35 -70ZM49 -54L54 -48L53 -44L50 -48ZM58 -41L64 -34L62 -30L59 -34ZM66 -26L69 -17L68 -15L66 -22ZM70 -9L72 -2L70 0ZM72 9L73 14L71 18L70 15ZM71 23L71 31L68 35L69 29Z"/>
        <path d="M-82 -43L-72 -35L-65 -26L-56 -23L-53 -28L-47 -25L-45 -16L-58 -14L-64 -19L-75 -16L-75 -6L-68 -8L-68 4L-62 8L-63 18L-57 18L-56 26L-62 32L-57 39L-52 38L-52 50L-62 51L-67 44L-66 31L-73 22L-73 13L-80 14L-79 2L-83 -6L-79 -17L-88 -18L-84 -27Z"/>
        <path fill="#000" d="M-84 -29L-78 -31L-76 -25L-78 -22L-83 -22ZM-75 -14L-68 -15L-69 -10L-75 -8ZM-72 1L-69 5L-71 9L-75 9ZM-68 20L-65 20L-64 25L-68 27ZM-61 30L-58 33L-62 38L-65 35Z"/>
        <path d="M-46 56L-35 59L-32 65L-16 65L-8 67L-2 66L4 69L13 69L20 72L9 73L-3 70L-18 70L-31 67L-37 68L-40 63L-46 62Z"/>
        <path d="M37 44L42 44L47 42L47 46L39 47L34 46ZM-52 54L-49 54L-48 58L-52 58Z"/>
        <path stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" d="M10 -32L10 -24L3 -20L-2 -18L-6 -11L3 -5L9 3L6 9L0 12L-10 10L-12 3L-10 -9L-6 -18L-1 -24L3 -25L3 -29Z"/>
        <path fill="#000" d="M-5 -1L2 3L-5 7L-8 6Z"/>
        <path d="M19 -22L20 -13L18 -8L20 0L17 5L16 14L9 24L5 28L2 34L-9 31L-12 26L-10 21L-6 27L-1 27L8 18L14 8L15 -5L17 -13Z"/>
        <path d="M-17 -36L-14 -38L-15 -34ZM-23 -29L-20 -32L-19 -29L-23 -25ZM-25 -23L-23 -19L-24 -15L-28 -17ZM-28 -12L-26 -9L-29 -5L-32 -5Z"/>
      </g>
      <g fill="#fff" opacity=".65" filter={`url(#${id}-dark-cuts)`}>
        <path d="M-34 -91L-29 -94L-24 -91L-27 -88L-33 -88ZM-8 -94L-3 -94L-1 -90L-6 -89ZM-60 -80L-54 -85L-49 -83L-49 -79L-53 -81L-56 -77ZM-78 -64L-75 -59L-79 -56L-82 -59ZM-93 -36L-91 -40L-90 -31L-94 -25ZM-97 -5L-94 -8L-92 -4L-95 1ZM-93 22L-89 20L-86 25L-90 28ZM-86 46L-81 48L-78 53L-83 54ZM-75 60L-72 59L-70 64L-74 66ZM-56 76L-53 77L-52 82L-56 81ZM-28 91L-25 89L-23 92L-26 95ZM10 96L14 94L16 96L13 99ZM47 85L50 81L52 84L49 89ZM76 59L79 56L80 62L76 64ZM90 27L94 25L94 29L90 32ZM92 -25L96 -28L95 -23L92 -21ZM77 -56L79 -60L82 -57L81 -52ZM54 -76L56 -79L59 -74L57 -72ZM30 -86L31 -90L34 -87L34 -84Z"/>
      </g>
    </g>
  </g>;
}
