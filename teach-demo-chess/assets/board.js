// Renders a chess position from a FEN piece-placement string into <div class="board" data-fen="..." data-hl="e4 d4" data-dot="f7">
// Usage: <script src="../assets/board.js"></script>; runs on DOMContentLoaded. Pieces are Unicode glyphs; no dependencies.
(function(){
  var G={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
  function render(el){
    var fen=(el.dataset.fen||'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR').split(' ')[0];
    var hl=(el.dataset.hl||'').split(/\s+/).filter(Boolean);
    var dot=(el.dataset.dot||'').split(/\s+/).filter(Boolean);
    var flip=el.dataset.flip==='1';
    var rows=fen.split('/');var grid=[];
    rows.forEach(function(r){var row=[];for(var i=0;i<r.length;i++){var c=r[i];if(/\d/.test(c)){for(var j=0;j<+c;j++)row.push('');}else row.push(c);}grid.push(row);});
    el.innerHTML='';
    for(var ri=0;ri<8;ri++){for(var fi=0;fi<8;fi++){
      var rr=flip?7-ri:ri, ff=flip?7-fi:fi;
      var sq=document.createElement('div');
      var file='abcdefgh'[ff], rank=8-rr, name=file+rank;
      sq.className='sq '+(((rr+ff)%2===0)?'l':'d');
      if(hl.indexOf(name)>=0)sq.classList.add('hl');
      if(dot.indexOf(name)>=0)sq.classList.add('dot');
      var p=grid[rr][ff];if(p)sq.textContent=G[p];
      if(fi===7){var s=document.createElement('span');s.className='coord rank';s.textContent=rank;sq.appendChild(s);}
      if(ri===7){var f=document.createElement('span');f.className='coord file';f.textContent=file;sq.appendChild(f);}
      el.appendChild(sq);
    }}
  }
  function init(){document.querySelectorAll('.board').forEach(render);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.renderBoards=init;
})();
