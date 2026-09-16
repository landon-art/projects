// Retrieval quiz widget. Markup:
// <div class="quiz" data-answer="2"><p class="q">...</p><div class="opts"><button>..</button>...</div><p class="fb"></p></div>
// data-answer is the 0-based index of the correct option. Optional data-explain on the .quiz gives feedback text.
// Options are shuffled on load so position gives no clue. A .score element (if present) tallies first-try results.
(function(){
  var total=0,right=0,answered=0;
  function shuffle(parent){var kids=[].slice.call(parent.children);kids.sort(function(){return Math.random()-.5}).forEach(function(k){parent.appendChild(k)})}
  document.querySelectorAll('.quiz').forEach(function(q){
    total++;
    var opts=q.querySelector('.opts'),fb=q.querySelector('.fb'),ans=+q.dataset.answer,tried=false;
    [].forEach.call(opts.children,function(b,i){b.dataset.i=i});
    shuffle(opts);
    opts.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b||q.dataset.done)return;
      var ok=+b.dataset.i===ans;
      b.classList.add(ok?'ok':'bad');
      if(ok){
        q.dataset.done=1;
        if(!tried)right++;
        answered++;
        fb.textContent='✓ '+(q.dataset.explain||'Correct.');
      }else{
        fb.textContent='✗ Not that one. Try again from memory before peeking.';
      }
      tried=true;
      var s=document.querySelector('.score');if(s)s.textContent='First-try score: '+right+' / '+answered+' of '+total;
    });
  });
})();
