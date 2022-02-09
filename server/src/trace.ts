import {IVector, Vector} from "../../common/vector";
import {tilesCollection} from "./tileCollection";
export const steps = [
  {x: -1, y: 0}, {x: 1, y: 0}, {
    x: 0,
    y: 1
  }, {x: 0, y: -1}, {x: -1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1}, {x: 1, y: -1},
]
function iteration(map:Array<Array<number>>, points:Array<{x:number, y:number}>, generation:number){
  const nextPoints: Array<{x:number, y:number}> = [];
  if (!points.length) { return; }
  points.forEach(point=>{
    steps.forEach(step=>{
      const px = point.x+step.x;
      const py = point.y+step.y;
      const row = map[py];
      if (row && row[px]!=null && row[px]>generation){
        row[px] = generation;
        nextPoints.push({x:px, y:py});
      }
    })
  });
  return nextPoints;
}

export function* indexGenerator(map:Array<Array<number>>, points:Array<{x:number, y:number}>, generation:number){
  let gen = generation;
  let nextPoints = points;
  do {
    nextPoints = iteration(map, nextPoints, gen);
    gen+=1;
    yield {generation:gen, points:nextPoints};
  } while (nextPoints.length);
  return {gen};
  //indexGenerator(map, nextPoints, generation+1);
}

export function indexateAsync( map:Array<Array<number>>, points:Array<{x:number, y:number}>, generation:number, onFinish:()=>void, startTime?:number){
  let gen = indexGenerator(map, points, generation);
  let iterationStart = new Date();
  let res:any;

  const chunkLength = 300;
  for (let i=0; i<chunkLength; i++){
    res = gen.next();
    if (res.done){
      break;
    }
  }
  if (res.done){
    //console.log('finished ', (new Date()).valueOf() - startTime.valueOf());
    onFinish();
  }else {
    setTimeout(()=>{
      // console.log('iteration '+ generation.toString(), (new Date()).valueOf() - iterationStart.valueOf());
      indexateAsync( map, res.value.points, res.value.generation, onFinish, startTime);
    }, 0);
  }

  //let startTime = new Date();
  /*setTimeout(()=>{
   let iterationStart = new Date();
   //for (let i=0; i<10; i++){
   const nextPoints = iteration(map, points, generation);
   console.log('iteration '+ generation.toString(), (new Date()).valueOf() - iterationStart.valueOf());
   if (!nextPoints || !nextPoints.length){
   console.log('finished ', (new Date()).valueOf() - startTime.valueOf());
   onFinish();
   return;
   }
   //}
   indexateAsync(map, nextPoints, generation+1, onFinish, startTime);
   }, 0);*/
  //indexate(map, points, generation);
  //console.log('finished ', (new Date()).valueOf() - startTime.valueOf());
  //onFinish();
}

export function tracePath(map:Array<Array<number>>, indexPoint:IVector, destination:IVector, onFinish:(path:Array<Vector>)=>void){

  indexateAsync(map, [indexPoint], 0, ()=>{
   const path = findPath(map, Vector.fromIVector(indexPoint), Vector.fromIVector(destination));
    onFinish(path);
  }, Date.now())
}

export function tracePathes(map:Array<Array<number>>, indexPoint:IVector, destinations:Array<IVector>, onFinish:(pathes:Array<Array<Vector>>)=>void){
  const pathes: Array<Array<Vector>> = [];
  indexateAsync(map, [indexPoint], 0, ()=>{
    destinations.forEach(destination=>{
      const path = findPath(map, Vector.fromIVector(indexPoint), Vector.fromIVector(destination));
      if (path){
        pathes.push(path);
      }
    });
    onFinish(pathes);
  }, Date.now())
}

export function findPath(map:Array<Array<number>>, indexPoint:Vector, destPoint:Vector){
  let path:Array<Vector> = [];
  let currentValue = map[destPoint.y][destPoint.x]
  console.log(destPoint,'-->',currentValue)
  if (currentValue == Number.MAX_SAFE_INTEGER) {
    return null;
  }
  let currentPoint:Vector = destPoint.clone();

  let crashDetector = 1000;
  while (currentValue != 0 && crashDetector>0){
    crashDetector--;
    let nextStep = steps.find(step=>{
    //  console.log('currentPoint',currentPoint)
    //  console.log(Vector.fromIVector(step))
      let point = currentPoint.clone().add(Vector.fromIVector(step));
      //console.log(point,'--- point')
      //console.log((map[point.y][point.x] == currentValue-1),
       // tilesCollection.getTileData(`${point.x}-${point.y}`).occupancyRatio==0)
      let result = (map[point.y][point.x] == currentValue-1) &&
                   (tilesCollection.getTileData(`${point.x}-${point.y}`).occupancyRatio==0)
     // console.log('###',map[point.y][point.x])
      //console.log('result',result)
      if (result){
        console.log('**',map[point.y][point.x])
        currentPoint = point;
        currentValue = map[point.y][point.x];
        console.log("*(*(*(",point)
        path.push(Vector.fromIVector(point));
      }
      return result;
    });

  }
  if (crashDetector<0){
    throw new Error('Infinity cycle');
  }
  return path;
}
