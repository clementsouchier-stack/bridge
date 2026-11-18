/* Bridge New Panel V2 - V81: linked alternate versions and stems.
   Prototype only. Preserves the V80 HTML, tabs, file metadata, origin and sharing code.
   No backend requests or live Bridge changes. */
(function(){
"use strict";
function init(){
  if(document.getElementById("v81-versions"))return;
  const $=id=>document.getElementById(id);
  const filePanel=$("bridge-file-panel");
  const technical=filePanel&&filePanel.querySelector(".v68-technical");
  const playerHost=document.querySelector('.shadow-up-01[style*="grid-area: player"]')||document.querySelector('div[style*="grid-area: player"]');
  const demoTrack=document.querySelector('[data-testid="list-track-name"][title="Hardcore"]')||document.querySelector('[data-testid="list-track-name"]');
  if(!technical||!playerHost||!demoTrack){return;}
  const trackName=demoTrack.textContent.trim();
  const row=demoTrack.closest('[data-testid="list-row"]');
  const artistName=(row&&row.querySelector('[data-testid="list-artist-name"]')||{}).textContent||"";
  const audio=playerHost.querySelector("audio")||document.createElement("audio");
  audio.autoplay=false;audio.preload="metadata";audio.controls=false;
  if(!audio.parentElement)playerHost.appendChild(audio);
  playerHost.classList.add("v81-player-host");
  const iconPaths={
    play:'<path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none"/>',
    pause:'<path d="M8 5v14M16 5v14"/>',
    layers:'<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    chevron:'<path d="m6 9 6 6 6-6"/>',
    dots:'<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
    check:'<path d="m5 12 4 4L19 6"/>'
  };
  function icon(name){const s=document.createElement("span");s.className="v81-icon";s.setAttribute("aria-hidden","true");s.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">'+(iconPaths[name]||iconPaths.layers)+'</svg>';return s;}
  function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
  function btn(cls,label,onClick){const b=el("button",cls,label);b.type="button";b.addEventListener("click",onClick);return b;}
  let seq=1;
  const versions=[
   {id:"original",name:"Original mix",kind:"original",duration:"2:59",format:"FLAC",origin:"Original file",url:null},
   {id:"instrumental",name:"Instrumental",kind:"version",duration:"2:59",format:"WAV",origin:"Example file",url:null},
   {id:"acappella",name:"A cappella",kind:"version",duration:"2:57",format:"WAV",origin:"Example file",url:null},
   {id:"cutdown",name:"30-second edit",kind:"version",duration:"0:30",format:"MP3",origin:"Example file",url:null},
   {id:"stem-drums",name:"Drums",kind:"stem",duration:"2:59",format:"WAV",origin:"Example stem",url:null},
   {id:"stem-bass",name:"Bass",kind:"stem",duration:"2:59",format:"WAV",origin:"Example stem",url:null}
  ];
  let activeId="original",addOpen=false,addMode="upload",addKind="version";
  let editId=null,menuId=null,picker=null,backdrop=null,player=null,feedback=null;
  const section=el("section","v81-version-section");section.id="v81-versions";section.setAttribute("aria-label","Linked track versions");
  technical.parentElement.insertBefore(section,technical);
  const fmtTime=x=>{if(!Number.isFinite(x))return"0:00";return Math.floor(x/60)+":"+String(Math.floor(x%60)).padStart(2,"0");};
  const current=()=>versions.find(v=>v.id===activeId)||versions[0];
  const altCount=()=>versions.filter(v=>v.kind==="version").length;
  const stemCount=()=>versions.filter(v=>v.kind==="stem").length;
  const totalCount=()=>versions.length-1;
  function inform(msg){if(feedback){feedback.textContent=msg;feedback.hidden=false;clearTimeout(inform.timer);inform.timer=setTimeout(()=>{if(feedback)feedback.hidden=true;},4300);}const note=$("v81-management-status");if(note)note.textContent=msg;}
  function formatMeta(v){return (v.duration||"--:--")+" · "+(v.format||"Audio")+(v.origin==="Linked from library"?" · Linked track":"");}
  function choose(v,autoplay){
    if(!v)return;
    activeId=v.id;audio.pause();
    if(v.url){audio.src=v.url;audio.load();if(autoplay){const promise=audio.play();if(promise&&promise.catch)promise.catch(()=>inform("Playback needs a user gesture or a compatible audio file."));}}
    else{audio.removeAttribute("src");audio.load();if(autoplay)inform("Sample audio is not embedded. Import your own audio file to listen.");}
    updatePlayer();renderManager();closePicker(false);
  }
  function togglePlayback(){
    if(!current().url){inform("This example version has no embedded audio. Add your own audio file in File to test playback.");return;}
    if(audio.paused){const p=audio.play();if(p&&p.catch)p.catch(()=>inform("This file could not be played in the browser."));}else audio.pause();
    updatePlayer();
  }
  function updatePlayer(){
    if(!player)return;
    const active=current();
    const play=player.querySelector("[data-v81-play]");
    if(play){play.replaceChildren(icon(audio.paused?"play":"pause"));play.setAttribute("aria-label",audio.paused?"Play selected version":"Pause selected version");}
    const subtitle=player.querySelector("[data-v81-subtitle]");if(subtitle)subtitle.textContent=active.name+" · "+artistName.trim();
    const switcher=player.querySelector("[data-v81-switch]");if(switcher)switcher.textContent="Versions ▾";
    const slider=player.querySelector("[data-v81-seek]");if(slider){slider.disabled=!active.url;slider.value=Number.isFinite(audio.duration)&&audio.duration>0?String(100*audio.currentTime/audio.duration):"0";}
    const elapsed=player.querySelector("[data-v81-elapsed]");if(elapsed)elapsed.textContent=fmtTime(audio.currentTime||0);
    const duration=player.querySelector("[data-v81-duration]");if(duration)duration.textContent=Number.isFinite(audio.duration)?fmtTime(audio.duration):(active.duration||"--:--");
  }
  function initPlayer(){
    player=el("div","v81-player");
    player.setAttribute("aria-label","Version-aware track player");
    const play=btn("v81-player-play","",togglePlayback);play.dataset.v81Play="true";
    player.append(play);
    const details=el("div","v81-player-text");
    const title=el("strong","",trackName);const sub=el("span","");sub.dataset.v81Subtitle="true";
    details.append(title,sub);player.append(details);
    const controls=el("div","v81-player-controls");
    const range=el("input");range.type="range";range.min="0";range.max="100";range.step="0.1";range.value="0";range.dataset.v81Seek="true";range.setAttribute("aria-label","Seek through version");
    range.addEventListener("input",()=>{if(current().url&&Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=audio.duration*Number(range.value)/100;});
    const times=el("div","v81-player-time");const elapsed=el("span");elapsed.dataset.v81Elapsed="true";const duration=el("span");duration.dataset.v81Duration="true";times.append(elapsed,duration);
    controls.append(range,times);player.append(controls);
    const switcher=btn("v81-player-select","Versions ▾",e=>openPicker(switcher));switcher.dataset.v81Switch="true";
    switcher.setAttribute("aria-haspopup","dialog");switcher.setAttribute("aria-label","Switch between linked versions and stems");
    player.append(switcher);
    feedback=el("div","v81-player-message");feedback.hidden=true;feedback.setAttribute("role","status");player.append(feedback);
    playerHost.append(player);
    for(const ev of ["timeupdate","loadedmetadata","play","pause","ended"])audio.addEventListener(ev,updatePlayer);
    updatePlayer();
  }
  function closePicker(refocus){if(picker){picker.remove();picker=null;}if(backdrop){backdrop.remove();backdrop=null;}if(refocus&&lastAnchor&&lastAnchor.isConnected)lastAnchor.focus();}
  let lastAnchor=null;
  function openPicker(anchor){
    if(picker){closePicker(false);if(anchor===lastAnchor)return;}
    lastAnchor=anchor;
    backdrop=el("div","v81-picker-backdrop");backdrop.addEventListener("click",()=>closePicker(true));document.body.append(backdrop);
    picker=el("div","v81-picker");picker.setAttribute("role","dialog");picker.setAttribute("aria-label","Linked versions for "+trackName);
    const head=el("div","v81-picker-head");head.append(el("strong","",trackName),btn("","×",()=>closePicker(true)));picker.append(head);
    function group(label,groupVersions){
      if(!groupVersions.length)return;
      picker.append(el("div","v81-picker-label",label));
      groupVersions.forEach(v=>{
        const b=btn("v81-picker-item","",()=>choose(v,true));
        b.setAttribute("aria-current",String(v.id===activeId));
        b.append(icon(v.id===activeId&&!audio.paused?"pause":"play"));
        const desc=el("span","v81-picker-title");desc.append(el("strong","",v.name),el("small","",formatMeta(v)));b.append(desc);
        if(v.id===activeId)b.append(el("span","v81-check","✓"));
        picker.append(b);
      });
    }
    group("ORIGINAL",versions.filter(v=>v.kind==="original"));
    group("ALTERNATE VERSIONS",versions.filter(v=>v.kind==="version"));
    group("STEMS",versions.filter(v=>v.kind==="stem"));
    const footer=el("div","v81-picker-footer");
    footer.append(btn("","Manage versions…",()=>{closePicker(false);openFile();}));
    picker.append(footer);document.body.append(picker);
    if(window.innerWidth>700){
      const r=anchor.getBoundingClientRect();const w=326;const height=Math.min(picker.offsetHeight,window.innerHeight-24);
      picker.style.left=Math.min(Math.max(10,r.left),window.innerWidth-w-12)+"px";
      picker.style.top=(r.bottom+height+8<=window.innerHeight?r.bottom+7:Math.max(12,r.top-height-7))+"px";
    }
    const first=picker.querySelector("button");if(first)first.focus();
  }
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&picker){e.preventDefault();closePicker(true);}});
  function openFile(){
    const launcher=$("v63-open-meta");const tab=document.querySelector('[data-v62-section="file"]');
    if(launcher)launcher.click();
    if(tab)tab.click();
    section.scrollIntoView({block:"nearest"});
  }
  function versionRow(v){
    const row=el("div","v81-version-row"+(activeId===v.id?" is-selected":""));
    const play=btn("v81-play","",()=>choose(v,true));play.title="Preview "+v.name;play.setAttribute("aria-label","Preview "+v.name);play.append(icon(activeId===v.id&&!audio.paused?"pause":"play"));row.append(play);
    if(editId===v.id){
      const editing=el("div","v81-edit-inline");const input=el("input");input.type="text";input.value=v.name;input.maxLength=80;
      const save=()=>{const name=input.value.trim();if(name){v.name=name;editId=null;renderManager();updatePlayer();inform("Version renamed locally.");}};
      input.addEventListener("keydown",e=>{if(e.key==="Enter")save();if(e.key==="Escape"){editId=null;renderManager();}});
      editing.append(input,btn("","Save",save));row.append(editing);setTimeout(()=>input.focus(),0);
    }else{
      const text=el("div","v81-version-name");text.append(el("strong","",v.name),el("small","",formatMeta(v)));row.append(text);
    }
    if(v.kind==="original"){row.append(el("span","v81-main-label","Main"));return row;}
    const more=btn("v81-more","",()=>{menuId=menuId===v.id?null:v.id;renderManager();});
    more.setAttribute("aria-label","More actions for "+v.name);more.append(icon("dots"));row.append(more);
    if(menuId===v.id){
      const menu=el("div","v81-more-menu");
      menu.append(btn("","Rename",()=>{menuId=null;editId=v.id;renderManager();}));
      menu.append(btn("","Unlink version",()=>{menuId=null;const i=versions.findIndex(x=>x.id===v.id);if(i>=0)versions.splice(i,1);if(v.url)URL.revokeObjectURL(v.url);if(activeId===v.id)choose(versions[0],false);renderManager();updateBadge();inform("Version unlinked. No original library file was deleted.");}));
      if(v.url){menu.append(btn("","Download this file",()=>{const a=el("a");a.href=v.url;a.download=v.fileName||v.name;a.click();menuId=null;renderManager();}));}
      row.append(menu);
    }
    return row;
  }
  function fileGroup(title,group,counts){
    if(!group.length&&title==="Stems")return;
    const head=el("div","v81-subhead");head.append(el("strong","",title),el("span","",String(counts)));
    section.append(head);group.forEach(v=>section.append(versionRow(v)));
  }
  function detectName(filename){
    const base=filename.replace(/\.[^.]+$/,"").replace(/^Johnny Jane[\s-_]+Hardcore[\s-_]*/i,"").replace(/[._-]+/g," ").trim();
    return base||"Alternate version";
  }
  function addFiles(list){
    const added=Array.from(list||[]).filter(f=>f&&((f.type||"").startsWith("audio/")||/\.(wav|flac|mp3|m4a|aiff|aif|ogg|aac)$/i.test(f.name)));
    if(!added.length){inform("Choose WAV, FLAC, MP3, AIFF, M4A or another supported audio file.");return;}
    added.forEach(file=>{
      const name=detectName(file.name);
      const kind=/drums?|bass|vocals?|guitar|keys|piano|percussion|stem/i.test(name)?"stem":addKind;
      versions.push({id:"uploaded-"+seq++,name,kind,duration:"--:--",format:(file.name.split(".").pop()||"audio").toUpperCase(),origin:"Local upload",url:URL.createObjectURL(file),fileName:file.name});
    });
    addOpen=false;renderManager();updateBadge();inform(added.length+" audio file(s) linked. They can now be played in the demo player.");
  }
  function listAvailable(){
    return Array.from(document.querySelectorAll('[data-testid="list-track-name"]')).map(e=>e.textContent.trim()).filter((n,i,a)=>n&&n!==trackName&&a.indexOf(n)===i&&!versions.some(v=>v.origin==="Linked from library"&&v.sourceName===n));
  }
  function linkExisting(name){
    if(!name)return;
    versions.push({id:"linked-"+seq++,name:name,kind:addKind,duration:"--:--",format:"Library",origin:"Linked from library",sourceName:name,url:null});
    addOpen=false;renderManager();updateBadge();inform('Linked "'+name+'" to '+trackName+'. Source remains in the Library.');
  }
  function renderAddForm(){
    const form=el("div","v81-add-panel");form.setAttribute("aria-label","Add versions");
    const options=el("div","v81-add-tabs");
    const chooseMode=(mode)=>{addMode=mode;renderManager();};
    const filesButton=btn("","Upload files",()=>chooseMode("upload"));filesButton.setAttribute("aria-selected",String(addMode==="upload"));
    const linkButton=btn("","Link from Library",()=>chooseMode("link"));linkButton.setAttribute("aria-selected",String(addMode==="link"));
    options.append(filesButton,linkButton);form.append(options);
    const kindLabel=el("label","","Add as");form.append(kindLabel);
    const select=el("select");select.setAttribute("aria-label","Version type");select.style.cssText="width:100%;height:35px;font-size:12px;padding:5px;border:1px solid #dedee2;border-radius:7px;background:#fff;margin-bottom:11px";
    [["version","Alternate version"],["stem","Stem"]].forEach(pair=>{const op=el("option","",pair[1]);op.value=pair[0];select.append(op);});
    select.value=addKind;select.addEventListener("change",()=>{addKind=select.value;});form.append(select);
    if(addMode==="upload"){
      const input=el("input");input.type="file";input.multiple=true;input.accept="audio/*,.wav,.flac,.aif,.aiff,.m4a,.ogg";input.hidden=true;
      input.addEventListener("change",()=>addFiles(input.files));
      const drop=btn("v81-dropzone","",()=>input.click());drop.style.width="100%";
      drop.append(icon("layers"),el("span","","Drop audio files here or browse"),el("span","v81-upload-action","Choose files"));
      drop.addEventListener("dragover",e=>{e.preventDefault();drop.style.background="#eaf0ff";});
      drop.addEventListener("dragleave",()=>{drop.style.background="";});
      drop.addEventListener("drop",e=>{e.preventDefault();drop.style.background="";addFiles(e.dataTransfer.files);});
      form.append(drop,input);
    }else{
      const search=el("input");search.type="search";search.autocomplete="off";search.placeholder="Search existing Library tracks…";
      search.setAttribute("aria-label","Find a track to link");form.append(search);
      const results=el("div","v81-search-results");form.append(results);
      const renderHits=()=>{
        results.replaceChildren();
        const q=search.value.trim().toLowerCase();const items=listAvailable().filter(n=>!q||n.toLowerCase().includes(q)).slice(0,8);
        if(!items.length){results.append(el("p","v81-note","No matching track in the visible Library."));return;}
        items.forEach(n=>{const b=btn("","",()=>linkExisting(n));b.append(el("strong","",n),el("small","","Link as "+(addKind==="stem"?"stem":"alternate version")));results.append(b);});
      };
      search.addEventListener("input",renderHits);select.addEventListener("change",renderHits);renderHits();
      form.append(el("p","v81-note","Only tracks that are versions of the same recording should be linked."));
    }
    section.append(form);
  }
  function renderManager(){
    section.replaceChildren();
    const head=el("div","v81-head");head.append(el("h3","","Versions"),el("span","v81-count",altCount()+" alternate · "+stemCount()+" stems"));section.append(head);
    section.append(el("p","v81-caption","Listen, group and manage files linked to this track."));
    fileGroup("Original",versions.filter(v=>v.kind==="original"),1);
    fileGroup("Alternate versions",versions.filter(v=>v.kind==="version"),altCount());
    fileGroup("Stems",versions.filter(v=>v.kind==="stem"),stemCount());
    section.append(btn("v81-add-button",addOpen?"Close":"＋ Add versions",()=>{addOpen=!addOpen;menuId=null;renderManager();}));
    if(addOpen)renderAddForm();
    const note=el("div","v81-status");note.id="v81-management-status";note.setAttribute("role","status");section.append(note);
    section.append(el("p","v81-note","V81 prototype · No live uploads or library changes."));
  }
  function updateBadge(){
    const count=totalCount();
    for(const text of document.querySelectorAll('[data-testid="list-track-name"]')){
      if(text.textContent.trim()!==trackName)continue;
      const place=text.parentElement;if(!place)continue;
      let badge=place.querySelector("[data-v81-anchor]");
      if(!badge){
        badge=btn("v81-row-badge","",()=>openPicker(badge));badge.dataset.v81Anchor="true";
        badge.setAttribute("aria-haspopup","dialog");
        badge.setAttribute("aria-label","Browse linked versions of "+trackName);
        badge.addEventListener("click",e=>e.stopPropagation());
        badge.addEventListener("mousedown",e=>e.stopPropagation());
        badge.addEventListener("dblclick",e=>e.stopPropagation());
        place.append(badge);
      }
      badge.replaceChildren(icon("layers"),document.createTextNode(count+" versions"));
    }
  }
  initPlayer();renderManager();updateBadge();
  const rowsRoot=demoTrack.closest('[data-testid="list-row"]')?.parentElement;
  if(rowsRoot){
    const observer=new MutationObserver(muts=>{
      if(muts.some(m=>Array.from(m.addedNodes).some(n=>n.nodeType===1&&(n.matches?.('[data-testid="list-row"]')||n.querySelector?.('[data-testid="list-row"]')))))updateBadge();
    });
    observer.observe(rowsRoot,{childList:true,subtree:true});
  }
  window.bridgeVersioningV81={
    version:"V81",prototypeOnly:true,selected:()=>current().name,
    list:()=>versions.map(v=>({id:v.id,name:v.name,kind:v.kind,source:v.origin,playable:!!v.url})),
    openFile,openVersions:()=>openPicker(document.querySelector("[data-v81-anchor]")||player.querySelector("[data-v81-switch]")),
    selectVersion:name=>{const v=versions.find(v=>v.name===name);if(v)choose(v,false);return !!v;}
  };
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
