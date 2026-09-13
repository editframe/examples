import React from "react";

const grid = [
"TLESESPKRESOSYEAASR",
"OEMOTIULMLSRTLESESU",
"EEEOCDEWNFQOOEMOTIN",
"UMSFGCRTTOTDEEEOCDC",
"KRESRSYEAASTUMSNGCR",
"LML SROLESESPKRESOSE".replace(/ /g,""),
"WNFQOONMOTIULMLS RTA".replace(/ /g,""),
"TTOTDEETOCDEWNFQOOT",
"ROOTCAUSEANALYSISEI",
"ESESPKRESNSYEAASTUO",
"MOTIULMLSRDLESESPKN",
"EOCDEWNFQOOEMOTIULF",
"SNGCRTTOTDEEEOCDEWI",
"ESOSYEAASTUMSNGCRTX",
"LSRTLESESPKRESOSYEA",
"FQOOEMOTIULMLSRTLES",
"OTDEEEOCDEWNFQOOEMO",
];

export function Investigation({intro=false}:{intro?:boolean}) {
  return <div className={`investigation-paper ${intro?"paper-intro":""}`}>
    <div className="investigation-header"><b>AI SPEND</b><b>$93.00</b></div>
    <div className="investigation-meta"><span>FIND 3 WORK ITEMS</span><span>8 SESSIONS / 3 REPOS</span></div>
    <div className="investigation-rule"/>
    <svg className="word-grid" width="720" height="780" viewBox="0 0 720 780">
      {grid.map((row,r)=>row.split("").map((letter,c)=><text key={`${r}-${c}`} x={68+c*32} y={155+r*34} textAnchor="middle" fill={(r===8&&c<17)||(c===18&&r<14)||(c===r&&r>=3&&r<=10)?"#111":"#858585"}>{letter}</text>))}
      <path className="highlight root-highlight" pathLength="1" d="M60 435 C87 438 108 435 130 438 C154 439 181 432 205 436 C230 440 249 438 272 434 C295 430 322 439 345 436 C370 432 390 439 412 436 C439 434 462 438 490 437 C519 435 540 437 567 434 C586 437 600 437 602 429 C605 419 605 410 592 407 C584 398 578 405 573 405 C547 410 524 398 491 405 C465 410 438 397 405 405 C378 410 352 403 325 405 C297 405 273 403 240 406 C212 409 186 397 159 404 C128 410 106 400 73 404 C57 406 42 407 46 424 C46 440 65 435 83 437"/>
      <path className="highlight vertical-highlight" pathLength="1" d="M625 142 C628 177 625 216 628 252 C632 286 626 319 628 355 C625 390 625 429 628 461 C630 498 630 532 629 567 C627 590 630 614 644 615 C660 615 663 601 661 586 C665 550 660 516 662 478 C660 439 661 407 660 371 C662 334 659 300 662 266 C658 232 660 197 660 166 L661 137 C643 120 629 126 627 141"/>
      <path className="highlight diagonal-highlight" pathLength="1" d="M148 257 C173 281 193 301 216 326 C244 353 265 379 291 405 C316 431 343 458 368 485 C379 496 385 516 397 512 C409 508 412 496 404 486 C379 461 359 438 335 414 C309 389 286 365 261 339 C237 314 216 289 195 265 C178 245 172 229 153 233 C141 237 139 248 148 257"/>
    </svg>
    <div className="investigation-footer">RUN EVIDENCE / MESSAGES / TOOLS / FILES / OUTCOMES</div>
  </div>;
}
