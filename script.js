const $=id=>document.getElementById(id);
const D={consumption:10,trailerPrice:30,trailerThreshold:55,tripsPerM2:130,helperThreshold:100,helperCost:30,costToro:2.25,costJaponesa:2.25,costSanAgustin:2.35,kmChitre:206,kmLosSantos:210,kmLasTablas:234,kmPedasi:355};
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
 let gc=n(gid[$("grass").value]),km=n(kms[d]),tripSize=Math.max(1,n("tripsPerM2"));
 let trips=Math.max(1,Math.ceil(m/tripSize));
 let litPerTrip=km*Math.max(.1,n("consumption"))/100, liters=litPerTrip*trips, fuel=liters*diesel;
 let trailer=trips*n("trailerPrice");
 let helpers=m>n("helperThreshold")?n("helperCost"):0;
 let grass=m*gc,log=fuel+trailer+helpers,cost=grass+log,unitCost=m?cost/m:0,commercialUnit=commercial(d,m),marginUnit=m?unitCost/(1-margin/100):0,recommendedUnit=Math.max(commercialUnit,marginUnit),sale=m*recommendedUnit,profit=sale-cost,actual=sale?profit/sale*100:0;
 $("grassHint").textContent=money(gc)+"/m² costo de compra";$("recommended").textContent=money(sale);$("recommendedM2").textContent=money(recommendedUnit)+"/m²";$("marginBadge").textContent=actual.toFixed(1)+"% margen";
 [["grassCost",grass],["fuelCost",fuel],["trailerCost",trailer],["helperCostDisplay",helpers],["logistics",log],["realCost",cost],["profit",profit],["breakEven",cost],["unitPrice",recommendedUnit],["unitCost",unitCost],["routeFuel",fuel]].forEach(([id,v])=>{if($(id))$(id).textContent=money(v)});
 $("routeDest").textContent=names[d];$("distance").textContent=km.toFixed(0)+" km/viaje";$("liters").textContent=liters.toFixed(1)+" L";$("tripCount").textContent=trips+(trips===1?" viaje":" viajes");
 $("trailerNotice").className="trailer"+(trips>1||m>n("trailerThreshold")?" on":"");$("trailerNotice").textContent=trips>1?`🚚 ${trips} viajes · ${money(trailer)} en remolques`:(m>n("trailerThreshold")?`🚚 Remolque · ${money(trailer)}`:"✓ 1 viaje con remolque incluido");
 $("helperNotice").textContent=helpers>0?`👷 Ayudantes para descarga · ${money(helpers)}`:"✓ Sin costo adicional de descarga";
 let notes=[];
 notes.push(trips>1?`Son ${trips} viajes porque el pedido supera ${tripSize} m² por viaje. El combustible y remolque se multiplican por ${trips}.`:`El pedido cabe en 1 viaje de hasta ${tripSize} m².`);
 if(helpers>0) notes.push(`Por superar ${n("helperThreshold")} m² se agregan ${money(helpers)} por los 2 trabajadores que bajan la grama.`);
 if(recommendedUnit>commercialUnit+.001) notes.push(`Para alcanzar ${margin}% de margen necesitas ${money(marginUnit)}/m².`);
 $("notice").innerHTML="💡 "+notes.join(" ");
 render(d,m,margin,diesel);
}
function render(d,m,margin,diesel){
 let gc=n(gid[$("grass").value]),km=n(kms[d]),tripSize=Math.max(1,n("tripsPerM2")),trp=n("trailerPrice"),th=n("helperThreshold"),hc=n("helperCost"),cons=n("consumption");
 $("volumeTable").innerHTML=ranges.map(r=>{let q=r.min===1?10:r.min,trips=Math.max(1,Math.ceil(q/tripSize)),fuel=km*Math.max(.1,cons)/100*diesel*trips,helpers=q>th?hc:0,cost=q*gc+fuel+(trips*trp)+helpers,min=cost/q/(1-margin/100),p=Math.max(commercial(d,q),min),cur=m>=r.min&&m<=r.max;return `<div class="vrow ${cur?"current":""}"><span>${r.label} · ${trips} ${trips===1?"viaje":"viajes"}</span><b>${money(p)}/m²</b></div>`}).join("")
}

load();document.querySelectorAll("input,select").forEach(e=>{e.addEventListener("input",()=>{if(D[e.id]!==undefined)save();calc()});e.addEventListener("change",()=>{if(D[e.id]!==undefined)save();calc()})});
$("settingsBtn").onclick=()=>{let s=$("settings"),h=s.hasAttribute("hidden");h?s.removeAttribute("hidden"):s.setAttribute("hidden","");if(h)s.scrollIntoView({behavior:"smooth"})};
$("reset").onclick=()=>{Object.entries(D).forEach(([k,v])=>$(k).value=v);save();calc()};calc();