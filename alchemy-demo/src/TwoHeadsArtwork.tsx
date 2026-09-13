import React from 'react';

export function TwoHeadsArtwork() {
  const torso='M427 728C447 704 472 704 497 713C524 695 553 706 571 716C591 715 619 728 631 747C642 762 640 790 632 812Q626 834 610 842L585 852Q570 862 574 880C575 903 600 914 625 924C661 938 686 948 700 978Q714 1009 720 1088L340 1088Q348 1062 349 1036L349 1007Q349 974 368 947C385 930 417 928 438 913Q458 901 455 885L446 859Q431 847 421 827C410 808 407 786 412 766Z';
  const rightShade='M488 710C514 700 547 706 574 716C606 718 633 734 638 763C643 795 630 829 606 841L581 853Q566 868 577 893Q585 910 628 928C676 944 701 970 714 1026L727 1088L548 1088C550 1064 537 1046 518 1020Q504 1006 504 982L511 958Q515 942 502 925Q486 902 478 877L469 852L487 836L489 813L482 790L474 768L480 741Z';
  const faceLocks=[
    'M426 732Q440 724 451 726L460 720L477 722L470 727L454 730L447 734L434 735Z',
    'M450 715L462 710L478 712L485 717L477 720L463 717Z',
    'M472 704L484 701L499 704L509 710L499 711L493 715L480 712Z',
    'M472 723L482 720L495 724L507 727L504 733L493 731L488 736L478 733Z',
    'M475 736L486 731L494 736L493 743L502 747L497 754L488 752L484 745L474 744Z',
    'M469 746L477 743L484 748L484 758L491 767L486 773L478 769L474 761Z',
    'M497 711L510 709L524 716L520 722L507 720L502 722L495 718Z',
    'M516 725L524 721L538 725L546 724L558 730L548 734L538 731L529 734Z',
    'M558 717L575 717L585 723L582 729L572 726L565 730L554 725Z',
    'M414 772L420 764L427 759L431 760L427 765L420 771L417 780Z',
    'M417 795L423 791L426 797L423 803L427 810L424 815L418 807Z',
    'M425 817L431 817L434 825L431 829L427 824Z',
  ];
  const cheekMarks=[
    'M449 742L453 737L460 738L462 743L457 745Z',
    'M449 753L458 750L470 753L473 758L465 760L458 757L451 759L443 763L440 759Z',
    'M447 765L453 760L464 760L468 764L463 769L454 771L450 767Z',
    'M483 775L490 775L493 785L489 794L493 799L489 803L482 801L480 796L484 792Z',
    'M476 799L482 797L484 802L480 806L475 805Z',
    'M469 814L478 810L487 813L494 810L502 815L500 819L490 818L484 821L476 817Z',
    'M474 824L483 821L490 824L500 823L504 827L497 831L486 832L478 829Z',
    'M495 838L502 837L508 842L505 846L498 846Z',
    'M520 758L531 754L542 758L550 765L546 768L535 763L528 765L521 764Z',
    'M528 771L538 769L542 773L538 778L531 779L527 775Z',
    'M548 772L555 770L557 779L552 787L552 793L548 797L543 793L545 785Z',
    'M537 797L544 794L550 797L548 803L541 802Z',
    'M527 810L538 806L548 809L556 808L562 813L558 817L548 815L539 815L532 813Z',
    'M531 820L540 821L548 818L557 820L553 825L542 828L532 825Z',
    'M566 823L574 819L579 824L575 831L568 832Z',
    'M418 1031L424 1036L425 1043L420 1046L417 1040Z',
    'M446 1045L452 1045L455 1050L451 1054L447 1052Z',
  ];
  const facialStrokes=[
    'M422 747Q431 751 440 745M423 757Q432 765 442 757',
    'M435 773Q440 777 447 773M450 777L459 775M465 774L470 772',
    'M440 795L444 797M439 812L444 815M455 834L467 840L480 844',
    'M451 844L460 850L470 851M463 858L468 865M463 870L469 879',
    'M489 755L496 758M499 760L505 764M508 768L516 770',
    'M523 784L532 782M528 791L533 790M522 797L528 799',
    'M521 831L531 835L545 838M538 844L548 846L557 842',
    'M558 778Q570 771 576 775M568 783L577 779M561 794L573 790',
    'M583 756Q594 751 605 755M586 764Q601 757 612 764',
    'M596 787L605 783L611 785M585 802L597 798L604 799',
    'M450 894L447 902M449 906L440 912M469 908L476 918',
    'M490 914L493 922M489 927L497 930M479 926L483 932',
  ];
  // Irregular stroke families, clipped to the hand-drawn anatomy. These are
  const hairHatch=Array.from({length:53},(_,i)=>{
    const y=724+i*2.24; const bend=Math.sin(i*1.73)*3.5;
    return `M${491+(i%4)*3} ${y}C${535+bend} ${y-8} ${586+bend} ${y+4} ${620+(i%3)*3} ${y+22}q8 5 9 12`;
  });
  const neckHatch=Array.from({length:43},(_,i)=>{
    const y=808+i*6.05; const dx=Math.sin(i*2.13)*6;
    return `M${486+dx} ${y}C${511+dx} ${y+14} ${534+dx} ${y+25} ${559+dx} ${y+36}S${622+dx} ${y+69} ${671+dx} ${y+120}`;
  });
  const chestHatch=Array.from({length:28},(_,i)=>{
    const x=543+i*6.6; const dy=Math.sin(i*1.39)*7;
    return `M${x} ${924+dy}C${x+49} ${947+dy} ${x+71} ${986+dy} ${x+87} ${1028+dy}L${x+99} 1094`;
  });
  return <g transform="translate(-233.018868 -380.634648) scale(.445969125)"
    stroke="#000" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <clipPath id="alchemy-twoheads-body"><path d={torso}/></clipPath>
      <clipPath id="alchemy-twoheads-shade"><path d={rightShade}/></clipPath>
      <filter id="alchemy-twoheads-rough" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".48 .65" numOctaves="2" seed="43" result="inkGrain"/>
        <feDisplacementMap in="SourceGraphic" in2="inkGrain" scale="3.8" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
    <g filter="url(#alchemy-twoheads-rough)">
      {/* Unequal rays emerge directly from the left head's engraved contour. */}
      <g strokeWidth="1.05">
        {Array.from({length:47},(_,i)=>{
          const a=(126+i*3.28)*Math.PI/180;
          const ri=85+Math.sin(i*1.63)*6;
          const ro=143+Math.sin(i*2.49)*19+(i%5===0?21:0)-(i<8?25:i<15?15:0);
          const sx=454+Math.cos(a)*ri,sy=782+Math.sin(a)*ri;
          const ex=454+Math.cos(a)*ro,ey=782+Math.sin(a)*ro;
          const ax=454+Math.cos(a+.017)*ri,ay=782+Math.sin(a+.017)*ri;
          return <path key={`ray${i}`} d={`M${sx} ${sy}L${ex} ${ey}L${ax} ${ay}`} fill={i%4===0?'#000':'none'}/>;
        })}
        <path d="M418 725L404 727L396 732L382 734M410 740L400 741L387 748L378 748M412 754L398 758L392 763L379 766M413 780L405 783L399 789L387 791M420 803L412 805L408 814L399 819M438 841L436 852L429 861M452 706L449 692L450 682M469 704L473 685L472 673" strokeWidth="2"/>
      </g>
      <path d={torso} fill="#fff" strokeWidth="2.3"/>
      {/* Dark lateral hair and long directional cross-hatching down the neck. */}
      <g clipPath="url(#alchemy-twoheads-shade)">
        {hairHatch.map((d,i)=><path key={`hair${i}`} d={d} strokeWidth={i%5===0?2.2:1.15} strokeDasharray={i%3===0?'13 3 7 2 22 5':'24 2 15 4'}/>)}
        {neckHatch.map((d,i)=><path key={`neck${i}`} d={d} strokeWidth={i%4===0?2:1.15} strokeDasharray={i%3===0?'16 4 9 3 22 6':'12 2 24 3'}/>)}
        {chestHatch.map((d,i)=><path key={`chest${i}`} d={d} strokeWidth={i%5===0?2.15:1.05} strokeDasharray={i%4===0?'18 3 11 4':'27 3 13 2'}/>)}
        <path d="M620 746Q645 783 620 820Q610 837 584 844M624 755Q637 785 614 817M576 842Q562 871 575 896Q594 919 624 927M580 855Q571 876 583 893M590 906L616 921M626 930Q681 952 701 1002L716 1085" strokeWidth="2.4"/>
      </g>
      {/* The lunar face retains pale planes between the much darker hair. */}
      <path d="M502 741Q519 735 539 747L553 763L550 779L560 787L579 793L578 801L562 804L559 815L566 827L554 837L538 839L522 830L512 817L510 805L502 798L506 781L500 768Z" fill="#fff" stroke="none"/>
      <path d="M512 746L520 750L525 752M506 757L512 763M510 776L514 780M516 793L522 798M520 804L525 807M517 815L524 820M527 829L535 834M553 830L559 827M561 795L571 798M550 753L557 759" strokeWidth="1.2"/>
      <path d="M568 781L575 778L580 782L576 787L570 787Z" fill="#000" stroke="none"/>
      {faceLocks.map((d,i)=><path key={`lock${i}`} d={d} fill="#000" stroke="none"/>)}
      {cheekMarks.map((d,i)=><path key={`face${i}`} d={d} fill="#000" stroke="none"/>)}
      {facialStrokes.map((d,i)=><path key={`detail${i}`} d={d} strokeWidth={i%4===0?1.8:1.15}/>)}
      <path d="M447 755Q457 751 469 756M521 760Q535 755 548 766" strokeWidth="1.5"/>
      <path d="M450 764L457 762L465 764M530 773L536 772" stroke="#fff" strokeWidth="1.1"/>
      <path d="M491 782L494 791L500 796M519 778L518 789L522 795M489 804L498 805M514 798L520 800" strokeWidth="1.3"/>
      <path d="M479 822L488 824L497 822M537 817L546 818L554 817" stroke="#fff" strokeWidth=".9"/>
      {/* Broken lower cheek/neck shadows remain separate from the pale left chest. */}
      <g clipPath="url(#alchemy-twoheads-body)" strokeWidth="1.25">
        {Array.from({length:17},(_,i)=><path key={`jaw${i}`} d={`M${444+i*2.3} ${839+i*.6}l${8+i%4*2} ${13+i%3*3}`} strokeDasharray={i%3===0?'5 2':'9 1'}/>)}
        {Array.from({length:18},(_,i)=><path key={`pit${i}`} d={`M${378+i*2.4} ${1049-i*2.2}l${8+i%3*2} ${9+i%4*3}`} strokeWidth={i%5===0?2:1.3}/>)}
        {Array.from({length:26},(_,i)=><path key={`under${i}`} d={`M${412+i*3.8} ${1058+Math.sin(i*.53)*6}l${7+i%4} ${20+i%5*3}`} strokeWidth={i%4===0?2:1.25}/>)}
        <path d="M396 1008L408 1019L409 1031M404 1015L417 1027L418 1038M480 899L488 911L491 918M501 886L512 900L520 912" strokeWidth="2"/>
      </g>
      {/* White crescent with an inked inner curve and irregular small star. */}
      <path d="M540 623C532 644 527 663 532 681C538 704 554 716 577 719C609 724 637 704 648 661C633 686 613 697 587 695C564 694 547 680 542 661Q538 642 540 623Z" fill="#fff" strokeWidth="2.1"/>
      <path d="M538 667C545 692 566 706 589 705Q620 703 639 679L634 693Q615 714 587 713Q558 711 543 692Z" fill="#000" stroke="none"/>
      <path d="M549 687L559 695L567 697M564 702L578 706L584 706M590 708L603 706M611 704L621 699M625 695L632 688" stroke="#fff" strokeWidth="1.3"/>
      <g transform="translate(649 674)">
        <path d="M-4 -9L-9 -26L0 -14L6 -28L7 -12L16 -24L13 -9L25 -15L16 -3L31 0L16 5L26 13L12 11L18 24L5 15L2 28L-3 15L-11 25L-10 11L-25 17L-15 4L-29 0L-16 -5L-23 -16L-10 -10Z" fill="#000" strokeWidth=".7"/>
        <path d="M-3 -12L0 -5L2 -10M-10 -3L-5 -1M5 7L9 13" stroke="#fff" strokeWidth=".8"/>
      </g>
    </g>
  </g>;
}
