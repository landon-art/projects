// Quiz widget. Markup:
// <div class="quiz" data-answer="2"><p class="q">Question?</p>
//   <button>opt 0</button><button>opt 1</button><button>opt 2</button>
//   <p class="fb" data-ok="Why right." data-bad="Why wrong."></p></div>
// Answer index is 0-based. Feedback is immediate; wrong answers stay clickable.
document.querySelectorAll('.quiz').forEach(function(q){
  var ans=parseInt(q.dataset.answer,10), fb=q.querySelector('.fb'), btns=q.querySelectorAll('button');
  btns.forEach(function(b,i){b.addEventListener('click',function(){
    btns.forEach(function(x){x.classList.remove('ok','bad')});
    var ok=i===ans; b.classList.add(ok?'ok':'bad');
    fb.textContent=ok?'✓ '+(fb.dataset.ok||''):'✗ '+(fb.dataset.bad||'');
    fb.className='fb '+(ok?'ok':'bad');
    try{localStorage.setItem('quiz:'+location.pathname+':'+q.dataset.id,ok?'1':'0')}catch(e){}
  })});
});
