'use strict';
(() => {
 const clone=value=>structuredClone(value),positions=Object.keys(positionFactors);
 state.skillConfiguration??={skills:Object.fromEntries(Object.entries(factors).map(([id,description])=>[id,{name:skillName(id),description}])),core:[...coreProfileSkills],positions:clone(positionFactors)};
 const config=()=>state.skillConfiguration;
 const groupDrafts=new Map(),definitionDrafts=new Map(),ratingDrafts=new Map(),openRatings=new Map();
 function applyConfiguration(){
  for(const [id,skill]of Object.entries(config().skills)){factors[id]=skill.description;skillLabels[id]=skill.name;if(!skillRows.has(id))skillRows.set(id,'configured-'+id);}
  coreProfileSkills.splice(0,coreProfileSkills.length,...config().core.filter(id=>Object.hasOwn(factors,id)));
  for(const position of positions)positionFactors[position]=(config().positions[position]??[]).filter(id=>Object.hasOwn(factors,id));
  const grouped=new Set(matrixGroups.flatMap(([,skills])=>skills));const more=Object.keys(config().skills).filter(id=>!grouped.has(id));
  if(more.length)matrixGroups.push(['Club skills',more]);
 }
 applyConfiguration();
 function setupNav(tab){return '<nav class="engine-tabs" aria-label="Skill setup">'+[['core','Core skills'],['positions','Position skills'],['library','Skill library']].map(([id,title])=>'<a href="#skill-config/'+id+'" '+(tab===id?'aria-current="page"':'')+'>'+title+'</a>').join('')+'</nav>';}
 function draftKey(tab,index){return tab==='positions'?'position:'+index:'core';}
 function selection(tab,index){const key=draftKey(tab,index);if(!groupDrafts.has(key))groupDrafts.set(key,[...(tab==='positions'?config().positions[positions[index]]??[]:config().core)]);return groupDrafts.get(key);}
 function setupPage(tab='core',positionIndex='0'){
  if(!['core','positions','library'].includes(tab))tab='core';const index=Math.max(0,Math.min(positions.length-1,Number(positionIndex)||0));
  const head=compactHeader('Club setup','clip','coaching-tile')+setupNav(tab);
  if(tab==='library')return head+'<div class="engine-section-heading"><h2>Skill library</h2><a class="primary" href="#skill-definition/new">+ New skill</a></div><div class="engine-library">'+Object.keys(config().skills).map(id=>'<a class="engine-library-card" href="#skill-definition/'+encodeURIComponent(id)+'"><strong>'+e(skillName(id))+'</strong><span class="details">'+e(factors[id])+'</span><span class="engine-open">Edit skill</span></a>').join('')+'</div>'+foot();
  const selected=selection(tab,index),available=Object.keys(config().skills).filter(id=>!selected.includes(id));
  return head+(tab==='positions'?'<label class="engine-search">Position<select data-skill-position>'+positions.map((p,i)=>opt(String(i),String(index),p)).join('')+'</select></label>':'')+
   '<h2 class="section">'+e(tab==='core'?'Core skills for every player':positions[index]+' skills')+'</h2><form id="skill-group-config" class="form section" data-group="'+tab+'" data-position="'+index+'">'+
   '<ol class="skill-setup-list">'+selected.map((id,i)=>'<li><a href="#skill-definition/'+encodeURIComponent(id)+'/'+tab+'/'+index+'"><strong>'+e(skillName(id))+'</strong><span class="details">Edit name & description</span></a><div class="skill-setup-actions">'+[['up','Move up'],['down','Move down'],['remove','Remove']].map(([action,title])=>'<button type="button" data-skill-group-action="'+action+'" data-index="'+i+'" aria-label="'+e(title+' '+skillName(id))+'" '+((action==='up'&&i===0||action==='down'&&i===selected.length-1)?'disabled':'')+'>'+title+'</button>').join('')+'</div></li>').join('')+'</ol>'+
   (!selected.length?'<p class="engine-empty">No skills selected for this group.</p>':'')+
   '<div class="engine-picker"><label>Add a skill<select name="skill"><option value="">Choose a skill</option>'+available.map(id=>opt(id,'',skillName(id))).join('')+'</select></label><div class="actions"><button type="button" data-skill-group-action="add" disabled>Add to group</button><a class="text-link" href="#skill-definition/new/'+tab+'/'+index+'">+ Create a skill</a></div></div>'+
   '<button class="primary">'+(tab==='core'?'Save core skills':'Save position skills')+'</button><p class="mini">Changes apply to '+(tab==='core'?'every player':e(positions[index])+' profiles')+'. Existing ratings and history stay saved.</p><p class="alert" role="alert"></p></form>'+foot();
 }
 function definitionPage(encoded='new',returnGroup='library',index='0'){
  let id;try{id=decodeURIComponent(encoded);}catch{return notFound('skill-config/library');}
  if(id!=='new'&&!config().skills[id])return notFound('skill-config/library');
  const backRoute='skill-config/'+(['core','positions'].includes(returnGroup)?returnGroup+'/'+index:'library');
  const d=definitionDrafts.get(id)??config().skills[id]??{name:'',description:''};
  return back(backRoute,'Back to skill setup')+compactHeader(id==='new'?'Create skill':'Edit skill','rugby','skills-tile')+'<form id="skill-definition-config" data-id="'+e(id)+'" data-group="'+e(returnGroup)+'" data-position="'+e(index)+'" class="form section"><label>Skill name<input name="name" required maxlength="80" value="'+e(d.name)+'"></label><label>What to look for<textarea name="description" rows="4" maxlength="600">'+e(d.description)+'</textarea></label><p class="mini">The name is shared across player profiles and rating history.</p><button class="primary">Save skill</button><p class="alert" role="alert"></p></form>'+foot();
 }
 function playerSkillHistory(name,skill){return [...playerHistory(name),...(state.skillNotes[name]??[])].filter(r=>r.factors?.some(f=>f.aspect===skill)).sort((a,b)=>(b.observedOn??'').localeCompare(a.observedOn??'')||(b.savedAt??0)-(a.savedAt??0));}
 function ratingRow(name,skill){
  const history=playerSkillHistory(name,skill),scored=latestScoredObservation(history,skill),value=markers.indexOf(markerFor(scored,skill))+1;
  const key=name+':'+skill,d=ratingDrafts.get(key)??{stage:'',note:'',good:false,priority:false,observedOn:londonToday(),context:'Pitch training'};
  return '<details class="profile-rating-row" name="player-skill-rating" data-rating-skill="'+e(skill)+'" '+(openRatings.get(name)===skill?'open':'')+'><summary><span>'+e(skillName(skill))+'</span><span class="profile-rating-score">'+(value?value+'/4 <small>'+e(skillLevels[value-1].label)+'</small>':'Not rated')+'</span></summary><form class="form profile-inline-rating" data-player="'+e(name)+'" data-skill="'+e(skill)+'">'+
   (factors[skill]?'<p class="details">'+e(factors[skill])+'</p>':'')+'<fieldset class="profile-levels"><legend>Rating</legend>'+skillLevels.map((level,i)=>'<label><input type="radio" name="stage" value="'+e(level.key)+'" '+(d.stage===level.key?'checked':'')+'><strong>'+(i+1)+'</strong><span>'+e(level.label)+'</span></label>').join('')+'</fieldset>'+
   '<label>Coach note <span class="mini">Optional with a rating</span><textarea name="note" rows="3" maxlength="480">'+e(d.note)+'</textarea></label><label class="check"><input type="checkbox" name="good" '+(d.good?'checked':'')+'> Good work</label><label class="check"><input type="checkbox" name="priority" '+(d.priority?'checked':'')+'> Make this their focus</label>'+
   '<details><summary>When & where</summary><div class="recipe-meta-fields"><label>Seen in<select name="context">'+['Pitch training','Match','1:1 coaching'].map(c=>opt(c,d.context)).join('')+'</select></label><label>Date<input type="date" name="observedOn" required max="'+londonToday()+'" value="'+e(d.observedOn)+'"></label></div></details>'+
   (state.coachSkillFocus[name]?.skill===skill?'<button type="button" class="secondary" data-clear-profile-focus>Clear current coach focus</button>':'')+
   '<button class="primary">Save & share rating</button><p class="alert" role="alert"></p>'+
   (history.length?'<details><summary>Previous reviews ('+history.length+')</summary><div class="stack">'+history.slice(0,6).map(r=>'<article class="line"><p class="mini">'+e(dateText(r.observedOn??''))+' · '+e(r.context??'')+'</p><strong>'+e(playerMarker(markerFor(r,skill)))+'</strong>'+(r.body?'<p class="details">'+e(r.body)+'</p>':'')+'</article>').join('')+'</div></details>':'')+'</form></details>';
 }
 coachProfileSkillsPage=function(name){
  const group=(title,skills)=>skills.length?'<section class="section"><h2 class="skill-rating-heading">'+e(title)+'</h2><div class="profile-rating-list">'+skills.map(skill=>ratingRow(name,skill)).join('')+'</div></section>':'';
  return '<section aria-labelledby="coach-profile-skills-heading"><div class="engine-section-heading"><h2 id="coach-profile-skills-heading">Rate skills</h2><a class="text-link" href="#skill-config">Club skill setup</a></div>'+group('Core skills',coreProfileSkills)+group((state.profiles[name].focus||'Position')+' skills',profilePositionSkills(name))+group('Additional skills',extraProfileSkills(name))+
   '<details class="fold section"><summary>Additional skills for '+e(name.split(' ')[0])+'</summary><div class="fold-content">'+coachProfileSkills(name)+'</div></details></section>';
 };
 routes['skill-config']=setupPage;routes['skill-definition']=definitionPage;
 const readRating=form=>{const f=new FormData(form);return {stage:String(f.get('stage')??''),note:String(f.get('note')??''),good:f.has('good'),priority:f.has('priority'),observedOn:String(f.get('observedOn')??''),context:String(f.get('context')??'Pitch training')};};
 document.addEventListener('toggle',event=>{const d=event.target;if(d.matches?.('[data-rating-skill]')&&d.open){const form=d.querySelector('form');openRatings.set(form.dataset.player,d.dataset.ratingSkill);}},true);
 document.addEventListener('input',event=>{const form=event.target.form;if(form?.matches('.profile-inline-rating'))ratingDrafts.set(form.dataset.player+':'+form.dataset.skill,readRating(form));if(form?.id==='skill-definition-config')definitionDrafts.set(form.dataset.id,{name:form.elements.name.value,description:form.elements.description.value});});
 document.addEventListener('change',event=>{
  const t=event.target;if(t.matches('[data-skill-position]'))go('skill-config/positions/'+t.value);
  if(t.form?.id==='skill-group-config'&&t.name==='skill')t.form.querySelector('[data-skill-group-action=add]').disabled=!t.value;
 });
 document.addEventListener('click',event=>{const clear=event.target.closest('[data-clear-profile-focus]');if(clear&&role==='coach'){delete state.coachSkillFocus[clear.form.dataset.player];save();render();notify('Coach focus cleared');return;}const b=event.target.closest('[data-skill-group-action]');if(!b||role!=='coach')return;const form=b.form,tab=form.dataset.group,index=Number(form.dataset.position),list=selection(tab,index),i=Number(b.dataset.index);switch(b.dataset.skillGroupAction){case 'add':if(form.elements.skill.value&&!list.includes(form.elements.skill.value))list.push(form.elements.skill.value);break;case 'remove':list.splice(i,1);break;case 'up':if(i>0)[list[i],list[i-1]]=[list[i-1],list[i]];break;case 'down':if(i<list.length-1)[list[i],list[i+1]]=[list[i+1],list[i]];break;}render();});
 document.addEventListener('submit',event=>{
  const form=event.target;
  if(form.id==='coach-profile-skills'){queueMicrotask(()=>render());return;}
  if(!['skill-group-config','skill-definition-config'].includes(form.id)&&!form.matches('.profile-inline-rating'))return;
  event.preventDefault();if(role!=='coach')return;const error=text=>form.querySelector('.alert').textContent=text;
  if(form.id==='skill-group-config'){
   const tab=form.dataset.group,index=Number(form.dataset.position),selected=[...selection(tab,index)],previous=tab==='core'?config().core:config().positions[positions[index]]??[];
   if(tab==='core')config().core=selected;else config().positions[positions[index]]=selected;
   applyConfiguration();for(const name of Object.keys(roster))if(tab==='core'||state.profiles[name].focus===positions[index])for(const skill of selected.filter(id=>!previous.includes(id)))recordCoachUpdate(name,'profile-skill',skill,skill);
   groupDrafts.delete(draftKey(tab,index));save();render();notify('Skill group saved');return;
  }
  if(form.id==='skill-definition-config'){
   const name=form.elements.name.value.trim(),description=form.elements.description.value.trim(),oldId=form.dataset.id;
   if(!name)return error('Name the skill.');if(Object.entries(config().skills).some(([id,s])=>id!==oldId&&s.name.toLowerCase()===name.toLowerCase()))return error('A skill already has that name.');
   const id=oldId==='new'?newId('skill'):oldId;config().skills[id]={name,description};applyConfiguration();definitionDrafts.delete(oldId);
   const group=form.dataset.group,index=Number(form.dataset.position)||0;if(oldId==='new'&&['core','positions'].includes(group))selection(group,index).push(id);
   save();go('skill-config/'+(['core','positions'].includes(group)?group+'/'+index:'library'));notify('Skill saved');return;
  }
  const name=form.dataset.player,skill=form.dataset.skill,d=readRating(form),note=d.note.trim();
  if(!Object.hasOwn(roster,name)||!Object.hasOwn(factors,skill))return;
  if(!markers.includes(d.stage)&&!note)return error('Choose a rating or write a coach note.');
  if(d.priority&&!note)return error('Add a coaching point before making this their focus.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(d.observedOn)||d.observedOn>londonToday())return error('Choose today or an earlier date.');
  const now=Date.now(),record={id:newId('skill-note'),savedAt:now,observedOn:d.observedOn,context:d.context,body:note,factors:[{aspect:skill,marker:markers.includes(d.stage)?d.stage:''}],goodWork:d.good};
  (state.skillNotes[name]??=[]).unshift(record);recordCoachUpdate(name,'skill-note',record.id,skill);if(d.priority)state.coachSkillFocus[name]={skill,note,savedAt:now};ratingDrafts.delete(name+':'+skill);openRatings.set(name,skill);save();render();notify('Rating shared with '+name.split(' ')[0]);
 });
 render();
})();
