import React,{useEffect,useMemo,useRef,useState} from "react";
import{createRoot}from"react-dom/client";
import ListRowShare from "./bridge-commons/components/ListRowShare";
import MobileTrackListRow from "./bridge-commons/components/MobileTrackListRow";
import{IconComponents}from"./bridge-commons/components/Icon/types";
import"./styles.css";

type Track={id:string;name:string;duration:number;artists:{id:string;name:string}[];support:{id:string;name:string};image:string;updatedAt:number;createdBy:string;sample?:boolean;url?:string;fileName?:string};
type Rel={parentId:string;childId:string;kind:"version"|"stem";type:string;order:number};
const kinds=["Instrumental","A cappella","Clean","Explicit","TV mix","Radio edit","Cutdown","Remix","Mix","Demo","Worktape","Stem","Other"];
const svgPath={search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',plus:'<path d="M12 5v14M5 12h14"/>',filter:'<path d="M4 6h16M7 12h10m-7 6h4"/>',right:'<path d="m9 18 6-6-6-6"/>',layers:'<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',play:'<path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5v14m8-14v14"/>',music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',folder:'<path d="M3 6h6l2 3h10v11H3z"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-5 2-8 6-8s6 3 6 8"/>',reset:'<path d="M3 12a9 9 0 1 1 2 6M3 5v7h7"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',link:'<path d="M9 15l6-6m-8 8H6a4 4 0 0 1 0-8h5m2-2h5a4 4 0 0 1 0 8h-5"/>',unlink:'<path d="M9 15l6-6m-8 8H6a4 4 0 0 1 0-8h5m2-2h5a4 4 0 0 1 0 8h-5"/>',down:'<path d="m6 9 6 6 6-6"/>'};
function I({n,size=18}:{n:string;size?:number}){return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:(svgPath as any)[n]||svgPath.music}}/>}
const fmt=(n:number)=>Math.floor((n||0)/60)+":"+String(Math.floor((n||0)%60)).padStart(2,"0");
function artwork(i:number){const pairs=[["#5f4c6b","#c4a5ae"],["#4e6975","#c6d1c7"],["#aa704f","#e5c3a6"],["#8c7e78","#d3cfcc"],["#433c59","#aca7c7"]];const[a,b]=pairs[i%5];const s='<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="66" cy="22" r="30" fill="#fff" opacity=".17"/><path d="M0 80 60 20 96 85V96H0" fill="#10131a" opacity=".15"/></svg>';return "data:image/svg+xml,"+encodeURIComponent(s)}
const t=(id:string,name:string,duration:number,i:number=0):Track=>({id,name,duration,artists:[{id:"jj",name:"Johnny Jane"}],support:{id:"att",name:"Attitude(s)"},image:artwork(i),updatedAt:1793408400,createdBy:"My Label",sample:true});
const initialTracks=[t("hardcore","Hardcore",179),t("tv-mix","Hardcore · TV Mix",178),t("american","A l'américaine",205,1),t("justine","Justine",244,2),t("lois","Les lois de l'univers",150,3),t("temple","Temple",194,4),t("prologue","Le Prologue",234,1),t("inst","Hardcore · Instrumental",179),t("acap","Hardcore · A cappella",177),t("cut","Hardcore · 30-second edit",30),t("drums","Hardcore · Drums",179),t("bass","Hardcore · Bass",179)];
const initialRelations:Rel[]=[{parentId:"hardcore",childId:"inst",kind:"version",type:"Instrumental",order:0},{parentId:"hardcore",childId:"acap",kind:"version",type:"A cappella",order:1},{parentId:"hardcore",childId:"cut",kind:"version",type:"Cutdown",order:2},{parentId:"hardcore",childId:"drums",kind:"stem",type:"Stem",order:3},{parentId:"hardcore",childId:"bass",kind:"stem",type:"Stem",order:4}];
function makePreview(id:string,dur:number){const sr=16000,sec=Math.max(6,Math.min(12,dur)),count=sr*sec,buffer=new ArrayBuffer(44+2*count),v=new DataView(buffer),write=(i:number,s:string)=>{for(let k=0;k<s.length;k++)v.setUint8(i+k,s.charCodeAt(k))};write(0,"RIFF");v.setUint32(4,36+count*2,true);write(8,"WAVE");write(12,"fmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);write(36,"data");v.setUint32(40,count*2,true);for(let i=0;i<count;i++){const time=i/sr,beat=time*1.8,frequency=[220,246.94,196,261.63][Math.floor(time/2)%4],fade=Math.min(1,time/.08)*Math.min(1,(sec-time)/.2),bass=Math.sin(time*Math.PI*frequency)*.11,melody=Math.sin(time*2*Math.PI*frequency)*.1,kick=Math.exp(-((beat%1)*16))*Math.sin(time*2*Math.PI*65)*.2,voice=Math.sin(time*2*Math.PI*frequency*1.14)*.08;let signal=id==="inst"?bass+melody:id==="acap"?voice:id==="drums"?kick:id==="bass"?bass:bass+melody+kick+voice;v.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,signal*fade))*32767),true)}return URL.createObjectURL(new Blob([buffer],{type:"audio/wav"}))}

function App(){
 const[tracks,setTracks]=useState(initialTracks),[relations,setRelations]=useState(initialRelations),[expanded,setExpanded]=useState<Set<string>>(new Set(["hardcore"])),[selected,setSelected]=useState<Set<string>>(new Set());
 const[active,setActive]=useState("hardcore"),[playing,setPlaying]=useState(false),[elapsed,setElapsed]=useState(0),[duration,setDuration]=useState(0);
 const[query,setQuery]=useState(""),[sort,setSort]=useState("recent"),[filters,setFilters]=useState(false),[onlyGroups,setOnlyGroups]=useState(false),[showStems,setShowStems]=useState(true);
 const[panel,setPanel]=useState(false),[section,setSection]=useState("metadata"),[panelReady,setPanelReady]=useState(false);
 const[modal,setModal]=useState<{parentId:string;childId:string;type:string}|null>(null);
 const[menu,setMenu]=useState<{id:string;x:number;y:number}|null>(null),[message,setMessage]=useState(""),[mobile,setMobile]=useState(window.innerWidth<=767);
 const audioRef=useRef<HTMLAudioElement>(null),frameRef=useRef<HTMLIFrameElement>(null),uploadRef=useRef<HTMLInputElement>(null),cache=useRef<Record<string,string>>({});
 const byId=useMemo(()=>new Map(tracks.map(x=>[x.id,x])),[tracks]);
 const roots=useMemo(()=>tracks.filter(t=>!relations.some(r=>r.childId===t.id)),[tracks,relations]);
 const children=(id:string)=>relations.filter(r=>r.parentId===id).sort((a,b)=>a.order-b.order);
 const parentOf=(id:string)=>relations.find(r=>r.childId===id)?.parentId;
 const selectedTrack=byId.get(active)||tracks[0];
 const flash=(msg:string)=>{setMessage(msg);window.clearTimeout((flash as any).timer);(flash as any).timer=window.setTimeout(()=>setMessage(""),3500)};
 const send=(type:string,data:any={})=>frameRef.current?.contentWindow?.postMessage({bridgeV83:true,type,...data},window.location.origin);
 const openPanel=(tab="metadata")=>{setPanel(true);setSection(tab);if(panelReady)send("OPEN_SECTION",{section:tab})};
 const currentState=()=>({master:{id:"hardcore",name:byId.get("hardcore")?.name||"Hardcore",artist:"Johnny Jane"},children:children("hardcore").map(r=>({id:r.childId,name:byId.get(r.childId)?.name||r.childId,kind:r.kind,type:r.type,duration:fmt(byId.get(r.childId)?.duration||0),fileName:byId.get(r.childId)?.fileName||""}))});
 useEffect(()=>{if(panelReady)send("PANEL_DATA",currentState())},[panelReady,relations,tracks]);
 useEffect(()=>{const h=()=>setMobile(window.innerWidth<=767);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
 const play=(id:string)=>{
  const t=byId.get(id),audio=audioRef.current;if(!t||!audio)return;
  if(active===id&&!audio.paused){audio.pause();return;}
  let url=t.url||cache.current[id];if(!url){url=makePreview(id,t.duration);cache.current[id]=url}
  if(audio.src!==url){audio.src=url;audio.load();setElapsed(0);setDuration(0)}
  audio.loop=!t.url;setActive(id);audio.play().catch(()=>flash("Tap play again if your browser prevented autoplay."));
 };
 const unlink=(id:string)=>{setRelations(x=>x.filter(r=>r.childId!==id));flash("Version unlinked. The original track remains in the Library.")};
 const link=()=>{if(!modal)return;const{parentId,childId,type}=modal;if(parentId===childId||parentOf(parentId)){flash("Choose an independent main track.");return}setRelations(p=>[...p.filter(r=>r.childId!==childId),{parentId,childId,kind:type==="Stem"?"stem":"version",type,order:p.filter(r=>r.parentId===parentId).length}]);setExpanded(p=>new Set([...p,parentId]));setModal(null);flash("Linked. The secondary file now appears under the main version.")};
 const showLink=(childId="tv-mix",parentId="hardcore")=>setModal({childId,parentId,type:childId==="tv-mix"?"TV mix":"Mix"});
 const toggle=(id:string)=>setExpanded(p=>{const n=new Set(p);if(n.has(id))n.delete(id);else n.add(id);return n});
 const toggleSelected=(id:string)=>setSelected(p=>{const n=new Set(p);if(n.has(id))n.delete(id);else n.add(id);return n});
 const reset=()=>{audioRef.current?.pause();audioRef.current?.removeAttribute("src");Object.values(cache.current).forEach(URL.revokeObjectURL);cache.current={};setTracks(initialTracks);setRelations(initialRelations);setExpanded(new Set(["hardcore"]));setSelected(new Set());setActive("hardcore");setQuery("");setModal(null);flash("Demo reset.")};
 const addFiles=(files:FileList|null)=>{if(!files?.length)return;const accepted=Array.from(files).filter(f=>f.type.startsWith("audio/")||/\.(wav|flac|mp3|aiff|m4a|aif|ogg)$/i.test(f.name));if(!accepted.length){flash("Select audio files.");return}const added=accepted.map((f,i)=>({...t("upload-"+Date.now()+"-"+i,f.name.replace(/\.[^.]+$/,""),179),url:URL.createObjectURL(f),fileName:f.name,sample:false}));setTracks(p=>[...p,...added]);setRelations(p=>[...p,...added.map((t,i)=>({parentId:"hardcore",childId:t.id,kind:"version" as const,type:"Mix",order:p.length+i}))]);setExpanded(p=>new Set([...p,"hardcore"]));flash(added.length+" local audio file(s) linked.");if(uploadRef.current)uploadRef.current.value=""};
 useEffect(()=>{const handler=(e:MessageEvent)=>{if(e.origin!==window.location.origin||e.source!==frameRef.current?.contentWindow||!e.data?.bridgeV83)return;const d=e.data;if(d.type==="PANEL_READY"){setPanelReady(true);send("PANEL_DATA",currentState());send("OPEN_SECTION",{section})}if(d.type==="PANEL_CLOSE")setPanel(false);if(d.type==="PANEL_ERROR")flash(d.message);if(d.type==="PLAY_VERSION")play(d.trackId);if(d.type==="LINK_REQUEST")showLink();if(d.type==="UPLOAD_REQUEST")uploadRef.current?.click();if(d.type==="UNLINK_VERSION")unlink(d.trackId);if(d.type==="RENAME_VERSION"){setTracks(ts=>ts.map(t=>t.id===d.trackId?{...t,name:d.name}:t));flash("Version renamed locally.")}};window.addEventListener("message",handler);return()=>window.removeEventListener("message",handler)},[tracks,relations,active,section]);
 const visible=roots.filter(t=>(!onlyGroups||children(t.id).length>0)&&(!query||t.name.toLowerCase().includes(query.toLowerCase())||children(t.id).some(r=>byId.get(r.childId)?.name.toLowerCase().includes(query.toLowerCase())))).sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="duration"?b.duration-a.duration:0);
 const showMenu=(id:string,x:number,y:number)=>setMenu({id,x,y});
 const row=(t:Track,r?:Rel)=>{
  const group=children(t.id),nested=!!r,current=active===t.id,sel=selected.has(t.id),has=group.length>0;
  const cls="library-row"+(nested?" is-child":"")+(sel?" is-selected":"")+(has?" has-versions":"");
  return <div className={cls} data-track-id={t.id} key={t.id} role="row"
   onDoubleClick={e=>{if(!(e.target as HTMLElement).closest("button,input"))play(t.id)}}
   onClick={e=>{if(!(e.target as HTMLElement).closest("button,input,[data-testid='list-togglePlay-icon']"))toggleSelected(t.id)}}>
    {mobile?<MobileTrackListRow data={t as any} isPlaying={playing} isActiveTrack={current} canStream={true} canDownload={true} canAccessTrackMetadata={true} togglePlayCallback={play} openActionModalCallback={()=>showMenu(t.id,window.innerWidth-210,90)}/>
    :<ListRowShare data={t as any} isLibrary={true} isHover={true} isPlaying={playing} isInError={false} isActiveTrack={current?1:0} isSelected={sel} canStream={true} togglePlay={(({trackId}:{trackId:string})=>play(trackId)) as any} toggleSelect={()=>toggleSelected(t.id)}
     menuOptions={[{label:"More actions",action:()=>showMenu(t.id,window.innerWidth-210,80)}] as any}
     handleOpenMenu={({x,y})=>showMenu(t.id,x,y)} actionsList={[{icon:IconComponents.Share,tooltipLabel:"Share",action:()=>flash("Sharing is simulated in this demo.")},{icon:IconComponents.Info,tooltipLabel:"Track information",action:()=>openPanel("metadata")}] as any} redirectTo={()=>flash("Navigation is outside this prototype.")}/>}
    {has&&<button className="v83-caret" title="Expand or collapse linked versions" aria-label={(expanded.has(t.id)?"Collapse ":"Expand ")+group.length+" versions"} aria-expanded={expanded.has(t.id)} onClick={e=>{e.stopPropagation();toggle(t.id)}}><I n="right" size={13}/></button>}
    {nested&&<span className="v83-child-indent">↳</span>}
    {!mobile&&has&&<button className="v83-count" onClick={e=>{e.stopPropagation();toggle(t.id)}}>{group.length} versions</button>}
    {!mobile&&nested&&<span className="v83-relation-label">{r.type}</span>}
   </div>;
 };
 const groupView=(parent:Track)=>{
  const rel=children(parent.id),alts=rel.filter(r=>r.kind==="version"),stems=showStems?rel.filter(r=>r.kind==="stem"):[];
  return <React.Fragment key={parent.id}>{row(parent)}
   {expanded.has(parent.id)&&!!rel.length&&<>
    {!!alts.length&&<div className="library-children-label">ALTERNATE VERSIONS <span>{alts.length}</span></div>}
    {alts.map(r=>byId.get(r.childId)?row(byId.get(r.childId)!,r):null)}
    {!!stems.length&&<div className="library-children-label">STEMS <span>{stems.length}</span></div>}
    {stems.map(r=>byId.get(r.childId)?row(byId.get(r.childId)!,r):null)}
   </>}
  </React.Fragment>;
 };
 const menus=menu?[
  ["Track information","info",()=>openPanel("metadata")],
  ["Manage versions","layers",()=>openPanel("versions")],
  ["Link as secondary version","link",()=>showLink(menu.id)],
  ...(parentOf(menu.id)?[["Unlink secondary version","unlink",()=>unlink(menu.id)]]:[]),
  ["Share","link",()=>flash("Share settings are not connected to production.")]
 ]:[];
 return <div className="bridge-shell" onClick={e=>{if(menu&&!(e.target as HTMLElement).closest(".context-menu"))setMenu(null)}}>
  <aside className="nav-rail"><div className="brand-mark">B</div>{[["music","Library"],["folder","Projects"],["layers","Hubs"],["users","Shared"]].map(([icon,title])=><button key={title} className={"nav-button"+(title==="Library"?" is-active":"")} onClick={()=>title!=="Library"&&flash(title+" is outside this Library demo.")}><I n={icon}/>{title}</button>)}<button className="nav-button nav-bottom" onClick={()=>flash("Settings are outside this demo.")}><I n="filter"/>Settings</button></aside>
  <header className="topbar"><div className="crumb">My Label <span className="crumb-sep">/</span> <strong>Library</strong> <span className="crumb-sep">/</span> Tracks</div><div className="top-spacer"/><div className="top-search"><I n="search" size={15}/> Quick search <span>⌘ K</span></div><div className="top-avatar">CS</div></header>
  <main className="content"><div className="content-head">
   <div className="content-head-top"><h1>Tracks</h1><span className="prototype-ribbon">Clean V83 · demo data</span></div>
   <p className="description">Your music library, grouped by recording and ready to share.</p>
   <div className="toolbar"><label className="search-field"><I n="search"/><input placeholder="Search tracks and versions…" aria-label="Search tracks and versions" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <button className="tool-button" onClick={()=>setFilters(!filters)}><I n="filter"/> Filters</button>
    <button className="tool-button" onClick={()=>setSort(sort==="recent"?"name":sort==="name"?"duration":"recent")}>Sort: {sort==="recent"?"Recent":sort==="name"?"Name":"Duration"} <I n="down" size={14}/></button>
    <div className="toolbar-right"><button className="tool-button" onClick={reset}><I n="reset" size={15}/> Reset</button><button className="tool-button accent" onClick={()=>uploadRef.current?.click()}><I n="plus" size={15}/> Add audio</button></div>
   </div>
   {filters&&<div style={{display:"flex",gap:18,fontSize:11,paddingBottom:12}}><label><input type="checkbox" checked={onlyGroups} onChange={e=>setOnlyGroups(e.target.checked)}/> Only tracks with versions</label><label><input type="checkbox" checked={showStems} onChange={e=>setShowStems(e.target.checked)}/> Show stems</label></div>}
  </div>
  <div className="library-frame" role="table" aria-label="Track library"><div className="library-header" role="row"><div><input type="checkbox" aria-label="Select all" onChange={e=>setSelected(e.target.checked?new Set(visible.map(t=>t.id)):new Set())}/></div><div>Tracks ({tracks.length})</div><div>Album</div><div>Duration</div><div>Added</div><div>Hubs</div><div/></div>
  <div className="library-scroll">{visible.length?visible.map(groupView):<div className="library-empty">No matching tracks.</div>}</div>
  <div className="library-status"><span><strong>{visible.length}</strong> main tracks · <strong>{relations.length}</strong> linked versions/stems</span><span>{selected.size?selected.size+" selected · ":""}Prototype, not production data</span></div></div></main>
  <footer className="player"><img className="player-art" alt="Track cover" src={selectedTrack.image}/><button className="play-circle" aria-label={playing?"Pause":"Play"} onClick={()=>play(active)}><I n={playing?"pause":"play"}/></button><div className="player-label"><strong>{selectedTrack.name}</strong><small>Johnny Jane · {selectedTrack.url?"Local audio file":"Original synthetic demo audio"}</small></div>
   <div className="wave-box"><input type="range" min="0" max="100" step=".1" aria-label="Seek" value={duration?100*elapsed/duration:0} onChange={e=>{if(audioRef.current&&duration)audioRef.current.currentTime=duration*Number(e.target.value)/100}}/><div className="wave-time"><span>{fmt(elapsed)}</span><span>{fmt(duration||selectedTrack.duration)}</span></div></div>
   <button className="player-version" onClick={()=>openPanel("versions")}><I n="layers" size={14}/><span>Versions</span><I n="down" size={14}/></button>
   <audio ref={audioRef} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onTimeUpdate={e=>setElapsed((e.target as HTMLAudioElement).currentTime)} onLoadedMetadata={e=>setDuration((e.target as HTMLAudioElement).duration||0)} style={{display:"none"}}/></footer>
  <input type="file" ref={uploadRef} multiple accept="audio/*,.mp3,.wav,.flac,.aiff,.m4a,.ogg" style={{display:"none"}} onChange={e=>addFiles(e.target.files)}/>
  {menu&&<div className="context-menu" role="menu" style={{left:Math.max(8,Math.min(window.innerWidth-210,menu.x)),top:Math.max(8,Math.min(window.innerHeight-290,menu.y))}}><div style={{fontSize:11,padding:9,color:"#888"}}>{byId.get(menu.id)?.name}</div>{menus.map(([label,icon,action],i)=><button key={i} onClick={()=>{setMenu(null);(action as any)()}}><I n={icon as string} size={15}/>{label as string}</button>)}</div>}
  {panel&&<><div className="overlay-dismiss" onClick={()=>setPanel(false)}/><aside className="panel-shell" aria-label="Original metadata panel V80"><iframe ref={frameRef} title="Bridge New Panel V80" src="/panel-clean-v80.html"/></aside></>}
  {modal&&<div className="modal-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)setModal(null)}}><div className="modal-card" role="dialog" aria-modal="true" aria-label="Link existing track"><div className="modal-head"><div><h3>Link an existing track</h3><p>Choose one main track and a secondary version. Their files remain independent.</p></div><button className="modal-x" onClick={()=>setModal(null)}>×</button></div>
    <label className="modal-label">Main track</label><select className="modal-select" value={modal.parentId} onChange={e=>setModal({...modal,parentId:e.target.value})}>{roots.filter(t=>t.id!==modal.childId).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
    <label className="modal-label">Secondary track</label><select className="modal-select" value={modal.childId} onChange={e=>setModal({...modal,childId:e.target.value})}>{roots.filter(t=>t.id!==modal.parentId).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
    <label className="modal-label">Version type</label><select className="modal-select" value={modal.type} onChange={e=>setModal({...modal,type:e.target.value})}>{kinds.map(k=><option key={k}>{k}</option>)}</select>
    <p className="modal-explain">Linking changes grouping, not the source file. Unlinking restores the independent Library entry. Alternate versions and stems retain their own metadata and permissions.</p><div className="modal-actions"><button onClick={()=>setModal(null)}>Cancel</button><button className="primary" onClick={link}>Link track</button></div></div></div>}
  {message&&<div className="toast" role="status">{message}</div>}
 </div>;
}
createRoot(document.getElementById("root")!).render(<App/>);
