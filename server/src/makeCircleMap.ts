export function makeCircleMap(radius:number){
  let d = radius*2 + 1;
  let map = [];
  for (let i = 0; i<d; i++){
    map.push(new Array(d).fill(0));
  }
	map[radius][radius]=1;
  for(let i=1; i<radius; i+=1){
    for(let j=0; j<Math.PI*2; j+=Math.PI/(6*i)){
      map[Math.round(radius+Math.sin(j)*(i))][Math.round(radius+Math.cos(j)*(i))] = 1;
    }
  }
 // console.log(map.map(it=>it.join('')).join('\n'))
  return map;
}