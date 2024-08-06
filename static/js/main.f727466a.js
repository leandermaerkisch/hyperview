(()=>{var e={46629:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>U});var n={};r.r(n),r.d(n,{ENTRY_POINT_NAV_URL:()=>j,ENTRY_POINT_URL:()=>u,MAIN_STACK_NAME:()=>c});var s,a,o=r(45914),i=r(68803),l=null==(s=i.default.manifest)||null==(a=s.extra)?void 0:a.base_url;console.log("base_url",i.default.manifest);var u=l?l+"/index.xml":"http://0.0.0.0:8085/index_navigator.xml",j=l?l+"/index.xml":"http://0.0.0.0:8085/index_navigator.xml",c="Main",f=r(16756),d=r(37157),h=r(37392),p=r(27167),v=r.n(p);function m(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function b(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?m(Object(r),!0).forEach((function(t){(0,h.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):m(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var g=r(95636),y=function(e,t){return v()(e).format(t)},O=function(e){var t,r,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{headers:{}};if(null!=(t=i.default.manifest)&&null!=(r=t.extra)&&r.base_url){var s,a,o=g(e.toString()),l=g(null==(s=i.default.manifest)||null==(a=s.extra)?void 0:a.base_url);o.pathname=l.pathname+o.pathname,e=o.toString(),console.log("input",e)}return fetch(e,b(b({},n),{},{mode:"cors",headers:b({"Cache-Control":"no-cache, no-store, must-revalidate",Expires:"0",Pragma:"no-cache"},n.headers)}))},k=r(81232),w=r(41318),x=r(22566);const _=function(e){var t=e.children,r=(0,w.useRoute)(),n=(0,w.useNavigationState)((function(e){return e.routes[0].key===r.key})),s=(0,w.useNavigation)();return(0,w.useFocusEffect)(d.useCallback((function(){var e=function(){var e,t;return!(n||null==(e=r.params)||null==(t=e.url)||!t.includes("custom_android_back"))&&(s.goBack(),!0)};return x.default.addEventListener("hardwareBackPress",e),function(){return x.default.removeEventListener("hardwareBackPress",e)}}),[])),t};var P=r(22152),N=r(4710),S=r(47644);function E(e,t){if(!e)return t;if(e.endsWith("%")){var r=parseInt(e.slice(0,-1),10);return!Number.isNaN(r)&&(s=100,0<=(n=r)&&n>=s)?r:t}var n,s,a=parseInt(e,10);return Number.isNaN(a)?t:a}var z=function(e){var t=E(e.element.getAttribute("width"),"100%"),r=E(e.element.getAttribute("height"),"100%");return"web"===P.default.OS?(0,S.jsx)("div",{dangerouslySetInnerHTML:{__html:e.element.toString()}}):(0,S.jsx)(N.SvgXml,{height:r,width:t,xml:e.element.toString()})};z.namespaceURI="http://www.w3.org/2000/svg",z.localName="svg",z.localNameAliases=[];const A=z;function M(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}var T=function e(t){var r,s=null==(r=t.route.params)?void 0:r.url;if(!s)return null;return(0,S.jsx)(_,{children:(0,S.jsx)(f.default,{back:function(){t.navigation.pop()},behaviors:e.Behaviors,closeModal:function(){t.navigation.pop()},components:[A],entrypointUrl:s,fetch:O,formatDate:y,navigate:function(e,t){},navigation:t.navigation,openModal:function(e){t.navigation.push(n.MODAL_STACK_NAME,e)},push:function(e){var r,s,a=null!=(r=null==(s=t.route.params)?void 0:s.modal)&&r;t.navigation.push(a?n.MODAL_STACK_NAME:c,function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?M(Object(r),!0).forEach((function(t){(0,h.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):M(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({modal:a},e))},route:t.route})})};T.Behaviors=[];const D=T;var L=r(39385),C=(0,r(2461).default)();const R=function(){return(0,S.jsxs)(C.Navigator,{screenOptions:{headerShown:!1},children:[(0,S.jsx)(C.Group,{children:(0,S.jsx)(C.Screen,{component:D,initialParams:{url:u},name:c})}),(0,S.jsx)(C.Group,{screenOptions:{presentation:"modal"},children:(0,S.jsx)(C.Screen,{component:D,name:n.MODAL_STACK_NAME})})]})};var I=r(75705),B=function(e){return e.EXTERNAL="external",e.HYPERVIEW="hyperview",e}(B||{});const U=function(){var e=(0,d.useState)(B.EXTERNAL),t=(0,o.default)(e,2),r=t[0],n=t[1],s={action:"set-navigator-source",callback:function(e){var t=e.getAttributeNS("https://hyperview.org/demo","source");n(t)}};return D.Behaviors=[s],(0,S.jsx)(k.SafeAreaProvider,{children:(0,S.jsx)(k.SafeAreaInsetsContext.Consumer,{children:function(e){return(0,S.jsx)(L.default,{style:{flex:1,paddingBottom:null==e?void 0:e.bottom,paddingLeft:null==e?void 0:e.left,paddingRight:null==e?void 0:e.right},children:(0,S.jsx)(I.default,{children:r==B.EXTERNAL?(0,S.jsx)(f.default,{components:[A],behaviors:[s],entrypointUrl:j,fetch:O,formatDate:y}):(0,S.jsx)(R,{})})})}})})}},46700:(e,t,r)=>{var n={"./af":26568,"./af.js":26568,"./ar":45615,"./ar-dz":67858,"./ar-dz.js":67858,"./ar-kw":45523,"./ar-kw.js":45523,"./ar-ly":68840,"./ar-ly.js":68840,"./ar-ma":10566,"./ar-ma.js":10566,"./ar-sa":24138,"./ar-sa.js":24138,"./ar-tn":86159,"./ar-tn.js":86159,"./ar.js":45615,"./az":99146,"./az.js":99146,"./be":8927,"./be.js":8927,"./bg":82409,"./bg.js":82409,"./bm":51220,"./bm.js":51220,"./bn":13462,"./bn-bd":39777,"./bn-bd.js":39777,"./bn.js":13462,"./bo":83024,"./bo.js":83024,"./br":30835,"./br.js":30835,"./bs":48974,"./bs.js":48974,"./ca":49760,"./ca.js":49760,"./cs":14819,"./cs.js":14819,"./cv":88437,"./cv.js":88437,"./cy":64700,"./cy.js":64700,"./da":10485,"./da.js":10485,"./de":55616,"./de-at":59222,"./de-at.js":59222,"./de-ch":62326,"./de-ch.js":62326,"./de.js":55616,"./dv":53638,"./dv.js":53638,"./el":24177,"./el.js":24177,"./en-au":98169,"./en-au.js":98169,"./en-ca":87497,"./en-ca.js":87497,"./en-gb":21730,"./en-gb.js":21730,"./en-ie":36541,"./en-ie.js":36541,"./en-il":65670,"./en-il.js":65670,"./en-in":6917,"./en-in.js":6917,"./en-nz":57643,"./en-nz.js":57643,"./en-sg":45557,"./en-sg.js":45557,"./eo":21920,"./eo.js":21920,"./es":10788,"./es-do":53950,"./es-do.js":53950,"./es-mx":69271,"./es-mx.js":69271,"./es-us":32899,"./es-us.js":32899,"./es.js":10788,"./et":68047,"./et.js":68047,"./eu":50237,"./eu.js":50237,"./fa":67912,"./fa.js":67912,"./fi":34194,"./fi.js":34194,"./fil":89926,"./fil.js":89926,"./fo":1471,"./fo.js":1471,"./fr":40406,"./fr-ca":77006,"./fr-ca.js":77006,"./fr-ch":67420,"./fr-ch.js":67420,"./fr.js":40406,"./fy":20975,"./fy.js":20975,"./ga":62746,"./ga.js":62746,"./gd":44611,"./gd.js":44611,"./gl":1399,"./gl.js":1399,"./gom-deva":34724,"./gom-deva.js":34724,"./gom-latn":80027,"./gom-latn.js":80027,"./gu":84039,"./gu.js":84039,"./he":54990,"./he.js":54990,"./hi":3346,"./hi.js":3346,"./hr":51466,"./hr.js":51466,"./hu":62390,"./hu.js":62390,"./hy-am":39493,"./hy-am.js":39493,"./id":96596,"./id.js":96596,"./is":62372,"./is.js":62372,"./it":62664,"./it-ch":77848,"./it-ch.js":77848,"./it.js":62664,"./ja":93776,"./ja.js":93776,"./jv":44773,"./jv.js":44773,"./ka":2256,"./ka.js":2256,"./kk":29443,"./kk.js":29443,"./km":67772,"./km.js":67772,"./kn":92404,"./kn.js":92404,"./ko":26683,"./ko.js":26683,"./ku":18042,"./ku.js":18042,"./ky":98944,"./ky.js":98944,"./lb":62499,"./lb.js":62499,"./lo":87011,"./lo.js":87011,"./lt":73336,"./lt.js":73336,"./lv":3769,"./lv.js":3769,"./me":73878,"./me.js":73878,"./mi":10319,"./mi.js":10319,"./mk":12761,"./mk.js":12761,"./ml":78492,"./ml.js":78492,"./mn":60373,"./mn.js":60373,"./mr":55195,"./mr.js":55195,"./ms":8289,"./ms-my":43873,"./ms-my.js":43873,"./ms.js":8289,"./mt":86042,"./mt.js":86042,"./my":24583,"./my.js":24583,"./nb":31569,"./nb.js":31569,"./ne":91347,"./ne.js":91347,"./nl":40834,"./nl-be":60420,"./nl-be.js":60420,"./nl.js":40834,"./nn":69371,"./nn.js":69371,"./oc-lnc":65320,"./oc-lnc.js":65320,"./pa-in":96693,"./pa-in.js":96693,"./pl":29348,"./pl.js":29348,"./pt":3836,"./pt-br":23818,"./pt-br.js":23818,"./pt.js":3836,"./ro":64862,"./ro.js":64862,"./ru":66555,"./ru.js":66555,"./sd":27654,"./sd.js":27654,"./se":52254,"./se.js":52254,"./si":56871,"./si.js":56871,"./sk":86874,"./sk.js":86874,"./sl":51133,"./sl.js":51133,"./sq":96905,"./sq.js":96905,"./sr":39762,"./sr-cyrl":83844,"./sr-cyrl.js":83844,"./sr.js":39762,"./ss":1881,"./ss.js":1881,"./sv":35734,"./sv.js":35734,"./sw":26267,"./sw.js":26267,"./ta":48493,"./ta.js":48493,"./te":76846,"./te.js":76846,"./tet":77193,"./tet.js":77193,"./tg":49530,"./tg.js":49530,"./th":91168,"./th.js":91168,"./tk":69009,"./tk.js":69009,"./tl-ph":13624,"./tl-ph.js":13624,"./tlh":58481,"./tlh.js":58481,"./tr":30026,"./tr.js":30026,"./tzl":38072,"./tzl.js":38072,"./tzm":854,"./tzm-latn":11751,"./tzm-latn.js":11751,"./tzm.js":854,"./ug-cn":7985,"./ug-cn.js":7985,"./uk":14974,"./uk.js":14974,"./ur":22609,"./ur.js":22609,"./uz":71706,"./uz-latn":98922,"./uz-latn.js":98922,"./uz.js":71706,"./vi":46969,"./vi.js":46969,"./x-pseudo":63308,"./x-pseudo.js":63308,"./yo":40214,"./yo.js":40214,"./zh-cn":54030,"./zh-cn.js":54030,"./zh-hk":77612,"./zh-hk.js":77612,"./zh-mo":78665,"./zh-mo.js":78665,"./zh-tw":78191,"./zh-tw.js":78191};function s(e){var t=a(e);return r(t)}function a(e){if(!r.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}s.keys=function(){return Object.keys(n)},s.resolve=a,e.exports=s,s.id=46700},26600:()=>{},29560:()=>{},18511:()=>{},64595:()=>{},4894:()=>{},86976:()=>{},45129:()=>{},15370:()=>{},66193:()=>{},24654:()=>{}},t={};function r(n){var s=t[n];if(void 0!==s)return s.exports;var a=t[n]={id:n,loaded:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.loaded=!0,a.exports}r.m=e,(()=>{var e=[];r.O=(t,n,s,a)=>{if(!n){var o=1/0;for(j=0;j<e.length;j++){for(var[n,s,a]=e[j],i=!0,l=0;l<n.length;l++)(!1&a||o>=a)&&Object.keys(r.O).every((e=>r.O[e](n[l])))?n.splice(l--,1):(i=!1,a<o&&(o=a));if(i){e.splice(j--,1);var u=s();void 0!==u&&(t=u)}}return t}a=a||0;for(var j=e.length;j>0&&e[j-1][2]>a;j--)e[j]=e[j-1];e[j]=[n,s,a]}})(),r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;r.t=function(n,s){if(1&s&&(n=this(n)),8&s)return n;if("object"===typeof n&&n){if(4&s&&n.__esModule)return n;if(16&s&&"function"===typeof n.then)return n}var a=Object.create(null);r.r(a);var o={};e=e||[null,t({}),t([]),t(t)];for(var i=2&s&&n;"object"==typeof i&&!~e.indexOf(i);i=t(i))Object.getOwnPropertyNames(i).forEach((e=>o[e]=()=>n[e]));return o.default=()=>n,r.d(a,o),a}})(),r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e={179:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var s,a,[o,i,l]=n,u=0;if(o.some((t=>0!==e[t]))){for(s in i)r.o(i,s)&&(r.m[s]=i[s]);if(l)var j=l(r)}for(t&&t(n);u<o.length;u++)a=o[u],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(j)},n=self.webpackChunkweb=self.webpackChunkweb||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var n=r.O(void 0,[803],(()=>r(46271)));n=r.O(n)})();
//# sourceMappingURL=main.f727466a.js.map