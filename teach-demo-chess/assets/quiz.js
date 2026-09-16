// Multiple-choice quiz widget. Markup:
// <div class="quiz" data-answer="2"><p class="q">Question?</p>
//   <button>Option A</button><button>Option B</button><button>Option C</button>
//   <div class="fb" data-i="0">why wrong</div> ... <div class="fb" data-i="2">why right</div>
// </div>
// data-answer is the zero-based index of the correct button. Feedback divs are optional.
// A <div class="score" data-total="N"></div> anywhere on the page shows running score.
(function(){
  var got=0,tried=0;
  function setup(q){
    var ans=+q.dataset.answer,done=false;
    var btns=q.querySelectorAll('button');
    btns.forEach(function(b,i){b.addEventListener('click',function(){
      if(done)return;done=true;tried++;
      if(i===ans){b.classList.add('correct');got++;}else{b.classList.add('wrong');btns[ans].classList.add('correct');}
      q.querySelectorAll('.fb').forEach(function(f){f.classList.toggle('show',+f.dataset.i===i);});
      var s=document.querySelector('.score');
      if(s)s.textContent='Score: '+got+' / '+tried+(s.dataset.total?' (of '+s.dataset.total+')':'');
    });});
  }
  function init(){document.querySelectorAll('.quiz').forEach(setup);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
