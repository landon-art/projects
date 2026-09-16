// Pronunciation via browser speechSynthesis (ja-JP). Usage: <button class="say" data-ja="はじめまして">Listen</button>
(function(){
  function jaVoice(){
    var v=speechSynthesis.getVoices().filter(function(x){return /^ja/i.test(x.lang)});
    return v.find(function(x){return /Kyoko|O-ren|Google/.test(x.name)})||v[0];
  }
  window.sayJa=function(text,rate){
    if(!('speechSynthesis' in window)){alert('No speech support in this browser. Ask your partner!');return}
    speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(text);u.lang='ja-JP';u.rate=rate||0.85;
    var v=jaVoice();if(v)u.voice=v;
    speechSynthesis.speak(u);
  };
  document.addEventListener('click',function(e){
    var b=e.target.closest('button.say');if(!b)return;
    sayJa(b.dataset.ja,parseFloat(b.dataset.rate)||0.85);
  });
  if('speechSynthesis' in window)speechSynthesis.getVoices();
})();
