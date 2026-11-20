'use strict';
const icons={
home:'<path d="m3 10 9-7 9 7v10H3zM9 20v-6h6v6"/>',
train:'<path d="M3 9v6m4-9v12m10-12v12m4-9v6M7 12h10"/>',
trend:'<path d="M3 4v16h18M7 15l4-4 4 2 5-6m-4 0h4v4"/>',
rugby:'<ellipse cx="12" cy="12" rx="8.5" ry="5.3" transform="rotate(-35 12 12)"/><path d="M7 17 17 7M9.8 9.8l2.2 2.2m-.7-3.6 2.2 2.2m-3.6.7 2.2 2.2"/>',
fuel:'<path d="M12 6c1-3 3-3 5-3-1 3-3 4-5 4M12 9c-7-5-12 3-7 9 2 3 4 4 7 2 3 2 5 1 7-2 5-6 0-14-7-9Z"/>',
users:'<circle cx="9" cy="8" r="3"/><path d="M2 20v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2zm15-15a3 3 0 0 1 0 6m1 2a5 5 0 0 1 4 5v2"/>',
clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v4H9zM9 12h6m-6 4h6"/>',
chat:'<path d="M20 4H4v12h5l3 4 3-4h5zM8 9h8m-8 3h5"/>',
arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
back:'<path d="M20 12H5m6-6-6 6 6 6"/>',
bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-8z"/>',
check:'<path d="m5 12 5 5 9-10"/>',
flag:'<path d="M5 22V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
plus:'<path d="M12 5v14M5 12h14"/>'
};
const icon=(name,size=19)=>'<svg aria-hidden="true" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg>';
const e=(x='')=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='corsairs-pathway-demo-v1';
const roster={'Eli Morgan':'U14 · Centre','Sam Patel':'U14 · Wing','Rory James':'U14 · Flanker'};
const categories={Speed:'bolt',Fitness:'bolt',Skills:'flag',Gym:'train','Strength & movement':'train'};
const unitNames={sec:'Sprint time (seconds)',reps:'Reps',kg:'Weight (kg)',m:'Metres',sets:'Sets, reps and optional load'};
const unitShort={sec:'s',reps:'reps',kg:'kg',m:'m'};
const welcomePraise='Good work getting your hands up early last Sunday.';
const initial=()=>({plans:[{id:'speed-01',title:'First-step speed',category:'Speed',duration:18,when:'This week',audience:'U14 squad',items:[
{name:'Movement prep',target:'A few minutes to warm up',cue:'Use clear, flat ground and ease into the movements.',unit:'',supervised:false},
{name:'10 m acceleration',target:'Coach-led · log a timed effort',cue:'Stay low for the first few steps. Take a full recovery between efforts.',unit:'sec',supervised:false},
{name:'Fast feet and stick',target:'Record clean landings',cue:'Land softly and hold your balance before resetting.',unit:'reps',supervised:false}
]}],logs:{},drafts:{},reviews:[{id:'welcome',player:'Eli Morgan',logId:null,body:welcomePraise+' Next time, try calling for the ball a little sooner.',goal:'Call early and ask for the ball',review:'Sunday training'}]});
let state=initial(),storageOK=true;
try{const cached=localStorage.getItem(key);if(cached)state=JSON.parse(cached);}catch{storageOK=false;}
const starterSpeed=state.plans.find(plan=>plan.id==='speed-01');
if(starterSpeed)starterSpeed.preset=true;
const gymSeed={id:'gym-01',preset:true,title:'Gym foundations',category:'Gym',duration:20,when:'This week',audience:'U14 squad',items:[
{name:'Movement prep',target:'Warm-up',instructions:'Ask your trainer to show you the warm-up.\nCheck you have room to move.\nStart easy and build up at your trainer’s pace.',unit:'',supervised:false},
{name:'Squat to a box',target:'',repCount:8,equipment:'Stable box or bench checked by your trainer',builtInDemo:true,instructions:'Set up in front of the box as your trainer shows you.\nLower slowly until you lightly touch the box.\nStand back up smoothly. Follow your trainer’s cue for rest and any weight.',unit:'sets',setCount:2,supervised:true}]};
const gymTemplates=[gymSeed,{id:'gym-bodyweight-01',preset:true,title:'Bodyweight basics',category:'Gym',duration:15,audience:'U14 squad',items:[
 {name:'Press-up',unit:'sets',setCount:2,repCount:6,equipment:'Floor',instructions:'Ask your trainer to show you the version to use. Log the reps you did.',supervised:true},
 {name:'Glute bridge',unit:'sets',setCount:2,repCount:8,equipment:'Floor',instructions:'Follow the setup and tempo your trainer shows you.',supervised:true}
]}];
for(const template of gymTemplates){
 const index=state.plans.findIndex(plan=>plan.id===template.id);
 if(index<0)state.plans.push(template);
 else state.plans[index]=template;
}
const trainingPacks={
 'speed-starts':{title:'First-step speed',category:'Speed',duration:15,description:'Practise your start and log a 10 m time.',items:[
  {name:'Movement prep',target:'Warm up with your coach',unit:'',supervised:true},
  {name:'10 m acceleration',target:'Coach-led timed effort',unit:'sec',distanceMetres:10,instructions:'Use the start your coach shows you. Run through the finish and record the time your coach gives you.',supervised:true}
 ]},
 'speed-turns':{title:'Stop, turn & go',category:'Fitness',duration:15,description:'Practise slowing down and moving into space.',items:[
  {name:'Movement prep',target:'Warm up with your coach',unit:'',supervised:true},
  {name:'Decelerate and change direction',target:'Coach-led practice',unit:'',instructions:'Follow the cone setup your coach shows you. Practise each side and build pace when your coach says you are ready.',supervised:true}
 ]}
};
state.profiles??={'Eli Morgan':{preferred:'Centre',secondary:'Wing',focus:'Centre',explore:'Full-back'},'Sam Patel':{preferred:'Wing',secondary:'',focus:'Wing',explore:'Centre'},'Rory James':{preferred:'Flanker',secondary:'',focus:'Flanker',explore:'Lock'}};
state.playerFocus??={};
state.oneSessions??={};
state.oneRequestNotes??={};
state.oneRequests??=Object.fromEntries(Object.entries(state.playerFocus).filter(([name,skill])=>skill&&!state.oneSessions[name]?.length));
state.skillNotes??={};
state.coachSkillFocus??={};
if(!Object.hasOwn(state.profiles['Eli Morgan'],'shirt'))state.profiles['Eli Morgan'].shirt=13;
const positionTips={
 Prop:'Start balanced and take short support steps. Practise scrum technique only with your age-grade coach.',
 Hooker:'Work on a repeatable lineout throw in coached practice and support the next phase.',
 Lock:'Communicate early at the lineout and arrive square in support.',
 Flanker:'Scan early and practise arriving in support on both sides of the ball.',
 'Number 8':'Scan for space and communicate with your scrum-half.',
 'Scrum-half':'Pass accurately both ways and look up before you reach the ball.',
 'Fly-half':'Scan early, call what you see and practise when to carry or pass.',
 Centre:'Scan the defender before receiving. Catch and pass on the move, both ways.',
 Wing:'Hold width and call for space. Change pace while keeping the ball secure.',
 'Full-back':'Talk early about space behind the line. Get into position to catch and link with your wings.'
};
const factors={
 'Short passing':'Find a nearby teammate in stride, on either side.',
 'Long passing':'Find a wider teammate with a playable pass at the right moment.',
 'Catching & handling':'Show hands early and secure the ball on the move.',
 'Tackling':'Use safe technique in age-grade, coach-led practice or a match.',
 'Dominant tackling':'Discuss effective, controlled tackles with your coach. Look at the outcome and safe technique together.',
 'Carrying & evasion':'Change pace or direction while keeping the ball secure.',
 'Support & work off the ball':'Offer a useful running line or get back into position.',
 'Scanning & decision-making':'Look early and choose when to pass, carry or kick.',
 'Communication':'Give early, useful information teammates can act on.',
 'Leadership & teamwork':'Help teammates reset, include others or set a good example.',
 'Kicking (optional)':'Choose and execute a kick appropriate to the situation.',
 'Goal kicking':'Discuss your routine and how reliably you strike the ball in goal-kicking practice.',
 'Scrummaging':'Discuss your role in a coached, age-grade scrum with your coach.',
 'Breakdown (optional)':'Use safe, legal technique in age-grade, coach-led practice.',
 'Set piece (optional)':'Carry out a role safely in an age-grade, coach-led setup.',
 'Gym technique (optional)':'Control the movement and follow the trainer’s cue.'
};
const positionFactors={
 Prop:['Tackling','Scrummaging','Support & work off the ball'],
 Hooker:['Scrummaging','Set piece (optional)','Catching & handling'],
 Lock:['Scrummaging','Set piece (optional)','Support & work off the ball'],
 Flanker:['Scrummaging','Support & work off the ball','Breakdown (optional)'],
 'Number 8':['Scrummaging','Carrying & evasion','Support & work off the ball'],
 'Scrum-half':['Short passing','Long passing','Communication'],
 'Fly-half':['Kicking (optional)','Goal kicking','Scanning & decision-making','Communication'],
 Centre:['Short passing','Tackling','Scanning & decision-making','Carrying & evasion'],
 Wing:['Carrying & evasion','Catching & handling','Support & work off the ball'],
 'Full-back':['Catching & handling','Kicking (optional)','Scanning & decision-making']
};
const londonToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const example=(id,observedOn,marker,body,goal)=>({id,player:'Eli Morgan', observedOn,context:'Pitch training',position:'Centre',factors:[{aspect:'Short passing',marker}],body,goal,example:true});
const exampleHistory=[
 example('demo-2','2026-11-08','Building consistency','At walking pace, passes on either side reached a moving teammate. At a jog, the left pass sometimes went behind.','Release earlier when passing left at a jog.'),
 example('demo-1','2026-10-25','Learning','The right pass reached the receiver at walking pace. The left pass often made them stop.','Lead the receiver with short passes to the left at walking pace.')];
const skillLevels=[
 {key:'Learning',label:'Learning'},
 {key:'Building consistency',label:'Getting steadier'},
 {key:'Consistent in this context',label:'Consistent'},
 {key:'Consistent under pressure',label:'Consistent under pressure'}
];
const markers=skillLevels.map(level=>level.key);
const coreProfileSkills=['Short passing','Long passing','Tackling','Dominant tackling','Breakdown (optional)'];
const isGym=p=>p.category==='Gym'||p.category==='Strength & movement';
let role='player',draft=null,toastTimer;
const main=document.querySelector('#main'), nav=document.querySelector('#nav'), toastEl=document.querySelector('#toast');
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{storageOK=false;}};
function clearToast(){
 clearTimeout(toastTimer);
 toastEl.textContent='';
}
function notify(message){
 clearToast();
 toastEl.textContent=message;
 toastTimer=setTimeout(clearToast,3400);
}
const logKey=(id,player='Eli Morgan')=>id+'|'+player;
const ownPlans=()=>state.plans.filter(p=>p.audience==='U14 squad'||p.audience==='Eli Morgan');
const ownLog=p=>playerLogs(playerName).find(log=>log.plan===p.id);
const newId=prefix=>prefix+'-'+crypto.randomUUID();
const sessionPath=(plan,origin,attempt)=>'session/'+plan.id+'/'+origin+(attempt?'/'+attempt:'');
const isFitness=plan=>['Speed','Fitness'].includes(plan.category);
const sessionOrigin=plan=>isGym(plan)?'gym':isFitness(plan)?'fitness':'field';
state.targets??={'Sam Patel':{goal:'Call early when there is space out wide.',review:londonToday(),savedAt:0}};
const playerHistory=name=>state.reviews.filter(x=>x.player===name);
const activeTarget=name=>{
 const review=playerHistory(name).find(r=>r.goal),target=state.targets[name];
 return target&&(!review||(target.savedAt??0)>(review.savedAt??0))?target:review;
};
const tag=(label,kind='')=>'<span class="tag '+kind+'">'+e(label)+'</span>';
const heading=(k,title,sub='')=>'<div class="eyebrow">'+e(k)+'</div><h1 class="page-title">'+e(title)+'</h1>'+(sub?'<p class="sub">'+e(sub)+'</p>':'');
const back=(to,label)=>'<a class="quiet" href="#'+to+'">'+icon('back',16)+e(label)+'</a>';
const go=to=>{if(location.hash==='#'+to)render();else location.hash=to;};
const dateText=value=>/^\d{4}-\d\d-\d\d$/.test(value)?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z')):value;
const names={done:'Completed',partial:'Part completed',skipped:'Skipped'};
const playerLogLabel=(plan,log)=>isGym(plan)&&log.status==='partial'?'Partial gym log':names[log.status];
const visibilityNote=(player=playerName)=>'<p class="call">Visible to '+e(player)+', verified linked parent or carer (Jo Morgan) and authorised U14 coaches.</p>';
const safeguardingFold=()=>fold('Help &amp; safeguarding','<p class="details"><strong>Team Manager - John Partridge</strong>. Speak to your parent, carer or team manager if anything worries you. Safeguarding and medical matters are handled outside this app.</p>','safeguard-fold');
const foot=()=>safeguardingFold()+'<p class="note">Prototype · fictional players · '+(storageOK?'changes stay in this browser':'changes last until this page closes')+'</p>';
const notFound=(to)=>heading('Corsairs pathway','That page moved')+'<div class="actions">'+back(to,'Back to your dashboard')+'</div>';

function planCard(plan,feature=false,origin='train',log=null){
 const started=state.drafts[logKey(plan.id)]?.some(x=>x.status);
 const when=/^\d{4}-/.test(plan.when??'')?'Due '+dateText(plan.when):dateText(plan.when);
 const meta=log?resultLoggedAt.format(log.at):plan.personal?'My gym session':plan.preset?plan.duration+' min':[plan.duration+' min',when].filter(Boolean).join(' · ');
 const view=log?sessionPath(plan,origin,log.id):sessionPath(plan,origin,'new');
 const label=log?'View log':started?'Continue log':ownLog(plan)?'Log again':'Log session';
 return '<article class="card training-plan '+(feature?'training-feature main-plan accent':'')+'"><div class="row"><span class="icon-tile">'+icon(categories[plan.category])+'</span><div><h3 class="card-title">'+e(plan.title)+'</h3><p class="mini">'+e(meta)+'</p></div>'+(log?tag(playerLogLabel(plan,log),log.status==='partial'?'attention':'good'):'')+'</div>'+
 '<div class="actions"><a href="#'+view+'" class="'+(feature?'primary':'secondary')+'">'+label+icon('arrow',16)+'</a>'+
 (log?'<a class="text-link" href="#'+sessionPath(plan,origin,'new')+'">Log again</a>':'')+'</div></article>';
}
function observationMeta(x){
 const bits=[x.observedOn?dateText(x.observedOn):'',x.context,x.position,x.example?'Demo example':''].filter(Boolean);
 return bits.length?'<p class="mini">'+bits.map(e).join(' · ')+'</p>':'';
}
function reviewCard(x){
 return '<article class="card accent"><div class="eyebrow">Coach Alex</div>'+observationMeta(x)+((x.factors??[]).map(f=>'<div class="factor-result">'+tag(f.aspect)+(f.marker?tag(playerMarker(f.marker),'dim'):'')+'</div>').join(''))+(x.goodWork?'<div class="factor-result">'+tag('Good work','good')+'</div>':'')+'<p class="details">'+e(x.body)+'</p>'+(x.goal?'<div class="line"><div class="row"><span class="icon-tile">'+icon('flag')+'</span><div><span class="mini">YOUR NEXT TARGET</span><h3 class="activity-name">'+e(x.goal)+'</h3><p class="mini">Review: '+e(dateText(x.review)||'To be agreed')+'</p></div></div></div>':'')+'<p class="mini line">Visible to '+e(x.player||playerName)+', linked parent or carer (Jo Morgan) and authorised U14 coaches.</p></article>';
}

function fold(label,body,classes=''){
 return '<details class="fold '+classes+'"><summary>'+label+'</summary><div class="fold-content">'+body+'</div></details>';
}

function positionCard(){
 const p=state.profiles['Eli Morgan'],primary=p.focus;
 if(!primary)return '<div class="card empty">Ask your coach which position to try next.</div>';
 return '<div class="card position-card"><h3 class="card-title">'+e(primary)+'</h3><p class="details">'+e(positionTips[primary])+'</p></div>';
}


const playerName='Eli Morgan';
function scheduleKey(plan){
 if(/^\d{4}-\d{2}-\d{2}$/.test(plan.when??''))return plan.when;
 return plan.when==='This week'?londonToday():'9999-12-31';
}
function nextTraining(plans){
 return plans.slice().sort((a,b)=>scheduleKey(a).localeCompare(scheduleKey(b)));
}
function currentSkillFocus(name,target=activeTarget(name)){
 const focus=state.coachSkillFocus[name];
 return focus&&(!target||(focus.savedAt??0)>=(target.savedAt??0))?focus:null;
}
function shirtGraphic(number){
 return '<span class="profile-shirt" role="img" aria-label="'+(number?'Shirt number '+e(number):'Shirt number not set')+'">'+
 '<img src="corsairs-shirt.webp" alt=""><span class="shirt-number" aria-hidden="true">'+e(number||'–')+'</span></span>';
}

function todayTile(route,symbol,title,variant){
 return '<a class="card today-tile '+variant+'" href="#'+route+'"><span class="tile-mark">'+icon(symbol,76)+'</span><h2>'+e(title)+'</h2><span class="tile-arrow">'+icon('arrow',18)+'</span></a>';
}
function sectionHero(title,symbol,variant,action,detail='',compact=false){
 return '<header class="section-hero '+variant+(compact?' app-section-header':'')+'"><span class="tile-mark">'+icon(symbol,124)+'</span><h1>'+e(title)+'</h1>'+
 (detail?'<p>'+e(detail)+'</p>':'')+
 (action?'<a class="section-action" href="#'+action.to+'"'+(action.jump?' data-jump="'+action.to+'"':'')+'>'+e(action.label)+icon('arrow',18)+'</a>':'')+'</header>';
}
function compactHeader(title,symbol,variant,action=null,detail=''){
 return sectionHero(title,symbol,variant,action,detail,true);
}
function recordCoachUpdate(player,type,ref,skill){
 const updates=(state.coachUpdates??={});
 (updates[player]??=[]).unshift({id:newId('update'),type,ref,skill});
}
function findCoachUpdate(id){
 return state.coachUpdates?.[playerName]?.find(update=>update.id===id);
}
function latestCoachUpdate(){
 return state.coachUpdates?.[playerName]?.find(update=>{
  if(update.seen)return false;
  if(update.type==='profile-skill')return [...profilePositionSkills(playerName),...extraProfileSkills(playerName)].includes(update.skill);
  return update.type==='feedback'||update.type==='skill-note';
 });
}
function coachUpdatePath(update){
 return update.type==='skill-note'?skillPath(update.skill,'today',update.id):'profile/all/'+update.id;
}
function revealCoachUpdate(update,target){
 if(!update||!target)return;
 target.classList.add('coach-update-target');
 target.setAttribute('tabindex','-1');
 target.focus({preventScroll:true});
 target.scrollIntoView({block:'start',behavior:'instant'});
 if(!update.seen){
  update.seen=true;
  save();
 }
}
function playerKit(linkToProfile=false){
 const profile=state.profiles[playerName];
 const update=linkToProfile?latestCoachUpdate():null;
 const badges=kitPathwayBadges();
 const browse=linkToProfile&&!badges&&firstPathway()?'<a class="kit-profile-action" href="#pathways">Explore rugby pathways '+icon('arrow',15)+'</a>':'';
 const separateLinks=Boolean(update||badges||browse);
 const profileLink=linkToProfile&&separateLinks?'<a class="kit-profile-action" href="#profile" aria-label="View profile for Eli Morgan">View profile '+icon('arrow',15)+'</a>':
  linkToProfile?'<span class="kit-profile-action">View profile '+icon('arrow',15)+'</span>':'';
 const cue=update?'<a class="kit-coach-update" href="#'+coachUpdatePath(update)+'">'+icon('chat',15)+' New coach update '+icon('arrow',14)+'</a>':'';
 const content='<div class="kit-copy"><div class="eyebrow hero-label">NOTTINGHAM CORSAIRS · U14</div><h1>Eli <em>Morgan</em></h1><p class="kit-position">'+e(profile.focus||'Position to discuss')+'</p>'+
  (linkToProfile&&separateLinks?'<div class="kit-home-actions">'+profileLink+browse+cue+'</div>':profileLink)+'</div>'+shirtGraphic(profile.shirt)+badges;
 return linkToProfile&&!separateLinks
  ?'<a class="hero profile-hero player-kit floodlights kit-profile-link" href="#profile" aria-label="View profile for Eli Morgan">'+content+'</a>'
  :'<section class="hero profile-hero player-kit'+(linkToProfile?' floodlights':'')+'">'+content+'</section>';
}
function homeAssignedSession(){
 const logged=playerActivity(playerName).recorded;
 const next=nextTraining(ownPlans()).find(plan=>!plan.preset&&!plan.personal&&!logged.has(plan.id));
 if(!next)return '';
 return '<a class="home-target home-assignment" href="#'+sessionPath(next,'today','new')+'">'+
  '<span class="icon-tile">'+icon('bolt',18)+'</span><span class="home-target-copy"><strong>Assigned by your coach</strong>'+
  '<span>'+e(next.title)+'</span></span>'+icon('arrow',16)+'</a>';
}
function today(){
 const {next,focus}=playerCoachSnapshot(playerName);
 const work=next?'<a class="home-target" href="#'+(focus?.skill?skillPath(focus.skill,'today'):'coach-feedback')+'"><span class="icon-tile">'+icon('flag',18)+'</span>'+
 '<span class="home-target-copy"><strong>Work on next'+(focus?.skill?' · '+e(skillName(focus.skill)):'')+'</strong><span>'+e(next)+'</span></span>'+icon('arrow',16)+'</a>':'';
 return playerKit(true)+homeAssignedSession()+work+
 playerPathwayUpdates()+homeLatestProgress()+'<nav class="section today-tiles" aria-label="Player sections">'+
 todayTile('skills','rugby','Rugby skills','skills-tile')+
 todayTile('gym','train','Strength & conditioning','gym-tile strength-tile')+
 todayTile('coach-feedback','chat','Coach feedback','coaching-tile')+
 todayTile('fuel','fuel','Food & hydration','food-tile')+'</nav>'+
 (activePathways().some(([key])=>pathwayStatus(pathwayRecord(playerName,key)))?'<div class="actions home-quick-links"><a class="text-link" href="#pathways">Explore rugby pathways '+icon('arrow',16)+'</a></div>':'')+foot();
}
function playerCoachSnapshot(name){
 const reviews=playerHistory(name);
 const target=activeTarget(name),focus=currentSkillFocus(name,target);
 const praises=[...reviews,...(state.skillNotes[name]??[])].filter(note=>note.goodWork)
  .sort((a,b)=>(b.savedAt??0)-(a.savedAt??0)||(b.observedOn??'').localeCompare(a.observedOn??''));
 return {
  reviews,focus,target,praises,
  positive:praises[0]?.body||(reviews.length===1&&reviews[0].id==='welcome'?welcomePraise:''),
  praiseSkill:praises[0]?.factors?.[0]?.aspect,
  next:focus?.note||target?.goal
 };
}
function profileCoachSummary(name,showHeading=true){
 const {focus,target,praises,positive,praiseSkill,next}=playerCoachSnapshot(name);
 if(!next&&!positive)return '';
 const extraSkills=[...new Set(praises.flatMap(note=>(note.factors??[]).map(f=>f.aspect)))]
  .filter(skill=>skill!==praiseSkill&&Object.hasOwn(factors,skill)).slice(0,3);
 const relatedNote=!focus&&target?.context==='1:1 coaching'&&target.body&&target.body!==next?'<p class="mini">From your 1:1</p><p>'+e(target.body)+'</p>':'';
 const checkIn=!focus&&target?.review?'<p class="mini">Check in: '+e(dateText(target.review))+'</p>':'';
 const work=next?'<div class="profile-coach-work" id="profile-target" tabindex="-1">'+
  '<h3>Work on next</h3><p class="profile-coach-target">'+e(next)+'</p>'+
  (focus?'<p class="mini">'+e(skillName(focus.skill))+'</p>':'')+relatedNote+checkIn+'</div>':'';
 const praise=positive&&positive!==next?'<div class="profile-coach-praise"><h3>What went well</h3>'+
  (praiseSkill?'<p class="mini">'+e(skillName(praiseSkill))+'</p>':'')+'<p>'+e(positive)+'</p>'+
  (extraSkills.length?'<div class="skill-shortcuts">'+extraSkills.map(skill=>skillShortcut(skill,'profile-highlight')).join('')+'</div>':'')+
  '</div>':'';
 return '<section class="section" aria-label="Current coaching feedback">'+
  (showHeading?'<h2 class="section-title block-title">From your coach</h2>':'')+
  '<div class="card profile-coach-summary">'+work+praise+'</div></section>';
}
function feedbackKind(review){
 if(review.context==='Match')return 'match';
 if(review.context==='1:1 coaching')return 'one-to-one';
 if(review.logId||['Pitch training','Speed session','Gym session','Session review'].includes(review.context))return 'training';
 return '';
}
function profileFeedbackCard(review,collapsed=false){
 const log=review.logId&&playerLogs(playerName).find(entry=>entry.id===review.logId);
 const plan=log&&ownPlans().find(entry=>entry.id===log.plan);
 const kind=feedbackKind(review);
 const label=review.eventTitle||plan?.title||(kind==='match'?'Match feedback':review.context||'Coach note');
 const date=log&&Number.isFinite(log.at)?resultFullDate.format(log.at):dateText(review.observedOn);
 const context={match:'Match',training:'Training','one-to-one':'1:1 coaching'}[kind];
 const meta=[context&&context!==label?context:'',date].filter(Boolean).join(' · ');
 const skills=(review.factors??[]).filter(f=>Object.hasOwn(factors,f.aspect));
 const message='<p class="details">'+e(review.body)+'</p>'+
  (review.goal?'<p class="profile-feedback-target"><strong>Try next</strong> '+e(review.goal)+'</p>':'');
 return '<article class="card profile-feedback-card" data-feedback-id="'+e(review.id)+'">'+(meta?'<p class="mini">'+e(meta)+'</p>':'')+
  '<h3 class="activity-name">'+e(label)+'</h3>'+
  (skills.length||review.goodWork?'<div class="skill-shortcuts">'+skills.map(f=>tag(skillName(f.aspect),'dim')).join('')+
   (review.goodWork?tag('Good work','good'):'')+'</div>':'')+
  (collapsed?fold('Read full note',message,'note-fold'):message)+'</article>';
}
function profileFeedback(highlightedId,title='Coach feedback'){
 const {reviews:history,target,praises}=playerCoachSnapshot(playerName);
 const reviews=history.filter(note=>note.id!=='welcome');
 if(!reviews.length)return '';
 const recent=reviews.find(note=>note.id===highlightedId)??reviews[0];
 const older=reviews.filter(note=>note!==recent);
 const card=note=>profileFeedbackCard(note,note.id!==highlightedId&&(note===praises[0]||note===target));
 return '<section class="section section-destination" id="profile-feedback" tabindex="-1"><h2 class="section-title block-title">'+e(title)+'</h2>'+
 '<div class="stack profile-feedback-list">'+card(recent)+
 (older.length?fold('Earlier feedback ('+older.length+')','<div class="stack">'+older.map(card).join('')+'</div>'):'')+'</div></section>';
}
function addedProfileSkills(name){
 const skills=state.profiles[name]?.extraSkills;
 return Array.isArray(skills)?[...new Set(skills)].filter(skill=>Object.hasOwn(factors,skill)&&!coreProfileSkills.includes(skill)):[];
}
function profilePositionSkills(name){
 const position=state.profiles[name]?.focus;
 return (positionFactors[position]??[]).filter(skill=>!coreProfileSkills.includes(skill));
}
function extraProfileSkills(name){
 const builtIn=profilePositionSkills(name);
 return addedProfileSkills(name).filter(skill=>!builtIn.includes(skill));
}
function profileSkillSection(){
 const profile=state.profiles[playerName];
 const position=profilePositionSkills(playerName),extra=extraProfileSkills(playerName);
 const tip=positionTips[profile.focus];
 const rows=skills=>'<div class="profile-metrics">'+skills.map(aspect=>ratedSkillLink(aspect,'profile')).join('')+'</div>';
 const group=(title,skills)=>'<section class="section profile-metrics-panel"><h2 class="section-title block-title">'+title+'</h2>'+rows(skills)+'</section>';
 const forPosition=tip||position.length?'<section class="section profile-position" aria-labelledby="profile-position-title">'+
  '<h2 class="section-title block-title" id="profile-position-title">'+e(profile.focus+' skills')+'</h2>'+
  '<div class="card profile-position-card">'+(tip?'<p class="details profile-position-tip">'+e(tip)+'</p>':'')+
  (position.length?rows(position):'')+'</div></section>':'';
 return group('Core skills',coreProfileSkills)+forPosition+(extra.length?group('Extra skills',extra):'');
}
function coachProfileSkills(name){
 const visible=extraProfileSkills(name);
 const builtIn=profilePositionSkills(name);
 const available=Object.keys(factors).filter(skill=>![...coreProfileSkills,...builtIn,...visible].includes(skill));
 const list=visible.map(skill=>'<div class="profile-skill-pick"><strong>'+e(skillName(skill))+'</strong>'+
  '<button type="submit" class="quiet" formnovalidate name="removeSkill" value="'+e(skill)+'" aria-label="Remove '+e(skillName(skill))+' from profile">Remove</button></div>').join('');
 return '<form id="coach-profile-skills" class="form" data-player="'+e(name)+'">'+
  (list?'<div class="coach-extra-skill-list">'+list+'</div>':'')+
  (available.length?'<label>Add a skill<select name="extraSkill" required>'+opt('','','Choose a skill')+available.map(skill=>opt(skill,'',skillName(skill))).join('')+'</select></label>'+
   '<button class="primary">Add skill to profile</button>':'')+'</form>';
}
function playerFeedbackPage(){
 const name=playerName;
 const summary=profileCoachSummary(name,false);
 const notes=profileFeedback(undefined,'Feedback history');
 const plan=onePlan(name),request=oneRequest(name);
 const oneLabel=plan?'View your 1:1 plan':request?'View your 1:1 request':oneHistory(name).length?'1:1 coaching history':'Ask for a 1:1';
 return compactHeader('Coach feedback','chat','coaching-tile')+
  (summary||notes?'':'<p class="details section">Your coach’s notes and targets will appear here.</p>')+
  summary+notes+
  '<div class="section"><a class="text-link" href="#one-to-one">'+e(oneLabel)+' '+icon('arrow',15)+'</a></div>'+foot();
}
function myProfile(filter,updateId){
 if(filter==='edit')return '<h1 class="page-title">Edit profile</h1>'+
  '<section class="section card coach-compact-form"><p class="details profile-edit-intro">Tell your coach where you’d like to play. Your coach sets the position used for your skills.</p>'+
  preferencesCard()+'</section>'+foot();
 const update=findCoachUpdate(updateId);
 const feedback=profileFeedback(update?.type==='feedback'?update.ref:undefined);
 return playerKit()+
 '<div class="profile-tools"><a class="text-link" href="#profile/edit">Edit profile '+icon('arrow',15)+'</a></div>'+
 profileSkillSection()+profileCoachSummary(playerName)+feedback+
 '<div class="metrics-meta"><a class="text-link" href="#skills/profile/all">All skills '+icon('arrow',14)+'</a></div>'+fold('Who can see your progress','<p class="details"><strong>Jo Morgan</strong> · Verified parent or carer<br><strong>Coach Alex</strong> · U14 coaching staff</p>','section')+foot();
}
const oneHistory=name=>state.oneSessions[name]??[];
const onePlan=name=>oneHistory(name).find(x=>!x.reviewId);
const oneRequest=name=>!onePlan(name)&&state.oneRequests[name];
const oneFormat=session=>session.format==='call'?'Coaching call':'In person';
function oneBookingDetails(session){
 return [dateText(session.date),session.time,session.format?oneFormat(session):''].filter(Boolean).join(' · ');
}
function oneCalendar(coach=false){
 const bookings=(coach?Object.keys(roster):[playerName]).map(name=>({name,session:onePlan(name)})).filter(item=>item.session)
  .sort((a,b)=>a.session.date.localeCompare(b.session.date)||(a.session.time||'').localeCompare(b.session.time||''));
 const rows=items=>'<div class="stack">'+items.map(({name,session})=>{
  const route=coach?'coach-one/'+Object.keys(roster).indexOf(name)+(session.date<londonToday()?'/feedback':''):'one-to-one';
  const label=coach?(session.date<londonToday()?'Give feedback':'View or change booking'):'View my session';
  return '<article class="card one-booking"><p class="mini">'+e(oneBookingDetails(session))+'</p>'+
   '<h3 class="card-title">'+e(coach?name+' · '+skillName(session.skill):skillName(session.skill))+'</h3>'+
   (session.meeting?'<p class="details">'+e(session.meeting)+'</p>':'')+
   '<a class="text-link" href="#'+route+'">'+label+' '+icon('arrow',15)+'</a></article>';
 }).join('')+'</div>';
 const today=londonToday(),upcoming=bookings.filter(item=>item.session.date>=today),past=bookings.filter(item=>item.session.date<today);
 const requests=coach?Object.keys(roster).flatMap((name,index)=>oneRequest(name)?
  ['<a class="card training-log-row" href="#coach-one/'+index+'"><span><strong>'+e(name)+'</strong><small>'+e(skillName(oneRequest(name)))+'</small></span>Arrange 1:1 '+icon('arrow',15)+'</a>']:[]):[];
 return back(coach?'desk':'one-to-one',coach?'Back to Squad':'Back to 1:1')+compactHeader('1:1 calendar','flag','coaching-tile')+
  (requests.length?'<section class="section"><h2 class="section-title block-title">Requests to arrange</h2><div class="stack">'+requests.join('')+'</div></section>':'')+
  '<section class="section"><h2 class="section-title block-title">Upcoming</h2>'+
  (upcoming.length?rows(upcoming):'<p class="mini">No upcoming 1:1 sessions or calls.</p>')+
  (!coach&&oneRequest(playerName)?'<p class="details">Your request is with your coach. The session will appear here once they set a date.</p>':'')+
  '</section>'+
  (past.length?'<section class="section"><h2 class="section-title block-title">Waiting for feedback</h2>'+rows(past)+'</section>':'')+
  (coach?'<section class="section"><h2 class="section-title block-title">Arrange for a player</h2><div class="stack">'+
   Object.keys(roster).map((name,index)=>({name,index})).filter(({name})=>!oneRequest(name)&&!onePlan(name)).map(({name,index})=>
    '<a class="card training-log-row" href="#coach-one/'+index+'"><strong>'+e(name)+'</strong>'+icon('arrow',15)+'</a>').join('')+
   '</div></section>':'')+foot();
}
function oneCard(session,feedbackFirst=false){
 const review=state.reviews.find(x=>x.id===session.reviewId);
 const marker=review?.factors?.[0]?.marker;
 const drills=session.drills.length?'<ol class="one-drills">'+session.drills.map(d=>'<li><strong>'+e(d.name)+'</strong>'+(d.notes?'<p class="details">'+e(d.notes)+'</p>':'')+'</li>').join('')+'</ol>':'';
 const feedback=review?'<div class="line">'+(marker||review.goodWork?'<div class="factor-result">'+(marker?'<span class="status-label '+markerClass(marker)+'"><span class="stage-dot '+markerClass(marker)+'" aria-hidden="true"></span>'+e(playerMarker(marker))+'</span>':'')+(review.goodWork?tag('Good work','good'):'')+'</div>':'')+'<p class="details">'+e(review.body)+'</p>'+
 (review.goal?'<p class="one-next"><strong>Try next:</strong> '+e(review.goal)+'</p>':'')+(review.review?'<p class="mini">Check in: '+e(dateText(review.review))+'</p>':'')+'<p class="mini line">Visible to '+e(review.player||playerName)+', linked parent or carer (Jo Morgan) and authorised U14 coaches.</p></div>':'';
 return '<article class="card one-session"><h3 class="card-title">'+e(skillName(session.skill))+'</h3><p class="mini">'+e(oneBookingDetails(session))+'</p>'+
 (!review&&session.meeting?'<p class="details">'+e(session.meeting)+'</p>':'')+
 (session.focus?'<p class="details"><strong>Session focus:</strong> '+e(session.focus)+'</p>':'')+
 (review&&feedbackFirst?feedback+(drills?fold('Practice ideas',drills,'note-fold'):''):drills+feedback)+'</article>';
}
function completedOne(name,player=false){
 const completed=oneHistory(name).filter(x=>x.reviewId);
 return completed.length?'<section class="section"><h2 class="section-title block-title">'+(player?'Coach feedback':'Last 1:1')+'</h2>'+oneCard(completed[0],true)+
 (completed.length>1?fold('Earlier 1:1 sessions','<div class="stack">'+completed.slice(1).map(session=>oneCard(session,true)).join('')+'</div>','section'):'')+'</section>':'';
}
function oneCoach(index,action){
 const name=Object.keys(roster)[Number(index)];
 if(!name)return notFound('desk');
 const focus=oneRequest(name)||state.playerFocus[name],session=onePlan(name),defaultSkill=session?.skill??focus??'';
 const drills=session?.drills??[];
 const planForm='<form id="one-plan-form" class="card form" data-index="'+index+'"><label>Skill<select name="skill" required>'+opt('',defaultSkill,'Choose a skill')+Object.keys(factors).map(x=>opt(x,defaultSkill,skillName(x))).join('')+'</select></label>'+
 '<label>Meeting type<select name="format">'+opt('pitch',session?.format||'pitch','In person')+opt('call',session?.format,'Coaching call')+'</select></label>'+
 '<div class="one-booking-fields"><label>Date<input name="date" type="date" required value="'+e(session?.date??londonToday())+'"></label>'+
 '<label>Time (optional)<input name="time" type="time" value="'+e(session?.time??'')+'"></label></div>'+
 '<label>Where or how to meet (optional)<input name="meeting" maxlength="120" value="'+e(session?.meeting??'')+'" placeholder="e.g. Clubhouse, or a call arranged with a parent"></label>'+
 '<label>What will you work on together? (optional)<textarea name="session-focus" maxlength="250" placeholder="One thing you’ll watch or practise together">'+e(session?.focus??'')+'</textarea></label>'+
 fold('Add practice ideas (optional)',[0,1].map(i=>'<fieldset class="one-drill-fields"><legend>Practice idea '+(i+1)+'</legend><label>Name<input name="drill'+i+'" maxlength="80" value="'+e(drills[i]?.name)+'" placeholder="e.g. Pass to a moving teammate"></label><label>What to do<textarea name="notes'+i+'" maxlength="480" placeholder="Setup, reps or a short cue">'+e(drills[i]?.notes)+'</textarea></label></fieldset>').join(''),'one-practice-options')+
 '<button class="primary">'+(session?'Save changes':'Save booking')+'</button><p class="alert" role="alert"></p></form>';
 const feedback=session?'<form id="one-feedback-form" data-index="'+index+'" data-session="'+e(session.id)+'" class="card form"><label>What did you notice?<textarea name="body" maxlength="600" required placeholder="Call out what went well or one cue to use next"></textarea></label><label>Where they are now<select name="stage">'+opt('','','Leave stage unchanged')+markers.map(x=>opt(x,'',playerMarker(x))).join('')+'</select></label>'+praiseField+optionalNextTarget()+visibilityNote(name)+'<button class="primary">Finish and share feedback</button><p class="alert" role="alert"></p></form>':'';
 const feedbackSection='<section class="section"><h2 class="section-title block-title">Give 1:1 feedback</h2>'+feedback+'</section>';
 const planSection=session?'<section class="section"><h2 class="section-title block-title">Booked 1:1</h2>'+oneCard(session)+
 (session.requestNote?'<p class="details"><strong>Player’s request:</strong> '+e(session.requestNote)+'</p>':'')+fold('Change booking',planForm,'section')+'</section>':'';
 return '<div class="one-coach-back">'+back('coach-calendar','1:1 calendar')+' <a class="text-link" href="#player/'+index+'">Player progress</a></div>'+compactHeader(name,'flag','coaching-tile',null,'1:1 coaching')+
 (session?'':'<section class="card section"><div class="eyebrow">'+(oneRequest(name)?'1:1 requested':'Player wants to work on')+'</div><h2 class="card-title">'+e(focus?skillName(focus):'No skill picked yet')+'</h2>'+
 (oneRequest(name)&&state.oneRequestNotes[name]?'<p class="details">'+e(state.oneRequestNotes[name])+'</p>':'')+'</section>')+
 (session?(action==='feedback'?feedbackSection+planSection:
 '<div class="actions"><a class="primary" href="#coach-one/'+index+'/feedback">Give 1:1 feedback '+icon('arrow',15)+'</a></div>'+planSection):
 '<section class="section"><h2 class="section-title block-title">Plan a 1:1</h2>'+planForm+'</section>')+completedOne(name)+fold('Update a skill',coachSkillForm(name),'section')+foot();
}
function playerSkillPicker(focus,position,pending){
 const saved=Object.hasOwn(factors,focus)?focus:'';
 const defaults=['Short passing','Tackling','Catching & handling'];
 const suggested=[...new Set([...(saved?[saved]:[]),...(positionFactors[position]??defaults)])].slice(0,3);
 const other=Object.keys(factors).filter(skill=>!suggested.includes(skill));
 const option=(skill,label=skillName(skill))=>'<label class="focus-choice"><input type="radio" name="focus" value="'+e(skill)+'" '+(skill===saved?'checked':'')+'> <span>'+e(label)+'</span></label>';
 return '<section class="'+(pending?'':'card section')+'" aria-labelledby="focus-heading"><h2 id="focus-heading" class="card-title">What would you like help with?</h2>'+
 '<form id="player-focus" class="form section-destination"><fieldset class="focus-options"><legend class="mini">'+(positionFactors[position]&&(!saved||positionFactors[position].includes(saved))?'For your position':'Start here')+'</legend>'+
 suggested.map(skill=>option(skill)).join('')+'</fieldset>'+
 fold('More skills',other.map(skill=>option(skill)).join(''),'focus-more')+
 '<label>What would you like to get better at? (optional)<textarea name="requestNote" rows="2" maxlength="250" placeholder="In your own words">'+e(pending?state.oneRequestNotes[playerName]??'':'')+'</textarea></label>'+
 '<button type="submit" class="primary">'+(pending?'Update request':'Ask for a 1:1')+'</button>'+
 (pending?'<button class="quiet" type="submit" name="cancel" value="yes" formnovalidate>Cancel request</button>':'')+
 '<p class="alert" role="alert"></p></form></section>';
}
function oneToOne(){
 const name=playerName,request=oneRequest(name),focus=request||state.playerFocus[name];
 const p=state.profiles[name];
 const planned=onePlan(name),finished=oneHistory(name).find(x=>x.reviewId);
 const picker=planned?'':playerSkillPicker(focus,p.focus,Boolean(request));
 return compactHeader('1:1 coaching','flag','coaching-tile')+
 (planned?'<section class="section"><h2 class="section-title block-title">Your session plan</h2>'+oneCard(planned)+
  '<p class="details">'+(planned.meeting?'':'Ask your coach when and where to meet. ')+
  'After you’ve worked together, your coach can leave feedback here.</p>'+
  '<a class="text-link" href="#one-calendar">View in calendar '+icon('arrow',15)+'</a></section>':'')+
 (request?'<section class="card section one-request-status"><p class="eyebrow">Waiting for your coach</p><h2 class="card-title">'+e(skillName(request))+'</h2>'+
  (state.oneRequestNotes[name]?'<p class="details"><strong>You asked for help with:</strong> '+e(state.oneRequestNotes[name])+'</p>':'')+
  '<p class="details">Your coach has your request. If you arrange a time together, the details will appear here.</p>'+
  fold('Change or cancel request',picker,'note-fold')+'</section>':'')+
 completedOne(name,true)+
 (!planned&&!request&&!finished?picker:'')+
 (!planned&&!request&&finished?fold('Request another 1:1',picker,'section'):'')+
 foot();
}
let trainingView='all';
function trainingTabs(active){
 const tabs=[['history','Sessions','gym'],['programmes','Programmes','gym/programmes'],['progress','Progress','gym/progress']];
 return '<nav class="gym-tabs" aria-label="Strength and conditioning sections">'+tabs.map(([key,label,path])=>
  '<a class="gym-tab" href="#'+path+'" '+(key===active?'aria-current="page"':'')+'>'+e(label)+'</a>').join('')+'</nav>';
}
function sharedSessionHistory(entries,plans,filter='all',selectedId){
 const isType=(plan,type)=>type==='all'||(type==='gym'?isGym(plan):isFitness(plan));
 if(!['all','gym','fitness'].includes(filter))filter='all';
 const visible=entries.filter(log=>isType(plans.find(plan=>plan.id===log.plan),filter));
 const origin=filter==='all'?'gym-history':'gym-history-'+filter;
 const groups=logMonths(visible).map(([month,logs],i)=>{
  const rows=logs.map(log=>{
   const plan=plans.find(item=>item.id===log.plan);
   return '<a class="training-log-row" data-history-log="'+e(log.id)+'" href="#'+sessionPath(plan,origin,log.id)+'">'+
    '<span><strong>'+e(plan.title)+'</strong><small>'+e((isGym(plan)?'Gym':'Speed & fitness')+' · '+
    (Number.isFinite(log.at)?resultLoggedAt.format(log.at):'Date unavailable')+' · '+playerLogLabel(plan,log))+'</small></span>'+icon('arrow',15)+'</a>';
  }).join('');
  return monthDisclosure(month,logs.length,rows,i===0||logs.some(log=>log.id===selectedId));
 }).join('');
 const filters=[['all','All'],['gym','Gym'],['fitness','Speed & fitness']];
 return '<section class="section training-history"><h2 class="section-title" id="session-history-title">Session history</h2>'+
  '<nav class="actions history-filters" aria-label="Filter session history">'+filters.map(([id,label])=>
   '<a class="secondary" '+(id===filter?'aria-current="page" ':'')+'href="#gym/history/'+id+'">'+label+'</a>').join('')+'</nav>'+
  (groups?'<div class="stack section">'+groups+'</div>':
   '<div class="card history-empty section"><p>'+ (entries.length?'No sessions logged in this category.':'No sessions logged yet.')+'</p>'+
    '<a class="text-link" href="#'+(filter==='fitness'?'fitness':'gym')+'">Choose a session '+icon('arrow',15)+'</a></div>')+
  (entries.length?'<div class="actions">'+
   (entries.some(log=>isGym(plans.find(plan=>plan.id===log.plan)))?'<a class="secondary" href="#training-results/gym">Gym progress '+icon('arrow',15)+'</a>':'')+
   (entries.some(log=>plans.find(plan=>plan.id===log.plan)?.category==='Speed')?'<a class="secondary" href="#training-results/fitness/history">Sprint progress '+icon('arrow',15)+'</a>':'')+
   '</div>':'')+'</section>';
}
function sessionHistory(entries,plans,origin){
 const rows=entries.map(log=>{
  const plan=plans.find(item=>item.id===log.plan);
  return '<a class="training-log-row" href="#'+sessionPath(plan,origin,log.id)+'"><span><strong>'+e(plan.title)+'</strong>'+
   '<small>'+e(resultLoggedAt.format(log.at))+' · '+e(playerLogLabel(plan,log))+'</small></span>'+icon('arrow',15)+'</a>';
 });
 return '<section class="section training-history" aria-labelledby="session-history-title">'+
  '<div class="section-head"><h2 class="section-title" id="session-history-title">Session history</h2>'+
  (rows.length?'<span class="mini">'+rows.length+' '+(rows.length===1?'log':'logs')+'</span>':'')+'</div>'+
  (rows.length?'<div class="stack training-log-list">'+rows.slice(0,3).join('')+'</div>'+
   (rows.length>3?fold('Earlier logs ('+(rows.length-3)+')','<div class="stack training-log-list">'+rows.slice(3).join('')+'</div>','section'):''):
   '<div class="card history-empty"><p>No sessions logged yet.</p><a class="text-link" href="#gym">Choose a gym session '+icon('arrow',15)+'</a></div>')+
  '</section>';
}
const conditioningBlock={
 id:'speed-fitness-5',title:'Speed & fitness foundations',
 sessions:[
  {title:'Find your starting point',category:'Speed',pack:'speed-starts',note:'Log your first 10 m time.'},
  {title:'Stop, turn & go',category:'Fitness',pack:'speed-turns',note:'Work on balance as you change direction.'},
  {title:'Build your base',category:'Gym',note:'Practise controlled bodyweight movements.'},
  {title:'Sharpen your start',category:'Speed',pack:'speed-starts',note:'Practise the first few steps with your coach.'},
  {title:'See your progress',category:'Speed',pack:'speed-starts',note:'Repeat the same 10 m test and compare your times.'}
 ]
};
function blockPlans(){
 return conditioningBlock.sessions.map((session,index)=>{
  const template=session.pack?trainingPacks[session.pack]:gymTemplates[1];
  return {...structuredClone(template),id:'sc-foundations-'+index,title:session.title,preset:false,
   audience:playerName,programmeId:conditioningBlock.id,programmeStep:index,category:session.category};
 });
}
function completedBlockSession(plan){
 return playerLogs(playerName).some(log=>log.plan===plan.id&&log.status==='done');
}
function conditioningProgramme(){
 const started=state.conditioningBlocks?.[playerName]?.includes(conditioningBlock.id);
 const plans=blockPlans(),done=plans.filter(completedBlockSession).length;
 const next=plans.find(plan=>!completedBlockSession(plan));
 return '<section class="section sc-programme"><div class="sc-programme-intro"><span class="eyebrow">5 sessions · Coach-led</span>'+
  '<h2>'+e(conditioningBlock.title)+'</h2><p>Work through each session with your coach. Take the recovery time they recommend.</p>'+
  (started?'<p class="sc-block-count">'+done+' of 5 completed</p><progress max="5" value="'+done+'" aria-label="Programme sessions completed"></progress>':'')+
  (!started?'<button class="primary" type="button" data-start-conditioning>Start programme</button>':next?
   '<a class="primary" href="#'+sessionPath(next,'gym','new')+'">'+(done?'Continue':'Start session 1')+'</a>':'<p class="sc-block-count">Block complete</p>')+'</div>'+
  '<ol class="sc-block-list">'+plans.map((plan,index)=>{
   const complete=completedBlockSession(plan);
   return '<li><span class="sc-step" aria-hidden="true">'+(complete?icon('check',18):index+1)+'</span><div><span class="mini">Session '+(index+1)+(complete?' · Completed':started&&plan.id===next?.id?' · Up next':'')+'</span>'+
    '<h3>'+e(plan.title)+'</h3><p class="mini">'+e(conditioningBlock.sessions[index].note)+'</p>'+
    (started?'<a class="text-link" href="#'+sessionPath(plan,'gym','new')+'">'+(complete?'Log again':'Open session')+'</a>':'')+'</div></li>';
  }).join('')+'</ol></section>';
}
function conditioningLogResult(plan,log){
 const results=plan.items.flatMap((activity,index)=>{
  const entry=log.items?.[index];
  if(entry?.status!=='done')return [];
  if(activity.unit==='sets'){
   const sets=(entry.sets??[]).filter(set=>Number(set.reps)>0);
   const loads=sets.map(set=>Number(set.load)).filter(load=>load>0);
   return sets.length?[activity.name+' · '+sets.length+(sets.length===1?' set':' sets')+(loads.length?' · up to '+Math.max(...loads)+' kg':' · bodyweight')]:[];
  }
  return activity.unit&&entry.value!==''&&entry.value!=null?[activity.name+' · '+entry.value+' '+(unitShort[activity.unit]??activity.unit)]:[];
 });
 return results.slice(0,2).map(text=>'<span>'+e(text)+'</span>').join('')||'<span>'+e(log.status==='skipped'?'Session skipped':log.status==='partial'?'Part of this session logged':'Session completed')+'</span>';
}
function conditioning(subpage,filter='all',selectedLog){
 const plans=ownPlans().filter(plan=>isGym(plan)||isFitness(plan));
 const entries=playerLogs(playerName).filter(log=>plans.some(plan=>plan.id===log.plan));
 const head='<div class="sc-page-head"><h1 class="page-title">Strength &amp; conditioning</h1>'+
  '<a class="primary" href="#gym/add">'+icon('plus',18)+' Add a session</a></div>';
 if(subpage==='add'){
  const choices=plans.filter(plan=>!plan.programmeId&&(filter!=='fitness'||isFitness(plan)));
  const group=(title,list)=>list.length?'<section class="section"><h2 class="section-title">'+title+'</h2><div class="sc-session-choices">'+list.map(plan=>
   '<a href="#'+sessionPath(plan,'gym','new')+'"><span class="icon-tile">'+icon(isGym(plan)?'train':'bolt')+'</span><span><strong>'+e(plan.title)+'</strong><small>'+e(isGym(plan)?'Gym':'Speed & fitness')+(plan.duration?' · '+plan.duration+' min':'')+'</small></span></a>').join('')+'</div></section>':'';
  return '<h1 class="page-title">Add a session</h1><a class="sc-custom-session" href="#gym-builder">'+icon('plus',22)+'<span><strong>Build my own session</strong><small>Choose exercises or add your own</small></span></a>'+
   group('From your coach',choices.filter(plan=>!plan.preset&&!plan.personal))+
   group('Choose a preset',choices.filter(plan=>plan.preset))+group('My saved sessions',choices.filter(plan=>plan.personal))+
   '<p class="mini section">Use weights with a qualified trainer supervising.</p>'+foot();
 }
 if(subpage==='programmes')return head+trainingTabs('programmes')+conditioningProgramme()+foot();
 if(subpage==='progress'){
  const {gym,sprint}=trainingResultGroups();
  return head+trainingTabs('progress')+'<section class="section">'+resultSection('gym-chart','Gym progress',gym,'Log sets and reps to start your graph.')+
   resultSection('sprint-chart','Sprint progress',sprint,'Log the same sprint distance to compare your times.')+'</section>'+foot();
 }
 if(!['all','gym','fitness'].includes(filter))filter='all';
 const visible=entries.filter(log=>filter==='all'||(filter==='gym'?isGym(plans.find(plan=>plan.id===log.plan)):isFitness(plans.find(plan=>plan.id===log.plan))));
 const months=logMonths(visible).map(([month,logs])=>'<section class="sc-month"><h2>'+e(month)+'</h2><div class="sc-feed">'+logs.map(log=>{
  const plan=plans.find(plan=>plan.id===log.plan);
  return '<a class="sc-activity'+(selectedLog===log.id?' selected-attempt':'')+'" href="#'+sessionPath(plan,'gym-history'+(filter==='all'?'':'-'+filter),log.id)+'" data-history-log="'+e(log.id)+'">'+
   '<div class="sc-activity-top"><span class="sc-activity-type">'+icon(isGym(plan)?'train':'bolt',17)+e(isGym(plan)?'Gym':'Speed & fitness')+'</span><time>'+e(resultLoggedAt.format(log.at))+'</time></div>'+
   '<h3>'+e(plan.title)+'</h3><div class="sc-log-result">'+conditioningLogResult(plan,log)+'</div>'+
   (plan.programmeId?'<p class="mini">'+e(plan.programmeTitle||conditioningBlock.title)+' · Session '+(plan.programmeStep+1)+'</p>':'')+
   '<div class="sc-activity-bottom">'+tag(playerLogLabel(plan,log),log.status==='partial'?'attention':log.status==='done'?'good':'dim')+'<span>View session</span></div></a>';
 }).join('')+'</div></section>').join('');
 const finished=entries.filter(log=>log.status==='done').length;
 return head+trainingTabs('history')+
  (entries.length?'<div class="sc-stats"><span><strong>'+entries.length+'</strong> sessions logged</span><span><strong>'+finished+'</strong> completed</span></div>':'')+
  '<nav class="sc-filter" aria-label="Filter activity">'+[['all','All'],['gym','Gym'],['fitness','Speed & fitness']].map(([key,label])=>
   '<a href="#gym/history/'+key+'" '+(key===filter?'aria-current="page"':'')+'>'+label+'</a>').join('')+'</nav>'+
  (months?months:'<section class="sc-empty"><span class="icon-tile">'+icon('train',28)+'</span><h2>'+e(entries.length?'No sessions here yet':'Your work starts here')+'</h2><p>'+e(entries.length?'Choose another filter to see your sessions.':'Log your first session. Each visit builds your story.')+'</p>'+(!entries.length?'<a class="primary" href="#gym/add">Add a session</a>':'')+'</section>')+
  (!entries.length?'<a class="sc-discover" href="#gym/programmes"><strong>Want a plan to follow?</strong><span>Explore the 5-session speed & fitness block</span></a>':'')+foot();
}
function train(view,subpage,historyFilter,selectedLog){
 const gymView=view==='gym',fitnessView=view==='fitness',pitchView=view==='field';
 const origin=gymView?'gym':fitnessView?'fitness':pitchView?'field':'train';
 const onGymHistory=gymView&&subpage==='history';
 const visible=nextTraining(ownPlans()).filter(plan=>onGymHistory?isGym(plan)||isFitness(plan):gymView?isGym(plan):fitnessView?isFitness(plan):pitchView?!isGym(plan)&&!isFitness(plan):true);
 const logs=playerLogs(playerName).filter(log=>visible.some(plan=>plan.id===log.plan));
 const title=pitchView?'Pitch sessions':gymView||fitnessView?'Strength & conditioning':'Training';
 const head=compactHeader(title,pitchView?'bolt':'train',pitchView?'skills-tile':'gym-tile')+
  (gymView||fitnessView?trainingTabs(fitnessView?'fitness':onGymHistory?'history':'sessions'):'');
 if(onGymHistory)return head+sharedSessionHistory(logs,visible,historyFilter,selectedLog)+foot();
 const personal=visible.filter(plan=>plan.personal);
 const presets=visible.filter(plan=>plan.preset);
 const assigned=visible.filter(plan=>!plan.personal&&!plan.preset);
 const nextGym=gymView?[...assigned,...presets,...personal].find(plan=>state.drafts[logKey(plan.id)]?.some(entry=>entry.status))||
  assigned.find(plan=>!ownLog(plan))||presets[0]:null;
 const group=(label,plans)=>plans.length?'<section class="section training-section"><h2 class="section-title block-title">'+label+'</h2>'+
  '<div class="stack">'+plans.map(plan=>planCard(plan,plan===nextGym,origin)).join('')+'</div></section>':'';
 return head+
  group(gymView?'Coach programmes':fitnessView?'Assigned sessions':'Sessions',assigned)+
  (fitnessView&&!assigned.length?'<p class="mini section">Your coach’s fitness and speed sessions will appear here.</p>':'')+
  (pitchView&&!assigned.length?'<p class="details section">No pitch skills sessions assigned. <a class="text-link" href="#fitness">Speed &amp; fitness '+icon('arrow',15)+'</a></p>':'')+
  group(gymView?'Choose a gym session':'Preset sessions',presets)+group('My gym sessions',personal)+
  (gymView?'<div class="gym-custom"><a class="secondary" href="#gym-builder">'+icon('plus',16)+' Build my own session</a>'+
   '<p class="mini gym-safety">Use weights with a qualified trainer supervising.</p></div>':'')+
  (!gymView&&!fitnessView&&logs.length?sessionHistory(logs,visible,origin):'')+foot();
}
function gym(subpage,historyFilter,selectedLog){return conditioning(subpage,historyFilter,selectedLog);}
function field(){return train('field');}
function fitness(){return conditioning('add','fitness');}
const positionSelect=(name,value,label,empty='Not set')=>'<label>'+label+'<select name="'+name+'">'+opt('',value,empty)+Object.keys(positionTips).map(x=>opt(x,value)).join('')+'</select></label>';
function playerProfile(arg){
 const staff=arg!==undefined,player=staff?Object.keys(roster)[Number(arg)]:'Eli Morgan';
 if(!player)return notFound('desk');
 const p=state.profiles[player],tips=[...new Set([p.focus,p.explore,p.preferred].filter(Boolean))];
 return (staff?back('player/'+arg,'Back to '+player)+compactHeader('Edit positions','flag','coaching-tile',null,player):
  compactHeader('Player profile','flag','coaching-tile'))+
 '<section class="card section"><div class="eyebrow">Coach plan</div>'+
 (staff?'<form id="position-plan" class="form line" data-player="'+e(player)+'">'+positionSelect('focus',p.focus,'Training focus')+positionSelect('explore',p.explore,'Position to try')+'<label>Shirt number (optional)<input name="shirt" type="number" inputmode="numeric" min="1" max="99" step="1" value="'+e(p.shirt??'')+'"></label><button class="primary">Save position plan</button></form>':
 '<div class="line"><strong>Training focus: '+e(p.focus||'To discuss')+'</strong><p class="mini">Position to try: '+e(p.explore||'To discuss')+'</p></div>')+'</section>'+
 '<section class="card section"><div class="eyebrow">Player preferences</div>'+
 (staff?'<p class="details">'+e(p.preferred||'None set')+'</p>':preferencesCard())+'</section>'+
 '<section class="section"><div class="section-head"><h2 class="section-title">Position tips</h2></div><div class="stack">'+(tips.map(pos=>'<article class="card"><h3 class="activity-name">'+e(pos)+'</h3><p class="details">'+e(positionTips[pos])+'</p><div class="skill-shortcuts">'+positionFactors[pos].map(x=>staff?tag(skillName(x),'dim'):skillButton(x)).join('')+'</div></article>').join('')||'<div class="card empty">Choose a position to see ideas to work on.</div>')+'</div></section>'+foot();
}
function mediaUrl(input){
 try{const u=new URL(input);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}
}
function exerciseMedia(a){
 const video=mediaUrl(a.demoVideo),pictures=(a.demoPhotos??[]).filter(p=>mediaUrl(p.url)&&p.caption);
 const clip=video?'<div class="exercise-video"><video controls playsinline preload="none" aria-label="Exercise demo: '+e(a.name)+'"><source src="'+e(video)+'"></video><a class="text-link" href="'+e(video)+'" target="_blank" rel="noopener noreferrer">Open video separately</a></div>':'';
 const gallery=pictures.length?'<div class="exercise-photos">'+pictures.map(p=>'<figure><a href="'+e(mediaUrl(p.url))+'" aria-label="'+e('Open photo: '+p.caption)+'" target="_blank" rel="noopener noreferrer"><img loading="lazy" src="'+e(mediaUrl(p.url))+'" alt="'+e(p.caption)+'" referrerpolicy="no-referrer"></a><figcaption>'+e(p.caption)+'</figcaption></figure>').join('')+'</div>':'';
 const builtIn=a.builtInDemo&&!video&&!pictures.length?'<figure class="exercise-diagram"><img src="box-squat.svg" alt="Three illustrations: stand in front of the box, lower to touch it, then stand tall again."><figcaption>Start tall → Touch the box → Stand tall</figcaption></figure>':'';
 return clip+gallery+builtIn;
}
function exerciseGuide(a,i){
 const steps=(a.instructions??'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 const media=exerciseMedia(a);
 const body=media+(a.equipment?'<p class="details"><strong>You need:</strong> '+e(a.equipment)+'</p>':'')+
 (a.rest!==undefined?'<p class="details"><strong>Rest:</strong> '+e(a.rest)+' seconds</p>':'')+
 (steps.length?'<ol class="exercise-steps">'+steps.map(x=>'<li>'+e(x)+'</li>').join('')+'</ol>':'')+
 (a.cue?'<p class="details">'+e(a.cue)+'</p>':'');
 return body?'<details class="fold exercise-guide" '+(i===undefined?'open':'data-guide="'+i+'"')+'><summary>How to do it'+(media?'<span class="demo-label">'+(a.demoVideo?'Video demo':'Picture demo')+'</span>':'')+'</summary><div class="fold-content">'+body+'</div></details>':'';
}
function activityTarget(activity){
 if(activity.unit!=='sets')return activity.target;
 const sets=activity.setCount??2;
 if(activity.repCount)return sets+' '+(sets===1?'set':'sets')+' of '+activity.repCount+' reps';
 const target=activity.target??'';
 return /\bsets?\b/i.test(target)?target:[target,sets+' '+(sets===1?'set':'sets')].filter(Boolean).join(' · ');
}
function activityLogStatus(activity,entry){
 if(entry.status!=='done')return entry.status;
 if(activity.unit==='sets'){
  const count=(entry.sets??[]).slice(0,activity.setCount??2).filter(set=>Number(set?.reps)>0).length;
  return count===(activity.setCount??2)?'done':count?'partial':'';
 }
 return !activity.unit||(entry.value!=null&&entry.value!=='')?'done':'';
}
function sessionLogCount(plan,entries){
 return entries.filter((entry,i)=>activityLogStatus(plan.items[i],entry)).length;
}
function refreshSessionLogCount(id,draftKey){
 const plan=ownPlans().find(x=>x.id===id), entries=state.drafts[draftKey];
 const counter=document.querySelector('[data-session-count]');
 if(counter&&plan&&entries)counter.textContent=sessionLogCount(plan,entries)+' of '+plan.items.length+' logged or skipped';
}
function setEditor(a,z,i){
 const field=(s,k,label)=>'<label>'+label+'<input type="number" min="'+(k==='reps'?'1':'0')+'" max="'+(k==='reps'?'999':'999.99')+'" step="'+(k==='reps'?'1':'.01')+'" inputmode="'+(k==='reps'?'numeric':'decimal')+'" data-set-activity="'+i+'" data-set-index="'+s+'" data-set-key="'+k+'" placeholder="'+(k==='load'?'Optional':a.repCount?'Aim for '+a.repCount:'')+'" value="'+e(z.sets?.[s]?.[k]??'')+'"></label>';
 return '<p class="mini line">Bodyweight? Leave weight blank.</p>'+Array.from({length:a.setCount??2},(_,s)=>'<fieldset class="set-row"><legend>Set '+(s+1)+'</legend>'+field(s,'reps','Reps')+field(s,'load','Weight (kg)')+'</fieldset>').join('');
}
function setSummary(z){
 return (z.sets??[]).map((s,i)=>s?.reps!==''&&s?.reps!=null?'Set '+(i+1)+' · '+e(s.reps)+' reps'+(s.load!==''&&s.load!=null?' · '+e(s.load)+' kg':''):'').filter(Boolean).join('<br>');
}

const skillButton=x=>'<button class="skill-chip" type="button" data-open-skill="'+e(x)+'">'+e(skillName(x))+' '+icon('arrow',13)+'</button>';
const skillRows=new Map(Object.keys(factors).map((x,i)=>[x,'factor-'+i]));
function observationsFor(aspect){
 const real=state.reviews.filter(r=>r.player==='Eli Morgan'&&r.factors?.some(f=>f.aspect===aspect));
 const added=(state.skillNotes['Eli Morgan']??[]).filter(r=>r.factors[0].aspect===aspect);
 const records=[...added,...real];
 return (records.length?records:aspect==='Short passing'?exampleHistory:[]).slice().sort((a,b)=>(b.observedOn??'').localeCompare(a.observedOn??'')||(b.savedAt??0)-(a.savedAt??0));
}
const markerFor=(r,x)=>r?.factors?.find(f=>f.aspect===x)?.marker;
const latestScoredObservation=(history,aspect)=>history.find(record=>markers.includes(markerFor(record,aspect)));
function markerClass(marker){
 const i=markers.indexOf(marker);
 return i<0?'neutral':'stage-'+(i+1);
}

const skillLabels={'Kicking (optional)':'Kicking from hand','Scanning & decision-making':'Look up and make a choice','Support & work off the ball':'Support your teammates','Carrying & evasion':'Run with the ball','Catching & handling':'Catching','Leadership & teamwork':'Leadership and teamwork'};
const skillName=x=>skillLabels[x]??x.replace(' (optional)','');
function playerMarker(marker){
 const index=markers.indexOf(marker);
 return index<0?'Coach note':(index+1)+' · '+skillLevels[index].label;
}
const skillPath=(aspect,source,updateId)=>['skill',skillRows.get(aspect),source,updateId].filter(Boolean).join('/');
const skillAspect=id=>[...skillRows].find(([,key])=>key===id)?.[0];
const skillListRoutes={
 'profile':['profile/row','Back to Profile'],
 'profile-highlight':['profile/highlight','Back to Profile'],
 'skills':['skills/row','Back to Skills'],
 'matrix':['skills/all','Back to Skills'],
 'profile-matrix':['skills/profile/all','Back to all skills']
};
function skillRowAttributes(aspect,source){
 return 'href="#'+skillPath(aspect,source)+'" data-skill-id="'+skillRows.get(aspect)+'" data-skill-list="'+source+'"';
}
function skillShortcut(aspect,source){
 return '<a class="skill-chip" '+skillRowAttributes(aspect,source)+'>'+e(skillName(aspect))+' '+icon('arrow',13)+'</a>';
}
function ratedSkillLink(aspect,source){
 const history=observationsFor(aspect);
 const observation=latestScoredObservation(history,aspect);
 const value=markers.indexOf(markerFor(observation,aspect))+1;
 const stage=value?skillLevels[value-1].label+(observation.example?' · Example':''):'';
 const isProfile=source==='profile', isPosition=source==='skills';
 const classes=isProfile?'profile-metric':isPosition?'position-skill':'skill-row matrix-skill';
 const rating=value?value+'<small>/'+skillLevels.length+'</small>':'Not rated';
 const badges=isProfile||isPosition?'':matrixSkillBadges(aspect,history);
 return '<a class="rated-skill '+classes+'" '+skillRowAttributes(aspect,source)+
 (isProfile?' data-open-skill="'+e(aspect)+'"':'')+'><span class="metric-copy"><span class="metric-title">'+e(skillName(aspect))+'</span>'+
 (stage?'<span class="metric-context">'+e(stage)+'</span>':'')+badges+'</span>'+
 '<span class="metric-score '+(value?'':'unrated')+'">'+rating+'</span>'+icon('arrow',14)+'</a>';
}
function matrixSkillBadges(aspect,history){
 const priority=currentSkillFocus(playerName)?.skill===aspect;
 const kudos=history.some(r=>r.goodWork);
 return priority||kudos?'<span class="skill-status">'+
 (priority?'<span class="matrix-focus">Coach focus</span>':'')+
 (kudos?'<span class="matrix-kudos">'+icon('check',13)+' Good work</span>':'')+'</span>':'';
}
function skillPage(id,source,updateId){
 const list=Object.hasOwn(skillListRoutes,source)?skillListRoutes[source]:skillListRoutes.skills;
 const aspect=skillAspect(id);
 const returnLink=source==='today'?back('today','Back to Home'):
  back(aspect?list[0]+'/'+id:list[0].split('/')[0],list[1]);
 if(!aspect)return returnLink+'<h1 class="page-title">Skill not found</h1>'+foot();
 const history=observationsFor(aspect), scored=latestScoredObservation(history,aspect), update=findCoachUpdate(updateId);
 const value=markers.indexOf(markerFor(scored,aspect))+1;
 const requested=update?.type==='skill-note'&&update.skill===aspect?history.find(r=>r.id===update.ref):null;
 const featured=requested??history[0], older=history.filter(r=>r!==featured);
 const note=(r,showLevel=false)=>{
  const level=markers.indexOf(markerFor(r,aspect));
  const meta=r===featured&&r===scored?observationMeta({...r,context:'',example:false}):observationMeta(r);
  return '<article class="card skill-note"'+(r.id?' data-skill-note="'+e(r.id)+'"':'')+'>'+meta+
   (showLevel&&level>=0?'<p class="mini skill-note-level">'+e(skillLevels[level].label)+'</p>':'')+
   (r!==featured&&r.goal?'<p class="profile-feedback-target"><strong>Work on next</strong>'+e(r.goal)+'</p>':'')+
   (r.goodWork?'<div>'+tag('Good work','good')+'</div>':'')+'<p class="details">'+e(r.body)+'</p></article>';
 };
 return returnLink+'<header class="card skill-page-head"><h1>'+e(skillName(aspect))+'</h1><div class="skill-page-rating">'+
 (value?'<strong class="skill-page-number">'+value+'<small>/'+skillLevels.length+'</small></strong><div><strong>'+e(skillLevels[value-1].label)+'</strong>'+
 '<p class="mini">'+[scored.context,scored.example?'Example rating':''].filter(Boolean).map(e).join(' · ')+'</p></div>':'<strong>Not rated yet</strong>')+
 '</div></header>'+
 (featured?.goal?'<section class="card skill-next section"><h2>Work on next</h2><p>'+e(featured.goal)+'</p></section>':'')+
 '<section class="section"><h2 class="section-title block-title">Coach note</h2>'+
 (featured?note(featured,Boolean(requested&&featured!==scored)):'<p class="mini">No coach note yet.</p>')+
 '</section><section class="section"><h2 class="section-title block-title">History</h2>'+
 (older.length?'<ol class="skill-page-history">'+older.map(r=>'<li>'+note(r,true)+'</li>').join('')+'</ol>':'<p class="mini">No earlier notes.</p>')+'</section>'+foot();
}
const matrixGroups=[
 ['Ball skills',['Short passing','Long passing','Catching & handling','Kicking (optional)','Goal kicking']],
 ['Contact & movement',['Tackling','Dominant tackling','Carrying & evasion','Breakdown (optional)','Set piece (optional)','Scrummaging','Gym technique (optional)']],
 ['Game sense & teamwork',['Support & work off the ball','Scanning & decision-making','Communication','Leadership & teamwork']]
];
const resultNumber=new Intl.NumberFormat('en-GB',{maximumFractionDigits:2});
const resultDate=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',day:'numeric',month:'short'});
const resultFullDate=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',day:'numeric',month:'short',year:'numeric'});
const resultLoggedAt=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
const resultLabel=value=>(value??'').trim().toLowerCase().replace(/\s+/g,' ');
function sprintDistance(activity){
 const distance=Number(activity.distanceMetres);
 if(Number.isFinite(distance)&&distance>0)return distance;
 // Older plans can be charted when the drill name specifies one distance.
 const matches=[...activity.name.matchAll(/\b(\d+(?:\.\d+)?)\s*(?:m|metres?|meters?)\b/gi)];
 return matches.length===1?Number(matches[0][1]):0;
}
function addChartResult(groups,key,label,unit,log,value){
 if(!groups.has(key))groups.set(key,{label,unit,points:[]});
 const points=groups.get(key).points;
 const sameSession=points.at(-1);
 if(sameSession?.logId===log.id){
  sameSession.value=unit==='s'?Math.min(sameSession.value,value):Math.max(sameSession.value,value);
 }else points.push({at:log.at,logId:log.id,value});
}
function trainingResultGroups(){
 const gym=new Map(),sprint=new Map(),history=[],plans=ownPlans();
 for(const log of playerLogs(playerName)){
  const plan=plans.find(p=>p.id===log.plan);
  if(!plan||!Number.isFinite(log.at))continue;
  plan.items.forEach((activity,i)=>{
   const entry=log.items[i];
   if(entry?.status!=='done')return;
   const exercise=resultLabel(activity.name);
   if(isGym(plan)){
    const result=activity.unit==='sets'?setSummary(entry):unitShort[activity.unit]&&entry.value!=null&&entry.value!==''?e(entry.value)+' '+unitShort[activity.unit]:'';
    if(result)history.push({name:activity.name,at:log.at,result,partial:log.status==='partial'});
    const equipment=activity.equipment?.trim();
    const setup=resultLabel(equipment);
    for(const set of (entry.sets??[]).slice(0,activity.setCount??2)){
     const reps=Number(set?.reps),load=Number(set?.load??0);
     if(!Number.isInteger(reps)||reps<1||!Number.isFinite(load)||load<0)continue;
     if(load===0){
      addChartResult(gym,JSON.stringify([exercise,setup,'unweighted']),
       activity.name+' · No weight logged'+(equipment?' · '+equipment:''),'reps',log,reps);
      continue;
     }
     const label=activity.name+' · '+reps+(reps===1?' rep':' reps')+(equipment?' · '+equipment:'');
     addChartResult(gym,JSON.stringify([exercise,setup,reps]),label,'kg',log,load);
    }
    if(activity.unit==='reps'&&Number(entry.value)>0){
     const label=activity.name+(equipment?' · '+equipment:'');
     addChartResult(gym,JSON.stringify([exercise,setup,'reps']),label,'reps',log,Number(entry.value));
    }
   }else if(plan.category==='Speed'&&activity.unit==='sec'){
    const seconds=Number(entry.value),distance=sprintDistance(activity);
    if(!Number.isFinite(seconds)||seconds<=0)return;
    history.push({name:activity.name,at:log.at,result:resultNumber.format(seconds)+' s'});
    if(distance)addChartResult(sprint,JSON.stringify([exercise,distance]),
     /^\d/.test(activity.name)&&sprintDistance({name:activity.name})===distance?activity.name:resultNumber.format(distance)+' m · '+activity.name,'s',log,seconds);
   }
  });
 }
 return {gym,sprint,history};
}
function resultPlot(series,selectedId){
 const selectedIndex=selectedId?series.points.findIndex(point=>point.logId===selectedId):-1;
 const start=selectedIndex<8?0:Math.min(selectedIndex-3,series.points.length-8);
 const points=series.points.slice(start,start+8).reverse();
 const values=points.map(p=>p.value),min=Math.min(...values),max=Math.max(...values);
 const timed=series.unit==='s';
 const coords=points.map((p,i)=>[points.length===1?175:53+i*245/(points.length-1),max===min?55:timed?29+(p.value-min)*52/(max-min):81-(p.value-min)*52/(max-min)]);
 const line=coords.map(pair=>pair.join(',')).join(' ');
 const dots=coords.map(([x,y],i)=>{
  const selected=Boolean(selectedId&&points[i].logId===selectedId);
  return '<circle'+(selected?' class="selected-point"':'')+' cx="'+x+'" cy="'+y+'" r="'+(selected?6:i===coords.length-1?5:3.5)+'"></circle>';
 }).join('');
 const topVal=timed?min:max,botVal=timed?max:min;
 const scale=max===min?'<text x="4" y="59">'+e(resultNumber.format(max))+'</text>':
  '<text x="4" y="33">'+e(resultNumber.format(topVal))+'</text><text x="4" y="85">'+e(resultNumber.format(botVal))+'</text>';
 return '<svg class="result-plot" viewBox="0 0 320 104" aria-hidden="true"><path class="result-grid" d="M49 29H300M49 55H300M49 81H300"/>'+scale+'<polyline points="'+line+'"/>'+dots+'</svg>'+
 (points.length===1?'<p class="mini">Log this again to see how it changes.</p>':'<div class="chart-dates" aria-hidden="true"><span>'+e(resultDate.format(points[0].at))+'</span><span>'+e(resultDate.format(points.at(-1).at))+'</span></div>');
}
function compareResults(unit,current,previous){
 if(!previous)return 'First result';
 const delta=Math.round((current.value-previous.value)*100)/100;
 if(!delta)return 'Same as last time';
 const direction=unit==='s'?(delta<0?'faster':'slower'):unit==='kg'?(delta>0?'heavier':'lighter'):(delta>0?'more':'fewer');
 const amount=resultNumber.format(Math.abs(delta));
 return unit==='reps'
  ?amount+' '+direction+' '+(Math.abs(delta)===1?'rep':'reps')+' than last time'
  :amount+' '+unit+' '+direction+' than last time';
}
function homeLatestProgress(){
 const log=playerActivity(playerName).latest;
 const plan=log&&ownPlans().find(item=>item.id===log.plan);
 if(!plan)return '';
 let title=plan.title,detail=playerLogLabel(plan,log),destination=sessionPath(plan,'today',log.id);
 if(isGym(plan)||plan.category==='Speed'){
  destination='results/'+log.id+'/today';
  const {gym,sprint}=trainingResultGroups();
  const series=[...(isGym(plan)?gym:sprint).values()].find(item=>item.points.some(point=>point.logId===log.id));
  if(series){
   const index=series.points.findIndex(point=>point.logId===log.id);
   const current=series.points[index],previous=series.points[index+1];
   title=series.label;
   detail=resultNumber.format(current.value)+' '+series.unit+(previous?' · '+compareResults(series.unit,current,previous):'');
  }
 }
 return '<a class="home-latest-progress" href="#'+destination+'"><span>'+
  '<span class="mini">Latest progress · '+e(resultDate.format(log.at))+'</span>'+
  '<strong>'+e(title)+'</strong><span class="mini">'+e(detail)+'</span></span>'+icon('arrow',15)+'</a>';
}
function resultCard(series,index,selectedId){
 const selectedIndex=selectedId?series.points.findIndex(point=>point.logId===selectedId):-1;
 const currentIndex=Math.max(0,selectedIndex);
 const current=series.points[currentIndex],previous=series.points[currentIndex+1];
 const timed=series.unit==='s';
 const comparison=compareResults(series.unit,current,previous);
 return '<article class="card result-card '+(timed?'speed-result':'gym-result')+'" data-result-series="'+index+'" '+(index?'hidden':'')+'>'+
 '<p class="mini">'+e(series.label)+'</p>'+(selectedIndex>=0?'<p class="current-attempt">This attempt</p>':'')+
 '<div class="result-stat"><strong>'+e(resultNumber.format(current.value))+'</strong> '+series.unit+'</div>'+
 '<p class="result-comparison">'+e(comparison)+'</p><p class="mini">'+e((selectedIndex>=0?resultLoggedAt:resultFullDate).format(current.at))+' · '+(timed?'Lower time is faster':series.unit==='kg'?'Heaviest set for these reps':'Most reps each session')+'</p>'+resultPlot(series,selectedId)+
 fold('See results by date','<ol class="training-results">'+series.points.map(point=>{
  const selected=Boolean(selectedId&&point.logId===selectedId);
  return '<li'+(selected?' class="selected-attempt"':'')+'><span class="mini">'+e(resultLoggedAt.format(point.at))+(selected?' <span class="current-attempt">This attempt</span>':'')+'</span><strong>'+e(resultNumber.format(point.value))+' '+series.unit+'</strong></li>';
 }).join('')+'</ol>','results-fold')+'</article>';
}
function resultSection(id,title,groups,empty,selectedId){
 const series=[...groups.values()];
 const options=series.map((x,i)=>'<option value="'+i+'">'+e(x.label)+'</option>').join('');
 const gym=id==='gym-chart';
 return '<section class="result-panel" aria-labelledby="'+id+'"><h3 id="'+id+'">'+title+'</h3>'+
 (series.length?(series.length>1?'<label class="result-choice">Compare '+(gym?'an exercise':'a timed drill')+'<select data-result-picker>'+options+'</select></label>':'')+
 series.map((entry,index)=>resultCard(entry,index,selectedId)).join(''):'<p class="mini">'+empty+' <a class="text-link" href="#'+(gym?'gym/add':'fitness')+'">'+(gym?'Choose a gym session':'Choose a speed session')+' '+icon('arrow',14)+'</a></p>'+exampleResult(id))+'</section>';
}
function exampleResult(id){
 const gym=id==='gym-chart';
 const values=gym?[10,9,8]:[2.12,2.19,2.24];
 const points=values.map((value,i)=>({value,at:Date.UTC(2026,10,12-i*7,12)}));
 const series={label:gym?'Example · box squat · 8 reps':'Example · 10 m sprint',unit:gym?'kg':'s',points};
 return fold('See an example chart',resultCard(series,0),'results-fold');
}
function trainingResultsPage(origin,source){
 const {gym,sprint,history}=trainingResultGroups();
 const gymOnly=origin==='gym',fitnessOnly=origin==='fitness';
 const fromHistory=gymOnly||source==='history';
 const path=fromHistory?'gym/history':fitnessOnly?'fitness':'skills';
 const backLabel=fromHistory?'Back to History':fitnessOnly?'Back to Speed & fitness':'Back to Skills';
 const showGym=!fitnessOnly,showSprint=!gymOnly;
 const title=gymOnly?'Gym progress':fitnessOnly?'Sprint progress':'Training results';
 return back(path,backLabel)+'<h1 class="page-title">'+title+'</h1>'+
 '<section class="section"><div class="result-panels">'+
 (showGym?resultSection('gym-chart',gymOnly?'Exercises':'Gym progress',gym,'Log a weighted set or a rep count to start a chart.'):'')+
 (showSprint?resultSection('sprint-chart',fitnessOnly?'Timed drills':'Sprint progress',sprint,'Log a timed speed drill with a distance to start a chart.'):'')+'</div>'+
 (!gymOnly&&!fitnessOnly&&history.length?fold('All gym and sprint logs','<ol class="training-results">'+history.map(r=>'<li><span class="mini">'+e(resultFullDate.format(r.at))+'</span><div><strong>'+e(r.name)+'</strong><p class="mini">'+r.result+'</p>'+(r.partial?tag('Partial gym log','attention'):'')+'</div></li>').join('')+'</ol>','results-fold'):'')+'</section>'+foot();
}
function partialGymSummary(plan,log){
 if(!isGym(plan)||log.status!=='partial')return '';
 const missing=[];
 plan.items.forEach((activity,index)=>{
  const entry=log.items[index];
  if(activityLogStatus(activity,entry)==='done')return;
  if(entry.status==='skipped'){
   missing.push(activity.name+' skipped');
  }else if(activity.unit==='sets'){
   const planned=activity.setCount??2;
   const completed=(entry.sets??[]).slice(0,planned).filter(set=>Number(set?.reps)>0).length;
   missing.push(activity.name+': '+completed+' of '+planned+' sets logged');
  }else missing.push(activity.name+' not logged');
 });
 return missing.length?'<p class="mini partial-summary">'+missing.slice(0,3).map(e).join(' · ')+
  (missing.length>3?' · '+(missing.length-3)+' more in the log':'')+'</p>':'';
}
function savedResults(logId,source){
 const log=playerLogs(playerName).find(entry=>entry.id===logId);
 const plan=log&&ownPlans().find(p=>p.id===log.plan);
 if(!plan)return notFound('gym');
 const {gym,sprint}=trainingResultGroups(), gymSession=isGym(plan);
 const groups=new Map([...(gymSession?gym:sprint)].filter(([,series])=>series.points.some(point=>point.logId===log.id)));
 const origin=sessionOrigin(plan);
 const block=plan.programmeId===conditioningBlock.id;
 const next=block?blockPlans().find(item=>!completedBlockSession(item)):null;
 return (source==='today'?back('today','Back to Home'):back('gym','Back to Sessions'))+
 compactHeader(gymSession?'Gym results':'Sprint results',gymSession?'train':'bolt',gymSession?'gym-tile':'skills-tile',null,plan.title+' · '+resultLoggedAt.format(log.at))+
 '<div class="player-log-status">'+tag(playerLogLabel(plan,log),log.status==='partial'?'attention':'good')+partialGymSummary(plan,log)+'</div>'+
 '<section class="section">'+(groups.size?resultSection(gymSession?'gym-chart':'sprint-chart','Your graph',groups,'',log.id):
 '<p class="card">Your session is in history. This log has no '+(gymSession?'sets or reps':'timed sprints with a distance')+' to graph.</p>')+'</section>'+
 '<div class="actions section"><a class="primary" href="#'+sessionPath(plan,origin,log.id)+'">View saved log</a><a class="text-link" href="#'+sessionPath(plan,origin,'new')+'">Log again</a></div>'+
 (block?'<section class="sc-result-programme"><h2>'+e(log.status==='done'?next?'Programme progress':'Block complete':'Keep going with this session')+'</h2><p>'+blockPlans().filter(completedBlockSession).length+' of 5 sessions completed</p><a class="secondary" href="#gym/programmes">View programme</a></section>':'')+foot();
}
function progress(origin){
 const position=state.profiles[playerName].focus;
 const positionSkills=positionFactors[position]??[];
 const tip=positionTips[position]?.match(/^[^.]+\.?/)?.[0];
 const matrixSource=origin==='profile'?'profile-matrix':'matrix';
 const practice=positionSkills.map(aspect=>{
  const history=observationsFor(aspect);
  const cue=history[0]&&!history[0].example?history[0].goal:'';
  return '<a class="practice-skill" '+skillRowAttributes(aspect,'skills')+'><span><strong>'+e(skillName(aspect))+'</strong>'+
   '<small>'+e(cue||factors[aspect])+'</small></span>'+icon('arrow',15)+'</a>';
 }).join('');
 return '<h1 class="page-title skills-title">Rugby skills</h1>'+
 '<section class="section skill-position-section" aria-labelledby="position-skills"><h2 class="section-title block-title" id="position-skills">'+e(positionSkills.length?position+' skills':'Your rugby skills')+'</h2>'+
 (tip?'<p class="details skill-position-tip">'+e(tip)+'</p>':'')+
 (practice?'<div class="card position-skills">'+practice+'</div>':
  '<p class="mini">Ask your coach which position to work on.</p>')+
 fold('All skills &amp; ratings',matrixGroups.map(([title,items])=>'<div class="matrix-group"><h3>'+e(title)+'</h3><div class="stack">'+items.map(aspect=>ratedSkillLink(aspect,matrixSource)).join('')+'</div></div>').join(''),'skills-matrix')+'</section>'+
 '<nav class="section skill-training-links" aria-label="Training">'+
 '<a class="text-link" href="#field">Pitch sessions '+icon('arrow',15)+'</a>'+
 '<a class="text-link" href="#profile">My profile '+icon('arrow',15)+'</a>'+
 '<a class="text-link" href="#training-results">Training results '+icon('arrow',15)+'</a></nav>'+foot();
}
function coachSkillForm(name){
 const priority=state.coachSkillFocus[name];
 const options=skills=>skills.map(skill=>opt(skill,'',skillName(skill))).join('');
 const profileSkills=[...coreProfileSkills,...profilePositionSkills(name),...extraProfileSkills(name)];
 const other=Object.keys(factors).filter(skill=>!profileSkills.includes(skill));
 return '<form id="skill-update" class="form" data-player="'+e(name)+'"><label>Skill<select name="skill" required>'+opt('','','Choose a skill')+
 '<optgroup label="Profile skills">'+options(profileSkills)+'</optgroup><optgroup label="Other skills">'+options(other)+'</optgroup></select></label>'+
 '<label>Development level<select name="stage">'+opt('','','Leave level unchanged')+markers.map(x=>opt(x,'',playerMarker(x))).join('')+'</select></label>'+
 '<label>What did you see, or what should they work on?<textarea name="note" maxlength="480" required></textarea></label>'+
 '<label class="check"><input type="checkbox" name="good">Highlight good work</label>'+
 '<label class="check"><input type="checkbox" name="priority">Set as current coach focus</label>'+
 (priority?'<p class="mini">Current focus: '+e(skillName(priority.skill))+'</p><button class="secondary" type="button" data-clear-skill-focus>Clear coach focus</button>':'')+
 visibilityNote(name)+
 '<button class="primary">Save skill update</button><p class="alert" role="alert"></p></form>';
}
const playerShirtNumbers=Array.from({length:15},(_,index)=>String(index+1));
function preferencesCard(){
 const p=state.profiles['Eli Morgan'],current=String(p.shirt??'');
 const numberOptions=playerShirtNumbers.map(number=>opt(number,current)).join('');
 const placeholder=playerShirtNumbers.includes(current)?'':opt('','',current?'Keep current number ('+current+')':'Choose a number');
 return '<form id="preferences" class="form">'+positionSelect('preferred',p.preferred,'Preferred position','Still exploring')+
  '<label>Shirt number<select name="shirt">'+placeholder+numberOptions+'</select></label>'+
  '<button class="primary">Save profile</button><p class="alert" role="alert"></p></form>';
}
const foodTopics={
 before:{label:'Before',heading:'Get ready for kick-off',tips:[
  'A few hours before a match, have a meal you know sits well. Include something like pasta, rice, bread or potatoes, with some protein.',
  'If you’re hungry closer to kick-off, try a small familiar snack. Bring a filled water bottle and sip before the warm-up.'
 ],ideas:['Pasta with tomato sauce and chicken or lentils','Porridge with milk or fortified soya drink and banana','A banana or toast with jam']},
 during:{label:'During',heading:'Use your water breaks',tips:[
  'Sip water at breaks and at half-time. Bring a bottle you can refill.',
  'On a tournament day, pack an easy snack for between games if there’s time to eat and you’re hungry.'
 ],ideas:['Water at half-time','Banana or a small jam sandwich between games']},
 after:{label:'After',heading:'Eat and drink after the match',tips:[
  'Have some water after the final whistle. At your next meal, include a source of carbohydrate and protein.',
  'If you’re travelling and the meal is a while away, pack a snack for the trip.'
 ],ideas:['Yoghurt and banana','Egg or hummus sandwich and fruit','Rice with chicken or beans and vegetables']},
 protein:{label:'Protein',heading:'Add protein to meals you already eat',tips:[
  'Try eggs, fish, chicken, beans, lentils, tofu or yoghurt. Choose foods you enjoy and mix them up across the week.',
  'Add beans to a jacket potato, stir lentils into pasta sauce, or put yoghurt with fruit.'
 ],ideas:['Egg on toast','Jacket potato with beans','Tofu and vegetable rice bowl','Plain yoghurt with fruit']}
};
const foodGuideDrafts=new Map();
const recipeDrafts=new Map();
const topicRecipes=topic=>state.foodRecipes?.[topic]??[];
const recipePhoto=photo=>/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo??'')?photo:'';
function recipeCards(topic,coach=false){
 const recipes=topicRecipes(topic);
 return '<section class="section recipe-section"><div class="recipe-heading"><h2>Recipes</h2>'+(coach?'<a class="secondary" href="#coach-recipe/'+e(topic)+'/new">+ Add recipe</a>':'')+'</div>'+
  (recipes.length?'<div class="recipe-grid">'+recipes.map(recipe=>'<a class="recipe-card" href="#'+(coach?'coach-recipe':'recipe')+'/'+e(topic)+'/'+e(recipe.id)+'">'+
   (recipePhoto(recipe.photo)?'<img src="'+e(recipe.photo)+'" alt="" loading="lazy">':'')+'<span><strong>'+e(recipe.name)+'</strong><small>'+e([recipe.time?recipe.time+' min':'',recipe.serves?'Serves '+recipe.serves:''].filter(Boolean).join(' · '))+'</small>'+(coach?'<small>Edit recipe</small>':'')+'</span></a>').join('')+'</div>':coach?'<p class="details">Add a meal or snack with a photo and simple steps.</p>':'')+'</section>';
}
function recipePage(topic,id,coach=false){
 const key=foodTopicKey(topic),saved=topicRecipes(key).find(item=>item.id===id),adding=id==='new';
 if(!saved&&(!coach||!adding))return notFound(coach?'coach-fuel/'+key:'fuel/'+key);
 const draftKey=key+':'+id;
 const draft=recipeDrafts.get(draftKey)??{name:'',time:'',serves:'',ingredients:'',steps:'',allergens:'',photo:'',...saved};
 if(!coach)return back('fuel/'+key,'Back to food guide')+'<article class="card recipe-detail">'+
  (recipePhoto(saved.photo)?'<img class="recipe-cover" src="'+e(saved.photo)+'" alt="'+e(saved.name)+'">':'')+'<h1 class="page-title">'+e(saved.name)+'</h1><p class="details">'+e([saved.time?saved.time+' min':'',saved.serves?'Serves '+saved.serves:''].filter(Boolean).join(' · '))+'</p>'+
  (saved.allergens?'<p class="recipe-allergens"><strong>Allergens</strong> '+e(saved.allergens)+'</p>':'')+'<h2>Ingredients</h2>'+foodLines(saved.ingredients.split('\n'))+'<h2>How to make it</h2><ol class="food-list">'+saved.steps.split('\n').map(step=>'<li>'+e(step)+'</li>').join('')+'</ol></article>'+foot();
 return back('coach-fuel/'+key,'Back to food guides')+compactHeader(adding?'Add recipe':'Edit recipe','fuel','food-tile')+
  '<form id="edit-recipe" class="form section" data-topic="'+e(key)+'" data-id="'+e(id)+'"><label>Recipe name<input name="name" maxlength="80" required value="'+e(draft.name)+'"></label>'+
  '<div class="recipe-meta-fields"><label>Time (minutes)<input name="time" type="number" min="1" max="1440" inputmode="numeric" value="'+e(draft.time)+'"></label><label>Serves<input name="serves" type="number" min="1" max="50" inputmode="numeric" value="'+e(draft.serves)+'"></label></div>'+
  '<label>Photo <span class="details">Optional · JPG, PNG or WebP</span><input name="photoFile" type="file" accept="image/jpeg,image/png,image/webp"></label><div data-recipe-photo>'+(recipePhoto(draft.photo)?'<img class="recipe-photo-preview" src="'+e(draft.photo)+'" alt="Recipe photo preview"><button class="secondary" type="button" data-remove-recipe-photo>Remove photo</button>':'')+'</div>'+
  '<label>Ingredients (one per line)<textarea name="ingredients" required maxlength="2400" rows="5" placeholder="e.g. 1 banana">'+e(draft.ingredients)+'</textarea></label><label>How to make it (one step per line)<textarea name="steps" required maxlength="4000" rows="5">'+e(draft.steps)+'</textarea></label><label>Allergens <span class="details">Optional</span><input name="allergens" maxlength="200" placeholder="e.g. Milk, wheat" value="'+e(draft.allergens)+'"></label>'+
  '<button class="primary">Save recipe</button><p class="alert" role="alert"></p></form>'+
  (!adding?'<details class="fold section"><summary>Remove recipe</summary><div class="fold-content"><button data-delete-recipe="'+e(id)+'" data-topic="'+e(key)+'">Remove this recipe</button></div></details>':'')+foot();
}
function recipeValues(form){
 const saved=recipeDrafts.get(form.dataset.topic+':'+form.dataset.id)??topicRecipes(form.dataset.topic).find(item=>item.id===form.dataset.id)??{};
 const data=new FormData(form);
 return {...saved,...Object.fromEntries(['name','time','serves','ingredients','steps','allergens'].map(field=>[field,String(data.get(field)??'')])),photo:saved.photo??''};
}
function storeRecipes(topic,recipes){
 const previous=state.foodRecipes;
 state.foodRecipes={...previous,[topic]:recipes};
 try{localStorage.setItem(key,JSON.stringify(state));return true;}catch{state.foodRecipes=previous;return false;}
}
async function prepareRecipePhoto(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024)throw Error('Choose a JPG, PNG or WebP photo under 10 MB.');
 const url=URL.createObjectURL(file);
 try{const img=new Image();img.src=url;await img.decode();const scale=Math.min(1,800/Math.max(img.naturalWidth,img.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);const photo=canvas.toDataURL('image/jpeg',.7);if(photo.length>400000)throw Error('Try a smaller photo.');return photo;}finally{URL.revokeObjectURL(url);}
}
const extraFoodTopics=()=>Object.entries(state.foodGuide??{}).filter(([id])=>id.startsWith('topic-'));
function foodTopicKey(key){
 return Object.hasOwn(foodTopics,key)||extraFoodTopics().some(([id])=>id===key)?key:'before';
}
function foodTopicNav(route,key){
 const link=(id,topic)=>'<a class="skill-chip" href="#'+route+'/'+e(id)+'" '+(id===key?'aria-current="page"':'')+'>'+e(topic.label)+'</a>';
 const extra=extraFoodTopics();
 return '<nav aria-label="Food guide topics"><div class="food-topic-nav">'+
  Object.entries(foodTopics).map(([id,topic])=>link(id,topic)).join('')+'</div>'+
  (extra.length?'<details class="fold food-more-topics" '+(extra.some(([id])=>id===key)?'open':'')+'>'+
   '<summary>More topics</summary><div class="fold-content food-topic-nav">'+extra.map(([id,topic])=>link(id,topic)).join('')+'</div></details>':'')+
  '</nav>';
}
function foodTopic(key){
 return {...foodTopics[key],...state.foodGuide?.[key]};
}
function foodLines(items){
 return '<ul class="food-list">'+items.map(item=>'<li>'+e(item)+'</li>').join('')+'</ul>';
}
function foodGuideCard(content){
 return '<article class="card food-guide"><h2 class="card-title">'+e(content.heading)+'</h2>'+
  (content.tips.length?foodLines(content.tips):'')+
  (content.ideas.length?(content.tips.length?'<h3>Simple ideas</h3>':'')+foodLines(content.ideas):'')+'</article>';
}
function fuel(topic){
 const key=foodTopicKey(topic),content=foodTopic(key);
 return compactHeader('Food & hydration','fuel','food-tile')+
  '<section aria-label="Food guide">'+foodTopicNav('fuel',key)+foodGuideCard(content)+
  (topicRecipes(key).length?recipeCards(key):'')+'<p class="mini food-safe">Choose foods that suit your allergies and diet.</p></section>'+foot();
}
function foodEditorValues(form){
 const values=new FormData(form);
 return Object.fromEntries(['label','heading','tips','ideas'].map(field=>[field,String(values.get(field)??'')]));
}
function cleanFoodGuide(values){
 const lines=text=>text.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
 return {label:values.label.trim(),heading:values.heading.trim(),tips:lines(values.tips),ideas:lines(values.ideas)};
}
function coachFuel(topic,mode){
 const adding=topic==='new-topic';
 const key=adding?topic:foodTopicKey(topic);
 const saved=adding?{label:'',heading:'',tips:[],ideas:[]}:foodTopic(key);
 const values=foodGuideDrafts.get(key)??{label:saved.label,heading:saved.heading,tips:saved.tips.join('\n'),ideas:saved.ideas.join('\n')};
 const editorRoute='coach-fuel/'+key;
 if(mode==='preview'&&!adding){
  const preview=cleanFoodGuide(values);
  return back(editorRoute,'Back to editor')+'<h1 class="page-title">Player preview</h1>'+
   '<section class="section">'+foodGuideCard({...preview,heading:preview.heading||saved.heading})+'</section>'+recipeCards(key)+foot();
 }
 const canRename=adding||key.startsWith('topic-');
 return (adding?back('coach-fuel','Back to food guides'):'')+
  compactHeader(adding?'Add food topic':'Food guides','fuel','food-tile')+
  (adding?'':foodTopicNav('coach-fuel',key)+'<a class="text-link" href="#coach-fuel/new-topic">'+icon('plus',15)+' Add topic</a>')+
  '<form id="edit-food-guide" data-topic="'+e(key)+'" class="form section coach-compact-form">'+
  (canRename?'<label>Topic name<input name="label" maxlength="30" required value="'+e(values.label)+'"></label>':'')+
  '<label>Heading<input name="heading" maxlength="85" required value="'+e(values.heading)+'"></label>'+
  '<label>Tips (one per line)<textarea name="tips" rows="4" maxlength="650">'+e(values.tips)+'</textarea></label>'+
  '<label>Meal and snack ideas (one per line)<textarea name="ideas" rows="4" maxlength="1000">'+e(values.ideas)+'</textarea></label>'+
  '<div class="actions"><button class="primary">'+(adding?'Add topic':'Save guide')+'</button>'+
  (adding?'':'<a class="text-link" href="#'+editorRoute+'/preview">Preview player guide '+icon('arrow',15)+'</a>')+'</div>'+
  '<p class="alert" role="alert"></p></form>'+(adding?'':recipeCards(key,true))+
  (adding?'':fold('References','<p class="details"><a class="text-link" href="https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/">NHS Eatwell Guide</a><br><a class="text-link" href="https://www.healthychildren.org/English/healthy-living/nutrition/Pages/Sports-Nutrition-for-Busy-Families-and-Busy-Lifestyles.aspx">American Academy of Pediatrics sports nutrition guide</a></p>','section'))+foot();
}
function session(id,origin,attempt){
 const plan=ownPlans().find(p=>p.id===id);
 if(!plan)return notFound('train');
 const latest=ownLog(plan), editing=attempt?.startsWith('edit-');
 const logId=editing?attempt.slice(5):attempt;
 const saved=attempt==='new'?null:logId?playerLogs(playerName).find(log=>log.id===logId&&log.plan===id):latest;
 if(logId&&logId!=='new'&&!saved)return notFound(sessionOrigin(plan));
 const canEdit=saved&&!state.reviews.some(review=>review.logId===saved.id);
 if(editing&&!canEdit)return notFound(sessionOrigin(plan));
 const log=editing?null:saved;
 const draftKey=editing?'edit|'+saved.id:logKey(id);
 const entries=log?.items??(state.drafts[draftKey]??=editing?structuredClone(saved.items):plan.items.map(()=>({status:'',value:''})));
 const list=plan.items.map((activity,index)=>sessionActivity(plan,activity,entries[index],index,log)).join('');
 const banner=log?
  '<section class="card result section"><h2 class="card-title">'+e(playerLogLabel(plan,log))+'</h2><p class="mini">'+e(resultLoggedAt.format(log.at))+'</p>'+partialGymSummary(plan,log)+'<div class="actions">'+
  ((isGym(plan)||plan.category==='Speed')?'<a class="primary" href="#results/'+log.id+'">See results '+icon('arrow',16)+'</a>':'')+
  '<a class="secondary" href="#'+sessionPath(plan,sessionOrigin(plan),'new')+'">Log again</a>'+
  (canEdit?'<a class="text-link" href="#'+sessionPath(plan,sessionOrigin(plan),'edit-'+log.id)+'">Edit this log</a>':'')+'</div></section>':
  '<p class="session-state" data-session-count>'+sessionLogCount(plan,entries)+' of '+plan.items.length+' logged or skipped</p>';
 const gymSession=isGym(plan);
 const backRoute=['today','gym','field','fitness','train'].includes(origin)?origin:sessionOrigin(plan);
 const backLabel={today:'Home',gym:'Back to Sessions',field:'Back to Pitch sessions',fitness:'Back to Speed & fitness',train:'Back to Training'}[backRoute];
 const historyFilter={ 'gym-history':'all','gym-history-gym':'gym','gym-history-fitness':'fitness' }[origin];
 const returnLink=plan.programmeAssignment?back('player-programme/'+plan.programmeAssignment,'Back to programme'):historyFilter?back('gym/history/'+historyFilter+(saved?'/'+saved.id:''),'Back to History'):back(backRoute,backLabel);
 return returnLink+compactHeader(plan.title,gymSession?'train':'bolt',gymSession?'gym-tile':'skills-tile',null,plan.personal?'My gym session':plan.duration+' min')+banner+
 (log?'<div class="stack section">'+list+'</div>':
 '<form id="session-form" class="stack section" data-id="'+id+'" data-draft="'+draftKey+'" data-edit="'+(editing?saved.id:'')+'">'+list+
 '<button class="primary full">'+(editing?'Save changes':gymSession||plan.category==='Speed'?'Save and see results':'Save session')+' '+icon('arrow',16)+'</button>'+
 (editing?'<button class="quiet" type="button" data-cancel-log>Cancel edit</button>':'')+
 '<p id="session-error" class="alert" role="alert" tabindex="-1"></p></form>')+foot();
}
function sessionActivity(plan,activity,entry,index,log){
 const unit=activity.unit;
 const status={done:'Done',partial:'Part logged',skipped:'Skipped'}[activityLogStatus(activity,entry)]??'Not logged';
 let input='';
 if(log&&entry.status==='done'){
  if(unit==='sets')input='<p class="metric set-result">'+setSummary(entry)+'</p>';
  else if(unit&&entry.value!==''&&entry.value!=null)input='<p class="metric">'+e(entry.value)+' '+unitShort[unit]+'</p>';
 }else if(!log){
  const metric=Boolean(unit);
  const skipped=entry.status==='skipped';
  const label=unit==='sec'?(plan.category==='Speed'?'Sprint time (seconds)':'Time (seconds)'):unitNames[unit];
  const controls=unit==='sets'?setEditor(activity,entry,index):'<label class="field">'+label+
    '<input data-metric="'+index+'" type="number" min="'+(unit==='sec'?'.01':'0')+'" step="'+(unit==='reps'?'1':'.01')+
    '" inputmode="'+(unit==='reps'?'numeric':'decimal')+'" value="'+e(entry.value)+'" placeholder="'+(unit==='sec'?'e.g. 2.34':'')+'"></label>';
  input=(metric&&!skipped?controls:'')+
   '<div class="choices session-choices">'+
   (!metric||skipped?'<button class="secondary" type="button" data-log-choice="'+index+'" data-state="'+(skipped?'':'done')+'" aria-pressed="'+(entry.status==='done')+'">'+(skipped?'Undo skip':icon('check',16)+'Done')+'</button>':'')+
   (!skipped?'<button class="quiet" type="button" data-log-choice="'+index+'" data-state="skipped">Skip activity</button>':'')+
   (skipped?tag('Skipped','dim'):'')+'</div>';
 }
 return '<article class="card activity"><div class="row"><div><h2 class="activity-name">'+e(activity.name)+'</h2>'+
 (activityTarget(activity)?'<p class="mini">'+e(activityTarget(activity))+'</p>':'')+'</div>'+(log?tag(status,'dim'):'')+'</div>'+
 (activity.supervised?'<p class="mini supervision">'+(isGym(plan)?'Use weights only with a qualified trainer supervising.':'Do this with your coach.')+'</p>':'')+exerciseGuide(activity,index)+input+'</article>';
}

const playerLogs=name=>Object.values(state.logs).reverse().filter(l=>l.player===name).sort((a,b)=>b.at-a.at);
function coachPlayerActivity(name,index){
 const activity=playerActivity(name);
 const {logs,assignments,recorded}=activity;
 const missing=assignments.filter(plan=>!recorded.has(plan.id));
 const assignmentList=plans=>'<ul class="coach-assignment-list">'+plans.map(plan=>
  '<li><strong>'+e(plan.title)+'</strong><span class="mini">Due '+e(dateText(plan.when))+'</span></li>').join('')+'</ul>';
 const visibleMissing=missing.slice(0,4);
 const earlierMissing=missing.slice(4);
 const history=logMonths(logs).map(([month,entries],monthIndex)=>{
  const rows=entries.map(log=>{
   const review=state.reviews.find(note=>note.logId===log.id);
   const status=log.status==='skipped'?'Skipped':hasTrainingRecord(log)?'Completed':'No result logged';
   return '<details class="fold coach-log"><summary><span>'+attemptSummary(log)+
    '<span class="mini coach-log-state">'+e([log.status==='partial'?'':status,review?'Reviewed':hasTrainingRecord(log)?'To review':''].filter(Boolean).join(' · '))+'</span></span></summary>'+
    '<div class="fold-content">'+sessionResults(log)+
    (review?'<p class="details">'+e(review.body)+'</p>':
     hasTrainingRecord(log)?'<a class="text-link" href="#player/'+index+'/'+e(log.id)+'">Review this session '+icon('arrow',15)+'</a>':'')+
    '</div></details>';
  }).join('');
  return monthDisclosure(month,entries.length,rows,monthIndex===0);
 }).join('');
 return '<section class="section coach-work"><h2 class="section-title block-title">Assignments due</h2>'+
  '<p class="details">'+e(assignedLogSummary(activity))+'</p>'+
  (missing.length?'<div class="card coach-missing"><h3 class="activity-name">No result logged ('+missing.length+')</h3>'+
   assignmentList(visibleMissing)+
   (earlierMissing.length?fold('Earlier assignments ('+earlierMissing.length+')',assignmentList(earlierMissing),'activity-assignments'):'')+
   '</div>':'')+
  '</section><section class="section coach-work"><h2 class="section-title block-title">Session logs</h2>'+
  (history?'<div class="stack">'+history+'</div>':'<p class="details">No sessions logged yet.</p>')+'</section>';
}
const hasTrainingRecord=log=>log.status==='done'||(log.status==='partial'&&log.items?.some(entry=>entry?.status==='done'));
function playerActivity(name){
 const logs=playerLogs(name);
 const recorded=new Set(logs.filter(hasTrainingRecord).map(log=>log.plan));
 const today=londonToday();
 const assignments=state.plans.filter(plan=>!plan.personal&&!plan.preset&&
  (plan.audience==='U14 squad'||plan.audience===name)&&
  /^\d{4}-\d{2}-\d{2}$/.test(plan.when??'')&&plan.when<=today)
  .sort((a,b)=>b.when.localeCompare(a.when));
 const latest=logs.find(log=>hasTrainingRecord(log)&&Number.isFinite(log.at));
 return {logs,recorded,assignments,latest};
}
function assignedLogSummary({assignments,recorded}){
 if(!assignments.length)return 'No assignments due';
 const logged=assignments.filter(plan=>recorded.has(plan.id)).length;
 return logged+' of '+assignments.length+' due '+(assignments.length===1?'assignment':'assignments')+' logged';
}
const logMonthFormat=new Intl.DateTimeFormat('en-GB',{month:'long',year:'numeric',timeZone:'Europe/London'});
function logMonths(logs){
 const months=new Map();
 for(const log of logs){
  const label=Number.isFinite(log.at)?logMonthFormat.format(log.at):'Date unavailable';
  if(!months.has(label))months.set(label,[]);
  months.get(label).push(log);
 }
 return [...months];
}
function monthDisclosure(month,count,body,open,extra=''){
 return '<details class="fold activity-month" '+(open?'open ':'')+extra+'><summary>'+
  '<span>'+e(month)+' <small class="mini">'+count+' '+(count===1?'log':'logs')+'</small></span></summary>'+
  '<div class="fold-content stack">'+body+'</div></details>';
}
const pendingLogs=name=>playerLogs(name).filter(l=>hasTrainingRecord(l)&&!state.reviews.some(r=>r.logId===l.id));
const overdue=name=>{const date=activeTarget(name)?.review;return /^\d{4}-\d{2}-\d{2}$/.test(date??'')&&date<=londonToday();};
const queueFor=name=>{
 const count=pendingLogs(name).length,due=overdue(name),request=oneRequest(name),plan=onePlan(name);
 const feedbackDue=Boolean(plan?.date&&plan.date<londonToday());
 const pathways=[],applications=[];
 for(const [key,pathway] of activePathways()){
  const status=pathwayStatus(pathwayRecord(name,key));
  if(status==='interested')pathways.push({key,title:pathway.title});
  if(status==='applying')applications.push({key,title:pathway.title});
 }
 return {count,due,request,feedbackDue,pathways,applications,needed:Boolean(count||due||request||feedbackDue||pathways.length)};
};
function coachHome(){
 const rows=Object.keys(roster).map((name,i)=>({name,i,...queueFor(name),activity:playerActivity(name)})).sort((a,b)=>Number(b.needed)-Number(a.needed)||Number(Boolean(b.request))-Number(Boolean(a.request))||Number(b.feedbackDue)-Number(a.feedbackDue)||Number(b.due)-Number(a.due)||b.pathways.length-a.pathways.length||b.count-a.count);
 return '<h1 class="page-title">U14 squad</h1>'+
 (rows.some(row=>row.request||onePlan(row.name))?'<a class="text-link" href="#coach-calendar">1:1 calendar '+icon('arrow',15)+'</a>':'')+
 (rows.length>8?'<div class="section form"><label>Find a player<input type="search" data-squad-search autocomplete="off"></label></div>':'')+
 '<div class="section stack">'+rows.map(squadPlayerCard).join('')+
 '<p class="details" data-squad-no-matches hidden>No players match that name.</p></div>'+foot();
}
function squadPlayerCard(row){
 const profile=state.profiles[row.name];
 const playerRoute='player/'+row.i;
 const tasks=[];
 if(row.count)tasks.push({route:playerRoute,label:row.count===1?'Review session':'Review '+row.count+' sessions'});
 if(row.request)tasks.push({route:'coach-one/'+row.i,label:'Plan 1:1',detail:skillName(row.request)});
 if(row.feedbackDue)tasks.push({route:'coach-one/'+row.i+'/feedback',label:'Give 1:1 feedback'});
 for(const {key,title} of row.pathways){
  tasks.push({route:'coach-pathways/'+row.i+'/'+key,label:title+' interest'});
 }
 if(row.due)tasks.push({route:playerRoute+'/target',label:'Check target'});
 const action=task=>'<a class="squad-task" href="#'+task.route+'" aria-label="'+
 e(task.label+' for '+row.name+(task.detail?' · '+task.detail:''))+'">'+
 '<span>'+e(task.label)+(task.detail?' · '+e(task.detail):'')+'</span>'+icon('arrow',14)+'</a>';
 const applications=row.applications.map(({key,title})=>
  '<a class="squad-task squad-application" href="#coach-pathways/'+row.i+'/'+key+'" aria-label="'+
  e(title+' · Applying for '+row.name)+'"><span>'+e(title)+' · Applying</span>'+icon('arrow',14)+'</a>').join('');
 const last=row.activity.latest;
 const lastLabel=last?'Last result logged '+resultDate.format(last.at):'No training results logged';
 return '<article class="card squad-player '+(row.needed?'due':'')+'" data-squad-name="'+e(row.name)+'">'+
 '<a class="squad-progress" href="#'+playerRoute+'"><div><h2 class="activity-name">'+e(row.name)+'</h2><p class="mini">'+e(profile.focus||'Position to discuss')+'</p></div>'+
 icon('arrow',16)+'</a>'+
 '<a class="squad-activity" href="#'+playerRoute+'/activity" aria-label="'+e('Training activity for '+row.name+' · '+lastLabel+' · '+assignedLogSummary(row.activity))+'">'+
 '<span><strong>'+e(lastLabel)+'</strong><span class="mini">'+e(assignedLogSummary(row.activity))+'</span></span>'+icon('arrow',14)+'</a>'+
 (tasks.length?'<div class="squad-actions" role="group" aria-label="Needs attention">'+tasks.map(action).join('')+'</div>':'')+
 (applications?'<div class="squad-actions" role="group" aria-label="Pathway applications">'+applications+'</div>':'')+'</article>';
}
function sessionResults(l){
 const p=state.plans.find(x=>x.id===l.plan);if(!p)return '';
 return '<div class="stack">'+p.items.map((a,i)=>'<div class="flex line"><strong>'+e(a.name)+'</strong><span class="mini">'+(l.items[i].status==='done'?(a.unit==='sets'?setSummary(l.items[i]):l.items[i].value!==''?e(l.items[i].value)+' '+unitShort[a.unit]:'Done'):l.items[i].status==='skipped'?'Skipped':'Not logged')+'</span></div>').join('')+'</div>';
}
function attemptHighlight(plan,log){
 if(!plan)return names[log.status]||'Saved session';
 const entries=plan.items.map((activity,index)=>({activity,entry:log.items?.[index]}))
  .filter(({entry})=>entry?.status==='done');
 const sets=entries.flatMap(({activity,entry})=>activity.unit==='sets'?(entry.sets??[])
  .filter(set=>Number(set?.reps)>0).map(set=>({activity,set})):[]);
 const bestSet=sets.find(({set})=>Number(set.load)>0)??sets[0];
 const timed=entries.find(({activity,entry})=>activity.unit==='sec'&&Number(entry.value)>0);
 if(plan.category==='Speed'&&timed)return timed.activity.name+' · '+resultNumber.format(Number(timed.entry.value))+' s';
 if(bestSet){
  const {activity,set}=bestSet;
  return activity.name+' · '+resultNumber.format(Number(set.reps))+' reps'+
   (Number(set.load)>0?' × '+resultNumber.format(Number(set.load))+' kg':'');
 }
 const metric=entries.find(({activity,entry})=>unitShort[activity.unit]&&entry.value!=null&&entry.value!=='');
 if(metric)return metric.activity.name+' · '+resultNumber.format(Number(metric.entry.value))+' '+unitShort[metric.activity.unit];
 return entries.length+' of '+plan.items.length+' activities logged';
}
function attemptMeta(log){
 const attempts=playerLogs(log.player).filter(entry=>entry.plan===log.plan);
 const order=attempts.findIndex(entry=>entry.id===log.id);
 const date=Number.isFinite(log.at)?resultLoggedAt.format(log.at):'Date unavailable';
 return date+(attempts.length>1&&order>=0?' · Attempt '+(attempts.length-order):'');
}
function attemptSummary(log){
 const plan=state.plans.find(p=>p.id===log.plan);
 return '<span class="mini">'+e(attemptMeta(log))+'</span><strong>'+e(plan?.title??'Session')+'</strong>'+
  '<span class="attempt-result">'+e(attemptHighlight(plan,log))+'</span>'+
  (log.status==='partial'?'<span class="mini">Part completed</span>':'');
}
function coachAttemptPicker(logs,selected,index){
 if(!logs.length)return '';
 const alternatives=logs.filter(log=>log!==selected);
 const buttons=alternatives.map(log=>'<button type="button" class="attempt-choice" data-review-attempt="'+e(log.id)+'" data-player-index="'+index+'">'+attemptSummary(log)+'</button>').join('');
 const match=selected?'<button type="button" class="attempt-choice" data-review-attempt="pitch" data-player-index="'+index+'"><strong>Training or match</strong></button>':'';
 return fold('Choose what to review','<div class="review-attempts">'+buttons+match+'</div>','attempt-picker');
}
function coachReviewSection(name,index,logs,log,done){
 const body=done&&!logs.length?
  '<p class="details">All session reviews done.</p><div class="actions">'+
  '<button type="button" class="secondary" data-review-attempt="pitch" data-player-index="'+index+'">Review training or a match</button></div>':
  (log?'<div class="card selected-review"><div class="attempt-summary">'+attemptSummary(log)+'</div>'+
  fold('All logged results',sessionResults(log),'session-results')+'</div>':'')+
  coachAttemptPicker(logs,log,index)+reviewForm(log?.id??'',name,!log,index);
 return '<section class="section coach-work" id="coach-feedback" tabindex="-1"><h2 class="section-title block-title">'+
  (log?'Review session':'Give feedback')+'</h2>'+body+'</section>';
}
function openCoachReview(index,attempt){
 history.replaceState(null,'','#player/'+index+'/'+attempt);
 render();
 const section=main.querySelector('#coach-feedback');
 section?.focus({preventScroll:true});
 section?.scrollIntoView({block:'start',behavior:'instant'});
}
function coachPlayerTabs(index,active){
 const route='player/'+index;
 const tabs=[['feedback','Feedback',route],['target','Target',route+'/target'],['skills','Rate skills',route+'/profile-skills'],['activity','Activity',route+'/activity']];
 return '<nav class="coach-player-tabs" aria-label="Player tools">'+tabs.map(([key,label,path])=>
  '<a class="secondary" href="#'+path+'" '+(active===key?'aria-current="page" ':'')+'>'+label+'</a>').join('')+'</nav>';
}
function coachTargetPanel(name){
 const target=activeTarget(name),today=londonToday();
 const review=target?.review??'';
 const editableDate=/^\d{4}-\d{2}-\d{2}$/.test(review)&&review>=today?review:'';
 const due=overdue(name);
 const checkIn=review&&(due||review!==editableDate)?
  '<p class="mini'+(due?' due-note':'')+'">'+(due?'Check-in due · ':'Current check-in · ')+e(dateText(review))+'</p>':'';
 return '<section class="section coach-work" aria-labelledby="coach-target-title"><h2 class="section-title block-title" id="coach-target-title">'+
  (target?'Current target':'Set a target')+'</h2>'+
  '<form id="target-form" data-player="'+e(name)+'" class="form coach-compact-form">'+
  '<label>What should they practise?<input name="goal" maxlength="110" required value="'+e(target?.goal??'')+'" placeholder="One thing to try at training"></label>'+
  checkIn+'<label>Check-in date<input type="date" name="review" required min="'+today+'" value="'+e(editableDate)+'"></label>'+
  '<div class="target-actions"><button class="primary" type="submit">Save target</button>'+
  '<button class="secondary" type="submit" name="returnTo" value="squad">Save and return to Squad</button></div>'+
  '<p class="alert" role="alert"></p></form></section>';
}
function coachProfileSkillsPage(name){
 const core=coreProfileSkills.map(skill=>'<li>'+e(skillName(skill))+'</li>').join('');
 return '<section class="section" aria-labelledby="coach-profile-skills-heading">'+
 '<h2 class="section-title block-title" id="coach-profile-skills-heading">Profile skills</h2>'+
 '<div class="card coach-profile-skill-card"><h3 class="activity-name">Extra skills</h3>'+
 coachProfileSkills(name)+'</div>'+
 fold('Core skills for every player','<ul class="coach-core-skills">'+core+'</ul>','section')+
 (profilePositionSkills(name).length?fold('Built-in position skills','<ul class="coach-core-skills">'+
  profilePositionSkills(name).map(skill=>'<li>'+e(skillName(skill))+'</li>').join('')+'</ul>','section'):'')+
 fold('Update a skill rating',coachSkillForm(name),'section')+'</section>';
}
function staffPlayer(index,selected){
 const name=Object.keys(roster)[Number(index)];if(!name)return notFound('desk');
 const profile=state.profiles[name];
 const active=selected==='target'?'target':selected==='profile-skills'?'skills':selected==='activity'?'activity':'feedback';
 const header=back('desk','Back to Squad')+
  '<header class="coach-player-heading"><h1 class="page-title">'+e(name)+'</h1>'+
  (profile.focus?'<p class="mini">'+e(profile.focus)+'</p>':'')+'</header>'+coachPlayerTabs(index,active);
 if(active==='target')return header+coachTargetPanel(name)+foot();
 if(active==='activity')return header+coachPlayerActivity(name,index)+foot();
 if(active==='skills')return header+coachProfileSkillsPage(name)+
  '<div class="actions"><a class="text-link" href="#position-plan/'+index+'">Edit positions '+icon('arrow',15)+'</a></div>'+foot();
 const history=playerHistory(name),logs=pendingLogs(name);
 const log=selected==='pitch'?null:logs.find(item=>item.id===selected)??logs[0];
 const focus=state.playerFocus[name];
 const oneLabel='1:1 coaching'+(focus?' · '+skillName(focus):'');
 return header+coachReviewSection(name,index,logs,log,selected==='done')+
  (history.length?fold('Past feedback ('+history.length+')','<div class="stack">'+history.map(reviewCard).join('')+'</div>','section'):'')+
  '<nav class="section coach-player-links" aria-label="More player tools">'+
  '<a class="text-link" href="#coach-one/'+index+'">'+e(oneLabel)+' '+icon('arrow',15)+'</a>'+
  (firstPathway()?'<a class="text-link" href="#coach-pathways/'+index+'">Pathways '+icon('arrow',15)+'</a>':'')+'</nav>'+foot();
}
function programmes(){
 const packRows=Object.entries(trainingPacks).map(([id,pack])=>
  '<article class="programme-row"><div><h3>'+e(pack.title)+'</h3><p class="mini">'+e(pack.description)+'</p></div>'+
  '<a class="secondary programme-action" href="#pack/'+id+'" aria-label="'+e('Assign pack: '+pack.title)+'">Assign pack '+icon('arrow',15)+'</a></article>').join('');
 const savedRows=state.plans.filter(plan=>!plan.personal&&!plan.preset).map(plan=>
  '<article class="programme-row"><div>'+tag(plan.category)+'<h3>'+e(plan.title)+'</h3>'+
  '<p class="mini">'+e(plan.audience)+' · '+e(dateText(plan.when))+' · '+plan.items.length+' activities</p></div>'+
  '<button type="button" class="secondary programme-action" data-copy="'+e(plan.id)+'">Copy &amp; adapt</button></article>').join('');
 return compactHeader('Programmes','train','gym-tile')+
  '<div class="actions programme-create"><button class="primary" data-create>'+icon('plus',16)+'New programme</button>'+
  '<button class="secondary" data-create="gym">'+icon('train',16)+'New gym programme</button></div>'+
  '<section class="section" aria-labelledby="training-packs-title"><h2 class="section-title block-title" id="training-packs-title">Training packs</h2>'+
  '<div class="programme-list">'+packRows+'</div></section>'+
  (savedRows?'<section class="section" aria-labelledby="saved-programmes-title"><h2 class="section-title block-title" id="saved-programmes-title">Saved programmes</h2>'+
  '<div class="programme-list">'+savedRows+'</div></section>':'')+foot();
}
function coachPack(id){
 if(!Object.hasOwn(trainingPacks,id))return notFound('programmes');
 const pack=trainingPacks[id];
 return back('programmes','Back to Programmes')+compactHeader(pack.title,'bolt','skills-tile',null,pack.description)+
 '<ul class="pack-activities">'+pack.items.map(activity=>'<li>'+e(activity.name)+'</li>').join('')+'</ul>'+
 '<form id="assign-pack" class="section form" data-pack="'+e(id)+'">'+
 '<label>Assign to<select name="audience">'+['U14 squad',...Object.keys(roster)].map(name=>opt(name,'')).join('')+'</select></label>'+
 '<label>Due date<input name="when" type="date" required min="'+londonToday()+'"></label>'+
 '<button class="primary">Assign pack '+icon('arrow',16)+'</button><p class="alert" role="alert"></p></form>'+foot();
}
const newItem=()=>({name:'',target:'',cue:'',equipment:'',instructions:'',unit:'',supervised:false});
const newPlan=()=>({title:'',category:'Skills',duration:20,when:'',audience:'U14 squad',items:[newItem()]});
const opt=(v,sel,label=v)=>'<option value="'+e(v)+'" '+(v===sel?'selected':'')+'>'+e(label)+'</option>';
function mediaFields(activity,i){
 const photos=activity.demoPhotos??[];
 return fold('Add a video or photos','<p class="mini">Use club-approved links. Choose a short, captioned demo if it has speech. Photos should show the movement clearly.</p>'+
 '<label>Video link (MP4 or WebM)<input type="url" name="video'+i+'" value="'+e(activity.demoVideo)+'" placeholder="https://…/demo.mp4"></label>'+
 Array.from({length:3},(_,j)=>'<div class="media-pair"><label>Photo '+(j+1)+' link<input type="url" name="photo'+i+'-'+j+'" value="'+e(photos[j]?.url)+'" placeholder="https://…/photo.jpg"></label><label>Photo '+(j+1)+' caption<input name="caption'+i+'-'+j+'" maxlength="110" value="'+e(photos[j]?.caption)+'" placeholder="e.g. Stand tall to finish"></label></div>').join(''),'media-fields');
}
function builderExamples(category){
 if(category==='Gym'||category==='Strength & movement'){
  return {title:'Gym foundations',activity:'Squat to a box',target:'2 sets of 8 reps',equipment:'Box or bench'};
 }
 if(category==='Fitness')return {title:'Stop, turn & go',activity:'Change of direction',target:'Follow your coach’s cues',equipment:'Cones'};
 if(category==='Speed'){
  return {title:'First-step speed',activity:'10 m acceleration',target:'3 runs',equipment:'Cones and stopwatch'};
 }
 return {title:'Passing under pressure',activity:'Pass on the move',target:'2 rounds',equipment:'Rugby ball and cones'};
}
function activityPrescription(activity,index,gym,examples){
 const showSetCount=activity.unit==='sets';
 const showDistance=!gym&&activity.unit==='sec';
 const legacyReps=activity.target?.match(/\b\d+\s+sets?\s+(?:of\s+)?(\d+)\b/i)?.[1];
 const sets=activity.setCount??2;
 const reps=activity.repCount??legacyReps??'';
 return '<fieldset class="split prescription-fields" data-gym-prescription '+(gym?'':'hidden disabled')+'>'+
 '<label>Sets<input name="gym-sets'+index+'" type="number" min="1" max="6" required value="'+sets+'"></label>'+
 '<label>Reps per set<input name="gym-reps'+index+'" type="number" min="1" max="999" required value="'+e(reps)+'" placeholder="e.g. 8"></label></fieldset>'+
 '<fieldset class="prescription-fields" data-other-prescription '+(gym?'hidden disabled':'')+'>'+
 '<div class="split"><label>How much?<input name="target'+index+'" maxlength="100" required value="'+e(activity.target)+'" data-example="target" placeholder="e.g. '+examples.target+'"></label>'+
 '<label>Record a result<select name="unit'+index+'">'+opt('',activity.unit,'Tick off only')+Object.entries(unitNames).map(([k,v])=>opt(k,activity.unit,v)).join('')+'</select></label></div>'+
 '<label data-set-count="unit'+index+'" '+(showSetCount?'':'hidden')+'>Sets to log<input name="sets'+index+'" type="number" min="1" max="6" value="'+sets+'" '+(showSetCount?'required':'disabled')+'></label>'+
 '<label data-sprint-distance="unit'+index+'" '+(showDistance?'':'hidden')+'>Sprint distance (m)<input name="distance'+index+'" type="number" min="0.01" max="10000" step="0.01" placeholder="Optional · e.g. 10" value="'+e(sprintDistance(activity)||'')+'" '+(showDistance?'':'disabled')+'></label></fieldset>';
}
function editor(preview=false){
 if(preview&&!draft)return editor();
 if(!draft)draft=newPlan();
 const d=draft;
 const examples=builderExamples(d.category);
 if(preview)return back('builder','Edit programme')+compactHeader(d.title,'train','gym-tile',null,d.category+' · '+d.duration+' min')+
 '<div class="card section"><strong>Assign to '+e(d.audience)+'</strong><p class="mini">Due '+e(dateText(d.when))+'</p></div>'+
 '<div class="stack section">'+d.items.map((a,i)=>'<article class="card"><div class="row"><span class="badge-number">'+String(i+1).padStart(2,'0')+'</span><div><h2 class="activity-name">'+e(a.name)+'</h2><p class="mini">'+e(activityTarget(a))+(a.unit&&a.unit!=='sets'?' · '+unitNames[a.unit]:'')+'</p></div></div>'+exerciseGuide(a)+(a.supervised?'<p class="mini supervision">Trainer must supervise</p>':'')+'</article>').join('')+'</div><div class="actions"><button class="primary full" data-publish>Assign programme '+icon('arrow',16)+'</button></div>'+foot();
 return back('programmes','Back to Programmes')+compactHeader('Build programme','train','gym-tile')+
 '<form id="builder" class="form section"><section class="card form"><label>Programme name<input name="title" maxlength="72" required value="'+e(d.title)+'" data-example="title" placeholder="e.g. '+examples.title+'"></label><div class="split"><label>Session type<select name="category">'+Object.keys(categories).filter(x=>x!=='Strength & movement'||x===d.category).map(x=>opt(x,d.category)).join('')+'</select></label><label>Minutes<input name="duration" type="number" min="1" max="120" required value="'+e(d.duration)+'"></label></div><div class="split"><label>Assign to<select name="audience">'+['U14 squad',...Object.keys(roster)].map(x=>opt(x,d.audience)).join('')+'</select></label><label>Due date<input name="when" type="date" required value="'+e(d.when)+'"></label></div></section>'+
 '<fieldset class="card form prescription-fields" data-coach-presets '+(isGym(d)?'':'hidden disabled')+'>'+
 '<label>Preset exercise<select name="coachPreset">'+gymPresetOptions()+'</select></label>'+
 '<div class="actions exercise-picker-actions"><button type="button" class="secondary" data-add-gym-preset disabled>Add preset</button>'+
 '<button type="button" class="quiet" data-add>Add custom exercise</button>'+
 '<button type="button" class="text-link" data-missing-reps '+(d.items.some(item=>!item.repCount&&!item.target?.match(/\b\d+\s+sets?\s+(?:of\s+)?\d+\b/i))?'':'hidden')+'>Fill in reps per set</button></div></fieldset>'+
 d.items.map((x,i)=>'<section class="plan-drill"><div class="flex"><h2 class="activity-name">Activity '+(i+1)+'</h2>'+(d.items.length>1?'<button class="quiet" type="button" data-remove="'+i+'" aria-label="Remove activity '+(i+1)+'">Remove</button>':'')+'</div><label>Activity name<input name="name'+i+'" maxlength="70" required value="'+e(x.name)+'" data-example="activity" placeholder="e.g. '+examples.activity+'"></label>'+activityPrescription(x,i,isGym(d),examples)+'<label>Equipment<input name="equipment'+i+'" maxlength="160" value="'+e(x.equipment)+'" data-example="equipment" placeholder="e.g. '+examples.equipment+'"></label><label>How to do it<textarea name="instructions'+i+'" maxlength="1600" rows="4" placeholder="One step per line. Explain setup, movement and rest.">'+e(x.instructions)+'</textarea></label>'+mediaFields(x,i)+'<label>Coaching cue<input name="cue'+i+'" maxlength="220" value="'+e(x.cue)+'" placeholder="Optional · one thing to remember"></label><label class="check"><input name="supervised'+i+'" type="checkbox" '+(x.supervised?'checked':'')+'> Qualified adult supervision required</label></section>').join('')+
 '<button class="secondary" type="button" data-add data-other-add '+(isGym(d)?'hidden':'')+'>'+icon('plus',16)+'Add activity</button><button class="primary">Preview programme '+icon('arrow',16)+'</button><p id="builder-error" class="alert" role="alert"></p></form>'+foot();
}
function readBuilder(){
 const f=new FormData(document.querySelector('#builder'));
 for(const k of ['title','category','duration','when','audience'])draft[k]=String(f.get(k)??'').trim();
 const gym=isGym(draft);
 draft.items=draft.items.map((previous,i)=>({builtInDemo:previous.builtInDemo&&String(f.get('name'+i)).trim()==='Squat to a box',demoVideo:String(f.get('video'+i)??'').trim(),demoPhotos:Array.from({length:3},(_,j)=>({url:String(f.get('photo'+i+'-'+j)??'').trim(),caption:String(f.get('caption'+i+'-'+j)??'').trim()})).filter(p=>p.url||p.caption),name:String(f.get('name'+i)).trim(),target:String(f.get('target'+i)??previous.target??'').trim(),cue:String(f.get('cue'+i)).trim(),equipment:String(f.get('equipment'+i)).trim(),instructions:String(f.get('instructions'+i)).trim(),unit:gym?'sets':f.get('unit'+i),distanceMetres:gym||f.get('unit'+i)!=='sec'?null:(Number(f.get('distance'+i))||null),setCount:Number(f.get('gym-sets'+i)??f.get('sets'+i)??previous.setCount??2),repCount:gym?(Number(f.get('gym-reps'+i))||null):(f.get('unit'+i)==='sets'?previous.repCount??null:null),supervised:gym||f.has('supervised'+i)||['kg','sets'].includes(f.get('unit'+i))}));
}
function reviews(){
 const logs=Object.values(state.logs).sort((a,b)=>b.at-a.at);
 return compactHeader('Player reviews','chat','coaching-tile')+
 '<div class="actions"><a class="primary" href="#observe">New player review '+icon('plus',16)+'</a></div>'+
 (state.reviews.some(x=>x.context&&!x.logId)?'<section class="section stack"><h2 class="section-title">Pitch feedback</h2>'+state.reviews.filter(x=>x.context&&!x.logId).map(x=>'<div class="stack"><h3 class="activity-name">'+e(x.player)+'</h3>'+reviewCard(x)+'</div>').join('')+'</section>':'')+
 '<section class="section stack">'+(logs.length?logs.map(l=>{const reviewed=state.reviews.some(r=>r.logId===l.id);return '<article class="card"><div class="row"><span class="icon-tile">'+icon('chat')+'</span><div>'+tag(reviewed?'Feedback sent':'Ready to review',reviewed?'good':'')+'<h2 class="card-title">'+e(l.player)+'</h2><div class="attempt-summary">'+attemptSummary(l)+'</div></div></div><div class="actions"><a class="'+(reviewed?'secondary':'primary')+'" href="#review/'+l.id+'">'+(reviewed?'View feedback':'Review session')+icon('arrow',16)+'</a></div></article>';}).join(''):'<div class="card empty"><h2 class="card-title">No sessions to review yet</h2><p>Switch to Player and log the speed session to try this out.</p></div>')+'</section>'+foot();
}
function suggestions(player,position){
 const p=state.profiles[player]??{},roles=position?[position]:[...new Set([p.focus,p.explore].filter(Boolean))];
 return roles.length?'<p class="mini">Suggested factors · choose only what you saw</p>'+
 roles.map(pos=>'<div class="suggested-role"><strong>'+e(pos)+'</strong><div class="skill-shortcuts">'+positionFactors[pos].map(x=>'<button type="button" class="skill-chip" data-suggest="'+e(x)+'">'+e(skillName(x))+'</button>').join('')+'</div></div>').join(''):
 '<p class="mini">No position focus set yet. Choose any observed factor below.</p>';
}
function optionalNextTarget(){
 return fold('Add a next target',
  '<label>What should they try next?<input name="goal" maxlength="110" placeholder="One thing to practise"></label><label>Check-in date (optional)<input type="date" name="review" min="'+londonToday()+'"></label>',
  'review-target');
}
const praiseField='<label class="check"><input type="checkbox" name="good">Highlight good work</label>';
function factorPicker(i){
 return '<fieldset class="factor-pick"><legend>'+(i===1?'Skill (optional)':'Second skill (optional)')+'</legend><label>Skill or behaviour<select name="factor'+i+'">'+opt('','','Choose an area')+Object.keys(factors).map(x=>opt(x,'',skillName(x))).join('')+'</select></label><p class="mini" data-factor-hint="factor'+i+'">Choose something you observed in training or a match.</p><label>Development level<select name="marker'+i+'">'+opt('','','Feedback only')+markers.map(x=>opt(x,'')).join('')+'</select></label></fieldset>';
}
function observe(){
 return back('reviews','Back to Reviews')+compactHeader('New player review','chat','coaching-tile')+reviewForm('', '', true)+foot();
}
function reviewForm(id,player,independent=false,index){
 const contextFields=independent?'<label>Feedback from<select name="context">'+
  ['Pitch training','Match','1:1 coaching','Speed session','Gym session'].map(context=>opt(context,'')).join('')+'</select></label>':'';
 const eventField=independent?'<label>Session or match name (optional)<input name="eventTitle" maxlength="80" placeholder="e.g. Sunday training"></label>':'';

 const fixed=index!==undefined;
 if(fixed){
  const details=eventField+
  '<label>Observed on<input type="date" name="observedOn" required max="'+londonToday()+'" value="'+londonToday()+'"></label>'+positionSelect('position','','Position observed','Not recorded')+
  '<div class="suggestions" id="position-suggestions">'+suggestions(player,'')+'</div>'+factorPicker(2);
  return '<form id="review-form" class="form coach-compact-form" data-id="'+id+'" data-player-index="'+index+'"><input type="hidden" name="player" value="'+e(player)+'"><label>What did you notice?<textarea name="body" maxlength="600" required></textarea></label>'+contextFields+
   optionalNextTarget()+
   fold('More feedback details',details+factorPicker(1)+praiseField)+visibilityNote(player)+'<button class="primary">Publish feedback</button><p id="review-error" class="alert" role="alert"></p></form>';
 }
 return '<form id="review-form" data-id="'+id+'" class="card form section">'+(independent?'<label>Player<select name="player">'+Object.keys(roster).map(x=>opt(x,'')).join('')+'</select></label>'+contextFields+eventField:'')+'<label>Observed on<input type="date" name="observedOn" required max="'+londonToday()+'" value="'+londonToday()+'"></label>'+positionSelect('position','','Position observed','Not recorded')+'<h2 class="section-title">Give feedback</h2><p class="mini">Pick up to two things you saw. Use a marker only when it helps explain the feedback.</p><div class="suggestions" id="position-suggestions" aria-label="Suggested factors">'+suggestions(player||Object.keys(roster)[0],'')+'</div>'+factorPicker(1)+factorPicker(2)+'<label>What went well or what to try<textarea name="body" maxlength="600" required placeholder="Keep it specific and useful."></textarea></label>'+praiseField+optionalNextTarget()+visibilityNote(player||'the player')+'<button class="primary">Publish feedback '+icon('arrow',16)+'</button><p id="review-error" class="alert" role="alert"></p></form>';
}
function review(id){
 const l=Object.values(state.logs).find(x=>x.id===id);if(!l)return notFound('reviews');
 const p=state.plans.find(x=>x.id===l.plan), posted=state.reviews.find(r=>r.logId===id);
 if(!p)return notFound('reviews');
 const index=Object.keys(roster).indexOf(l.player);
 const title=back('reviews','Back to Reviews')+compactHeader(l.player,'chat','coaching-tile',null,'Session review');
 if(!posted&&index>=0)return title+coachReviewSection(l.player,index,pendingLogs(l.player),l,false)+foot();
 return title+'<section class="card section"><div class="attempt-summary">'+attemptSummary(l)+'</div>'+
 fold('All logged results',sessionResults(l),'session-results')+'</section>'+
 (posted?'<section class="section"><h2 class="section-title">Feedback sent</h2>'+reviewCard(posted)+'</section>':reviewForm(id,l.player))+foot();
}
function parentView(){
 const name=playerName,reviews=playerHistory(name),target=activeTarget(name),focus=currentSkillFocus(name,target);
 const praise=[...reviews,...(state.skillNotes[name]??[])].filter(r=>r.goodWork)
  .sort((a,b)=>(b.savedAt??0)-(a.savedAt??0)||(b.observedOn??'').localeCompare(a.observedOn??''))[0];
 const positive=praise?.body||(reviews.some(r=>r.id==='welcome')?welcomePraise:'');
 const next=focus?.note||target?.goal;
 const planned=onePlan(name),req=oneRequest(name),doneOne=oneHistory(name).filter(x=>x.reviewId);
 const plans=nextTraining(ownPlans());
 return heading('Verified parent or carer · Jo Morgan','Eli’s pathway','Read-only view of Eli’s published plans, logged sessions and coach feedback.')+
 playerKit(false)+
 '<section class="card section skills-coach" aria-label="Current coaching summary">'+
 '<div class="skills-coach-item"><span class="icon-tile">'+icon('check',18)+'</span><div><h2>What went well</h2><p>'+e(positive||'Coach praise will appear here once published.')+'</p></div></div>'+
 '<div class="skills-coach-item"><span class="icon-tile">'+icon('flag',18)+'</span><div><h2>Current focus</h2><p>'+e(next||'No active target set yet.')+'</p></div></div></section>'+
 '<section class="section"><h2 class="section-title block-title">1:1 coaching</h2>'+
 (planned?oneCard(planned):req?'<article class="card"><div class="eyebrow">Requested by Eli</div><h3 class="card-title">'+e(skillName(req))+'</h3><p class="mini">Waiting for Coach Alex to add a session date and drills.</p></article>':doneOne.length?oneCard(doneOne[0],true):'<div class="card empty">No 1:1 sessions requested or planned right now.</div>')+'</section>'+
 '<section class="section"><h2 class="section-title block-title">Assigned sessions &amp; logs</h2><div class="stack">'+
 plans.map(p=>{const l=ownLog(p);return '<article class="card"><div class="row"><span class="icon-tile">'+icon(categories[p.category])+'</span><div>'+tag(isGym(p)?'Gym':p.category)+'<h3 class="card-title">'+e(p.title)+'</h3><p class="mini">'+e(p.personal?'My gym session':p.duration+' min · '+dateText(p.when))+'</p></div>'+(l?tag(names[l.status],'good'):tag('Assigned','dim'))+'</div>'+(l?'<div class="line">'+sessionResults(l)+'</div>':'')+'</article>';}).join('')+'</div></section>'+
 (reviews.length?'<section class="section"><h2 class="section-title block-title">Published coach feedback</h2><div class="stack">'+reviews.map(reviewCard).join('')+'</div></section>':'')+
 foot();
}
const routes={recipe:(topic,id)=>recipePage(topic,id),'coach-recipe':(topic,id)=>recipePage(topic,id,true),today,'coach-feedback':playerFeedbackPage,parent:parentView,'one-to-one':oneToOne,'one-calendar':()=>oneCalendar(),'coach-calendar':()=>oneCalendar(true),'coach-one':oneCoach,train:()=>train(trainingView),gym,field,fitness,progress,skills:progress,skill:skillPage,'training-results':trainingResultsPage,fuel,'coach-fuel':coachFuel,profile:myProfile,'gym-builder':gymBuilder,results:savedResults,pathways:key=>pathwayPage(key),'coach-pathways':(index,key)=>pathwayPage(key,index),'edit-pathways':editPathwayInfo,'position-plan':arg=>playerProfile(arg??'0'),session,desk:coachHome,player:staffPlayer,programmes,pack:coachPack,builder:()=>editor(),preview:()=>editor(true),reviews,review,observe};

const gymExerciseGroups=[
 ['Lower body',[
  {...gymSeed.items[1]}, {name:'Step-up',equipment:'Stable step'}, {name:'Glute bridge',equipment:'Floor'},
  {name:'Split squat',equipment:'Floor'}, {name:'Calf raise',equipment:'Floor'}
 ]],
 ['Upper body',[
  {name:'Press-up',equipment:'Floor'}, {name:'Incline press-up',equipment:'Stable bench'}, {name:'Band row',equipment:'Resistance band'}
 ]],
 ['Core & balance',[
  {name:'Dead bug',equipment:'Mat'}, {name:'Bird dog',equipment:'Mat'}, {name:'Single-leg balance',equipment:'Floor'}
 ]]
];
const gymPresets=gymExerciseGroups.flatMap(([,exercises])=>exercises);
function gymPresetOptions(){
 let index=0;
 return opt('','','Choose an exercise')+gymExerciseGroups.map(([group,exercises])=>'<optgroup label="'+e(group)+'">'+
  exercises.map(exercise=>opt(String(index++),'',exercise.name)).join('')+'</optgroup>').join('');
}
const gymBuilderDraft=()=>state.gymBuilder??={title:'',items:[]};
function gymBuilder(){
 const draft=gymBuilderDraft();
 const exercises=draft.items.map((activity,index)=>'<fieldset class="card form personal-activity"><legend>Exercise '+(index+1)+'</legend>'+
  '<label>Exercise name<input name="exercise'+index+'" required maxlength="70" value="'+e(activity.name)+'" placeholder="e.g. Step-up"></label>'+
  '<div class="split"><label>Sets<input name="sets'+index+'" type="number" inputmode="numeric" min="1" max="12" required value="'+e(activity.setCount)+'"></label>'+
  '<label>Equipment (optional)<input name="equipment'+index+'" maxlength="80" value="'+e(activity.equipment)+'" placeholder="e.g. Resistance band"></label></div>'+
  '<button type="button" class="quiet" data-gym-action="remove" data-index="'+index+'">Remove exercise '+(index+1)+'</button></fieldset>').join('');
 const options=gymPresetOptions();
 return compactHeader('Build my own session','train','gym-tile')+
  '<form id="gym-session-builder" class="form section">'+
  '<label>Session name<input name="title" required maxlength="70" value="'+e(draft.title)+'" placeholder="e.g. Monday gym"></label>'+
  '<div class="card form"><label>Preset exercise<select name="preset">'+options+'</select></label>'+
  '<div class="actions exercise-picker-actions"><button type="button" class="secondary" data-gym-action="preset" disabled>Add preset</button>'+
  '<button type="button" class="quiet" data-gym-action="custom">Add custom exercise</button></div></div>'+
  exercises+
  '<button class="primary">Start logging '+icon('arrow',16)+'</button><p class="alert" role="alert"></p></form>'+
  foot();
}
function readGymBuilder(form){
 const draft=gymBuilderDraft(), data=new FormData(form);
 draft.title=String(data.get('title')??'');
 draft.items=draft.items.map((activity,index)=>{
  const name=String(data.get('exercise'+index)??'');
  return {...activity,name,equipment:String(data.get('equipment'+index)??''),
   setCount:String(data.get('sets'+index)??''),builtInDemo:activity.builtInDemo&&name.trim()===gymSeed.items[1].name,
   instructions:name.trim()===gymSeed.items[1].name?activity.instructions:''};
 });
 return draft;
}
function updateGymBuilder(button){
 const form=button.form,draft=readGymBuilder(form);
 const action=button.dataset.gymAction;
 if(action==='remove'){
  draft.items.splice(Number(button.dataset.index),1);
 }else if(draft.items.length<20){
  const choice=form.elements.preset.value;
  const preset=action==='preset'&&choice?gymPresets[Number(choice)]:null;
  if(action==='preset'&&!preset)return;
  draft.items.push({name:'',equipment:'',setCount:1,...preset,repCount:null,unit:'sets',supervised:true});
 }else{
  form.querySelector('.alert').textContent='A session can have up to 20 exercises.';
  return;
 }
 save();render();
 const selector=action==='custom'?'[name="exercise'+(draft.items.length-1)+'"]':'#gym-session-builder [name="preset"]';
 main.querySelector(selector)?.focus();
 if(action==='preset')notify(draft.items.at(-1).name+' added');
}
function saveGymBuilder(form){
 const draft=readGymBuilder(form);
 const title=draft.title.trim();
 if(!title||!draft.items.length||draft.items.some(activity=>!activity.name.trim()||!Number.isInteger(Number(activity.setCount))||Number(activity.setCount)<1||Number(activity.setCount)>12)){
  form.querySelector('.alert').textContent='Name the session and add at least one named exercise with 1 to 12 sets.';
  return;
 }
 const plan={id:newId('gym'),title,category:'Gym',personal:true,audience:playerName,
  items:draft.items.map(activity=>({...activity,name:activity.name.trim(),equipment:activity.equipment.trim(),setCount:Number(activity.setCount)}))};
 state.plans.unshift(plan);
 delete state.gymBuilder;
 save();go(sessionPath(plan,'gym','new'));
}
function saveTrainingLog(form){
 const {id,draft:draftKey,edit}=form.dataset;
 const plan=ownPlans().find(p=>p.id===id),entries=state.drafts[draftKey];
 if(!plan||!entries)return;
 const savedPair=edit&&Object.entries(state.logs).find(([,log])=>log.id===edit&&log.plan===id&&log.player===playerName);
 if(edit&&(!savedPair||state.reviews.some(review=>review.logId===edit)))return;
 const alert=form.querySelector('#session-error');
 for(const input of form.querySelectorAll('[aria-describedby="session-error"]')){
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
 }
 const error=(message,input)=>{
  alert.textContent=message;
  if(input){
   input.setAttribute('aria-invalid','true');
   input.setAttribute('aria-describedby',alert.id);
   input.focus();
  }else alert.focus();
 };
 if(!entries.some(entry=>entry.status))return error('Log a result, mark an activity done or skip it first.');
 for(const [index,entry] of entries.entries()){
  if(entry.status!=='done')continue;
  const unit=plan.items[index].unit;
  if(unit==='sets'){
   const sets=entry.sets??[];
   const missing=sets.findIndex(set=>set?.load&&!set.reps);
   if(!sets.some(set=>Number(set?.reps)>0)||missing>=0){
    const reps=form.querySelector('[data-set-activity="'+index+'"][data-set-index="'+Math.max(missing,0)+'"][data-set-key="reps"]');
    return error('Enter reps for each set where you logged weight.',reps);
   }
  }else if(unit){
   const value=Number(entry.value);
   if(entry.value===''||!Number.isFinite(value)||value<0||(unit==='sec'&&value<=0)){
    return error('Enter a valid result for '+plan.items[index].name+'.',form.querySelector('[data-metric="'+index+'"]'));
   }
  }
 }
 const complete=entries.every((entry,index)=>activityLogStatus(plan.items[index],entry)==='done');
 const status=complete?'done':entries.every(entry=>entry.status==='skipped')?'skipped':'partial';
 const logId=savedPair?savedPair[1].id:newId('log');
 const key=savedPair?savedPair[0]:logId;
 const items=entries.map(entry=>entry.status==='skipped'?{status:'skipped',value:''}:entry);
 state.logs[key]={id:logId,player:playerName,plan:id,status,items,at:savedPair?savedPair[1].at:Date.now()};
 delete state.drafts[draftKey];
 save();
 if(isGym(plan)||plan.category==='Speed')go('results/'+logId);
 else go(sessionPath(plan,sessionOrigin(plan),logId));
 notify('Session saved');
}


const academyPathways={
 tigers:{
  title:'Leicester Tigers',programme:'U15 Junior Academy',
  source:'https://staffsrfu.com/leicester-tigers-junior-academy-u15-nominations-2024-2025/',
  sourceLabel:'Read the 2024/25 nomination guidance',
  intro:'Tigers looks for outstanding potential in one or more areas. The club can discuss current nominations with you.',
  criteria:[
   ['physical','Physical potential','Speed, agility, strength or size can stand out. For coaching, focus on movement and how the player uses it in games.'],
   ['coachability','Coachability','Engage in training, ask questions and put feedback into practice.'],
   ['competitiveness','Competitiveness','Keep working on and off the ball, including when the game is going against you.'],
   ['skill','Outstanding skill','A skill such as passing, kicking, carrying, tackling or breakdown work that makes a difference in matches.']
  ]
 },
 ur7s:{
  title:'UR7s',programme:'National Sevens Academy',
  source:'https://ultimaterugbysevens.com/wp-content/uploads/2025/02/UR7S-Academy-_-Prospectus-2025_26-1.pdf',
  sourceLabel:'Read the 2025/26 UR7s prospectus',
  intro:'UR7s looks at rugby ability and how a player might develop in sevens.',
  criteria:[
   ['technical','Technical ability','Use core rugby skills effectively under pressure.'],
   ['athletic','Athletic ability','Show speed, acceleration, agility and movement in open space.'],
   ['standout','Standout skills','Show an individual skill that makes a difference in sevens.'],
   ['potential','Potential','Show how you can adapt and improve as a sevens player.'],
   ['attitude','Attitude','Be willing to learn, listen to feedback and keep working at it.']
  ]
 }
};
const pathwayCatalog=()=>({...academyPathways,...state.customPathways});
const isPathwayArchived=key=>state.archivedPathways?.[key]===true;
const activePathways=()=>Object.entries(pathwayCatalog()).filter(([key])=>!isPathwayArchived(key));
const isActivePathway=key=>Object.hasOwn(pathwayCatalog(),key)&&!isPathwayArchived(key);
const firstPathway=()=>activePathways()[0]?.[0];
function pathwayMark(key,title){
 const words=title.trim().split(/\s+/);
 const initials=key==='tigers'?'LT':key==='ur7s'?'7s':
  words.length>1?words.slice(0,2).map(word=>Array.from(word)[0]).join(''):Array.from(words[0]).slice(0,2).join('');
 return '<span class="pathway-mark" aria-hidden="true">'+e(initials.toUpperCase())+'</span>';
}
const pathwayStages=['Working on it','Making progress','Showing it regularly'];
const pathwayRecord=(player,key)=>state.pathways?.[player]?.[key]??{};
function savePathwayRecord(player,key,patch){
 const records=(state.pathways??={});
 const playerRecords=(records[player]??={});
 playerRecords[key]={...playerRecords[key],...patch};
 save();
}
function pathwayFeedback(key,record){
 const criteria=pathwayInfo(key).criteria;
 const criterion=criteria.find(([id])=>id===record.feedbackCriterion&&record.progress?.[id])||
  criteria.find(([id])=>record.progress?.[id]?.note)||
  criteria.find(([id])=>record.progress?.[id]?.stage);
 if(!criterion)return null;
 const [id,title]=criterion;
 return {id,title,...record.progress[id]};
}
const pathwayHasProgress=status=>status==='applying'||status==='accepted';
function playerPathwayUpdates(){
 const updates=activePathways().flatMap(([key,pathway])=>{
  const record=pathwayRecord(playerName,key);
  const stage=pathwayStatus(record);
  const statusUpdate=pathwayHasProgress(stage)&&record.statusSeen!==stage;
  const feedback=pathwayFeedback(key,record);
  const feedbackUpdate=feedback&&(record.feedbackSeen??0)<(record.feedbackVersion??1);
  if(!statusUpdate&&!feedbackUpdate)return [];
  return ['<a class="card home-pathway-update" href="#pathways/'+key+'"><span class="icon-tile">'+icon(statusUpdate?'flag':'chat',18)+'</span>'+
   '<span><span class="eyebrow">'+(statusUpdate?'Pathway update':'New coach feedback')+'</span><strong>'+e(pathway.title)+'</strong>'+
   (statusUpdate?pathwayStatusLabel(stage):'')+
   (feedbackUpdate?'<span class="mini">'+e(feedback.title+(feedback.stage?' · '+feedback.stage:''))+'</span>':'')+
   (feedbackUpdate&&feedback.note?'<span class="pathway-note-preview">'+e(feedback.note)+'</span>':'')+'</span>'+icon('arrow',16)+'</a>'];
 });
 return updates.length?'<section class="stack home-pathway-updates" aria-label="New pathway updates">'+updates.join('')+'</section>':'';
}
function kitPathwayBadges(){
 const links=activePathways().flatMap(([key,pathway])=>{
  const record=pathwayRecord(playerName,key),status=pathwayStatus(record);
  if(!status)return [];
  return ['<a class="kit-pathway-badge '+status+'" href="#pathways/'+key+'">'+pathwayMark(key,pathway.title)+
   '<span><strong>'+e(pathway.title)+'</strong>'+pathwayStatusLabel(status)+'</span></a>'];
 });
 return links.length?'<nav class="kit-pathway-badges" aria-label="Your pathways">'+links.join('')+'</nav>':'';
}
function pathwayStatus(record){
 if(record.joinedOn)return 'accepted';
 if(record.applying)return 'applying';
 return record.interested?'interested':'';
}
const pathwayStatusLabels={interested:'Interest sent',applying:'Applying',accepted:'Accepted'};
function pathwayStatusLabel(status){
 return '<span class="pathway-status '+status+'">'+(status==='accepted'?icon('check',13):'')+pathwayStatusLabels[status]+'</span>';
}
function coachPathwayPlace(key,index,record){
 const status=pathwayStatus(record);
 const applying=record.applying;
 const confirmed=status==='accepted';
 return '<form id="pathway-place" class="pathway-place" data-key="'+key+'" data-index="'+index+'">'+
  '<div>'+ (status?pathwayStatusLabel(status):'<p class="mini">No request to be considered</p>')+
  (confirmed?'<p class="mini">Confirmed '+e(dateText(record.joinedOn))+'</p>':'')+'</div>'+
  '<div class="pathway-place-actions">'+
  (confirmed?'':'<button type="submit" name="stage" value="applying" class="'+(applying?'quiet':'secondary')+'">'+
   (applying?'Clear applying status':'Mark as applying')+'</button>')+
  '<button type="submit" name="stage" value="place" class="'+(confirmed?'quiet':'secondary')+'">'+
  (confirmed?'Remove confirmation':'Confirm place')+'</button></div></form>';
}
function coachPathwayCriterion(key,index,[id,title,description],record){
 const update=record.progress?.[id];
 const status=update?.stage||(update?.note?'Feedback added':'Not reviewed');
 return '<details class="fold coach-criterion" name="coach-pathway-criteria" data-criterion="'+id+'"><summary>'+
  '<span>'+e(title)+'<span class="mini criterion-status">'+e(status)+'</span></span></summary>'+
  '<div class="fold-content"><form class="form pathway-criterion-form" data-key="'+key+'" data-index="'+index+'" data-criterion="'+id+'">'+
  (description?'<p class="details">'+e(description)+'</p>':'')+
  '<label>Progress rating<select name="stage">'+opt('',update?.stage??'','Not reviewed')+
  pathwayStages.map(stage=>opt(stage,update?.stage??'')).join('')+'</select></label>'+
  '<label>Comment<textarea placeholder="What went well or what to work on" name="note" rows="2" maxlength="300">'+e(update?.note)+'</textarea></label>'+
  '<button class="primary">Save feedback</button></form></div></details>';
}
const pathwayCanReview=record=>Boolean(pathwayStatus(record));
const pathwayInfo=key=>({...pathwayCatalog()[key],...state.pathwayInfo?.[key]});
function pathwayDates(pathway){
 const dates=pathway.dates??[];
 return dates.length?'<div class="pathway-dates"><h3>Key dates</h3><dl>'+dates.map(({label,date})=>
  '<div><dt>'+e(label)+'</dt><dd><time datetime="'+e(date)+'">'+e(dateText(date))+'</time></dd></div>').join('')+'</dl></div>':'';
}
function pathwayDateFields({label='',date=''}={}){
 return '<fieldset class="pathway-date-fields"><legend>Key date</legend><label>What’s happening?<input name="dateLabel" maxlength="70" required placeholder="e.g. Nominations close" value="'+e(label)+'"></label>'+
  '<label>Date<input name="dateValue" type="date" required value="'+e(date)+'"></label>'+
  '<button type="button" class="quiet" data-pathway-remove-date>Remove date</button></fieldset>';
}
const pathwayDateDrafts=new Map();
const pathwayDetailDrafts=new Map();
const pathwayCriteriaDrafts=new Map();
function pathwayCriterionFields([id,title,description]){
 return '<details class="pathway-criteria-editor" data-criterion-id="'+e(id)+'"><summary>'+e(title||'New criterion')+'</summary><div class="form"><label>Criterion name<input name="criterionTitle" required maxlength="90" value="'+e(title)+'"></label><label>What players see<textarea name="criterionDescription" rows="3" maxlength="600">'+e(description)+'</textarea></label><button type="button" class="quiet" data-pathway-remove-criterion>Remove criterion</button></div></details>';
}
function readPathwayCriteria(form){
 return [...form.querySelectorAll('[data-criterion-id]')].map(row=>[row.dataset.criterionId,row.querySelector('[name=criterionTitle]').value,row.querySelector('[name=criterionDescription]').value]);
}
function readPathwayDates(form){
 const data=new FormData(form),labels=data.getAll('dateLabel');
 return data.getAll('dateValue').map((date,i)=>({label:labels[i],date}));
}
function managePathways(){
 const rows=Object.entries(pathwayCatalog()).map(([key,pathway])=>{
  const archived=isPathwayArchived(key);
  const action=archived?'Restore':'Remove';
  return '<div class="programme-row"><div><strong>'+e(pathway.title)+'</strong>'+
   (archived?'<p class="mini">Removed</p>':'')+'</div>'+
   '<form id="visibility-'+e(key)+'" class="pathway-visibility" data-key="'+e(key)+'">'+
   '<button class="secondary" aria-label="'+e(action+' '+pathway.title)+'">'+action+'</button></form></div>';
 }).join('');
 return (firstPathway()?back('edit-pathways','Back to Pathways'):'')+compactHeader('Manage pathways','flag','coaching-tile')+
  '<section class="section"><h2 class="section-title block-title">Pathways</h2>'+
  '<p class="mini">Removed pathways are hidden from players. You can restore them here.</p>'+
  '<div class="programme-list">'+rows+'</div></section>'+
  '<form class="card section form" id="add-pathway"><h2 class="card-title">Add a pathway</h2>'+
  '<label>Pathway name<input name="title" required maxlength="60"></label>'+
  '<label>Programme name<input name="programme" maxlength="80"></label>'+
  '<label>About this pathway<textarea name="intro" rows="3" maxlength="600"></textarea></label>'+
  '<label>Review criteria (optional, one per line)<textarea name="criteria" rows="3" maxlength="650"></textarea></label>'+
  '<p class="alert" role="alert"></p><button class="primary">Add pathway</button></form>'+foot();
}
function submitPathwayManagement(form){
 if(role!=='coach')return;
 if(form.id==='add-pathway'){
  const data=new FormData(form),value=name=>String(data.get(name)??'').trim();
  const title=value('title'),error=form.querySelector('.alert');
  if(!title){error.textContent='Give the pathway a name.';return;}
  if(Object.values(pathwayCatalog()).some(pathway=>pathway.title.toLowerCase()===title.toLowerCase())){
   error.textContent='A pathway with this name already exists.';
   return;
  }
  const key=newId('pathway');
  const names=[...new Set(value('criteria').split(/\r?\n/).map(line=>line.trim()).filter(Boolean))];
  const criteria=names.map((name,i)=>['criterion-'+(i+1),name,'']);
  (state.customPathways??={})[key]={title,programme:value('programme'),intro:value('intro'),criteria};
  save();
  go('edit-pathways/'+key);
  notify('Pathway added');
  return;
 }
 const key=form.dataset.key;
 if(!Object.hasOwn(pathwayCatalog(),key))return;
 const archived=(state.archivedPathways??={});
 const restoring=isPathwayArchived(key);
 if(restoring)delete archived[key];
 else archived[key]=true;
 save();
 render();
 document.getElementById('visibility-'+key)?.querySelector('button')?.focus({preventScroll:true});
 notify(restoring?'Pathway restored':'Pathway removed');
}
function editPathwayInfo(key,index){
 if(key==='manage'||!firstPathway())return managePathways();
 if(!isActivePathway(key))key=firstPathway();
 const info=pathwayInfo(key), player=Object.keys(roster)[Number(index)];
 const context=player?'/'+Number(index):'';
 const dates=pathwayDateDrafts.get(key)??info.dates??[];
 const details=pathwayDetailDrafts.get(key)??info;
 const criteria=pathwayCriteriaDrafts.get(key)??info.criteria;
 return (player?back('coach-pathways/'+Number(index)+'/'+key,'Back to '+player+'’s pathway'):'')+
  compactHeader('Edit pathways','flag','coaching-tile')+
  '<nav class="actions section pathway-tabs" aria-label="Edit rugby pathways">'+activePathways().map(([id,option])=>
   '<a class="secondary" href="#edit-pathways/'+id+context+'" '+(key===id?'aria-current="page"':'')+'>'+e(option.title)+'</a>').join('')+'</nav>'+
  '<section class="section" aria-labelledby="pathway-editor-title"><div class="pathway-editor-heading">'+
  '<h2 class="card-title" id="pathway-editor-title">'+e(info.title)+'</h2>'+
  '<a class="text-link" href="#edit-pathways/manage">Manage pathways '+icon('arrow',14)+'</a></div>'+
  '<p class="mini">Changes appear on the pathway page for the whole squad.</p>'+
  '<form class="card section form" id="edit-pathway-dates" data-key="'+key+'"><h3 class="activity-name">Key dates</h3>'+
  '<div class="stack" data-pathway-dates>'+dates.map(pathwayDateFields).join('')+'</div>'+
  '<p class="alert" role="alert"></p><div class="pathway-date-actions">'+
  '<button type="button" class="secondary" data-pathway-add-date>'+icon('plus',16)+' Add a date</button>'+
  '<button class="primary">Save dates</button></div></form>'+
  '<form class="card section form" id="edit-pathway-info" data-key="'+key+'"><h3 class="activity-name">Programme details</h3>'+
  '<label>Programme name<input name="programme" maxlength="80" value="'+e(details.programme)+'"></label>'+
  '<label>About this pathway<textarea name="intro" rows="3" maxlength="600">'+e(details.intro)+'</textarea></label>'+
  '<label>Guidance link text<input name="sourceLabel" maxlength="100" value="'+e(details.sourceLabel)+'"></label>'+
  '<label>Guidance URL<input name="source" type="url" maxlength="400" value="'+e(details.source)+'"></label>'+
  '<p class="alert" role="alert"></p><button class="primary">Save pathway details</button></form>'+
  '<form class="card section form" id="edit-pathway-criteria" data-key="'+e(key)+'"><h3 class="activity-name">What they look for</h3><div class="stack" data-pathway-criteria>'+criteria.map(pathwayCriterionFields).join('')+'</div><p class="mini">Removing a criterion hides it. Previous player feedback stays saved.</p><div class="actions"><button type="button" class="secondary" data-pathway-add-criterion>+ Add criterion</button><button class="primary">Save criteria</button></div><p class="alert" role="alert"></p></form></section>'+foot();
}
function submitPathwayCriteria(form){
 const key=form.dataset.key;if(role!=='coach'||!isActivePathway(key))return;
 const criteria=readPathwayCriteria(form).map(([id,title,description])=>[id,title.trim(),description.trim()]);
 if(criteria.some(([,title])=>!title)){form.querySelector('.alert').textContent='Name each criterion before saving.';return;}
 if(new Set(criteria.map(([,title])=>title.toLowerCase())).size!==criteria.length){form.querySelector('.alert').textContent='Give each criterion a different name.';return;}
 const records=(state.pathwayInfo??={});records[key]={...records[key],criteria};pathwayCriteriaDrafts.delete(key);save();form.querySelector('.alert').textContent='';notify('Pathway criteria saved');
}
function submitPathwayDates(form){
 const key=form.dataset.key;
 if(role!=='coach'||!isActivePathway(key))return;
 const dates=readPathwayDates(form).map(({label,date})=>({label:label.trim(),date}));
 const error=form.querySelector('.alert');
 if(dates.some(({label,date})=>!label||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T12:00:00Z')))){
  error.textContent='Give each key date a name and a date.';
  return;
 }
 dates.sort((a,b)=>a.date.localeCompare(b.date));
 const records=(state.pathwayInfo??={});
 records[key]={...records[key],dates};
 pathwayDateDrafts.delete(key);
 save();
 error.textContent='';
 notify('Pathway dates saved');
}
function submitPathwayInfo(form){
 const key=form.dataset.key;
 if(role!=='coach'||!isActivePathway(key))return;
 const data=new FormData(form),value=name=>String(data.get(name)??'').trim();
 const programme=value('programme'),intro=value('intro'),sourceLabel=value('sourceLabel'),source=value('source');
 const error=form.querySelector('.alert');
 if(source&&!/^https?:\/\//i.test(source)){error.textContent='Use a guidance link that starts with https:// or http://.';return;}
 const records=(state.pathwayInfo??={});
 records[key]={...records[key],programme,intro,sourceLabel,source};
 pathwayDetailDrafts.delete(key);
 save();
 error.textContent='';
 notify('Pathway details saved');
}
function pathwayPage(key,coachIndex){
 key=key??firstPathway();
 const coach=coachIndex!==undefined;
 const player=coach?Object.keys(roster)[Number(coachIndex)]:playerName;
 if(!player)return notFound(coach?'desk':'today');
 if(!isActivePathway(key))return (coach?back('player/'+coachIndex,'Back to '+player):'')+
  compactHeader('Pathways','flag','coaching-tile')+
  '<p class="section">This pathway is no longer listed.</p>'+
  (firstPathway()?'<a class="secondary" href="#'+(coach?'coach-pathways/'+coachIndex:'pathways')+'">Browse pathways</a>':'')+foot();
 const route=coach?'coach-pathways/'+coachIndex:'pathways';
 const pathway=pathwayInfo(key),record=pathwayRecord(player,key),canReview=coach&&pathwayCanReview(record);
 const tabs=activePathways().map(([id,option])=>
  '<a class="secondary" href="#'+route+'/'+id+'" '+(key===id?'aria-current="page"':'')+'>'+e(option.title)+'</a>').join('');
 const formAttrs=' data-key="'+key+'"'+(coach?' data-index="'+coachIndex+'"':'');
 const stage=pathwayStatus(record);
 const status=!coach&&pathwayHasProgress(stage)?'<div class="pathway-player-status">'+pathwayStatusLabel(stage)+
  (stage==='accepted'?'<p class="mini">Confirmed '+e(dateText(record.joinedOn))+'</p>':
   '<p class="details">Your coach has marked your application as in progress. Ask them whether it’s been sent and what to do next.</p>')+'</div>':'';
 const interest=coach?coachPathwayPlace(key,coachIndex,record):record.joinedOn||record.applying?'':
  '<form id="pathway-interest" class="form"'+formAttrs+'>'+
  '<button class="'+(record.interested?'secondary':'primary')+'" aria-pressed="'+Boolean(record.interested)+'">'+
  (record.interested?'Withdraw my interest':'I’d like to be considered')+'</button>'+
  (record.interested?'<p class="mini">'+icon('check',15)+' Interest sent to your coach.</p>':'')+'</form>';
 const feedback=coach?null:pathwayFeedback(key,record);
 const feedbackCard=feedback?'<section class="card section pathway-feedback" aria-label="Latest coach feedback"><h2 class="activity-name">Latest coach feedback</h2>'+
  '<p class="mini">'+e(feedback.title)+'</p>'+(feedback.stage?tag(feedback.stage,'good'):'')+
  (feedback.note?'<p class="details">'+e(feedback.note)+'</p>':'')+'</section>':'';
 const rows=pathway.criteria.map(criterion=>{
  if(canReview)return coachPathwayCriterion(key,coachIndex,criterion,record);
  const [id,title,description]=criterion,update=record.progress?.[id];
  return '<article class="card pathway-criterion"><h3 class="activity-name">'+e(title)+'</h3>'+
   (description?'<p class="details">'+e(description)+'</p>':'')+
   (feedback?.id===id?'':
    (update?.stage?tag(update.stage,'good'):'')+(update?.note?'<p class="details">'+e(update.note)+'</p>':''))+'</article>';
 }).join('');
 return (coach?back('player/'+coachIndex,'Back to '+player)+compactHeader('Pathways','flag','coaching-tile',null,player):
  compactHeader('Pathways','flag','coaching-tile'))+
  '<nav class="actions section pathway-tabs" aria-label="Rugby pathways">'+tabs+'</nav>'+
  '<section class="card section"><div class="pathway-identity">'+pathwayMark(key,pathway.title)+
  '<div><h2 class="card-title">'+e(pathway.title)+'</h2>'+
  (pathway.programme?'<p class="mini">'+e(pathway.programme)+'</p>':'')+'</div></div>'+
  (pathway.intro?'<p class="details">'+e(pathway.intro)+'</p>':'')+pathwayDates(pathway)+status+interest+(coach?'<a class="text-link" href="#edit-pathways/'+key+'/'+coachIndex+'">Edit details for the squad '+icon('arrow',14)+'</a>':'')+'</section>'+feedbackCard+
  (rows?'<section class="section"><h2 class="section-title block-title">'+(canReview?'Review pathway criteria':'What they look for')+'</h2>'+
  (canReview?'<p class="mini">Open a criterion to add a progress rating, a comment, or both.</p>':coach?'<p class="mini">You can review these criteria once '+e(player)+' shows interest.</p>':'')+
  '<div class="stack section">'+rows+'</div></section>':'')+
  (pathway.source?'<p class="mini section"><a class="text-link" href="'+e(pathway.source)+'" target="_blank" rel="noopener noreferrer">'+e(pathway.sourceLabel||'Read the guidance')+' '+icon('arrow',14)+'</a></p>':'')+foot();
}
function submitPathway(form,submitter){
 const key=form.dataset.key;
 if(!isActivePathway(key))return;
 if(form.id==='pathway-interest'){
  const record=pathwayRecord(playerName,key);
  if(record.joinedOn||record.applying)return;
  const interested=!record.interested;
  savePathwayRecord(playerName,key,{interested});
  render();main.querySelector('#pathway-interest button')?.focus({preventScroll:true});
  notify(interested?'Interest recorded':'Interest withdrawn');
  return;
 }
 const index=form.dataset.index,player=Object.keys(roster)[Number(index)];
 if(role!=='coach'||!player)return;
 const record=pathwayRecord(player,key);
 if(form.id==='pathway-place'){
  const stage=submitter?.value;
  let message;
  if(stage==='applying'&&!record.joinedOn){
   const applying=!record.applying;
   savePathwayRecord(player,key,{applying,statusSeen:''});
   message=applying?'Marked as applying':'Applying status cleared';
  }else if(stage==='place'){
   const joinedOn=record.joinedOn?'':londonToday();
   savePathwayRecord(player,key,{joinedOn,statusSeen:''});
   message=joinedOn?'Place confirmed':'Confirmation removed';
  }else return;
  render();
  main.querySelector('#pathway-place button[value="'+stage+'"]')?.focus({preventScroll:true});
  notify(message);
  return;
 }
 const criterion=pathwayInfo(key).criteria.find(([id])=>id===form.dataset.criterion);
 if(!criterion||!pathwayCanReview(record))return;
 const [id]=criterion;
 const data=new FormData(form),stage=String(data.get('stage')??''),note=String(data.get('note')??'').trim();
 const observation={stage:pathwayStages.includes(stage)?stage:'',note};
 const previous=record.progress?.[id],progress={...record.progress};
 if(observation.stage||note)progress[id]=observation;
 else delete progress[id];
 const changed=(previous?.stage??'')!==observation.stage||(previous?.note??'')!==note;
 const feedbackUpdate=changed&&progress[id]?{
  feedbackCriterion:id,feedbackVersion:(record.feedbackVersion??(pathwayFeedback(key,record)?1:0))+1
 }:{};
 savePathwayRecord(player,key,{progress,...feedbackUpdate});
 form.closest('details').outerHTML=coachPathwayCriterion(key,index,criterion,pathwayRecord(player,key));
 const summary=main.querySelector('[data-criterion="'+id+'"] > summary');
 summary?.focus({preventScroll:true});
 summary?.scrollIntoView({block:'nearest',behavior:'instant'});
 notify('Pathway feedback saved');
}

function render(focus=false){
 let [name,arg,origin,attempt]=(location.hash.slice(1)||'today').split('/');
 if(['progress','skills'].includes(name)&&arg==='profile'&&skillAspect(origin)){
  history.replaceState(null,'','#'+skillPath(skillAspect(origin),attempt?'today':'profile',attempt));
  return render(focus);
 }
 if(!Object.hasOwn(routes,name))name='today';
 const nextRole=name==='parent'?'parent':['desk','player','coach-pathways','edit-pathways','coach-one','coach-calendar','programmes','pack','coach-fuel','coach-recipe','skill-config','skill-definition','programme-editor','programme-view','session-editor','activity-editor','programme-assign','builder','preview','reviews','review','position-plan','observe'].includes(name)?'coach':'player';
 if(role!==nextRole)clearToast();
 role=nextRole;
 if(name==='edit-pathways'&&arg!=='manage'){
  const lastPathway=isActivePathway(state.coachPathway)?state.coachPathway:firstPathway();
  arg=isActivePathway(arg)?arg:lastPathway??'manage';
  if(isActivePathway(arg)&&state.coachPathway!==arg){
   state.coachPathway=arg;
   save();
  }
 }
 const pathwayRoute='edit-pathways';
 const tabs=role==='coach'?[['desk','users','Squad'],['programmes','clip','Programmes'],['coach-fuel','fuel','Food'],[pathwayRoute,'flag','Pathways'],['skill-config','clip','Setup']]:[];
 const selected=({'coach-pathways':'desk','edit-pathways':pathwayRoute,'coach-one':'desk','coach-calendar':'desk',player:'desk','position-plan':'desk',reviews:'desk',review:'desk',observe:'desk',pack:'programmes','coach-recipe':'coach-fuel','skill-definition':'skill-config','programme-editor':'programmes','programme-view':'programmes','session-editor':'programmes','activity-editor':'programmes','programme-assign':'programmes',builder:'programmes',preview:'programmes'})[name]??name;
 nav.className='tabs';
 nav.hidden=role!=='coach';
 nav.innerHTML=tabs.map(([r,i,l])=>'<a class="tab" '+(r===selected?'aria-current="page" ':'')+'href="#'+r+'">'+icon(i,18)+e(l)+'</a>').join('');
 document.querySelectorAll('[data-role]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.role===role)));
 document.querySelector('.brand').href=role==='coach'?'#desk':role==='parent'?'#parent':'#today';
 let returnLink='';
 if(role==='player'&&!['today','session','results','skill','training-results','one-calendar','recipe','player-programme'].includes(name)){
  if(name==='one-to-one')returnLink=back('coach-feedback','Back to Coach feedback');
  else if(name==='gym-builder')returnLink=back('gym/add','Back to Add a session');
  else if(name==='gym'&&arg==='add')returnLink=back('gym','Back to Sessions');
  else if(name==='field')returnLink=back('skills','Back to Skills');
  else if(name==='profile'&&arg==='edit')returnLink=back('profile','Back to Profile');
  else if(['skills','progress'].includes(name)&&arg==='profile')returnLink=back('profile','Back to Profile');
  else returnLink=back('today','Home');
 }
 main.innerHTML=returnLink+routes[name](arg,origin,attempt);
 const pageTitle=main.querySelector('h1')?.textContent.trim();
 const playerTab=name==='player'?main.querySelector('.coach-player-tabs [aria-current="page"]')?.textContent.trim():'';
 document.title=pageTitle&&name!=='today'?[playerTab,pageTitle,'Corsairs Pathway'].filter(Boolean).join(' | '):'Nottingham Corsairs Pathway';
 if(focus){
  window.scrollTo(0,0);main.focus({preventScroll:true});
  if(name==='profile'&&arg==='target'){
   const target=main.querySelector('#profile-target');
   target?.scrollIntoView({block:'center',behavior:'instant'});
   target?.focus({preventScroll:true});
  }
 }
 if(name==='pathways'){
  const key=arg??firstPathway();
  if(isActivePathway(key)){
   const record=pathwayRecord(playerName,key);
   const version=record.feedbackVersion??1,stage=pathwayStatus(record),seen={};
   if(pathwayFeedback(key,record)&&(record.feedbackSeen??0)<version)seen.feedbackSeen=version;
   if(pathwayHasProgress(stage)&&record.statusSeen!==stage)seen.statusSeen=stage;
   if(Object.keys(seen).length)savePathwayRecord(playerName,key,seen);
  }
 }
 if(name==='profile'&&origin&&!['row','highlight'].includes(arg)){
  const update=findCoachUpdate(origin);
  const target=update?.type==='feedback'?main.querySelector('[data-feedback-id="'+CSS.escape(update.ref)+'"]'):
   update?.type==='profile-skill'?main.querySelector('.profile-metric[data-open-skill="'+CSS.escape(update.skill)+'"]'):null;
  revealCoachUpdate(update,target);
 }
 if(name==='profile'&&arg==='row')restoreSkillRow(origin,'profile');
 if(name==='gym'&&arg==='history'&&attempt){
  const row=main.querySelector('[data-history-log="'+CSS.escape(attempt)+'"]');
  row?.scrollIntoView({block:'center',behavior:'instant'});
  row?.focus({preventScroll:true});
 }
 if(name==='profile'&&arg==='highlight')restoreSkillRow(origin,'profile-highlight');
 if(['progress','skills'].includes(name)){
  if(arg==='row')restoreSkillRow(origin,'skills');
  const fromProfile=arg==='profile'&&origin==='all';
  if(fromProfile||arg==='all'){
   const list=main.querySelector('.skills-matrix');
   list.open=true;
   if(!restoreSkillRow(fromProfile?attempt:origin,fromProfile?'profile-matrix':'matrix')){
    list.scrollIntoView({block:'start',behavior:'instant'});
    list.querySelector('summary').focus({preventScroll:true});
   }
  }
 }
 if(name==='skill'&&attempt){
  const update=findCoachUpdate(attempt);
  if(update?.type==='skill-note'&&update.skill===skillAspect(arg)){
   const note=main.querySelector('[data-skill-note="'+CSS.escape(update.ref)+'"]');
   if(note){
    note.classList.add('coach-update-target');
    if(!update.seen){update.seen=true;save();}
   }
  }
 }
}
function restoreSkillRow(id,source){
 if(!skillAspect(id))return false;
 const row=main.querySelector('[data-skill-id="'+id+'"][data-skill-list="'+source+'"]');
 if(!row)return false;
 row.scrollIntoView({block:'center',behavior:'instant'});
 row.focus({preventScroll:true});
 return true;
}
window.addEventListener('hashchange',()=>render(true));
document.addEventListener('click',ev=>{
 const criterionButton=ev.target.closest('button[data-pathway-add-criterion],button[data-pathway-remove-criterion]');
 if(criterionButton?.form?.id==='edit-pathway-criteria'&&role==='coach'){
  const form=criterionButton.form,container=form.querySelector('[data-pathway-criteria]');
  if(criterionButton.hasAttribute('data-pathway-add-criterion')){
   if(container.children.length>=20){form.querySelector('.alert').textContent='A pathway can have up to 20 criteria.';return;}
   container.insertAdjacentHTML('beforeend',pathwayCriterionFields([newId('criterion'),'','']));const row=container.lastElementChild;row.open=true;row.querySelector('input').focus();
  }else criterionButton.closest('[data-criterion-id]').remove();
  pathwayCriteriaDrafts.set(form.dataset.key,readPathwayCriteria(form));return;
 }
 const removePhoto=ev.target.closest('[data-remove-recipe-photo]');
 if(removePhoto&&role==='coach'){
  const form=removePhoto.form,values=recipeValues(form);values.photo='';recipeDrafts.set(form.dataset.topic+':'+form.dataset.id,values);form.querySelector('[data-recipe-photo]').innerHTML='';form.elements.photoFile.value='';return;
 }
 const removeRecipe=ev.target.closest('[data-delete-recipe]');
 if(removeRecipe&&role==='coach'){
  const topic=removeRecipe.dataset.topic,id=removeRecipe.dataset.deleteRecipe;
  if(!storeRecipes(topic,topicRecipes(topic).filter(recipe=>recipe.id!==id))){notify('Could not save this change. Try again.');return;}
  recipeDrafts.delete(topic+':'+id);go('coach-fuel/'+topic);notify('Recipe removed');return;
 }
 const startBlock=ev.target.closest('[data-start-conditioning]');
 if(startBlock&&role==='player'){
  state.conditioningBlocks??={};
  state.conditioningBlocks[playerName]??=[];
  if(!state.conditioningBlocks[playerName].includes(conditioningBlock.id)){
   state.conditioningBlocks[playerName].push(conditioningBlock.id);
   for(const plan of blockPlans())if(!state.plans.some(existing=>existing.id===plan.id))state.plans.push(plan);
   save();
  }
  go(sessionPath(blockPlans().find(plan=>!completedBlockSession(plan))??blockPlans()[0],'gym','new'));
  return;
 }
 const dateAction=ev.target.closest('button[data-pathway-add-date],button[data-pathway-remove-date]');
 const dateForm=dateAction?.form;
 if(dateForm?.id==='edit-pathway-dates'&&role==='coach'){
  if(dateAction.hasAttribute('data-pathway-add-date')){
   const list=dateForm.querySelector('[data-pathway-dates]');
   list.insertAdjacentHTML('beforeend',pathwayDateFields());
   list.lastElementChild.querySelector('input').focus();
  }else{
   dateForm.querySelector('[data-pathway-add-date]').focus();
   dateAction.closest('fieldset').remove();
  }
  pathwayDateDrafts.set(dateForm.dataset.key,readPathwayDates(dateForm));
  return;
 }
 const skillLink=ev.target.closest('a[data-skill-list]');
 if(skillLink&&ev.button===0&&!ev.metaKey&&!ev.ctrlKey&&!ev.altKey&&!ev.shiftKey){
  const {skillId,skillList}=skillLink.dataset;
  const [listPath]=skillListRoutes[skillList];
  history.replaceState(null,'','#'+listPath+'/'+skillId);
 }
 const a=ev.target.closest('[data-jump]');
 if(a){
  const region=document.getElementById(a.dataset.jump);
  if(!region)return;
  ev.preventDefault();
  region.scrollIntoView({block:'start'});
  (region.querySelector('textarea,input:not([type=hidden]),select')??region).focus({preventScroll:true});
  return;
 }
 const b=ev.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-clear-skill-focus')){
  const name=b.closest('#skill-update').dataset.player;
  delete state.coachSkillFocus[name];save();render();
  const f=main.querySelector('#skill-update');f.closest('details').open=true;f.querySelector('select').focus();notify('Coach focus cleared');return;
 }
 if(b.dataset.reviewAttempt){
  openCoachReview(b.dataset.playerIndex,b.dataset.reviewAttempt);
  return;
 }

 if(b.dataset.trainView){
  trainingView=b.dataset.trainView;
  if(location.hash==='#gym'||location.hash==='#field'){if(location.hash!=='#'+trainingView)go('train');}
  else{render();document.querySelector('[data-train-view="'+trainingView+'"]').focus({preventScroll:true});}
  return;
 }
 if(b.dataset.openSkill){
  go(skillPath(b.dataset.openSkill,location.hash.startsWith('#profile')?'profile':'skills'));return;
 }
 if(b.dataset.suggest){
  const fields=[...document.querySelectorAll('#review-form select[name^="factor"]')];
  if(fields.some(x=>x.value===b.dataset.suggest)){notify('That factor is already selected');return;}
  const field=fields.find(x=>!x.value);
  if(!field){notify('Two factors selected. Change one below to use this suggestion.');return;}
  field.value=b.dataset.suggest;field.dispatchEvent(new Event('change',{bubbles:true}));field.focus();return;
 }
 if(b.dataset.role){if(b.dataset.role!==role)go(b.dataset.role==='coach'?'desk':b.dataset.role==='parent'?'parent':'today');return;}
 if(b.hasAttribute('data-cancel-log')){
  const form=document.querySelector('#session-form');
  const plan=ownPlans().find(p=>p.id===form.dataset.id);
  delete state.drafts[form.dataset.draft];
  save();go(sessionPath(plan,sessionOrigin(plan),form.dataset.edit));return;
 }
 if(b.hasAttribute('data-log-choice')){
  const form=document.querySelector('#session-form'),i=Number(b.dataset.logChoice);
  const entry=state.drafts[form.dataset.draft][i];
  const restoredResult=entry.value!==''||entry.sets?.some(record=>record&&(record.reps!==''||record.load!==''));
  const openGuides=[...document.querySelectorAll('[data-guide][open]')].map(d=>d.dataset.guide);
  entry.status=b.dataset.state===''?(restoredResult?'done':''):entry.status===b.dataset.state?'':b.dataset.state;
  save();render();
  for(const guide of openGuides)document.querySelector('[data-guide="'+guide+'"]').open=true;
  document.querySelector('[data-log-choice="'+i+'"],[data-set-activity="'+i+'"],[data-metric="'+i+'"]')?.focus({preventScroll:true});
  return;
 }
 if(b.dataset.gymAction){updateGymBuilder(b);return;}
 if(b.hasAttribute('data-create')||b.dataset.copy){
  draft=b.dataset.copy?JSON.parse(JSON.stringify(state.plans.find(x=>x.id===b.dataset.copy))):newPlan();
  delete draft.preset;
  if(b.dataset.create==='gym'){draft.category='Gym';draft.items[0].unit='sets';draft.items[0].supervised=true;} draft.when='';delete draft.id;go('builder');return;
 }
 if(b.hasAttribute('data-missing-reps')){
  [...b.form.querySelectorAll('[name^="gym-reps"]')].find(input=>!input.value)?.focus();
  return;
 }
 if(b.hasAttribute('data-add-gym-preset')){
  const choice=b.form.elements.coachPreset.value;
  const preset=choice?gymPresets[Number(choice)]:null;
  if(!preset||!isGym({category:b.form.elements.category.value}))return;
  readBuilder();
  const first=draft.items[0];
  const emptyStarter=draft.items.length===1&&
   ![first.name,first.target,first.cue,first.equipment,first.instructions,first.demoVideo,first.repCount,first.demoPhotos.length].some(Boolean);
  const activity={...newItem(),...preset,unit:'sets',setCount:preset.setCount??2,supervised:true};
  if(emptyStarter)draft.items[0]=activity;
  else draft.items.push(activity);
  render();
  main.querySelector('[name="coachPreset"]').focus();
  notify(preset.name+' added');
  return;
 }
 if(b.hasAttribute('data-add')||b.hasAttribute('data-remove')){
  readBuilder();
  if(b.hasAttribute('data-add')){draft.items.push(newItem());render();document.querySelector('[name="name'+(draft.items.length-1)+'"]').focus();}
  else{draft.items.splice(Number(b.dataset.remove),1);render();
   main.querySelector(isGym(draft)?'[name="coachPreset"]':'[data-other-add]').focus();}
  return;
 }
 if(b.hasAttribute('data-publish')&&draft?.title&&draft.when){
  state.plans.unshift({...draft,id:'plan-'+Date.now().toString(36)});
  draft=null;save();go('programmes');notify('Programme assigned');return;
 }
});
document.addEventListener('input',ev=>{
 const input=ev.target;
 if(input.form?.id==='edit-pathway-criteria'){
  pathwayCriteriaDrafts.set(input.form.dataset.key,readPathwayCriteria(input.form));
  if(input.name==='criterionTitle')input.closest('[data-criterion-id]').querySelector('summary').textContent=input.value||'New criterion';return;
 }
 if(input.form?.id==='edit-recipe'){
  recipeDrafts.set(input.form.dataset.topic+':'+input.form.dataset.id,recipeValues(input.form));return;
 }
 if(input.matches('[data-squad-search]')){
  const query=input.value.trim().toLowerCase();
  const rows=[...main.querySelectorAll('[data-squad-name]')];
  for(const row of rows)row.hidden=!row.dataset.squadName.toLowerCase().includes(query);
  main.querySelector('[data-squad-no-matches]').hidden=rows.some(row=>!row.hidden);
  return;
 }
 if(input.form?.id==='builder'&&input.name.startsWith('gym-reps')){
  input.form.querySelector('[data-missing-reps]').hidden=
   [...input.form.querySelectorAll('[name^="gym-reps"]')].every(field=>field.value);
 }
 if(input.form?.id==='edit-pathway-dates'){
  pathwayDateDrafts.set(input.form.dataset.key,readPathwayDates(input.form));return;
 }
 if(input.form?.id==='edit-pathway-info'){
  pathwayDetailDrafts.set(input.form.dataset.key,Object.fromEntries(new FormData(input.form)));return;
 }
 if(input.form?.id==='edit-food-guide'){
  foodGuideDrafts.set(input.form.dataset.topic,foodEditorValues(input.form));return;
 }
 if(input.form?.id==='gym-session-builder'){readGymBuilder(input.form);save();return;}
 const form=input.form;
 if(form?.id!=='session-form')return;
 const entries=state.drafts[form.dataset.draft];
 if(input.hasAttribute('data-set-activity')){
  const entry=entries[Number(input.dataset.setActivity)],set=Number(input.dataset.setIndex);
  entry.sets??=[];
  entry.sets[set]??={reps:'',load:''};
  entry.sets[set][input.dataset.setKey]=input.value;
  entry.status=entry.sets.some(record=>record&&(record.reps!==''||record.load!==''))?'done':'';
 }else if(input.hasAttribute('data-metric')){
  const entry=entries[Number(input.dataset.metric)];
  entry.value=input.value;
  entry.status=input.value===''?'':'done';
 }else return;
 save();refreshSessionLogCount(form.dataset.id,form.dataset.draft);
});
document.addEventListener('change',ev=>{
 const t=ev.target;
 if(t.form?.id==='edit-recipe'&&t.name==='photoFile'&&role==='coach'){
  const form=t.form,file=t.files[0];if(!file)return;
  const draftKey=form.dataset.topic+':'+form.dataset.id;
  const saveButton=form.querySelector('button.primary');saveButton.disabled=true;form.dataset.photoBusy='1';form.querySelector('.alert').textContent='Preparing photo…';
  prepareRecipePhoto(file).then(photo=>{
   recipeDrafts.set(draftKey,{...recipeValues(form),photo});
   if(form.isConnected){form.querySelector('[data-recipe-photo]').innerHTML='<img class="recipe-photo-preview" src="'+e(photo)+'" alt="Recipe photo preview"><button class="secondary" type="button" data-remove-recipe-photo>Remove photo</button>';form.querySelector('.alert').textContent='';}
  }).catch(()=>{if(form.isConnected)form.querySelector('.alert').textContent='Choose a JPG, PNG or WebP photo under 10 MB.';}).finally(()=>{saveButton.disabled=false;delete form.dataset.photoBusy;});return;
 }
 if(t.form?.id==='builder'&&t.name==='coachPreset')t.form.querySelector('[data-add-gym-preset]').disabled=!t.value;
 if(t.form?.id==='gym-session-builder'&&t.name==='preset')t.form.querySelector('[data-gym-action="preset"]').disabled=!t.value;
 if((t.name==='player'||t.name==='position')&&t.form?.id==='review-form'){
   const form=t.form,log=Object.values(state.logs).find(l=>l.id===form.dataset.id);
   if(t.name==='player')form.elements.position.value='';
   document.querySelector('#position-suggestions').innerHTML=suggestions(form.elements.player?.value??log?.player,form.elements.position.value);
 }
 if(/^unit\d+$/.test(t.name??'')){
   const row=document.querySelector('[data-set-count="'+t.name+'"]');
   row.hidden=t.value!=='sets'; row.querySelector('input').disabled=row.hidden;
   const distance=t.form.querySelector('[data-sprint-distance="'+t.name+'"]');
   distance.hidden=t.value!=='sec';distance.querySelector('input').disabled=distance.hidden;
 }
 if(t.name==='category'&&t.form?.id==='builder'){
   const examples=builderExamples(t.value),gym=isGym({category:t.value});
   const presets=t.form.querySelector('[data-coach-presets]');
   presets.hidden=presets.disabled=!gym;
   t.form.querySelector('[data-other-add]').hidden=gym;
   for(const group of t.form.querySelectorAll('[data-gym-prescription], [data-other-prescription]')){
    group.hidden=group.disabled=group.hasAttribute('data-gym-prescription')!==gym;
   }
   for(const field of t.form.querySelectorAll('[data-example]')){
    field.placeholder='e.g. '+examples[field.dataset.example];
   }
 }
 if(t.hasAttribute('data-result-picker')){
  for(const card of t.closest('.result-panel').querySelectorAll('[data-result-series]')){
   card.hidden=card.dataset.resultSeries!==t.value;
  }
 }
 if(/^factor[12]$/.test(t.name??'')){
   document.querySelector('[data-factor-hint="'+t.name+'"]').textContent=factors[t.value]??'Choose something you observed in training or a match.';
 }
});
document.addEventListener('submit',ev=>{
 const f=ev.target;
 if(f.id==='add-pathway'||f.matches('.pathway-visibility')){ev.preventDefault();submitPathwayManagement(f);return;}
 if(f.id==='edit-pathway-dates'){ev.preventDefault();submitPathwayDates(f);return;}
 if(f.id==='edit-pathway-info'){ev.preventDefault();submitPathwayInfo(f);return;}
 if(f.id==='edit-pathway-criteria'){ev.preventDefault();submitPathwayCriteria(f);return;}
 if(f.matches('#pathway-interest,#pathway-place,.pathway-criterion-form')){
  ev.preventDefault();
  submitPathway(f,ev.submitter);
  return;
 }
 if(f.id==='edit-recipe'){
  ev.preventDefault();if(role!=='coach'||f.dataset.photoBusy)return;
  const topic=foodTopicKey(f.dataset.topic),id=f.dataset.id==='new'?newId('recipe'):f.dataset.id;
  const values=recipeValues(f),lines=text=>text.split(/\r?\n/).map(line=>line.trim()).filter(Boolean).join('\n');
  const recipe={...values,id,name:values.name.trim(),ingredients:lines(values.ingredients),steps:lines(values.steps),allergens:values.allergens.trim(),photo:recipePhoto(values.photo)};
  if(!recipe.name||!recipe.ingredients||!recipe.steps){f.querySelector('.alert').textContent='Add a name, ingredients and steps.';return;}
  const recipes=topicRecipes(topic).filter(item=>item.id!==id);recipes.push(recipe);
  if(!storeRecipes(topic,recipes)){f.querySelector('.alert').textContent='Your browser storage is full. Try a smaller photo or remove an old recipe.';return;}
  recipeDrafts.delete(topic+':'+f.dataset.id);go('coach-fuel/'+topic);notify('Recipe saved');return;
 }
 if(!['builder','assign-pack','edit-food-guide','gym-session-builder','session-form','review-form','position-plan','preferences','target-form','player-focus','one-plan-form','one-feedback-form','skill-update','coach-profile-skills'].includes(f.id))return;
 ev.preventDefault();
 if(f.id==='edit-food-guide'){
  const key=f.dataset.topic,adding=key==='new-topic';
  if(role!=='coach'||(!adding&&foodTopicKey(key)!==key))return;
  const guide=cleanFoodGuide(foodEditorValues(f));
  const custom=adding||key.startsWith('topic-');
  if(!guide.heading||(custom&&!guide.label)||(!guide.tips.length&&!guide.ideas.length)){
   f.querySelector('.alert').textContent='Add a heading and at least one tip or meal idea.';return;
  }
  if(!custom)delete guide.label;
  const savedKey=adding?newId('topic'):key;
  (state.foodGuide??={})[savedKey]=guide;
  foodGuideDrafts.delete(key);
  f.querySelector('.alert').textContent='';
  save();
  if(adding)go('coach-fuel/'+savedKey);
  notify(adding?'Food topic added':'Food guide saved');return;
 }
 if(f.id==='assign-pack'){
  const id=f.dataset.pack,data=new FormData(f),audience=String(data.get('audience')??''),when=String(data.get('when')??'');
  if(role!=='coach'||!Object.hasOwn(trainingPacks,id))return;
  if((audience!=='U14 squad'&&!Object.hasOwn(roster,audience))||!/^\d{4}-\d{2}-\d{2}$/.test(when)||when<londonToday()){
   f.querySelector('.alert').textContent='Choose who to assign it to and a current or future date.';return;
  }
  state.plans.unshift({...structuredClone(trainingPacks[id]),id:newId('plan'),packId:id,audience,when});
  save();go('programmes');notify('Pack assigned');return;
 }
 if(f.id==='coach-profile-skills'){
  const name=f.dataset.player,profile=state.profiles[name];
  if(role!=='coach'||!profile||!Object.hasOwn(roster,name))return;
  const visible=extraProfileSkills(name),added=addedProfileSkills(name);
  const remove=ev.submitter?.name==='removeSkill';
  const skill=remove?ev.submitter.value:String(new FormData(f).get('extraSkill')??'');
  if(!Object.hasOwn(factors,skill)||coreProfileSkills.includes(skill)||profilePositionSkills(name).includes(skill)||(remove?!visible.includes(skill):visible.includes(skill)))return;
  profile.extraSkills=remove?added.filter(item=>item!==skill):[...new Set([...added,skill])];
  if(remove){
   const updates=state.coachUpdates?.[name];
   if(updates)state.coachUpdates[name]=updates.filter(update=>update.seen||update.type!=='profile-skill'||update.skill!==skill);
  }else recordCoachUpdate(name,'profile-skill',skill,skill);
  save();
  f.outerHTML=coachProfileSkills(name);
  const editor=main.querySelector('#coach-profile-skills');
  (editor.querySelector('select')??editor.querySelector('button'))?.focus({preventScroll:true});
  notify(remove?'Removed from profile':'Added to profile');
  return;
 }
 if(f.id==='skill-update'){
  const name=f.dataset.player,data=new FormData(f),skill=String(data.get('skill')),marker=String(data.get('stage')||''),note=String(data.get('note')||'').trim();
  if(!Object.hasOwn(roster,name)||!Object.hasOwn(factors,skill)||!note){f.querySelector('.alert').textContent='Choose a skill and add a note.';return;}
  const now=Date.now(),priority=data.has('priority');
  const record={id:newId('skill-note'),savedAt:now,observedOn:londonToday(),context:'Skill update',body:note,factors:[{aspect:skill,marker}],goodWork:data.has('good')};
  (state.skillNotes[name]??=[]).unshift(record);
  recordCoachUpdate(name,'skill-note',record.id,skill);
  if(priority)state.coachSkillFocus[name]={skill,note,savedAt:now};
  save();render();const next=main.querySelector('#skill-update');next.closest('details').open=true;next.querySelector('select').focus({preventScroll:true});notify('Skill update saved');return;
 }
 if(f.id==='one-plan-form'||f.id==='one-feedback-form'){
  const name=Object.keys(roster)[Number(f.dataset.index)],session=onePlan(name),data=new FormData(f);
  const read=k=>String(data.get(k)??'').trim();
  const error=msg=>{f.querySelector('.alert').textContent=msg;};
  if(!name)return;
  if(f.id==='one-plan-form'){
   const skill=read('skill'),date=read('date'),drills=[0,1].map(i=>({name:read('drill'+i),notes:read('notes'+i)}));
   if(!Object.hasOwn(factors,skill)||!date||drills.some(drill=>!drill.name&&drill.notes))return error('Choose a skill and date, and name any practice ideas you add.');
   const plan={id:session?.id??newId('one'),skill,date,time:read('time'),
    format:read('format')==='call'?'call':'pitch',meeting:read('meeting'),focus:read('session-focus'),
    requestNote:state.oneRequestNotes[name]??session?.requestNote??'',drills:drills.filter(drill=>drill.name)};
   state.oneSessions[name]=[plan,...oneHistory(name).filter(x=>x.id!==plan.id)];
   delete state.oneRequests[name];
   delete state.oneRequestNotes[name];
   save();render(true);notify('1:1 booking saved');return;
  }
  if(!session||session.id!==f.dataset.session)return error('This session is already complete.');
  const body=read('body'),goal=read('goal'),review=read('review'),stage=read('stage');
  if(!body)return error('Add your feedback.');
  if(review&&!goal)return error('Add a next target for the check-in date.');
  const now=Date.now(),id=newId('review');
  state.reviews.unshift({id,player:name,savedAt:now,logId:null,context:'1:1 coaching',observedOn:session.date,body,goal,review,goodWork:data.has('good'),factors:[{aspect:session.skill,marker:stage}]});
  session.reviewId=id;
  recordCoachUpdate(name,'feedback',id);
  save();render(true);notify('Feedback shared in 1:1');return;
 }
 if(f.id==='player-focus'){
  const name=playerName;
  if(onePlan(name)){render(true);return;}
  const value=String(new FormData(f).get('focus')??'');
  if(ev.submitter?.name==='cancel'){
   delete state.oneRequests[name];
   delete state.oneRequestNotes[name];
   delete state.playerFocus[name];
   save();render(true);notify('Request cancelled');return;
  }
  if(!Object.hasOwn(factors,value)){f.querySelector('.alert').textContent='Pick a skill first.';return;}
  state.playerFocus[name]=state.oneRequests[name]=value;
  state.oneRequestNotes[name]=String(new FormData(f).get('requestNote')??'').trim().slice(0,250);
  save();render(true);notify('Sent to coach');return;
 }
 if(f.id==='target-form'){
  const data=new FormData(f),goal=String(data.get('goal')).trim();
  if(!goal){f.querySelector('.alert').textContent='Enter one thing for the player to practise.';return;}
  state.targets[f.dataset.player]={goal,review:String(data.get('review')),savedAt:Date.now()};
  save();
  if(ev.submitter?.value==='squad'){
   go('desk');
  }else render(true);
  notify('Target saved');return;
 }
 if(f.id==='position-plan'||f.id==='preferences'){
  const staff=f.id==='position-plan',p=state.profiles[staff?f.dataset.player:'Eli Morgan'],fd=new FormData(f);
  const shirt=String(fd.get('shirt')??'');
  if(!staff&&shirt&&!playerShirtNumbers.includes(shirt)){
   f.querySelector('.alert').textContent='Choose a shirt number from 1 to 15.';return;
  }
  for(const k of staff?['focus','explore']:['preferred'])p[k]=String(fd.get(k)||'');
  if(staff||shirt)p.shirt=shirt?Number(shirt):'';
  save();
  if(!staff&&location.hash==='#profile/edit'){
   go('profile');notify('Profile saved');return;
  }
  render();
  if(!staff){
   const button=main.querySelector('#preferences button');
   for(let detail=button?.closest('details');detail;detail=detail.parentElement.closest('details'))detail.open=true;
   button?.focus({preventScroll:true});
  }
  notify(staff?'Position plan saved':'Profile saved');return;
 }
 if(f.id==='session-form'){saveTrainingLog(f);return;}
 if(f.id==='gym-session-builder'){saveGymBuilder(f);return;}
 if(f.id==='builder'){
  readBuilder();
  if(!draft.title||draft.items.some(x=>!x.name)){
   document.querySelector('#builder-error').textContent='Fill in the programme name and name each activity.';return;
  }
  if(isGym(draft)&&draft.items.some(x=>!Number.isInteger(x.setCount)||x.setCount<1||x.setCount>6||!Number.isInteger(x.repCount)||x.repCount<1||x.repCount>999)){
   document.querySelector('#builder-error').textContent='Enter Sets and Reps per set for each activity.';return;
  }
  if(!isGym(draft)&&draft.items.some(x=>!x.target)){
   document.querySelector('#builder-error').textContent='Say how much to do for each activity.';return;
  }
  const mediaIssue=draft.items.findIndex(a=>(a.demoVideo&&!mediaUrl(a.demoVideo))||a.demoPhotos.some(p=>!mediaUrl(p.url)||!p.caption));
  if(mediaIssue>=0){document.querySelector('#builder-error').textContent='Activity '+(mediaIssue+1)+': use HTTPS media links and give each photo a caption.';return;}
  go('preview');return;
 }
 const l=Object.values(state.logs).find(x=>x.id===f.dataset.id);
 if(f.dataset.id&&(!l||state.reviews.some(r=>r.logId===l.id)))return;
 const values=new FormData(f), [body,goal,reviewDate]=['body','goal','review'].map(k=>String(values.get(k)??'').trim());
 if(!body||reviewDate&&!goal){
  document.querySelector('#review-error').textContent=body?'Add a next target for the check-in date.':'Add your feedback.';return;
 }
 const observed=[1,2].map(i=>({aspect:String(values.get('factor'+i)||''),marker:String(values.get('marker'+i)||'')}));
 if(observed.some(x=>x.marker&&!x.aspect)||(observed[0].aspect&&observed[0].aspect===observed[1].aspect)){
  document.querySelector('#review-error').textContent='Choose a different area for each observation. A marker needs a focus area.';return;
 }
 if(values.has('good')&&!observed.some(x=>x.aspect)){
  document.querySelector('#review-error').textContent='Choose the skill you want to praise.';return;
 }
 const reviewId=newId('review'),player=l?.player??String(values.get('player'));
 state.reviews.unshift({id:reviewId,savedAt:Date.now(),goodWork:values.has('good'),player,logId:l?.id??null,context:String(values.get('context')??'')||(l?'Session review':''),eventTitle:String(values.get('eventTitle')??'').trim(),position:String(values.get('position')??''),observedOn:String(values.get('observedOn')??''),body,goal,review:reviewDate,factors:observed.filter(x=>x.aspect)});
 recordCoachUpdate(player,'feedback',reviewId);
 save();
 if(f.dataset.playerIndex!==undefined){
  const next=l&&pendingLogs(l.player)[0];
  openCoachReview(f.dataset.playerIndex,next?.id??(l?'done':'pitch'));
 }else if(l)render(true);
 else go('reviews');
 notify('Feedback published');
});
render();
