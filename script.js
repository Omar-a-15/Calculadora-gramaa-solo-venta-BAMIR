const $=id=>document.getElementById(id);
const D={consumption:10,trailerPrice:30,trailerThreshold:55,costToro:2.25,costJaponesa:2.25,costSanAgustin:2.35,kmChitre:206,kmLosSantos:210,kmLasTablas:234,kmPedasi:355};
const names={chitre:"Chitré",lossantos:"Los Santos",lastablas:"Las Tablas",pedasi:"Pedasí"},kms={chitre:"kmChitre",lossantos:"kmLosSantos",lastablas:"kmLasTablas",pedasi:"kmPedasi"};
const ranges=[{min:1,max:19,label:"1–19 m²"},{min:20,max:40,label:"20–40 m²"},{min:41,max:60,label:"41–60 m²"},{min:61,max:75,label:"61–75 m²"},{min:76,max:100,label:"76–100 m²"},{min:101,max:Infinity,label:"101+ m²"}];
const base={chitre:[4.30,4.05,3.95,3.80,3.65,3.50],lossantos:[4.30,4.05,3.95,3.80,3.65,3.50],lastablas:[4.55,4.30,4.20,4.05,3.90,3.75],pedasi:[4.80,4.55,4.45,4.30,4.15,4.00]};
const gid={toro:"costToro",japonesa:"costJaponesa",sanagustin:"costSanAgustin"};
function n(id){let x=parseFloat($(id).value);return Number.isFinite(x)?x:0}
function money(x){return new Intl.NumberFormat("es-PA",{style:"currency",currency:"USD"}).format(x||0)}
function idx(m){return ranges.findIndex(r=>m>=r.min&&m<=r.max)}
function commercial(d,m){let i=idx(m);return base[d][i<0?5:i]}
function save(){let x={};Object.keys(D).forEach(k=>x[k]=n(k));localStorage.setItem("bamir-venta",JSON.stringify(x))}
function load(){try{let x=JSON.parse(localStorage.getItem("bamir-venta"));if(x)Object.keys(D).forEach(k=>{if(x[k]!=null)$(k).value=x[k]})}catch(e){}}
function calc(){
 let m=Math.max(0,n("m2")),d=$("destination").value,diesel=n("diesel"),margin=Math.min(80,Math.max(0,n("margin")));
 let gc=n(gid[$("grass").value]),km=n(kms[d]),lit=km*Math.max(.1,n("consumption"))/100,fuel=lit*diesel,tr=m>n("trailerThreshold")?n("trailerPrice"):0;
 let grass=m*gc,log=fuel+tr,cost=grass+log,unitCost=m?cost/m:0,commercialUnit=commercial(d,m),marginUnit=m?unitCost/(1-margin/100):0,recommendedUnit=Math.max(commercialUnit,marginUnit),sale=m*recommendedUnit,profit=sale-cost,actual=sale?profit/sale*100:0;
 $("grassHint").textContent=money(gc)+"/m² costo de compra";$("recommended").textContent=money(sale);$("recommendedM2").textContent=money(recommendedUnit)+"/m²";$("marginBadge").textContent=actual.toFixed(1)+"% margen";
 [["grassCost",grass],["fuelCost",fuel],["trailerCost",tr],["logistics",log],["realCost",cost],["profit",profit],["breakEven",cost],["unitPrice",recommendedUnit],["unitCost",unitCost],["routeFuel",fuel]].forEach(([id,v])=>$(id).textContent=money(v));
 $("routeDest").textContent=names[d];$("distance").textContent=km.toFixed(0)+" km";$("liters").textContent=lit.toFixed(1)+" L";
 $("trailerNotice").className="trailer"+(tr?" on":"");$("trailerNotice").textContent=tr?"🚚 Remolque requerido · "+money(tr):"✓ Sin remolque";
 $("notice").innerHTML="💡 "+(recommendedUnit>commercialUnit+.001?`Para alcanzar ${margin}% de margen necesitas ${money(marginUnit)}/m². La calculadora usa ese precio.`:`La tabla comercial de ${money(commercialUnit)}/m² ya cubre el margen objetivo.`);
 render(d,m,margin,diesel);
}
function render(d,m,margin,diesel){
 let gc=n(gid[$("grass").value]),km=n(kms[d]),fuel=km*Math.max(.1,n("consumption"))/100*diesel,trp=n("trailerPrice"),th=n("trailerThreshold");
 $("volumeTable").innerHTML=ranges.map(r=>{let q=r.min===1?10:r.min, cost=q*gc+fuel+(q>th?trp:0), min=cost/q/(1-margin/100), p=Math.max(commercial(d,q),min),cur=m>=r.min&&m<=r.max;return `<div class="vrow ${cur?"current":""}"><span>${r.label}</span><b>${money(p)}/m²</b></div>`}).join("")
}
load();document.querySelectorAll("input,select").forEach(e=>{e.addEventListener("input",()=>{if(D[e.id]!==undefined)save();calc()});e.addEventListener("change",()=>{if(D[e.id]!==undefined)save();calc()})});
$("settingsBtn").onclick=()=>{let s=$("settings"),h=s.hasAttribute("hidden");h?s.removeAttribute("hidden"):s.setAttribute("hidden","");if(h)s.scrollIntoView({behavior:"smooth"})};
$("reset").onclick=()=>{Object.entries(D).forEach(([k,v])=>$(k).value=v);save();calc()};calc();