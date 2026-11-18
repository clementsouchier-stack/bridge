/* Bridge New Panel V2 / V82.
  Library design and dimensions grounded in GitLab:
  packages/webapp/src/views/Library/Tracks/index.tsx
  packages/commons/src/components/ListRowShare/index.tsx
  packages/commons/src/components/MobileTrackListRow/index.tsx
  packages/commons/src/components/List/index.tsx
  This is an isolated HTML prototype: no production GraphQL/Redux mutations. */
(function(){
"use strict";
function init(){
  if(window.bridgeVersioningV82)return;
  const api=window.bridgeVersioningV81;
  const filePanel=document.getElementById("bridge-file-panel");
  const versionSection=document.getElementById("v81-versions");
  const original=document.querySelector('[data-testid="list-track-name"][title="Hardcore"]')?.closest('[data-testid="list-row"]')||document.querySelector('[data-testid="list-row"]');
  if(!api||!versionSection||!filePanel||!original)return;
  const root=original.parentElement;
  const baseRows=Array.from(root.querySelectorAll(':scope > [data-testid="list-row"]'));
  const parentTrackName=original.querySelector('[data-testid="list-track-name"]')?.textContent.trim()||"Hardcore";
  const artists=original.querySelector('[data-testid="list-artist-name"]')?.textContent.trim()||"Johnny Jane";
  const cover=original.querySelector('[data-testid="list-support-image"]')?.getAttribute("src")||"";
  const timeColumn=(n)=>n.querySelector('[data-testid="list-duration"]');
  const titleOf=(r)=>r.querySelector('[data-testid="list-track-name"]')?.textContent.trim()||"Track";
  const versionTypes=["Instrumental","A cappella","Clean","Explicit","TV mix","Mix","Cutdown","Radio","Edit","Remix","Demo","Worktape","Stem","Other"];
  let expanded=false, modal=null, notice=null, liveRows=[], compactRows=[], pending=false;
  let indexWidth=original.style.gridTemplateColumns||"24px minmax(150px, 2fr) minmax(150px, 2fr) 100px minmax(150px, 1fr) minmax(150px, 1fr) 140px";
  const originalTotalHeight=parseFloat(root.style.height)||2494080;
  const initialRowSize=52;
  let standalone=null;
  const elm=(tag,cls,txt)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(txt!==undefined)node.textContent=txt;return node};
  const button=(cls,txt,cb)=>{const b=elm("button",cls,txt);b.type="button";b.addEventListener("click",e=>{e.stopPropagation();cb(e)});return b};
  const svg=(name)=>{
    const paths={
      chevron:'<path d="m9 18 6-6-6-6"/>',
      play:'<path fill="currentColor" stroke="none" d="m8 5 11 7-11 7z"/>',
      dots:'<circle cx="5" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.8" fill="currentColor" stroke="none"/>',
      layers:'<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>'
    };
    const el=elm("span","v82-icon");el.setAttribute("aria-hidden","true");el.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+paths[name]+"</svg>";return el;
  };
  function toast(txt){
    if(notice)notice.remove();
    notice=elm("div","v82-mini-notice",txt);notice.setAttribute("role","status");document.body.append(notice);
    clearTimeout(toast.timer);toast.timer=setTimeout(()=>{notice?.remove();notice=null;},3200);
  }
  /* Main tabs: Metadata | Description | Versions | File. V80's original handlers stay intact. */
  const tabs=document.getElementById("v62-main-tabs");
  const fileTab=tabs?.querySelector('[data-v62-section="file"]');
  let versionsTab=null,versionsPanel=null;
  function buildTabs(){
    if(!tabs||!fileTab)return;
    versionsTab=elm("li","group relative flex h-12 cursor-pointer items-center px-xs hover:bg-neutralSoftBg");
    versionsTab.dataset.v82Section="versions";
    versionsTab.setAttribute("role","tab");versionsTab.setAttribute("aria-selected","false");versionsTab.tabIndex=-1;
    versionsTab.id="v82-tab-versions";
    const title=elm("span","text-secondaryContent","Versions");versionsTab.append(title);
    fileTab.before(versionsTab);
    versionsPanel=elm("section","meta-custom");versionsPanel.id="bridge-versions-panel";versionsPanel.hidden=true;versionsPanel.setAttribute("role","tabpanel");versionsPanel.setAttribute("aria-labelledby","v82-tab-versions");
    filePanel.after(versionsPanel);versionsPanel.append(versionSection);
    function showVersions(){
      document.getElementById("v63-open-meta")?.click();
      const list=["bridge-details-panel","bridge-lyrics-panel","bridge-credits-panel","bridge-tags-panel","bridge-pitch-panel","bridge-file-panel","bridge-projects-panel","bridge-hubs-panel"];
      for(const id of list){const p=document.getElementById(id);if(p)p.hidden=true;}
      document.getElementById("v62-content-nav")?.setAttribute("hidden","");
      document.getElementById("v65-description-nav")?.setAttribute("hidden","");
      for(const t of tabs.querySelectorAll('[role="tab"]')){
        t.setAttribute("aria-selected",String(t===versionsTab));
        t.tabIndex=t===versionsTab?0:-1;
        t.classList.toggle("bg-primary3XlSoftBg",t===versionsTab);
        t.classList.toggle("bridge-active-tab",t===versionsTab);
        const span=t.querySelector("span");if(span){span.classList.toggle("text-accentContent",t===versionsTab);span.classList.toggle("text-secondaryContent",t!==versionsTab);}
      }
      versionsPanel.hidden=false;
      versionSection.scrollIntoView({block:"nearest",behavior:"instant"});
    }
    window.bridgeV82OpenVersions=showVersions;
    versionsTab.addEventListener("click",showVersions);
    versionsTab.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();showVersions();}if(e.key==="ArrowRight"){e.preventDefault();fileTab.focus();fileTab.click();}if(e.key==="ArrowLeft"){e.preventDefault();const previous=tabs.querySelector('[data-v62-section="description"]');previous?.focus();previous?.click();}});
    for(const tab of tabs.querySelectorAll('[data-v62-section]'))tab.addEventListener("click",()=>{versionsPanel.hidden=true;versionsTab.setAttribute("aria-selected","false");versionsTab.tabIndex=-1;versionsTab.classList.remove("bg-primary3XlSoftBg","bridge-active-tab");title.classList.remove("text-accentContent");title.classList.add("text-secondaryContent");});
  }
  buildTabs();
  /* Library: the GitLab list uses fixed itemSize=52 desktop / 64 mobile.
     Prototype repositions only the rendered static rows. A production implementation
     should flatten the displayed parent+children sequence before passing to virtualization. */
  const mainName=titleOf(original);
  baseRows.forEach(r=>{r.classList.add("v82-processed");r.dataset.v82Track=titleOf(r);r.dataset.v82Base="1";});
  function isMobile(){return window.matchMedia("(max-width:767px)").matches;}
  function rowSize(){return isMobile()?64:52;}
  function versionText(v){
    const n=v.sourceName||v.name;
    if(n.toLowerCase().includes(mainName.toLowerCase()))return n;
    return mainName+" · "+n;
  }
  function fixCloneIds(node){
    node.querySelectorAll("[id]").forEach((item,i)=>{item.id="v82-clone-"+Math.random().toString(36).slice(2,9)+"-"+i;});
    node.querySelectorAll(".v53-track-options,[data-v81-anchor],.v82-row-expand,.v82-mobile-track,.v82-row-actions,.v81-row-badge").forEach(e=>e.remove());
  }
  function setDisplayTitle(row,name,duration){
    const title=row.querySelector('[data-testid="list-track-name"]');
    if(title){title.textContent=name;title.setAttribute("title",name);}
    const support=row.querySelector('[data-testid="list-support-name"]');if(support)support.textContent=mainName;
    const span=timeColumn(row);if(span)span.textContent=duration||"2:59";
    row.querySelectorAll('input[type="checkbox"]').forEach(ch=>{ch.checked=false;ch.id="v82-checkbox-"+Math.random().toString(36).slice(2,8);});
    row.classList.remove("bg-primaryXlSoftBg");
  }
  function makeChild(v){
    const cloned=original.cloneNode(true);
    fixCloneIds(cloned);
    cloned.removeAttribute("data-testid");cloned.classList.add("v82-nested");
    if(v.kind==="stem")cloned.classList.add("v82-stem");
    cloned.dataset.v82Version=v.id;cloned.dataset.v82VersionName=v.name;
    cloned.style.gridTemplateColumns=indexWidth;
    setDisplayTitle(cloned,versionText(v),v.kind==="stem"?"2:59":v.name.includes("30")?"0:30":"2:59");
    const title=cloned.querySelector('[data-testid="list-track-name"]');
    if(title)title.classList.add("v82-child-title");
    const titleCell=cloned.querySelectorAll('[data-testid="list-cell"]')[1];
    if(titleCell){
      titleCell.style.position="relative";
      titleCell.prepend(elm("span","v82-child-mark","↳"));
      const art=titleCell.querySelector('[data-testid="list-support-image"]')?.closest("div");
      if(art){const play=button("v82-nest-play","",()=>playVariant(v.name));play.append(svg("play"));play.setAttribute("aria-label","Play "+versionText(v));art.replaceWith(play);}
      const tag=elm("span","v82-child-tag",v.type|| (v.kind==="stem"?"Stem":"Mix"));title?.parentElement?.append(tag);
    }
    addMobileLayout(cloned,{name:versionText(v),artist:artists,kind:v.kind,label:v.type||v.name,version:v});
    cloned.addEventListener("click",e=>{if(e.target.closest("button,input"))return;playVariant(v.name);});
    return cloned;
  }
  function playVariant(name){
    const ok=api.playVersion?.(name);
    if(!ok)toast("This version is unavailable in the local demo.");
  }
  function addMobileLayout(row,{name,artist,kind,label,version,standaloneName}){
    row.querySelector(".v82-mobile-track")?.remove();
    const mob=elm("div","v82-mobile-track");
    if(row===original){
      const chevron=button("v82-row-expand","",()=>setExpanded(!expanded));chevron.setAttribute("aria-expanded",String(expanded));chevron.setAttribute("aria-label",expanded?"Collapse versions":"Expand versions");chevron.append(svg("chevron"));mob.append(chevron);
    }else if(version){mob.append(elm("span","v82-child-mark","↳"));}
    else {const gap=elm("span");gap.style.cssText="width:23px;flex:none";mob.append(gap);}
    const thumb=elm("div","v82-mobile-thumb");
    const img=elm("img");img.src=cover;img.alt="Cover artwork";thumb.append(img);
    if(version||row===original){thumb.addEventListener("click",e=>{e.stopPropagation();playVariant(version?.name||"Original mix");});}
    mob.append(thumb);
    const text=elm("div","v82-mobile-text");
    const title=elm("strong","",name);const sub=elm("small","",artist);
    text.append(title,sub);
    text.addEventListener("click",e=>{e.stopPropagation();if(standaloneName){openLinkModal(standaloneName);return;}playVariant(version?.name||"Original mix");});
    mob.append(text);
    if(row===original){
      const v=api.list().filter(x=>x.kind!=="original");
      const pill=button("v82-mobile-version","+"+v.length,()=>setExpanded(!expanded));
      pill.setAttribute("aria-label",v.length+" linked versions. "+(expanded?"Collapse":"Expand"));
      mob.append(pill);
    }else if(version){
      mob.append(elm("span","v82-mobile-version",label));
    }
    const action=button("v82-mobile-actions","",()=>{if(standaloneName)openLinkModal(standaloneName);else if(row===original)window.bridgeV82OpenVersions?.();else window.bridgeV82OpenVersions?.();});
    action.setAttribute("aria-label",standaloneName?"Link this track as a version":row===original?"Manage versions":"Manage linked version");action.append(svg("dots"));mob.append(action);
    row.append(mob);
  }
  function prepareParent(){
    const titleCell=original.querySelectorAll('[data-testid="list-cell"]')[1];
    const badge=original.querySelector("[data-v81-anchor]");
    if(titleCell&&!titleCell.querySelector(".v82-row-expand")){
      const arrow=button("v82-row-expand","",()=>setExpanded(!expanded));arrow.append(svg("chevron"));arrow.setAttribute("aria-label","Expand linked versions");arrow.setAttribute("aria-expanded","false");titleCell.prepend(arrow);
    }
    if(badge&&!badge.dataset.v82Bound){
      badge.dataset.v82Bound="1";
      badge.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();setExpanded(!expanded);},true);
    }
    addMobileLayout(original,{name:mainName,artist});
  }
  function buildStandalone(){
    standalone=original.cloneNode(true);fixCloneIds(standalone);standalone.removeAttribute("data-testid");
    standalone.classList.remove("v82-processed");standalone.classList.add("v82-standalone","v82-nested");
    standalone.dataset.v82Independent="demo-tv-mix";standalone.dataset.v82Track="Hardcore · TV Mix";
    standalone.style.gridTemplateColumns=indexWidth;
    setDisplayTitle(standalone,"Hardcore · TV Mix","2:58");
    const first=standalone.querySelectorAll('[data-testid="list-cell"]')[1];
    if(first){
      first.style.position="relative";
      const menu=button("v82-type-btn v82-link-action","Link as version",()=>openLinkModal("Hardcore · TV Mix"));
      const box=elm("div","v82-row-actions");box.append(menu);first.append(box);
      const tag=elm("span","v82-unlinked-flag","Unlinked");
      first.querySelector('[data-testid="list-track-name"]')?.parentElement?.append(tag);
    }
    addMobileLayout(standalone,{name:"Hardcore · TV Mix",artist,standaloneName:"Hardcore · TV Mix"});
    standalone.addEventListener("click",e=>{if(e.target.closest("button,input"))return;openLinkModal("Hardcore · TV Mix");});
    root.append(standalone);
  }
  function setExpanded(value){
    expanded=Boolean(value);
    renderRows();
  }
  function updateExpandControl(){
    const all=api.list(),alts=all.filter(v=>v.kind==="version").length,stems=all.filter(v=>v.kind==="stem").length,count=alts+stems;
    original.querySelectorAll(".v82-row-expand").forEach(b=>{b.setAttribute("aria-expanded",String(expanded));b.setAttribute("aria-label",expanded?"Collapse "+count+" linked versions":"Expand "+count+" linked versions");});
    const badge=original.querySelector("[data-v81-anchor]");
    if(badge){badge.title=alts+" alternate versions · "+stems+" stems";badge.setAttribute("aria-expanded",String(expanded));badge.replaceChildren(svg("layers"),document.createTextNode(count+" versions"));}
    original.querySelector(".v82-mobile-version")?.replaceChildren(document.createTextNode("+"+count));
  }
  function renderRows(){
    const prev=[...root.querySelectorAll(":scope > [data-v82-version]")];prev.forEach(x=>x.remove());
    liveRows=[];
    prepareParent();
    const linked=api.list().filter(v=>v.kind!=="original");
    if(expanded){
      for(const version of linked){
        const child=makeChild(version);
        root.append(child);liveRows.push(child);
      }
    }
    updateExpandControl();
    const linkedNames=new Set(linked.filter(v=>v.source==="Linked from library").map(v=>v.sourceName||v.name));
    const allRows=[...baseRows,standalone].filter(Boolean);
    const visible=allRows.filter(r=>!linkedNames.has(titleOf(r)));
    // Stable parent is always first; the remaining Library rows preserve source order.
    const ordered=[original,...(expanded?liveRows:[]),...visible.filter(r=>r!==original)];
    const size=rowSize();
    for(let index=0;index<ordered.length;index++){
      const item=ordered[index];item.hidden=false;item.style.position="absolute";item.style.left="0";item.style.top=(index*size)+"px";item.style.height=size+"px";item.style.width="100%";
      if(item!==original)item.style.gridTemplateColumns=indexWidth;
      item.style.display=isMobile()?"block":"grid";
      item.classList.toggle("v82-processed",Boolean(item.dataset.v82Base));
      if(item.dataset.v82Base){
        item.querySelector(".v82-mobile-track")?.remove();
        addMobileLayout(item,{name:titleOf(item),artist:item.querySelector('[data-testid="list-artist-name"]')?.textContent.trim()||artists});
      }
    }
    for(const item of allRows){if(!ordered.includes(item))item.hidden=true;}
    // Keep all original tracks addressable while adding expanded children and demo stand-alone.
    root.style.height=(originalTotalHeight/initialRowSize*size+(ordered.length-baseRows.length)*size)+"px";
  }
  function closeModal(){modal?.remove();modal=null;}
  function openLinkModal(name){
    closeModal();
    const shade=elm("div","v82-modal-shade");modal=shade;shade.addEventListener("click",e=>{if(e.target===shade)closeModal();});
    const dialog=elm("div","v82-modal");dialog.setAttribute("role","dialog");dialog.setAttribute("aria-modal","true");dialog.setAttribute("aria-label","Link secondary version");
    const head=elm("div","v82-modal-head");const heading=elm("div");heading.append(elm("h3","","Link a version"),elm("p","","Connect an existing Library track to the main recording."));head.append(heading,button("v82-modal-close","×",closeModal));dialog.append(head);
    const master=elm("div","v82-master-tile"),icon=elm("div","v82-master-icon","♫"),detail=elm("div");detail.append(elm("strong","",parentTrackName),elm("small","","Main track · "+artists));master.append(icon,detail);dialog.append(master);
    const childLabel=elm("label","","Existing track");dialog.append(childLabel);
    const source=elm("div","v82-master-tile");source.style.marginTop="0";source.append(elm("strong","",name));dialog.append(source);
    const label=elm("label","","Version type");dialog.append(label);
    const type=elm("select");type.setAttribute("aria-label","Select version type");
    for(const value of versionTypes){const op=elm("option","",value);op.value=value;type.append(op);}
    type.value=/TV/i.test(name)?"TV mix":"Mix";
    dialog.append(type);
    dialog.append(elm("p","v82-modal-note","This creates a parent-child relationship. The original file is not replaced or deleted; unlinking will restore the independent track."));
    const foot=elm("div","v82-modal-footer");const cancel=button("","Cancel",closeModal),ok=button("v82-confirm","Link to main track",()=>{
      const kind=type.value==="Stem"?"stem":"version";
      const added=api.linkTrack({trackId:"demo-tv-mix",name,kind,type:type.value});
      if(added){closeModal();setExpanded(true);toast("Linked under "+parentTrackName+". The secondary version is now visible in the Library.");}
      else toast("This track is already linked.");
    });
    foot.append(cancel,ok);dialog.append(foot);shade.append(dialog);document.body.append(shade);type.focus();
  }
  function upgradeSection(){
    if(!versionsPanel)return;
    const note=elm("p","v82-tab-desc","Versions stay linked to the main track. You can upload new audio, link existing Library tracks, or unlink a secondary track without deleting its source.");
    versionsPanel.prepend(note);
    const footer=elm("p","v82-tab-desc","Sharing rule to validate in production: alternate versions can be included with the main track; stems require explicit sharing permission.");
    versionsPanel.append(footer);
  }
  upgradeSection();
  buildStandalone();
  prepareParent();
  renderRows();
  window.addEventListener("resize",()=>{clearTimeout(window.bridgeV82Resize);window.bridgeV82Resize=setTimeout(renderRows,90);});
  window.addEventListener("bridge:versions-changed",()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;renderRows();});});
  window.bridgeVersioningV82={
    version:"V82",gitlabGrounded:true,prototypeOnly:true,expanded:()=>expanded,
    toggle:()=>setExpanded(!expanded),expand:()=>setExpanded(true),
    openVersions:()=>window.bridgeV82OpenVersions?.(),
    linkDemo:()=>openLinkModal("Hardcore · TV Mix"),
    getVisibleRows:()=>[original,...liveRows,...baseRows.slice(1)].map(titleOf),
    refPaths:["packages/webapp/src/views/Library/Tracks/index.tsx","packages/commons/src/components/ListRowShare/index.tsx","packages/commons/src/components/MobileTrackListRow/index.tsx"]
  };
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();