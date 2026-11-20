'use strict';
// Programmes own session snapshots; library edits never rewrite assigned work or logs.
(() => {
 const copy=value=>structuredClone(value);
 const categories=['Gym','Speed','Fitness','Skills'];
 const groups=['Lower body','Upper body','Core & balance','Speed & fitness','Rugby skills','Warm-up'];
 const sampleSessions=[...gymTemplates,...Object.entries(trainingPacks).map(([id,p])=>({...p,id,duration:p.duration??20}))];
 state.sessionLibrary??=sampleSessions.map(p=>({...copy(p),id:'library-'+p.id,items:p.items.map(a=>({...newItem(),...a,setCount:a.setCount??2,repCount:a.repCount??8}))}));
 for(const plan of state.plans.filter(p=>!p.personal&&!p.preset&&!p.programmeId)){
  if(!state.sessionLibrary.some(s=>s.sourceId===plan.id))state.sessionLibrary.push({...copy(plan),id:'library-'+plan.id,sourceId:plan.id});
 }
 state.activityLibrary??=gymExerciseGroups.flatMap(([group,items])=>items.map(a=>({...newItem(),...copy(a),id:newId('exercise'),group,unit:'sets',setCount:2,repCount:8,supervised:true})));
 if(!state.activityLibrary.some(a=>a.group==='Speed & fitness'))state.activityLibrary.push(...trainingPacks['speed-starts'].items.map(a=>({...newItem(),...copy(a),id:newId('exercise'),group:a.unit==='sec'?'Speed & fitness':'Warm-up'})));
 state.programmeLibrary??=[{id:'programme-foundations',title:conditioningBlock.title,description:'Five sessions to build movement, speed and confidence.',sessions:conditioningBlock.sessions.map((s,i)=>({...copy(sampleSessions.find(p=>p.id===(s.pack??'gym-bodyweight-01'))??sampleSessions[1]),id:'foundation-session-'+i,title:s.title,category:s.category}))}];
 state.programmeAssignments??=[];
 state.programmeDrafts??={};state.engineSessionDrafts??={};state.exerciseDrafts??={};
 const originalPresets=gymPresets.length;
 const customGroup=['Coach library',[]];gymExerciseGroups.push(customGroup);
 function syncActivities(){customGroup[1]=state.activityLibrary.filter(a=>!gymPresets.slice(0,originalPresets).some(p=>p.name.toLowerCase()===a.name.toLowerCase())&&a.unit==='sets').map(copy);gymPresets.splice(originalPresets,gymPresets.length-originalPresets,...customGroup[1]);}
 syncActivities();
 const labelMetrics=a=>a.unit==='sets'?(a.setCount??2)+' × '+(a.repCount??'–')+' reps':a.unit==='sec'?(a.distanceMetres?a.distanceMetres+' m · ':'')+(a.target||'Time in seconds'):a.target||'Tick off';
 const blankSession=()=>({id:newId('session'),title:'',category:'Gym',duration:20,items:[]});
 const blankActivity=()=>({...newItem(),unit:'sets',setCount:2,repCount:8,rest:60,group:'Lower body',supervised:true});
 function programmeDraft(id){return state.programmeDrafts[id]??=(copy(state.programmeLibrary.find(p=>p.id===id)??{id:newId('programme'),title:'',description:'',sessions:[]}));}
 function sessionDraft(owner,id){const key=owner+':'+id;return state.engineSessionDrafts[key]??=copy((owner==='library'?state.sessionLibrary:programmeDraft(owner).sessions).find(s=>s.id===id)??blankSession());}
 function persist(){save();}
 function nav(tab){return '<nav class="engine-tabs" aria-label="Coaching library">'+[['programmes','Programmes'],['sessions','Sessions'],['activities','Activities']].map(([id,name])=>'<a '+(id===tab?'aria-current="page" ':'')+'href="#programmes/'+id+'">'+name+'</a>').join('')+'</nav>';}
 function library(tab='programmes'){
  if(!['programmes','sessions','activities'].includes(tab))tab='programmes';
  const programmes=tab==='programmes',sessions=tab==='sessions';
  const items=programmes?state.programmeLibrary:sessions?state.sessionLibrary:state.activityLibrary;
  const route=programmes?'programme-editor/new':sessions?'session-editor/library/new':'activity-editor/new';
  return compactHeader('Coaching library','train','gym-tile')+nav(tab)+
   '<div class="engine-section-heading"><div><h2>'+(programmes?'Programmes':sessions?'Session library':'Activity library')+'</h2><p class="details">'+(programmes?'Build a block of sessions, then assign it to your players.':sessions?'Reusable sessions for any programme.': 'Exercises and drills ready to add to a session.')+'</p></div><a class="primary" href="#'+route+'">+ '+(programmes?'New programme':sessions?'New session':'New activity')+'</a></div>'+
   '<label class="engine-search">Find '+(programmes?'a programme':sessions?'a session':'an activity')+'<input type="search" data-engine-search placeholder="Search by name"></label><div class="engine-library">'+items.map(item=>{
    const count=programmes?item.sessions.length:sessions?item.items.length:0;
    const href=programmes?'programme-view/'+item.id:sessions?'session-editor/library/'+item.id:'activity-editor/'+item.id;
    return '<a class="engine-library-card" data-engine-name="'+e(item.title??item.name)+'" href="#'+href+'"><span class="engine-kind">'+e(programmes?count+' sessions':sessions?item.category+' · '+item.duration+' min':item.group)+'</span><strong>'+e(item.title??item.name)+'</strong><span class="details">'+e(programmes?item.description:sessions?count+' activities':labelMetrics(item))+'</span><span class="engine-open">'+(programmes?'Open programme':'Edit')+'</span></a>';
   }).join('')+'</div><p data-engine-no-results hidden>No matches. Try another name.</p>'+foot();
 }
 function programmeEditor(id='new'){
  const p=programmeDraft(id);
  return back('programmes','Back to Programmes')+compactHeader('Build programme','train','gym-tile')+
   '<form id="engine-programme" class="form section" data-id="'+e(id)+'"><label>Programme title<input name="title" required maxlength="80" value="'+e(p.title)+'" placeholder="e.g. Pre-season foundations"></label><label>Goal <span class="mini">Optional</span><textarea name="description" rows="2" maxlength="400" placeholder="What will players work towards?">'+e(p.description)+'</textarea></label></form>'+
   '<section class="section"><div class="engine-section-heading"><h2>Sessions <span class="engine-count">'+p.sessions.length+'</span></h2><a class="secondary" href="#session-editor/'+e(id)+'/new">+ Create session</a></div>'+
   '<div class="engine-picker"><label>Add from session library<select data-engine-session-choice><option value="">Choose a session</option>'+state.sessionLibrary.map(s=>'<option value="'+e(s.id)+'">'+e(s.title)+' · '+e(s.category)+'</option>').join('')+'</select></label><button type="button" data-engine-action="add-session" data-owner="'+e(id)+'" disabled>Add session</button></div>'+
   (p.sessions.length?'<ol class="engine-session-list">'+p.sessions.map((s,i)=>'<li><span class="engine-session-index">'+(i+1)+'</span><div><a class="engine-session-title" href="#session-editor/'+e(id)+'/'+e(s.id)+'">'+e(s.title)+'</a><p class="details">'+e(s.category)+' · '+s.duration+' min · '+s.items.length+' activities</p><details class="engine-row-options"><summary>Options</summary><div class="actions">'+
    [['up','Move up'],['down','Move down'],['copy','Duplicate'],['remove','Remove']].map(([action,name])=>'<button type="button" data-engine-session-action="'+action+'" data-owner="'+e(id)+'" data-index="'+i+'" '+((action==='up'&&i===0||action==='down'&&i===p.sessions.length-1)?'disabled ':'')+'aria-label="'+e(name+' '+s.title)+'">'+name+'</button>').join('')+'</div></details></div><a class="secondary" href="#session-editor/'+e(id)+'/'+e(s.id)+'">Edit</a></li>').join('')+'</ol>':'<div class="engine-empty"><h3>Build your first session</h3><p>Add a session from your library or create one for this programme.</p></div>')+'</section>'+
   '<div class="engine-save"><button class="primary" form="engine-programme" type="submit">Save programme</button></div><p class="alert" role="alert" id="engine-programme-error"></p>'+foot();
 }
 function programmeView(id){
  const p=state.programmeLibrary.find(p=>p.id===id);if(!p)return notFound('programmes');
  const assigned=state.programmeAssignments.filter(a=>a.programmeId===id);
  return back('programmes','Back to Programmes')+compactHeader(p.title,'train','gym-tile',null,p.description)+
   '<div class="engine-toolbar"><a class="primary" href="#programme-assign/'+e(id)+'">Assign programme</a><a class="secondary" href="#programme-editor/'+e(id)+'">Edit programme</a><button type="button" data-engine-action="copy-programme" data-id="'+e(id)+'">Duplicate</button></div>'+
   '<h2 class="section">'+p.sessions.length+' sessions</h2><ol class="engine-session-list">'+p.sessions.map((s,i)=>'<li><span class="engine-session-index">'+(i+1)+'</span><div><h3>'+e(s.title)+'</h3><p class="details">'+e(s.category)+' · '+s.duration+' min</p><details><summary>'+s.items.length+' activities</summary><ul class="food-list">'+s.items.map(a=>'<li>'+e(a.name)+' · '+e(labelMetrics(a))+'</li>').join('')+'</ul></details></div></li>').join('')+'</ol>'+
   (assigned.length?'<section class="section"><h2>Assigned players</h2><div class="engine-library">'+assigned.map(a=>'<article class="card"><strong>'+e(a.player)+'</strong><p>'+assignmentDone(a)+' of '+a.planIds.length+' sessions completed</p><progress max="'+a.planIds.length+'" value="'+assignmentDone(a)+'" aria-label="'+e(a.player+' programme progress')+'"></progress></article>').join('')+'</div><p class="mini">Editing the library keeps these assigned sessions and results unchanged.</p></section>':'')+foot();
 }
 function activityFields(a,i,standalone=false){
  const unit=a.unit??'';
  return '<label>Activity name<input name="name'+i+'" maxlength="70" required value="'+e(a.name)+'"></label><div class="recipe-meta-fields"><label>Group<select name="group'+i+'">'+groups.map(g=>opt(g,a.group??'Lower body')).join('')+'</select></label><label>Log as<select name="metric'+i+'" data-engine-metric="'+i+'">'+[['sets','Sets, reps & kg'],['sec','Time (seconds)'],['','Tick off']].map(([v,l])=>opt(v,unit,l)).join('')+'</select></label></div>'+
   '<div class="recipe-meta-fields" data-engine-sets="'+i+'" '+(unit==='sets'?'':'hidden')+'><label>Sets<input name="setCount'+i+'" type="number" min="1" max="12" value="'+(a.setCount??2)+'" '+(unit==='sets'?'required':'disabled')+'></label><label>Reps per set<input name="repCount'+i+'" type="number" min="1" max="999" value="'+(a.repCount??8)+'" '+(unit==='sets'?'required':'disabled')+'></label></div>'+
   '<label data-engine-distance="'+i+'" '+(unit==='sec'?'':'hidden')+'>Distance (m) <span class="mini">Optional</span><input name="distance'+i+'" type="number" min="0.01" max="10000" step="0.01" value="'+e(a.distanceMetres??'')+'" '+(unit==='sec'?'':'disabled')+'></label>'+
   '<label data-engine-target="'+i+'" '+(unit==='sets'?'hidden':'')+'>Instructions at a glance<input name="target'+i+'" maxlength="100" value="'+e(a.target)+'" placeholder="e.g. 3 runs with full recovery"></label>'+
   '<details class="engine-coaching-details"><summary>Instructions, rest & demo</summary><div class="form"><label>How to do it<textarea name="instructions'+i+'" rows="3" maxlength="1600">'+e(a.instructions)+'</textarea></label><div class="recipe-meta-fields"><label>Rest (seconds)<input name="rest'+i+'" type="number" min="0" max="1800" value="'+e(a.rest??60)+'"></label><label>Equipment<input name="equipment'+i+'" maxlength="160" value="'+e(a.equipment)+'"></label></div><label>Coaching cue<input name="cue'+i+'" maxlength="220" value="'+e(a.cue)+'"></label><label>Demo video link <span class="mini">Optional MP4 or WebM</span><input type="url" name="demoVideo'+i+'" value="'+e(a.demoVideo??'')+'"></label><label class="check"><input name="supervised'+i+'" type="checkbox" '+(a.supervised?'checked':'')+'> Qualified adult supervision required</label></div></details>'+
   (!standalone&&!a.libraryId?'<label class="check"><input name="saveLibrary'+i+'" type="checkbox" '+(a.saveToLibrary!==false?'checked':'')+'> Save to activity library</label>':'');
 }
 function readActivity(form,a,i){
  const f=new FormData(form),get=name=>String(f.get(name+i)??'').trim(),unit=get('metric');
  return {...a,name:get('name'),group:get('group'),unit,setCount:Number(get('setCount'))||a.setCount||2,repCount:Number(get('repCount'))||a.repCount||8,distanceMetres:unit==='sec'?(Number(get('distance'))||null):null,target:get('target'),rest:Number(get('rest'))||0,equipment:get('equipment'),instructions:get('instructions'),cue:get('cue'),demoVideo:get('demoVideo'),supervised:unit==='sets'||f.has('supervised'+i),saveToLibrary:f.has('saveLibrary'+i)};
 }
 function readSession(form){const s=sessionDraft(form.dataset.owner,form.dataset.id);const f=new FormData(form);s.title=String(f.get('title')??'').trim();s.category=String(f.get('category'));s.duration=Number(f.get('duration'))||20;s.items=s.items.map((a,i)=>readActivity(form,a,i));return s;}
 function sessionEditor(owner='library',id='new'){
  const s=sessionDraft(owner,id);
  return back(owner==='library'?'programmes/sessions':'programme-editor/'+owner,owner==='library'?'Back to session library':'Back to programme')+compactHeader('Build session','train','gym-tile')+
   '<form id="engine-session" class="form section" data-owner="'+e(owner)+'" data-id="'+e(id)+'"><section class="card form"><label>Session title<input name="title" required maxlength="80" value="'+e(s.title)+'" placeholder="e.g. Strength foundations"></label><div class="recipe-meta-fields"><label>Session type<select name="category">'+categories.map(c=>opt(c,s.category)).join('')+'</select></label><label>Minutes<input type="number" name="duration" min="1" max="180" required value="'+s.duration+'"></label></div></section>'+
   '<section class="engine-picker"><label>Find an activity<input type="search" data-engine-exercise-search placeholder="Search exercises and drills"></label><label>Activity library<select name="exerciseChoice"><option value="">Choose an activity</option>'+groups.map(g=>'<optgroup label="'+g+'">'+state.activityLibrary.filter(a=>a.group===g).map(a=>'<option value="'+e(a.id)+'">'+e(a.name)+'</option>').join('')+'</optgroup>').join('')+'</select></label><div class="actions"><button type="button" data-engine-action="add-activity" disabled>Add activity</button><button type="button" data-engine-action="new-activity">+ Create activity</button></div></section>'+
   '<h2>Activities <span class="engine-count">'+s.items.length+'</span></h2>'+s.items.map((a,i)=>'<details class="engine-activity" '+(s.openIndex===i?'open':'')+'><summary><span>'+e(a.name||'New activity')+'</span><small>'+e(labelMetrics(a))+'</small></summary><div class="form">'+activityFields(a,i)+'<div class="actions">'+[['up','Move up'],['down','Move down'],['remove','Remove']].map(([action,name])=>'<button type="button" data-engine-activity-action="'+action+'" data-index="'+i+'" '+((action==='up'&&i===0||action==='down'&&i===s.items.length-1)?'disabled ':'')+'aria-label="'+name+' activity '+(i+1)+'">'+name+'</button>').join('')+'</div></div></details>').join('')+
   (!s.items.length?'<div class="engine-empty"><p>Add an activity from the library, or create your own.</p></div>':'')+
   (owner!=='library'?'<label class="check"><input type="checkbox" name="saveSessionLibrary" '+(s.saveToLibrary?'checked':'')+'> Save this session to the library too</label>':'')+
   '<button class="primary">'+(owner==='library'?'Save session':'Save session & return to programme')+'</button><p class="alert" role="alert"></p></form>'+foot();
 }
 function activityEditor(id='new'){
  const a=state.exerciseDrafts[id]??=copy(state.activityLibrary.find(a=>a.id===id)??{...blankActivity(),id:newId('exercise')});
  return back('programmes/activities','Back to activity library')+compactHeader(id==='new'?'New activity':'Edit activity','train','gym-tile')+'<form id="engine-activity" data-id="'+e(id)+'" class="form section">'+activityFields(a,0,true)+'<button class="primary">Save activity</button><p class="alert" role="alert"></p></form>'+foot();
 }
 const completedPlan=(name,id)=>playerLogs(name).some(l=>l.plan===id&&l.status==='done');
 const assignmentDone=a=>a.planIds.filter(id=>completedPlan(a.player,id)).length;
 const activeAssignment=(programmeId,name)=>state.programmeAssignments.find(a=>a.programmeId===programmeId&&a.player===name&&assignmentDone(a)<a.planIds.length);
 function assignPage(id){
  const p=state.programmeLibrary.find(p=>p.id===id);if(!p)return notFound('programmes');
  return back('programme-view/'+id,'Back to programme')+compactHeader('Assign programme','train','gym-tile',null,p.title)+'<form id="engine-assign" class="form section" data-id="'+e(id)+'"><fieldset class="engine-players"><legend>Players</legend><button type="button" data-engine-select-all>Select all available</button>'+Object.keys(roster).map(name=>'<label class="check"><input type="checkbox" name="players" value="'+e(name)+'" '+(activeAssignment(id,name)?'disabled':'')+'><span>'+e(name)+(activeAssignment(id,name)?'<small>Already assigned · '+assignmentDone(activeAssignment(id,name))+' of '+p.sessions.length+' completed</small>':'')+'</span></label>').join('')+'</fieldset><p class="mini" data-engine-selected role="status">0 players selected</p><label>Start date<input type="date" name="when" required value="'+londonToday()+'" min="'+londonToday()+'"></label><button class="primary" disabled>Assign programme</button><p class="alert" role="alert"></p></form>'+foot();
 }
 function playerProgramme(id){
  const a=state.programmeAssignments.find(a=>a.id===id&&a.player===playerName);if(!a)return notFound('gym/programmes');
  const plans=a.planIds.map(id=>state.plans.find(p=>p.id===id)).filter(Boolean),done=assignmentDone(a),next=plans.find(p=>!completedPlan(playerName,p.id));
  return back('gym/programmes','Back to programmes')+compactHeader(a.title,'train','gym-tile')+'<section class="card section engine-player-progress"><p>'+done+' of '+plans.length+' sessions completed</p><progress max="'+plans.length+'" value="'+done+'" aria-label="Programme completion"></progress>'+(next?'<a class="primary" href="#'+sessionPath(next,'gym','new')+'">'+(done?'Continue with session '+(next.programmeStep+1):'Start session 1')+'</a>':'<strong>Programme complete</strong>')+'</section><ol class="engine-session-list">'+plans.map((p,i)=>'<li><span class="engine-session-index">'+(completedPlan(playerName,p.id)?'✓':i+1)+'</span><div><span class="mini">Session '+(i+1)+(completedPlan(playerName,p.id)?' · Completed':'')+'</span><h2>'+e(p.title)+'</h2><p class="details">'+e(p.category)+' · '+p.duration+' min</p><a class="secondary" href="#'+sessionPath(p,'gym','new')+'">'+(completedPlan(playerName,p.id)?'Log again':'Open session')+'</a></div></li>').join('')+'</ol>'+foot();
 }
 const oldGym=routes.gym,oldToday=routes.today,oldResults=routes.results;
 routes.programmes=library;routes['programme-editor']=programmeEditor;routes['programme-view']=programmeView;routes['session-editor']=sessionEditor;routes['activity-editor']=activityEditor;routes['programme-assign']=assignPage;routes['player-programme']=playerProgramme;
 routes.gym=(tab,...args)=>{
  if(tab!=='programmes')return oldGym(tab,...args);
  const assigned=state.programmeAssignments.filter(a=>a.player===playerName);
  if(!assigned.length)return oldGym(tab,...args);
  return compactHeader('Strength & conditioning','train','gym-tile')+trainingTabs('programmes')+
   '<section class="section"><h2>Your assigned programmes</h2><div class="engine-library">'+assigned.map(a=>'<a class="engine-library-card" href="#player-programme/'+e(a.id)+'"><strong>'+e(a.title)+'</strong><span>'+assignmentDone(a)+' of '+a.planIds.length+' sessions completed</span><progress max="'+a.planIds.length+'" value="'+assignmentDone(a)+'" aria-label="'+e(a.title+' progress')+'"></progress></a>').join('')+'</div></section>'+fold('Explore the foundations block',conditioningProgramme(),'section')+foot();
 };
 routes.today=()=>{const cards=state.programmeAssignments.filter(a=>a.player===playerName&&assignmentDone(a)<a.planIds.length).map(a=>'<a class="home-target" href="#player-programme/'+e(a.id)+'"><span class="icon-tile">'+icon('train',18)+'</span><span class="home-target-copy"><strong>Your programme</strong><span>'+e(a.title)+'</span><small>'+assignmentDone(a)+' of '+a.planIds.length+' sessions completed</small></span>'+icon('arrow',16)+'</a>').join('');return oldToday().replace('<nav class="section today-tiles"',cards+'<nav class="section today-tiles"');};
 routes.results=(logId,...args)=>{const html=oldResults(logId,...args),log=playerLogs(playerName).find(l=>l.id===logId),plan=state.plans.find(p=>p.id===log?.plan),assignment=state.programmeAssignments.find(a=>a.id===plan?.programmeAssignment);return assignment?html.replace(foot(),'<section class="card section"><h2>Programme progress</h2><p>'+assignmentDone(assignment)+' of '+assignment.planIds.length+' sessions completed</p><a class="primary" href="#player-programme/'+e(assignment.id)+'">Continue programme</a></section>'+foot()):html;};
 function alertForm(form,message){const alert=form.querySelector('.alert')??document.getElementById('engine-programme-error');alert.textContent=message;alert.focus?.();}
 document.addEventListener('input',event=>{
  const t=event.target,form=t.form;
  if(t.matches('[data-engine-search]')){const q=t.value.toLowerCase();const cards=[...main.querySelectorAll('[data-engine-name]')];cards.forEach(c=>c.hidden=!c.dataset.engineName.toLowerCase().includes(q));main.querySelector('[data-engine-no-results]').hidden=cards.some(c=>!c.hidden);return;}
  if(form?.id==='engine-programme'){const p=programmeDraft(form.dataset.id);p.title=form.elements.title.value;p.description=form.elements.description.value;persist();}
  if(form?.id==='engine-session'){
   if(t.matches('[data-engine-exercise-search]')){const q=t.value.toLowerCase();for(const option of form.elements.exerciseChoice.options)option.hidden=Boolean(option.value)&&!option.text.toLowerCase().includes(q);return;}
   const s=readSession(form);s.saveToLibrary=form.elements.saveSessionLibrary?.checked??false;
   const item=t.closest('.engine-activity');if(item){const index=[...form.querySelectorAll('.engine-activity')].indexOf(item),a=s.items[index];item.querySelector('summary > span').textContent=a.name||'New activity';item.querySelector('summary > small').textContent=labelMetrics(a);}persist();
  }
  if(form?.id==='engine-activity'){state.exerciseDrafts[form.dataset.id]=readActivity(form,state.exerciseDrafts[form.dataset.id],0);persist();}
 });
 document.addEventListener('change',event=>{
  const t=event.target,form=t.form;
  if(t.matches('[data-engine-session-choice]'))main.querySelector('[data-engine-action=add-session]').disabled=!t.value;
  if(form?.id==='engine-session'&&t.name==='exerciseChoice')form.querySelector('[data-engine-action=add-activity]').disabled=!t.value;
  if(t.matches('[data-engine-metric]')){const i=t.dataset.engineMetric,unit=t.value;form.querySelector('[data-engine-sets="'+i+'"]').hidden=unit!=='sets';form.querySelectorAll('[data-engine-sets="'+i+'"] input').forEach(input=>{input.disabled=unit!=='sets';input.required=unit==='sets';});const distance=form.querySelector('[data-engine-distance="'+i+'"]');distance.hidden=unit!=='sec';distance.querySelector('input').disabled=unit!=='sec';form.querySelector('[data-engine-target="'+i+'"]').hidden=unit==='sets';}
  if(form?.id==='engine-assign'){const count=form.querySelectorAll('[name=players]:checked').length;form.querySelector('[data-engine-selected]').textContent=count+' '+(count===1?'player':'players')+' selected';form.querySelector('.primary').disabled=!count;}
 });
 document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||role!=='coach')return;
  const action=button.dataset.engineAction;
  if(action==='add-session'){const p=programmeDraft(button.dataset.owner),source=state.sessionLibrary.find(s=>s.id===main.querySelector('[data-engine-session-choice]').value);if(!source||p.sessions.length>=40)return;p.sessions.push({...copy(source),id:newId('session'),sourceId:source.id});persist();render();notify('Session added');}
  if(action==='copy-programme'){const original=state.programmeLibrary.find(p=>p.id===button.dataset.id);if(!original)return;const p={...copy(original),id:newId('programme'),title:original.title+' copy',sessions:original.sessions.map(s=>({...copy(s),id:newId('session')}))};state.programmeLibrary.push(p);persist();go('programme-editor/'+p.id);}
  if(button.dataset.engineSessionAction){const p=programmeDraft(button.dataset.owner),i=Number(button.dataset.index),action=button.dataset.engineSessionAction;if(action==='remove')p.sessions.splice(i,1);if(action==='copy')p.sessions.splice(i+1,0,{...copy(p.sessions[i]),id:newId('session'),title:p.sessions[i].title+' copy'});if(action==='up'&&i>0)[p.sessions[i-1],p.sessions[i]]=[p.sessions[i],p.sessions[i-1]];if(action==='down'&&i<p.sessions.length-1)[p.sessions[i+1],p.sessions[i]]=[p.sessions[i],p.sessions[i+1]];persist();render();}
  if(action==='add-activity'||action==='new-activity'){const form=button.form,s=readSession(form);if(s.items.length>=20)return;const source=state.activityLibrary.find(a=>a.id===form.elements.exerciseChoice.value);if(action==='add-activity'&&!source)return;s.items.push(action==='new-activity'?blankActivity():{...copy(source),libraryId:source.id,saveToLibrary:false});s.openIndex=s.items.length-1;persist();render();main.querySelectorAll('.engine-activity')[s.openIndex]?.scrollIntoView({block:'start'});}
  if(button.dataset.engineActivityAction){const form=button.form,s=readSession(form),i=Number(button.dataset.index),action=button.dataset.engineActivityAction;if(action==='remove')s.items.splice(i,1);if(action==='up'&&i>0)[s.items[i-1],s.items[i]]=[s.items[i],s.items[i-1]];if(action==='down'&&i<s.items.length-1)[s.items[i+1],s.items[i]]=[s.items[i],s.items[i+1]];persist();render();}
  if(button.hasAttribute('data-engine-select-all')){button.form.querySelectorAll('[name=players]:not(:disabled)').forEach(input=>input.checked=true);button.form.querySelector('[name=players]')?.dispatchEvent(new Event('change',{bubbles:true}));}
 });
 document.addEventListener('submit',event=>{
  const form=event.target;if(!['engine-programme','engine-session','engine-activity','engine-assign'].includes(form.id))return;event.preventDefault();if(role!=='coach')return;
  if(form.id==='engine-programme'){const p=programmeDraft(form.dataset.id);p.title=form.elements.title.value.trim();p.description=form.elements.description.value.trim();if(!p.title||!p.sessions.length){alertForm(form,'Give your programme a title and add at least one session.');return;}const index=state.programmeLibrary.findIndex(item=>item.id===p.id);if(index<0)state.programmeLibrary.push(copy(p));else state.programmeLibrary[index]=copy(p);delete state.programmeDrafts[form.dataset.id];persist();go('programme-view/'+p.id);notify('Programme saved');}
  if(form.id==='engine-session'){const s=readSession(form);s.saveToLibrary=form.elements.saveSessionLibrary?.checked??false;if(!s.title||!s.items.length||s.items.some(a=>!a.name)){alertForm(form,'Name the session and add at least one named activity.');return;}
   for(const a of s.items){if(a.demoVideo&&!/^https:\/\//i.test(a.demoVideo)){alertForm(form,'Use an HTTPS demo link.');return;}}
   for(const a of s.items)if(a.saveToLibrary&&!a.libraryId){const existing=state.activityLibrary.find(item=>item.name.toLowerCase()===a.name.toLowerCase());if(existing)a.libraryId=existing.id;else{const lib={...copy(a),id:newId('exercise')};delete lib.saveToLibrary;state.activityLibrary.push(lib);a.libraryId=lib.id;}}
   if(form.dataset.owner==='library'||s.saveToLibrary){const targetId=form.dataset.owner==='library'?s.id:newId('library-session');const index=state.sessionLibrary.findIndex(item=>item.id===targetId);const lib={...copy(s),id:targetId};if(index<0)state.sessionLibrary.push(lib);else state.sessionLibrary[index]=lib;}
   if(form.dataset.owner!=='library'){const p=programmeDraft(form.dataset.owner),index=p.sessions.findIndex(item=>item.id===s.id);if(index<0)p.sessions.push(copy(s));else p.sessions[index]=copy(s);}
   delete state.engineSessionDrafts[form.dataset.owner+':'+form.dataset.id];syncActivities();persist();go(form.dataset.owner==='library'?'programmes/sessions':'programme-editor/'+form.dataset.owner);notify('Session saved');
  }
  if(form.id==='engine-activity'){const a=readActivity(form,state.exerciseDrafts[form.dataset.id],0);if(!a.name){alertForm(form,'Name the activity.');return;}const index=state.activityLibrary.findIndex(item=>item.id===a.id);if(index<0)state.activityLibrary.push(copy(a));else state.activityLibrary[index]=copy(a);delete state.exerciseDrafts[form.dataset.id];syncActivities();persist();go('programmes/activities');notify('Activity saved');}
  if(form.id==='engine-assign'){const p=state.programmeLibrary.find(p=>p.id===form.dataset.id),data=new FormData(form),players=data.getAll('players').filter(name=>Object.hasOwn(roster,name)&&!activeAssignment(p.id,name)),when=String(data.get('when'));if(!players.length||!/^\d{4}-\d{2}-\d{2}$/.test(when)||when<londonToday()){alertForm(form,'Choose players and a current or future start date.');return;}
   for(const name of players){const assignment={id:newId('assignment'),programmeId:p.id,title:p.title,player:name,when,assignedAt:Date.now(),planIds:[]};p.sessions.forEach((s,i)=>{const plan={...copy(s),id:newId('plan'),preset:false,personal:false,audience:name,when,programmeId:p.id,programmeTitle:p.title,programmeStep:i,programmeAssignment:assignment.id};assignment.planIds.push(plan.id);state.plans.push(plan);});state.programmeAssignments.push(assignment);}persist();go('programme-view/'+p.id);notify('Programme assigned to '+players.length+' '+(players.length===1?'player':'players'));}
 });
 render();
})();
