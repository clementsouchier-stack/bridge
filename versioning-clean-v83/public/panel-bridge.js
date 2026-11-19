/* Bridge V83 isolated V80 metadata-panel bridge.
   Original public/metadata-v80.html is an exact byte-for-byte copy of GitHub V80.
   No V81 or V82 code is loaded. This adapter only attaches a Versions tab and
   mediates events with the parent React application. */
(()=>{
"use strict";
if(window.__bridgeCleanPanel)return;window.__bridgeCleanPanel=true;
const doc=document, parent=window.parent, $=id=>doc.getElementById(id);
const send=(type,data={})=>parent.postMessage({bridgeV83:true,type,...data},location.origin);
const style=doc.createElement("link");style.rel="stylesheet";style.href="/panel-bridge.css";doc.head.append(style);
function init(){
 const tabs=$("v62-main-tabs"),file=$("bridge-file-panel"),launcher=$("v63-open-meta");
 if(!tabs||!file){send("PANEL_ERROR",{message:"Canonical V80 tabs/file not found"});return;}
 const shell=$("v63-metadata-shell")||doc.querySelector(".v83-panel-host > div");
 if(shell&&!shell.id)shell.id="v63-metadata-shell";
 if(launcher)launcher.click();
 if(shell){shell.style.display="block";shell.style.visibility="visible";shell.style.width="100%";shell.style.right="0";shell.style.top="0";}
 let close=shell?.querySelector(".v63-meta-close");
 if(!close&&shell){close=doc.createElement("button");close.type="button";close.className="v83-panel-close";close.textContent="×";close.setAttribute("aria-label","Close metadata panel");shell.append(close);}
 if(close)close.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();send("PANEL_CLOSE");},true);
 const versionsTab=doc.createElement("li");versionsTab.id="bridge-v83-version-tab";
 versionsTab.className="group relative flex h-12 cursor-pointer items-center px-xs hover:bg-neutralSoftBg";
 versionsTab.role="tab";versionsTab.tabIndex=-1;versionsTab.setAttribute("aria-selected","false");
 versionsTab.innerHTML='<span class="text-secondaryContent">Versions</span>';
 const fileTab=tabs.querySelector('[data-v62-section="file"]');fileTab.before(versionsTab);
 const pane=doc.createElement("section");pane.id="bridge-v83-version-pane";pane.className="meta-custom";pane.hidden=true;
 pane.setAttribute("role","tabpanel");pane.setAttribute("aria-labelledby","bridge-v83-version-tab");file.after(pane);
 let master={name:"Hardcore",artist:"Johnny Jane"},children=[],selectedVersion=null,activeSection="metadata";
 const node=(tag,cls,txt)=>{const el=doc.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;};
 const button=(txt,cls,cb)=>{const b=node("button",cls,txt);b.type="button";b.addEventListener("click",cb);return b;};
 const sectionList=(title,records)=>{
  const box=node("section","v83-vgroup");const h=node("div","v83-vgroup-heading");
  h.append(node("strong","",title),node("span","",String(records.length)));box.append(h);
  for(const record of records){
    const row=node("div","v83-vrow"),play=button("","v83-iconbutton",()=>send("PLAY_VERSION",{trackId:record.id}));
    play.textContent="▶";play.setAttribute("aria-label","Play "+record.name);row.append(play);
    const description=node("div","v83-vrow-content");
    const name=node("strong","",record.name);
    const meta=node("small","",(record.type||"Mix")+(record.duration?" · "+record.duration:"")+(record.fileName?" · "+record.fileName:""));
    description.append(name,meta);row.append(description);
    if(title==="Original")row.append(node("span","v83-main-chip","Main"));
    else{
      const opt=button("···","v83-iconbutton",()=>{const menu=row.querySelector(".v83-row-menu");if(menu){menu.remove();return;}pane.querySelectorAll(".v83-row-menu").forEach(e=>e.remove());const m=node("div","v83-row-menu");
        m.append(button("Rename", "",()=>{const next=window.prompt("Version name",record.name);if(next?.trim())send("RENAME_VERSION",{trackId:record.id,name:next.trim()});m.remove();}));
        m.append(button("Unlink", "",()=>{send("UNLINK_VERSION",{trackId:record.id});m.remove();}));
        row.append(m);
      });opt.setAttribute("aria-label","More actions for "+record.name);row.append(opt);
    }
    box.append(row);
  }
  pane.append(box);
 };
 function render(){
  pane.replaceChildren();
  const head=node("div","v83-v-head");head.append(node("h3","", "Versions"),node("span","v83-v-subtitle",children.length+" linked files"));
  pane.append(head);
  pane.append(node("p","v83-v-description","Group alternate versions of the same recording. Each linked track retains its identity and can be played, shared or unlinked separately."));
  sectionList("Original",[{...master,id:master.id||"hardcore",type:"Original",duration:"2:59"}]);
  sectionList("Alternate versions",children.filter(x=>x.kind!=="stem"));
  sectionList("Stems",children.filter(x=>x.kind==="stem"));
  const row=node("div","v83-v-cta");
  row.append(button("＋ Add audio files","v83-borderbutton",()=>send("UPLOAD_REQUEST")));
  row.append(button("Link existing track","v83-borderbutton",()=>send("LINK_REQUEST")));
  pane.append(row);
  pane.append(node("p","v83-v-footnote","Preview data only. Versions are linked locally and are not written to Bridge.audio production."));
 }
 function selectVersions(){
  activeSection="versions";
  for(const id of ["bridge-details-panel","bridge-lyrics-panel","bridge-credits-panel","bridge-tags-panel","bridge-pitch-panel","bridge-file-panel","bridge-projects-panel","bridge-hubs-panel"]){const el=$(id);if(el)el.hidden=true;}
  const meta=$("v62-content-nav"),desc=$("v65-description-nav");if(meta)meta.hidden=true;if(desc)desc.hidden=true;
  tabs.querySelectorAll('[role="tab"]').forEach(tab=>{
    const active=tab===versionsTab;tab.classList.toggle("bridge-active-tab",active);tab.classList.toggle("bg-primary3XlSoftBg",active);tab.setAttribute("aria-selected",String(active));tab.tabIndex=active?0:-1;
    const span=tab.querySelector("span");if(span){span.classList.toggle("text-accentContent",active);span.classList.toggle("text-secondaryContent",!active);}
  });pane.hidden=false;render();
 }
 
 // Single native V80 tab controller. The original legacy scripts are intentionally excluded.
 const metaViews={information:"bridge-details-panel",lyrics:"bridge-lyrics-panel",credits:"bridge-credits-panel"};
 const descriptionViews={tags:"bridge-tags-panel",pitch:"bridge-pitch-panel"};
 let metaView="information",descriptionView="tags";
 const allPanels=["bridge-details-panel","bridge-lyrics-panel","bridge-credits-panel","bridge-tags-panel","bridge-pitch-panel","bridge-file-panel","bridge-projects-panel","bridge-hubs-panel"];
 function showNative(which){
  activeSection=which;
  const chosen=which==="metadata"?metaViews[metaView]:which==="description"?descriptionViews[descriptionView]:"bridge-file-panel";
  allPanels.forEach(id=>{const el=$(id);if(el)el.hidden=id!==chosen;});
  pane.hidden=true;
  const mn=$("v62-content-nav"),dn=$("v65-description-nav");
  if(mn)mn.hidden=which!=="metadata";if(dn)dn.hidden=which!=="description";
  tabs.querySelectorAll('[role="tab"]').forEach(tab=>{
   const active=tab.dataset.v62Section===which;
   tab.setAttribute("aria-selected",String(active));tab.tabIndex=active?0:-1;
   tab.classList.toggle("bridge-active-tab",active);tab.classList.toggle("bg-primary3XlSoftBg",active);
   const span=tab.querySelector("span");if(span){span.classList.toggle("text-accentContent",active);span.classList.toggle("text-secondaryContent",!active);}
  });
  for(const [id,val] of [["v62-pitch","information"],["v62-lyrics","lyrics"],["v65-credits","credits"]]){
   const b=$(id);if(b){b.setAttribute("aria-selected",String(metaView===val));b.classList.toggle("is-active",metaView===val);}
  }
  for(const [id,val] of [["v65-tags","tags"],["v65-pitch","pitch"]]){
   const b=$(id);if(b){b.setAttribute("aria-selected",String(descriptionView===val));b.classList.toggle("is-active",descriptionView===val);}
  }
 }
 for(const tab of tabs.querySelectorAll("[data-v62-section]")){
  tab.addEventListener("click",()=>showNative(tab.dataset.v62Section));
  tab.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();showNative(tab.dataset.v62Section);}});
 }
 for(const [id,val] of [["v62-pitch","information"],["v62-lyrics","lyrics"],["v65-credits","credits"]]){
  $(id)?.addEventListener("click",()=>{metaView=val;showNative("metadata");});
 }
 for(const [id,val] of [["v65-tags","tags"],["v65-pitch","pitch"]]){
  $(id)?.addEventListener("click",()=>{descriptionView=val;showNative("description");});
 }
 showNative("metadata");

 versionsTab.addEventListener("click",selectVersions);
 versionsTab.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectVersions();}});
 for(const tab of tabs.querySelectorAll('[data-v62-section]'))tab.addEventListener("click",()=>{
   activeSection=tab.getAttribute("data-v62-section");pane.hidden=true;versionsTab.classList.remove("bridge-active-tab","bg-primary3XlSoftBg");versionsTab.setAttribute("aria-selected","false");
   const span=versionsTab.querySelector("span");span.classList.remove("text-accentContent");span.classList.add("text-secondaryContent");
 });
 window.addEventListener("message",e=>{
  if(e.origin!==location.origin||!e.data?.bridgeV83)return;
  const data=e.data;
  if(data.type==="PANEL_DATA"){master=data.master||master;children=Array.isArray(data.children)?data.children:children;if(activeSection==="versions")render();}
  if(data.type==="OPEN_SECTION"){
    if(launcher)launcher.click();
    if(data.section==="versions")selectVersions();
    else if(data.section==="file")fileTab.click();
    else if(data.section==="description")tabs.querySelector('[data-v62-section="description"]')?.click();
    else tabs.querySelector('[data-v62-section="metadata"]')?.click();
  }
 });
 render();send("PANEL_READY");
}
if(doc.readyState==="loading")doc.addEventListener("DOMContentLoaded",()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
})();