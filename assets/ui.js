/* Componenti comuni di area clienti e dashboard */
(function () {
  var NF = window.NF, esc = NF.esc;

  var LOGO = '<svg class="nf-logo" viewBox="0 0 100 100" aria-hidden="true" overflow="visible"><defs><radialGradient id="nfa-alone"><stop offset="0" stop-color="#FFF0F8"/><stop offset=".35" stop-color="#F29AC6" stop-opacity=".85"/><stop offset="1" stop-color="#D63384" stop-opacity="0"/></radialGradient><clipPath id="nfa-dietro"><rect x="-10" y="-10" width="120" height="63"/></clipPath><clipPath id="nfa-davanti"><rect x="-10" y="53" width="120" height="70"/></clipPath></defs><g transform="rotate(-14 50 53)"><g clip-path="url(#nfa-dietro)"><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#6FC3C3" stroke-opacity="0.12" stroke-width="0.77" stroke-linecap="butt" stroke-dasharray="38.00 62.00" stroke-dashoffset="38.00"><animate attributeName="stroke-dashoffset" from="38.00" to="-62.00" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#77C0C3" stroke-opacity="0.128" stroke-width="0.84" stroke-linecap="butt" stroke-dasharray="36.48 63.52" stroke-dashoffset="36.48"><animate attributeName="stroke-dashoffset" from="36.48" to="-63.52" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#7FBEC3" stroke-opacity="0.141" stroke-width="0.95" stroke-linecap="butt" stroke-dasharray="34.96 65.04" stroke-dashoffset="34.96"><animate attributeName="stroke-dashoffset" from="34.96" to="-65.04" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#87BBC4" stroke-opacity="0.159" stroke-width="1.08" stroke-linecap="butt" stroke-dasharray="33.43 66.57" stroke-dashoffset="33.43"><animate attributeName="stroke-dashoffset" from="33.43" to="-66.57" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#90B9C4" stroke-opacity="0.18" stroke-width="1.22" stroke-linecap="butt" stroke-dasharray="31.91 68.09" stroke-dashoffset="31.91"><animate attributeName="stroke-dashoffset" from="31.91" to="-68.09" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#98B6C4" stroke-opacity="0.204" stroke-width="1.37" stroke-linecap="butt" stroke-dasharray="30.39 69.61" stroke-dashoffset="30.39"><animate attributeName="stroke-dashoffset" from="30.39" to="-69.61" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#A0B4C4" stroke-opacity="0.231" stroke-width="1.54" stroke-linecap="butt" stroke-dasharray="28.87 71.13" stroke-dashoffset="28.87"><animate attributeName="stroke-dashoffset" from="28.87" to="-71.13" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#A8B1C4" stroke-opacity="0.259" stroke-width="1.71" stroke-linecap="butt" stroke-dasharray="27.35 72.65" stroke-dashoffset="27.35"><animate attributeName="stroke-dashoffset" from="27.35" to="-72.65" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#B0AFC4" stroke-opacity="0.29" stroke-width="1.88" stroke-linecap="butt" stroke-dasharray="25.83 74.17" stroke-dashoffset="25.83"><animate attributeName="stroke-dashoffset" from="25.83" to="-74.17" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#B8ACC5" stroke-opacity="0.323" stroke-width="2.07" stroke-linecap="butt" stroke-dasharray="24.30 75.70" stroke-dashoffset="24.30"><animate attributeName="stroke-dashoffset" from="24.30" to="-75.70" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#C0AAC5" stroke-opacity="0.358" stroke-width="2.26" stroke-linecap="butt" stroke-dasharray="22.78 77.22" stroke-dashoffset="22.78"><animate attributeName="stroke-dashoffset" from="22.78" to="-77.22" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#C9A7C5" stroke-opacity="0.395" stroke-width="2.46" stroke-linecap="butt" stroke-dasharray="21.26 78.74" stroke-dashoffset="21.26"><animate attributeName="stroke-dashoffset" from="21.26" to="-78.74" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#D1A4C5" stroke-opacity="0.433" stroke-width="2.66" stroke-linecap="butt" stroke-dasharray="19.74 80.26" stroke-dashoffset="19.74"><animate attributeName="stroke-dashoffset" from="19.74" to="-80.26" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#D9A2C5" stroke-opacity="0.473" stroke-width="2.87" stroke-linecap="butt" stroke-dasharray="18.22 81.78" stroke-dashoffset="18.22"><animate attributeName="stroke-dashoffset" from="18.22" to="-81.78" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#E19FC6" stroke-opacity="0.514" stroke-width="3.08" stroke-linecap="butt" stroke-dasharray="16.70 83.30" stroke-dashoffset="16.70"><animate attributeName="stroke-dashoffset" from="16.70" to="-83.30" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#E99DC6" stroke-opacity="0.557" stroke-width="3.30" stroke-linecap="butt" stroke-dasharray="15.17 84.83" stroke-dashoffset="15.17"><animate attributeName="stroke-dashoffset" from="15.17" to="-84.83" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F19AC6" stroke-opacity="0.602" stroke-width="3.52" stroke-linecap="butt" stroke-dasharray="13.65 86.35" stroke-dashoffset="13.65"><animate attributeName="stroke-dashoffset" from="13.65" to="-86.35" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F4A5CD" stroke-opacity="0.647" stroke-width="3.75" stroke-linecap="butt" stroke-dasharray="12.13 87.87" stroke-dashoffset="12.13"><animate attributeName="stroke-dashoffset" from="12.13" to="-87.87" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F6B2D4" stroke-opacity="0.695" stroke-width="3.98" stroke-linecap="butt" stroke-dasharray="10.61 89.39" stroke-dashoffset="10.61"><animate attributeName="stroke-dashoffset" from="10.61" to="-89.39" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F7BEDB" stroke-opacity="0.743" stroke-width="4.21" stroke-linecap="butt" stroke-dasharray="9.09 90.91" stroke-dashoffset="9.09"><animate attributeName="stroke-dashoffset" from="9.09" to="-90.91" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F9CBE2" stroke-opacity="0.793" stroke-width="4.45" stroke-linecap="butt" stroke-dasharray="7.57 92.43" stroke-dashoffset="7.57"><animate attributeName="stroke-dashoffset" from="7.57" to="-92.43" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FBD7EA" stroke-opacity="0.844" stroke-width="4.69" stroke-linecap="butt" stroke-dasharray="6.04 93.96" stroke-dashoffset="6.04"><animate attributeName="stroke-dashoffset" from="6.04" to="-93.96" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FDE4F1" stroke-opacity="0.896" stroke-width="4.94" stroke-linecap="butt" stroke-dasharray="4.52 95.48" stroke-dashoffset="4.52"><animate attributeName="stroke-dashoffset" from="4.52" to="-95.48" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FFF0F8" stroke-opacity="0.95" stroke-width="5.19" stroke-linecap="round" stroke-dasharray="3.00 97.00" stroke-dashoffset="3.00"><animate attributeName="stroke-dashoffset" from="3.00" to="-97.00" dur="7s" repeatCount="indefinite"/></path><g><g transform="scale(1.7)"><circle r="9" fill="url(#nfa-alone)"/><path d="M0 -6 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z" fill="#FFF0F8"/></g><animateMotion dur="7s" repeatCount="indefinite" path="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/></g></g></g><g class="nf-lettere" fill="#F3EAF0"><path transform="translate(6.47 73) scale(0.03067 -0.03067)" d="M300.2132568359375 1500V39H534.089599609375V0H54.2132568359375V39H259.2132568359375V1461H54.2132568359375V1500ZM1502.04541015625 1500V1461H1291.2813720703125V-20H1237.04541015625L271.44921875 1500H567.2825927734375L1251.04541015625 404.5645751953125V1461H1022.6409912109375V1500Z"/><path transform="translate(55.39 73) scale(0.03067 -0.03067)" d="M804.8662109375 517.123046875Q797.787353515625 584.123046875 768.8939819335938 630.84228515625Q740.0006103515625 677.5615234375 685.6185913085938 702.1627807617188Q631.236572265625 726.7640380859375 548.955810546875 726.7640380859375H418.1917724609375V765.2359619140625H548.955810546875Q631.236572265625 765.2359619140625 685.6185913085938 786.9552001953125Q740.0006103515625 808.6744384765625 768.8939819335938 852.7756958007812Q797.787353515625 896.876953125 804.8662109375 963.876953125H844.6302490234375V517.123046875ZM1135.1917724609375 1500V1090H1095.955810546875Q1088.876953125 1197 1051.741943359375 1281.0Q1014.60693359375 1365 941.9214477539062 1413.0Q869.2359619140625 1461 754.5955810546875 1461H481.8441162109375V39H681.080078125V0H54.2132568359375V39H234.44921875V1461H54.2132568359375V1500Z"/></g><g transform="rotate(-14 50 53)"><g clip-path="url(#nfa-davanti)"><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#6FC3C3" stroke-opacity="0.12" stroke-width="0.77" stroke-linecap="butt" stroke-dasharray="38.00 62.00" stroke-dashoffset="38.00"><animate attributeName="stroke-dashoffset" from="38.00" to="-62.00" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#77C0C3" stroke-opacity="0.128" stroke-width="0.84" stroke-linecap="butt" stroke-dasharray="36.48 63.52" stroke-dashoffset="36.48"><animate attributeName="stroke-dashoffset" from="36.48" to="-63.52" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#7FBEC3" stroke-opacity="0.141" stroke-width="0.95" stroke-linecap="butt" stroke-dasharray="34.96 65.04" stroke-dashoffset="34.96"><animate attributeName="stroke-dashoffset" from="34.96" to="-65.04" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#87BBC4" stroke-opacity="0.159" stroke-width="1.08" stroke-linecap="butt" stroke-dasharray="33.43 66.57" stroke-dashoffset="33.43"><animate attributeName="stroke-dashoffset" from="33.43" to="-66.57" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#90B9C4" stroke-opacity="0.18" stroke-width="1.22" stroke-linecap="butt" stroke-dasharray="31.91 68.09" stroke-dashoffset="31.91"><animate attributeName="stroke-dashoffset" from="31.91" to="-68.09" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#98B6C4" stroke-opacity="0.204" stroke-width="1.37" stroke-linecap="butt" stroke-dasharray="30.39 69.61" stroke-dashoffset="30.39"><animate attributeName="stroke-dashoffset" from="30.39" to="-69.61" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#A0B4C4" stroke-opacity="0.231" stroke-width="1.54" stroke-linecap="butt" stroke-dasharray="28.87 71.13" stroke-dashoffset="28.87"><animate attributeName="stroke-dashoffset" from="28.87" to="-71.13" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#A8B1C4" stroke-opacity="0.259" stroke-width="1.71" stroke-linecap="butt" stroke-dasharray="27.35 72.65" stroke-dashoffset="27.35"><animate attributeName="stroke-dashoffset" from="27.35" to="-72.65" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#B0AFC4" stroke-opacity="0.29" stroke-width="1.88" stroke-linecap="butt" stroke-dasharray="25.83 74.17" stroke-dashoffset="25.83"><animate attributeName="stroke-dashoffset" from="25.83" to="-74.17" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#B8ACC5" stroke-opacity="0.323" stroke-width="2.07" stroke-linecap="butt" stroke-dasharray="24.30 75.70" stroke-dashoffset="24.30"><animate attributeName="stroke-dashoffset" from="24.30" to="-75.70" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#C0AAC5" stroke-opacity="0.358" stroke-width="2.26" stroke-linecap="butt" stroke-dasharray="22.78 77.22" stroke-dashoffset="22.78"><animate attributeName="stroke-dashoffset" from="22.78" to="-77.22" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#C9A7C5" stroke-opacity="0.395" stroke-width="2.46" stroke-linecap="butt" stroke-dasharray="21.26 78.74" stroke-dashoffset="21.26"><animate attributeName="stroke-dashoffset" from="21.26" to="-78.74" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#D1A4C5" stroke-opacity="0.433" stroke-width="2.66" stroke-linecap="butt" stroke-dasharray="19.74 80.26" stroke-dashoffset="19.74"><animate attributeName="stroke-dashoffset" from="19.74" to="-80.26" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#D9A2C5" stroke-opacity="0.473" stroke-width="2.87" stroke-linecap="butt" stroke-dasharray="18.22 81.78" stroke-dashoffset="18.22"><animate attributeName="stroke-dashoffset" from="18.22" to="-81.78" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#E19FC6" stroke-opacity="0.514" stroke-width="3.08" stroke-linecap="butt" stroke-dasharray="16.70 83.30" stroke-dashoffset="16.70"><animate attributeName="stroke-dashoffset" from="16.70" to="-83.30" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#E99DC6" stroke-opacity="0.557" stroke-width="3.30" stroke-linecap="butt" stroke-dasharray="15.17 84.83" stroke-dashoffset="15.17"><animate attributeName="stroke-dashoffset" from="15.17" to="-84.83" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F19AC6" stroke-opacity="0.602" stroke-width="3.52" stroke-linecap="butt" stroke-dasharray="13.65 86.35" stroke-dashoffset="13.65"><animate attributeName="stroke-dashoffset" from="13.65" to="-86.35" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F4A5CD" stroke-opacity="0.647" stroke-width="3.75" stroke-linecap="butt" stroke-dasharray="12.13 87.87" stroke-dashoffset="12.13"><animate attributeName="stroke-dashoffset" from="12.13" to="-87.87" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F6B2D4" stroke-opacity="0.695" stroke-width="3.98" stroke-linecap="butt" stroke-dasharray="10.61 89.39" stroke-dashoffset="10.61"><animate attributeName="stroke-dashoffset" from="10.61" to="-89.39" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F7BEDB" stroke-opacity="0.743" stroke-width="4.21" stroke-linecap="butt" stroke-dasharray="9.09 90.91" stroke-dashoffset="9.09"><animate attributeName="stroke-dashoffset" from="9.09" to="-90.91" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F9CBE2" stroke-opacity="0.793" stroke-width="4.45" stroke-linecap="butt" stroke-dasharray="7.57 92.43" stroke-dashoffset="7.57"><animate attributeName="stroke-dashoffset" from="7.57" to="-92.43" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FBD7EA" stroke-opacity="0.844" stroke-width="4.69" stroke-linecap="butt" stroke-dasharray="6.04 93.96" stroke-dashoffset="6.04"><animate attributeName="stroke-dashoffset" from="6.04" to="-93.96" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FDE4F1" stroke-opacity="0.896" stroke-width="4.94" stroke-linecap="butt" stroke-dasharray="4.52 95.48" stroke-dashoffset="4.52"><animate attributeName="stroke-dashoffset" from="4.52" to="-95.48" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FFF0F8" stroke-opacity="0.95" stroke-width="5.19" stroke-linecap="round" stroke-dasharray="3.00 97.00" stroke-dashoffset="3.00"><animate attributeName="stroke-dashoffset" from="3.00" to="-97.00" dur="7s" repeatCount="indefinite"/></path><g><g transform="scale(1.7)"><circle r="9" fill="url(#nfa-alone)"/><path d="M0 -6 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z" fill="#FFF0F8"/></g><animateMotion dur="7s" repeatCount="indefinite" path="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/></g></g></g></svg>';

  function toast(msg, errore) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.toggle('errore', !!errore); t.classList.add('visibile');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('visibile'); }, errore ? 5000 : 2600);
  }

  function demoBar(testo) {
    if (NF.live) return '';
    return '<div class="demo-bar"><b>Modalità demo</b> · ' + testo + ' I dati sono di esempio e non vengono salvati.</div>';
  }

  function avatar(p, grande) {
    var cls = 'avatar' + (grande ? ' grande' : '');
    if (p && p.avatar_url) return '<span class="' + cls + '"><img src="' + esc(p.avatar_url) + '" alt="" referrerpolicy="no-referrer"></span>';
    return '<span class="' + cls + '" aria-hidden="true">' + esc(NF.iniziali(p && (p.nome || p.email))) + '</span>';
  }

  var riduci = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- animazioni ----------
  // numeri che contano fino al valore
  function conta(root) {
    (root || document).querySelectorAll('[data-conta]').forEach(function (el) {
      var fine = +el.getAttribute('data-conta'); if (riduci || !fine) { el.textContent = fine; return; }
      var t0 = null, dur = 800 + Math.min(600, fine * 40);
      (function passo(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(fine * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(passo); })(performance.now());
    });
  }
  // elementi nuovi (arrivati dopo il primo disegno) si illuminano
  function segnaNuovi(box, sel) {
    var ids = [].slice.call(box.querySelectorAll(sel)).map(function (el) { return el.getAttribute('data-id'); });
    if (box._visti) box.querySelectorAll(sel).forEach(function (el) { if (!box._visti[el.getAttribute('data-id')]) el.classList.add('nuovo'); });
    box._visti = {}; ids.forEach(function (i) { box._visti[i] = 1; });
  }
  // cambio di vista con View Transitions, se il browser le supporta
  function transizione(fn) {
    if (document.startViewTransition && !riduci) { var t = document.startViewTransition(fn); return t.updateCallbackDone; }
    return Promise.resolve(fn());
  }
  // "sta scrivendo…" in fondo alla conversazione
  function scrive(box, nome) {
    if (!box) return;
    var el = box.querySelector('.digitando');
    if (!el) { el = document.createElement('div'); el.className = 'msg digitando'; el.innerHTML = '<div class="bolla" aria-hidden="true"><i></i><i></i><i></i></div><div class="info"></div>'; box.appendChild(el); }
    el.querySelector('.info').textContent = nome + ' sta scrivendo…';
    box.scrollTo({ top: box.scrollHeight, behavior: riduci ? 'instant' : 'smooth' });
    clearTimeout(el._h); el._h = setTimeout(function () { el.remove(); }, 4500);
  }
  function saluto() { var h = new Date().getHours(); return h < 5 ? 'Buonasera' : h < 13 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera'; }

  // ---------- elenco documenti ----------
  function estensione(n) { var m = /\.([a-z0-9]{2,5})$/i.exec(n || ''); return m ? m[1].toUpperCase() : 'FILE'; }
  function righeDocumenti(docs, opz) {
    if (!docs.length) return '<div class="vuoto">' + esc(opz.vuoto) + '</div>';
    return '<ul class="doc-lista">' + docs.map(function (d) {
      var puoEliminare = opz.eliminaTutti || !d.da_naomi;
      return '<li class="doc' + (d.da_naomi ? ' da-naomi' : '') + '" data-id="' + esc(d.id) + '">' +
        '<span class="icona">' + esc(estensione(d.nome)) + '</span>' +
        '<div style="min-width:0"><div class="nome">' + esc(d.nome) + '</div><div class="meta">' +
        (d.da_naomi ? '<span class="pill naomi">Da Naomi</span>' : '<span>' + esc(NF.CATEGORIE[d.categoria] || 'Documento') + '</span>') +
        '<span>' + esc(NF.quando(d.creato_il)) + '</span><span>' + esc(NF.peso(d.dimensione)) + '</span></div></div>' +
        '<div class="azioni"><button class="icon-btn" data-az="scarica" type="button" aria-label="Scarica ' + esc(d.nome) + '">Scarica</button>' +
        '<button class="icon-btn" data-az="commenta" type="button" aria-label="Commenta ' + esc(d.nome) + '">Commenta</button>' +
        (puoEliminare ? '<button class="icon-btn pericolo" data-az="elimina" type="button" aria-label="Elimina ' + esc(d.nome) + '">Elimina</button>' : '') +
        '</div></li>';
    }).join('') + '</ul>';
  }
  function collegaDocumenti(box, docs, azioni) {
    box.querySelectorAll('.doc').forEach(function (li) {
      var d = docs.find(function (x) { return x.id === li.getAttribute('data-id'); });
      li.querySelectorAll('[data-az]').forEach(function (b) {
        b.addEventListener('click', async function () {
          var az = b.getAttribute('data-az');
          if (az === 'scarica') {
            var url = await NF.linkDownload(d);
            if (!url) return toast(NF.live ? 'Download non riuscito, riprova.' : 'In modalità demo si possono scaricare solo i file caricati in questa sessione.', true);
            var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.download = d.nome; document.body.appendChild(a); a.click(); a.remove();
          }
          if (az === 'commenta') azioni.commenta(d);
          if (az === 'elimina') {
            if (b.dataset.conferma !== '1') { b.dataset.conferma = '1'; b.textContent = 'Confermi?'; setTimeout(function () { b.dataset.conferma = ''; b.textContent = 'Elimina'; }, 3500); return; }
            var r = await NF.eliminaDocumento(d); if (r.errore) toast(r.errore, true); else { toast('Documento eliminato'); azioni.aggiorna(); }
          }
        });
      });
    });
  }

  // ---------- caricamento ----------
  function dropzone(box, opz) {
    var cats = Object.keys(NF.CATEGORIE).filter(function (k) { return opz.naomi ? true : k !== 'consegna'; });
    box.innerHTML = '<div class="dropzone"><b>' + esc(opz.titolo) + '</b><small>Trascina qui i file oppure sceglili · PDF, Word, immagini · max ' + (window.NF_CONFIG.MAX_FILE_MB || 20) + ' MB</small>' +
      '<span class="riga"><select aria-label="Tipo di documento" id="' + opz.id + '-cat">' + cats.map(function (k) { return '<option value="' + k + '"' + (k === (opz.naomi ? 'consegna' : 'cv') ? ' selected' : '') + '>' + esc(NF.CATEGORIE[k]) + '</option>'; }).join('') + '</select>' +
      '<label class="btn btn-scuro" for="' + opz.id + '" style="min-height:44px">Scegli file</label></span>' +
      '<input id="' + opz.id + '" type="file" multiple accept=".pdf,.doc,.docx,.odt,.txt,.jpg,.jpeg,.png,.webp" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none">' +
      '<span class="progresso" hidden><i></i></span></div>';
    var z = box.querySelector('.dropzone'), inp = box.querySelector('input[type=file]'), sel = box.querySelector('select'), bar = box.querySelector('.progresso');
    z.style.position = 'relative';
    ['dragenter', 'dragover'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.add('sopra'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.remove('sopra'); }); });
    z.addEventListener('drop', function (e) { invia(e.dataTransfer.files); });
    inp.addEventListener('change', function () { invia(inp.files); inp.value = ''; });
    async function invia(files) {
      files = Array.prototype.slice.call(files || []); if (!files.length) return;
      bar.hidden = false; var fatti = 0, errori = [];
      for (var i = 0; i < files.length; i++) {
        bar.firstChild.style.width = Math.round((i / files.length) * 100) + '%';
        var r = await NF.carica(opz.clienteId(), files[i], sel.value, opz.naomi);
        if (r.errore) errori.push(r.errore); else fatti++;
      }
      bar.firstChild.style.width = '100%'; setTimeout(function () { bar.hidden = true; bar.firstChild.style.width = '0'; }, 600);
      if (errori.length) toast(errori[0], true); else { toast(fatti === 1 ? 'Documento caricato' : fatti + ' documenti caricati'); z.classList.remove('fatto'); z.offsetWidth; z.classList.add('fatto'); setTimeout(function () { z.classList.remove('fatto'); }, 1400); }
      opz.dopo();
    }
  }

  // ---------- conversazione ----------
  function chat(box, messaggi, docs, opz) {
    if (!messaggi.length) { box.innerHTML = '<div class="vuoto">' + esc(opz.vuoto) + '</div>'; return; }
    var ultimoGiorno = '', out = '';
    messaggi.forEach(function (m) {
      var g = new Date(m.creato_il).toDateString();
      if (g !== ultimoGiorno) { ultimoGiorno = g; out += '<div class="giorno-sep">' + esc(NF.fmtData.format(new Date(m.creato_il))) + '</div>'; }
      var mio = opz.naomi ? m.da_naomi : !m.da_naomi;
      var doc = m.documento_id ? docs.find(function (d) { return d.id === m.documento_id; }) : null;
      out += '<div class="msg' + (mio ? ' mio' : '') + '" data-id="' + esc(m.id) + '">' +
        (doc ? '<span class="rif">📎 ' + esc(doc.nome) + '</span>' : '') +
        '<div class="bolla">' + esc(m.testo) + '</div>' +
        '<div class="info">' + esc(m.da_naomi ? 'Naomi' : (opz.nomeCliente || 'Cliente')) + ' · ' + esc(NF.quando(m.creato_il)) + (mio && m.letto ? ' · letto' : '') + '</div></div>';
    });
    var scriveva = box.querySelector('.digitando');
    box.innerHTML = out;
    segnaNuovi(box, '.msg[data-id]');
    if (scriveva && !box.querySelector('.msg.nuovo:not(.mio)')) box.appendChild(scriveva);
    requestAnimationFrame(function () { box.scrollTo({ top: box.scrollHeight, behavior: 'instant' }); });
  }
  function composer(box, opz) {
    box.innerHTML = '<form class="scrivi"><div class="riferimento" hidden><span></span><button type="button" class="icon-btn" aria-label="Rimuovi riferimento al documento">×</button></div>' +
      '<div class="riga"><label for="' + opz.id + '" class="sr" style="position:absolute;left:-9999px">Messaggio</label><textarea id="' + opz.id + '" rows="2" placeholder="' + esc(opz.placeholder) + '"></textarea>' +
      '<button class="btn btn-lume" type="submit">Invia</button></div><small class="sotto">Invio con Ctrl+Invio o ⌘+Invio</small></form>';
    var f = box.querySelector('form'), ta = f.querySelector('textarea'), rif = f.querySelector('.riferimento'), docId = null;
    rif.querySelector('button').addEventListener('click', function () { docId = null; rif.hidden = true; });
    ta.addEventListener('input', function () { if (opz.suScrittura && ta.value.trim()) opz.suScrittura(); });
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); f.requestSubmit(); } });
    f.addEventListener('submit', async function (e) {
      e.preventDefault(); var b = f.querySelector('button[type=submit]'); b.disabled = true;
      var r = await NF.scrivi(opz.clienteId(), ta.value, docId, opz.naomi); b.disabled = false;
      if (r.errore) return toast(r.errore, true);
      ta.value = ''; docId = null; rif.hidden = true; opz.dopo();
    });
    return {
      riferisci: function (d) { docId = d.id; rif.hidden = false; rif.querySelector('span').textContent = '📎 Sul documento: ' + d.nome; ta.focus(); box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    };
  }

  window.UI = { LOGO: LOGO, toast: toast, demoBar: demoBar, avatar: avatar, righeDocumenti: righeDocumenti, collegaDocumenti: collegaDocumenti, dropzone: dropzone, chat: chat, composer: composer,
    conta: conta, segnaNuovi: segnaNuovi, transizione: transizione, scrive: scrive, saluto: saluto, riduci: riduci };
})();
