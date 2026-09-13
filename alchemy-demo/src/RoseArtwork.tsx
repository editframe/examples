import React from 'react';

export function RoseArtwork({id='alchemy-rose'}:{id?:string}) {
  const leaves = [
    'M108 203C97 196 98 178 106 166C106 180 120 185 112 201L109 205Z',
    'M161 220C152 211 143 201 147 190C153 199 166 198 167 207L166 218Z',
    'M268 215C271 201 267 193 280 181L286 164C298 177 305 190 296 205L276 222Z',
    'M323 189C313 179 316 172 311 163L306 147C323 147 338 167 332 181L328 191Z',
    'M294 236C303 228 312 231 329 233L317 244C310 248 300 242 294 236Z',
    'M151 256C145 266 139 282 125 285L131 267L144 250L153 247Z',
    'M75 246C67 231 53 226 42 221C39 235 55 244 63 247Z',
    'M60 252C47 244 28 249 18 254L-6 270C18 265 44 263 60 252Z',
    'M88 235C102 231 116 243 119 254C121 266 106 282 94 282C81 287 72 277 75 265L80 249Z',
    'M78 307C94 313 105 315 112 330L125 343C114 349 99 346 91 337C83 329 78 318 78 307Z',
    'M145 339C158 338 169 346 180 360C165 356 151 350 139 346Z',
    'M237 340C249 346 260 348 271 344L278 348C268 357 254 354 244 351Z',
    'M397 157C417 149 441 137 456 118C455 141 439 158 421 167L400 172L397 166C415 163 430 152 437 144L415 155Z',
    'M408 113C393 108 384 98 381 84C393 91 401 99 408 109Z',
    'M397 72C386 67 376 55 369 34C383 45 390 55 397 72Z',
    'M421 91C428 77 435 74 443 71L439 64L442 61L449 67C449 79 435 87 421 94Z',
  ];
  return <g>
    <defs>
      <filter id={`${id}-edge`} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".53" numOctaves="3" seed="51" result="grain"/>
        <feDisplacementMap in="SourceGraphic" in2="grain" scale="6" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id={`${id}-foliage`} x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="49" result="noise"/>
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 20 -4.5" result="grain"/>
        <feComposite in="SourceGraphic" in2="grain" operator="in"/>
      </filter>
      <filter id={`${id}-sepals`} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".82" numOctaves="3" seed="15" result="noise"/>
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 14 -6.1" result="grain"/>
        <feComposite in="SourceGraphic" in2="grain" operator="in"/>
      </filter>
    </defs>
    <g filter={`url(#${id}-edge)`}>
      <path fill="#000" fillRule="evenodd" d="M65 93C79 63 90 43 117 31L144 19L159 14L169 18L184 10C213 6 248 9 274 18C310 27 341 48 359 77C382 107 395 145 392 183C389 228 365 269 332 298C301 325 263 337 228 339L237 354L222 350L210 338C169 337 128 319 100 289C73 261 58 225 57 187C52 159 56 121 65 93ZM103 92C128 55 158 34 199 35C241 31 281 48 306 73C335 99 353 136 353 169C359 210 340 250 308 274C279 296 245 305 216 299C174 300 143 282 118 256C95 230 84 199 88 168C85 140 89 116 103 92Z"/>
      <path fill="#fff" d="M126 39L129 35L132 36L130 39ZM62 202L65 198L67 202L65 207ZM333 298L346 291L342 297L335 302Z"/>
      <g fill="none" stroke="#000" strokeLinecap="round">
        <path d="M224 316C222 289 224 265 222 247L229 222L232 214" strokeWidth="18"/>
        <path d="M224 267C197 249 174 239 156 233C124 224 103 216 80 220L60 225" strokeWidth="9"/>
        <path d="M224 267C251 239 273 224 301 216L346 200L375 183L400 164" strokeWidth="10"/>
        <path d="M109 227L108 204M160 240L159 216M282 232L278 214M323 211L325 186M303 222L304 236M142 235L150 249" strokeWidth="3"/>
      </g>
      <g filter={`url(#${id}-foliage)`} fill="#000">
        {leaves.map((d,i)=><path d={d} key={i}/>)}
        <path d="M394 140C412 124 414 109 414 93L399 76L397 71M414 96L433 80M403 86L398 79" fill="none" stroke="#000" strokeWidth="3.4"/>
      </g>
      <path fill="#000" d="M148 135C160 109 182 91 206 82L224 78L238 81L248 75L263 79C280 84 292 94 297 107C305 123 298 146 286 159C274 170 254 180 235 185C213 193 190 192 170 184C151 177 147 158 148 135Z"/>
      <g fill="#fff" opacity=".58" filter={`url(#${id}-sepals)`}>
        <path d="M187 122L194 117L195 111L201 108L206 96L213 95L219 100L226 97L232 102L230 112L225 119L216 127L207 129L194 127L185 128Z"/>
        <path d="M287 145L291 137L295 135L293 145L287 152ZM153 166L157 175L162 179L165 184L160 182L154 178Z"/>
      </g>
      <path fill="#000" d="M195 118L202 108L210 105L208 113L203 119ZM212 122L217 114L224 109L221 119L217 122Z"/>
      <g fill="#000" filter={`url(#${id}-sepals)`}>
        <path d="M151 168C173 185 190 192 211 189C239 188 270 174 288 153L292 162C274 182 256 195 237 203L230 224L222 220L217 207L209 221L203 205L189 200L185 215L179 205L178 198L163 196L159 184L148 180Z"/>
        <path d="M96 28L108 18L122 14L130 7L138 8L145 0L140 11L126 19L112 23L108 28ZM342 305L351 300L345 308L333 312Z"/>
      </g>
      <path fill="none" stroke="#000" strokeWidth="2.5" d="M224 242L214 223L211 221M224 245L235 234M189 267L182 274M244 259L253 263"/>
    </g>
  </g>;
}
