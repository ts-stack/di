"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[514],{9963:function(e,t,a){a.r(t),a.d(t,{default:function(){return Ce}});var n=a(7294),l=a(4334),r=a(1944),c=a(5281),o=a(2802),i=a(3320),s=a(4477),d=a(1116),m=a(2164),u=a(5999),b=a(2466),p=a(5936);var h="backToTopButton_sjWU",E="backToTopButtonShow_xfvO";function v(){const{shown:e,scrollToTop:t}=function(e){let{threshold:t}=e;const[a,l]=(0,n.useState)(!1),r=(0,n.useRef)(!1),{startScroll:c,cancelScroll:o}=(0,b.Ct)();return(0,b.RF)(((e,a)=>{let{scrollY:n}=e;const c=null==a?void 0:a.scrollY;c&&(r.current?r.current=!1:n>=c?(o(),l(!1)):n<t?l(!1):n+window.innerHeight<document.documentElement.scrollHeight&&l(!0))})),(0,p.S)((e=>{e.location.hash&&(r.current=!0,l(!1))})),{shown:a,scrollToTop:()=>c(0)}}({threshold:300});return n.createElement("button",{"aria-label":(0,u.I)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,l.Z)("clean-btn",c.k.common.backToTopButton,h,e&&E),type:"button",onClick:t})}var _=a(6775),f=a(7524),k=a(6668),g=a(1327),C=a(3117);function I(e){return n.createElement("svg",(0,C.Z)({width:"20",height:"20","aria-hidden":"true"},e),n.createElement("g",{fill:"#7a7a7a"},n.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),n.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))}var S="collapseSidebarButton_PEFL",N="collapseSidebarButtonIcon_kv0_";function Z(e){let{onClick:t}=e;return n.createElement("button",{type:"button",title:(0,u.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,u.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,l.Z)("button button--secondary button--outline",S),onClick:t},n.createElement(I,{className:N}))}var y=a(9689),T=a(902);const x=Symbol("EmptyContext"),L=n.createContext(x);function M(e){let{children:t}=e;const[a,l]=(0,n.useState)(null),r=(0,n.useMemo)((()=>({expandedItem:a,setExpandedItem:l})),[a]);return n.createElement(L.Provider,{value:r},t)}var w=a(6043),A=a(8596),B=a(9960),H=a(2389);function F(e){let{categoryLabel:t,onClick:a}=e;return n.createElement("button",{"aria-label":(0,u.I)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:t}),type:"button",className:"clean-btn menu__caret",onClick:a})}function P(e){let{item:t,onItemClick:a,activePath:r,level:i,index:s,...d}=e;const{items:m,label:u,collapsible:b,className:p,href:h}=t,{docs:{sidebar:{autoCollapseCategories:E}}}=(0,k.L)(),v=function(e){const t=(0,H.Z)();return(0,n.useMemo)((()=>e.href?e.href:!t&&e.collapsible?(0,o.Wl)(e):void 0),[e,t])}(t),_=(0,o._F)(t,r),f=(0,A.Mg)(h,r),{collapsed:g,setCollapsed:I}=(0,w.u)({initialState:()=>!!b&&(!_&&t.collapsed)}),{expandedItem:S,setExpandedItem:N}=function(){const e=(0,n.useContext)(L);if(e===x)throw new T.i6("DocSidebarItemsExpandedStateProvider");return e}(),Z=function(e){void 0===e&&(e=!g),N(e?null:s),I(e)};return function(e){let{isActive:t,collapsed:a,updateCollapsed:l}=e;const r=(0,T.D9)(t);(0,n.useEffect)((()=>{t&&!r&&a&&l(!1)}),[t,r,a,l])}({isActive:_,collapsed:g,updateCollapsed:Z}),(0,n.useEffect)((()=>{b&&S&&S!==s&&E&&I(!0)}),[b,S,s,I,E]),n.createElement("li",{className:(0,l.Z)(c.k.docs.docSidebarItemCategory,c.k.docs.docSidebarItemCategoryLevel(i),"menu__list-item",{"menu__list-item--collapsed":g},p)},n.createElement("div",{className:(0,l.Z)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":f})},n.createElement(B.Z,(0,C.Z)({className:(0,l.Z)("menu__link",{"menu__link--sublist":b,"menu__link--sublist-caret":!h&&b,"menu__link--active":_}),onClick:b?e=>{null==a||a(t),h?Z(!1):(e.preventDefault(),Z())}:()=>{null==a||a(t)},"aria-current":f?"page":void 0,"aria-expanded":b?!g:void 0,href:b?null!=v?v:"#":v},d),u),h&&b&&n.createElement(F,{categoryLabel:u,onClick:e=>{e.preventDefault(),Z()}})),n.createElement(w.z,{lazy:!0,as:"ul",className:"menu__list",collapsed:g},n.createElement(U,{items:m,tabIndex:g?-1:0,onItemClick:a,activePath:r,level:i+1})))}var W=a(3919),D=a(9471),R="menuExternalLink_NmtK";function z(e){let{item:t,onItemClick:a,activePath:r,level:i,index:s,...d}=e;const{href:m,label:u,className:b}=t,p=(0,o._F)(t,r),h=(0,W.Z)(m);return n.createElement("li",{className:(0,l.Z)(c.k.docs.docSidebarItemLink,c.k.docs.docSidebarItemLinkLevel(i),"menu__list-item",b),key:u},n.createElement(B.Z,(0,C.Z)({className:(0,l.Z)("menu__link",!h&&R,{"menu__link--active":p}),"aria-current":p?"page":void 0,to:m},h&&{onClick:a?()=>a(t):void 0},d),u,!h&&n.createElement(D.Z,null)))}var K="menuHtmlItem_M9Kj";function V(e){let{item:t,level:a,index:r}=e;const{value:o,defaultStyle:i,className:s}=t;return n.createElement("li",{className:(0,l.Z)(c.k.docs.docSidebarItemLink,c.k.docs.docSidebarItemLinkLevel(a),i&&[K,"menu__list-item"],s),key:r,dangerouslySetInnerHTML:{__html:o}})}function j(e){let{item:t,...a}=e;switch(t.type){case"category":return n.createElement(P,(0,C.Z)({item:t},a));case"html":return n.createElement(V,(0,C.Z)({item:t},a));default:return n.createElement(z,(0,C.Z)({item:t},a))}}function G(e){let{items:t,...a}=e;return n.createElement(M,null,t.map(((e,t)=>n.createElement(j,(0,C.Z)({key:t,item:e,index:t},a)))))}var U=(0,n.memo)(G),Y="menu_SIkG",q="menuWithAnnouncementBar_GW3s";function O(e){let{path:t,sidebar:a,className:r}=e;const o=function(){const{isActive:e}=(0,y.nT)(),[t,a]=(0,n.useState)(e);return(0,b.RF)((t=>{let{scrollY:n}=t;e&&a(0===n)}),[e]),e&&t}();return n.createElement("nav",{className:(0,l.Z)("menu thin-scrollbar",Y,o&&q,r)},n.createElement("ul",{className:(0,l.Z)(c.k.docs.docSidebarMenu,"menu__list")},n.createElement(U,{items:a,activePath:t,level:1})))}var X="sidebar_njMd",J="sidebarWithHideableNavbar_wUlq",Q="sidebarHidden_VK0M",$="sidebarLogo_isFc";function ee(e){let{path:t,sidebar:a,onCollapse:r,isHidden:c}=e;const{navbar:{hideOnScroll:o},docs:{sidebar:{hideable:i}}}=(0,k.L)();return n.createElement("div",{className:(0,l.Z)(X,o&&J,c&&Q)},o&&n.createElement(g.Z,{tabIndex:-1,className:$}),n.createElement(O,{path:t,sidebar:a}),i&&n.createElement(Z,{onClick:r}))}var te=n.memo(ee),ae=a(3102),ne=a(2961);const le=e=>{let{sidebar:t,path:a}=e;const r=(0,ne.e)();return n.createElement("ul",{className:(0,l.Z)(c.k.docs.docSidebarMenu,"menu__list")},n.createElement(U,{items:t,activePath:a,onItemClick:e=>{"category"===e.type&&e.href&&r.toggle(),"link"===e.type&&r.toggle()},level:1}))};function re(e){return n.createElement(ae.Zo,{component:le,props:e})}var ce=n.memo(re);function oe(e){const t=(0,f.i)(),a="desktop"===t||"ssr"===t,l="mobile"===t;return n.createElement(n.Fragment,null,a&&n.createElement(te,e),l&&n.createElement(ce,e))}var ie="expandButton_m80_",se="expandButtonIcon_BlDH";function de(e){let{toggleSidebar:t}=e;return n.createElement("div",{className:ie,title:(0,u.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,u.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t},n.createElement(I,{className:se}))}var me="docSidebarContainer_b6E3",ue="docSidebarContainerHidden_b3ry";function be(e){var t;let{children:a}=e;const l=(0,d.V)();return n.createElement(n.Fragment,{key:null!=(t=null==l?void 0:l.name)?t:"noSidebar"},a)}function pe(e){let{sidebar:t,hiddenSidebarContainer:a,setHiddenSidebarContainer:r}=e;const{pathname:o}=(0,_.TH)(),[i,s]=(0,n.useState)(!1),d=(0,n.useCallback)((()=>{i&&s(!1),r((e=>!e))}),[r,i]);return n.createElement("aside",{className:(0,l.Z)(c.k.docs.docSidebarContainer,me,a&&ue),onTransitionEnd:e=>{e.currentTarget.classList.contains(me)&&a&&s(!0)}},n.createElement(be,null,n.createElement(oe,{sidebar:t,path:o,onCollapse:d,isHidden:i})),i&&n.createElement(de,{toggleSidebar:d}))}var he={docMainContainer:"docMainContainer_gTbr",docMainContainerEnhanced:"docMainContainerEnhanced_Uz_u",docItemWrapperEnhanced:"docItemWrapperEnhanced_czyv"};function Ee(e){let{hiddenSidebarContainer:t,children:a}=e;const r=(0,d.V)();return n.createElement("main",{className:(0,l.Z)(he.docMainContainer,(t||!r)&&he.docMainContainerEnhanced)},n.createElement("div",{className:(0,l.Z)("container padding-top--md padding-bottom--lg",he.docItemWrapper,t&&he.docItemWrapperEnhanced)},a))}var ve="docPage__5DB",_e="docsWrapper_BCFX";function fe(e){let{children:t}=e;const a=(0,d.V)(),[l,r]=(0,n.useState)(!1);return n.createElement(m.Z,{wrapperClassName:_e},n.createElement(v,null),n.createElement("div",{className:ve},a&&n.createElement(pe,{sidebar:a.items,hiddenSidebarContainer:l,setHiddenSidebarContainer:r}),n.createElement(Ee,{hiddenSidebarContainer:l},t)))}var ke=a(4972),ge=a(197);function Ce(e){const{versionMetadata:t}=e,a=(0,o.hI)(e);if(!a)return n.createElement(ke.default,null);const{docElement:m,sidebarName:u,sidebarItems:b}=a;return n.createElement(n.Fragment,null,n.createElement(ge.Z,{version:t.version,tag:(0,i.os)(t.pluginId,t.version)}),n.createElement(r.FG,{className:(0,l.Z)(c.k.wrapper.docsPages,c.k.page.docsDocPage,e.versionMetadata.className)},n.createElement(s.q,{version:t},n.createElement(d.b,{name:u,items:b},n.createElement(fe,null,m)))))}}}]);