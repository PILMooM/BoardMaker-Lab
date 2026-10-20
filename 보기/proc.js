// 소량 보드게임 제작 사업 콘티 보기: 콘티.js(window.PROC)를 읽어 탭으로 보여 줌. 모양은 theme.css (발표자료와 같은 테마).
// 한눈에 → 공통 제작 공정 → B2C → B2B → B2G → 비교 · 확인할 것
(()=>{
const P=window.PROC;if(!P){document.body.textContent='콘티.js를 찾지 못했습니다.';return;}
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const img=(src,alt)=>{const i=el('img');i.src='그림/'+src;i.alt=alt||'';i.loading='lazy';return i;};
const two=i=>String(i+1).padStart(2,'0');
const FLOW_IDS=['b2c','b2b','b2g'];
document.title=P.title+' · 사업 콘티';

const header=el('header'),head=el('div','head'),h1=el('h1');h1.append(el('small',null,P.kind),document.createTextNode(P.title));
const meta=el('div','meta');for(const t of P.meta||[])meta.append(el('span',null,t));head.append(h1,meta);header.append(head);
const tabs=el('nav','tabs'),tabbar=el('div','tabbar');tabbar.append(tabs);document.body.append(header,tabbar);
const TABS=[['overview','한눈에'],['common','공통 제작 공정'],['b2c','B2C · 자체 게임'],['b2b','B2B · 기업 의뢰'],['b2g','B2G · 기관 의뢰'],['compare','비교']];
const main=el('main'),views=el('div');main.append(views);document.body.append(main);
// 사진 크게 보기: 공정 사진을 누르면 화면 가득 열리고, 아무 데나 한 번 더 누르거나 Esc로 닫힘
const zoom=el('div','zoom'),zimg=el('img'),zcap=el('div','zcap');zoom.hidden=true;zoom.append(zimg,zcap);document.body.append(zoom);
const closeZoom=()=>{zoom.hidden=true;zimg.removeAttribute('src');};
zoom.onclick=closeZoom;addEventListener('keydown',e=>{if(e.key==='Escape'&&!zoom.hidden)closeZoom();});
main.addEventListener('click',e=>{const t=e.target;if(t.tagName==='IMG'&&t.closest('.cpic')){zimg.src=t.src;zimg.alt=t.alt;zcap.textContent=t.alt;zoom.hidden=false;}});
const sections={};for(const [id,name] of TABS){const b=el('button',null,name);b.dataset.tab=id;b.onclick=()=>show(id);tabs.append(b);const s=el('section','view');s.hidden=true;sections[id]=s;views.append(s);}
function show(id){for(const b of tabs.children){b.classList.toggle('on',b.dataset.tab===id);if(b.dataset.tab===id)tabs.scrollTo({left:b.offsetLeft-(tabs.clientWidth-b.offsetWidth)/2});}for(const [k,s] of Object.entries(sections))s.hidden=k!==id;try{history.replaceState(null,'','#'+id);}catch{}scrollTo({top:0});}

// 슬라이드 머리: 작은 이름 → 선 → 굵은 제목 → 설명
function top(s,label,title,sub){s.append(el('div','sec-label',label),el('h2','sec-title',title));if(sub)s.append(el('p','sub',sub));}
const heading=(s,text)=>s.append(el('h2',null,text));
function table(head,rows,cls){const t=el('table',cls);const tr=el('tr');head.forEach(x=>tr.append(el('th',null,x)));t.append(tr);for(const row of rows){const r=el('tr');row.forEach(x=>r.append(el('td',null,x)));t.append(r);}return t;}
// 표를 고객별 세 장의 카드로: head[1..3] = B2C·B2B·B2G, rows = [항목, B2C, B2B, B2G]
function columns(head,rows){const wrap=el('div','cols');
 head.slice(1).forEach((h,j)=>{const f=P.flows[FLOW_IDS[j]];const c=el('div','col');c.style.setProperty('--cc',f.color);c.style.setProperty('--cs',f.soft);c.style.setProperty('--n',rows.length+1);
  const [code,...rest]=h.split(' · ');const hd=el('div','col-head');hd.append(el('strong',null,code),el('span',null,rest.join(' · ')||f.name.split(' · ')[1]||''));c.append(hd);
  for(const r of rows){const it=el('div','item');it.append(el('b',null,r[0]),el('p',null,r[j+1]));c.append(it);}wrap.append(c);});
 return wrap;}

// 1) 한눈에
{const s=sections.overview;top(s,'한눈에',P.titles.overview);
 const hero=el('div','card hero');hero.append(el('p','lead',P.oneLine),el('p','sub',P.summary));hero.lastChild.style.margin='0';s.append(hero);
 heading(s,'세 고객 한눈에');s.append(columns(P.channels.head,P.channels.rows));
 heading(s,'처음 만날 고객은 플레이어, 다음은 기업·기관');const o=el('div','order');
 (P.order||[]).forEach(([step,name,text],i)=>{const c=el('div','card ord'+(i===P.order.length-1?' why':''));c.append(el('small',null,step),el('b',null,name),el('p',null,text));o.append(c);});s.append(o);
 heading(s,'흐름별로 보기');const go=el('div','grid g3');
 for(const id of FLOW_IDS){const f=P.flows[id];const c=el('button','card go');c.style.setProperty('--fc',f.color);c.append(el('strong',null,f.name),el('span',null,f.steps.length+'단계 · '+f.steps[0].name+' → '+f.steps[f.steps.length-1].name));c.onclick=()=>show(id);go.append(c);}
 s.append(go);}

// 2) 공통 제작 공정
{const s=sections.common;top(s,'공통 제작 공정',P.titles.common,'B2C · B2B · B2G 모두 이 다섯 단계를 거칩니다. 다른 점은 "누구의 목적에서 출발하느냐"와 "누가 확인하느냐"입니다.');
 const row=el('div','common');P.common.forEach((st,i)=>{const c=el('div','card cstep');const pic=el('div','cpic');pic.append(img(st.img,st.name));c.append(pic,el('span','ino',two(i)),el('h3',null,st.name),el('p',null,st.text));const o=el('div','box out');o.append(el('b',null,'만드는 것'),document.createTextNode(st.out));c.append(o);row.append(c);});s.append(row);
 heading(s,'수량에 맞춰 생산 방식 고르기');s.append(table(P.qty.head,P.qty.rows,'setup'));
 const n=el('div','card note');n.style.marginTop='16px';n.append(el('h3',null,'생산 능력'),el('p',null,P.capacity));n.lastChild.style.margin='0';s.append(n);}

// 3~5) 흐름별 단계 보드
for(const id of FLOW_IDS){const s=sections[id],f=P.flows[id];s.style.setProperty('--fc',f.color);s.style.setProperty('--fs',f.soft);
 top(s,f.name,f.title,f.intro);
 const line=el('div','flowline');line.style.setProperty('--half',Math.ceil(f.steps.length/2));f.steps.forEach((st,i)=>line.append(el('span','fl',two(i)+' '+st.name)));s.append(line);
 if(f.example){const a=el('a','example',f.example.label+' ↗');a.href=f.example.url;a.target='_blank';s.append(a);}
 const board=el('div','board');
 f.steps.forEach((st,i)=>{const c=el('div','card stage');const t=el('div','top');t.append(el('span','no',two(i)),el('h3',null,st.name));c.append(t);
  const box=(cls,label,text)=>{if(!text)return;const b=el('div','box'+(cls?' '+cls:''));b.append(el('b',null,label),document.createTextNode(text));c.append(b);};
  box('','하는 일',st.doing);box('out','만드는 것',st.out);box('intent','확인할 것',st.check);box('risk','조심할 것',st.risk);board.append(c);});
 s.append(board);}

// 6) 비교 · 확인할 것
{const s=sections.compare;top(s,'비교',P.titles.compare,'세 흐름은 고객·수량·돈을 받는 방식이 다릅니다.');
 s.append(columns(P.compare.head.map((h,i)=>i?P.flows[FLOW_IDS[i-1]].name:h),P.compare.rows));
 }

// 휴대폰에서는 표를 줄마다 카드로 쌓아 보여 주므로, 칸마다 머리글 이름을 달아 둠
for(const t of document.querySelectorAll('main table')){const rows=[...t.rows];const head=[...rows[0].cells].map(x=>x.textContent);t.classList.add('stack');for(const r of rows)[...r.cells].forEach((c,i)=>{if(c.tagName==='TD'&&head[i])c.dataset.label=head[i];});}
show(TABS.some(([k])=>k===location.hash.slice(1))?location.hash.slice(1):'overview');
})();
