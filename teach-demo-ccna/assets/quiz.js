/* Shared quiz widget.
   Usage: <div class="quiz" data-domain="3.0" data-answer="b">
            <span class="tag">Objective 3.2.a</span><p class="q">Question</p>
            <label><input type="radio" name="qN" value="a"> option</label> ...
            <div class="explain">Why.</div>
          </div>
   Answers marked immediately. Scores tallied per data-domain into #score if present.
   Progress saved to localStorage under the page's pathname. */
(function(){
  const key='ccna-quiz:'+location.pathname;
  let saved={}; try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
  const quizzes=[...document.querySelectorAll('.quiz')];
  quizzes.forEach((qz,i)=>{
    const name=qz.querySelector('input')?.name||('q'+i);
    qz.dataset.name=name;
    qz.querySelectorAll('input').forEach(inp=>inp.addEventListener('change',()=>grade(qz,inp.value,true)));
    if(saved[name]) grade(qz,saved[name],false);
  });
  function grade(qz,val,persist){
    const ans=qz.dataset.answer; qz.classList.add('answered'); qz.dataset.result=(val===ans)?'1':'0';
    qz.querySelectorAll('label').forEach(l=>{const v=l.querySelector('input').value; l.querySelector('input').checked=(v===val);
      if(v===ans)l.classList.add('correct'); else if(v===val)l.classList.add('wrong');});
    if(persist){saved[qz.dataset.name]=val; try{localStorage.setItem(key,JSON.stringify(saved))}catch(e){}}
    tally();
  }
  function tally(){
    const box=document.getElementById('score'); if(!box)return;
    const by={}; let done=0,right=0;
    quizzes.forEach(qz=>{const d=qz.dataset.domain||'all'; by[d]=by[d]||{n:0,ok:0,done:0}; by[d].n++;
      if(qz.dataset.result!==undefined){by[d].done++;done++; if(qz.dataset.result==='1'){by[d].ok++;right++}}});
    let html='<strong>Answered '+done+'/'+quizzes.length+' &middot; correct '+right+'</strong><table><tr><th>Domain</th><th>Score</th><th></th></tr>';
    Object.keys(by).sort().forEach(d=>{const b=by[d],pct=b.n?Math.round(100*b.ok/b.n):0;
      html+='<tr><td>'+(box.dataset['d'+d.replace('.','_')]||d)+'</td><td>'+b.ok+'/'+b.n+'</td><td style="width:40%"><div class="bar"><i style="width:'+pct+'%"></i></div></td></tr>'});
    html+='</table>';
    if(done===quizzes.length){const weak=Object.keys(by).filter(d=>by[d].ok/by[d].n<0.5);
      html+='<p>'+(weak.length?'Weakest domains: <b>'+weak.map(d=>box.dataset['d'+d.replace('.','_')]||d).join(', ')+'</b>. Tell your teacher this list; it sets your starting point.':'No domain under 50%. Tell your teacher; you can skip early fundamentals.')+'</p>';}
    box.innerHTML=html+'<button class="secondary" onclick="localStorage.removeItem(\''+key+'\');location.reload()">Reset</button>';
  }
  tally();
})();
