class SoundManagerClass{
  private baseURL = `./public/sounds/`;
  private cache = new Map<string, Blob>();
  private soundList:Array<string> = [
    'yes-sir',
    //'like-the-wind',
   // 'yes-commander',
    'attacking',
    // 'give-me-a-job',
    // 'give-me-a-target',
    // 'command-received',

  ];
  volume: number = 0.2;
  constructor(){

  }

  preload(){
    const results = Promise.all(this.soundList.map(it=>this.preloadFile(`${this.baseURL}${it}.mp3`)));
    results.then(res=>{
      this.soundList.forEach((soundName, i)=>{
        this.cache.set(soundName, res[i]);
      })
    })
  }

  private preloadFile(url:string){
    return fetch(url).then(res=>res.blob());
  }

  soldierMove(){
    this.playSound('yes-sir');  
  }

  soldierAttack(){
    this.playSound('attacking'); 

  }

  soldierReady(){

  }

  tankReady(){

  }

  tankMove(){
    this.playSound('like-the-wind');  
  }

  tankAttack(){

  }

  



  playSound(name:string){
    const cached = this.cache.get(name);
    if (cached){
      const audio = new Audio(URL.createObjectURL(cached));
      audio.volume = this.volume;
      audio.play();
    } else {
      const audio = new Audio(`${this.baseURL}${name}.mp3`);
      audio.volume = this.volume;
      audio.play();
    }
  }

  setVolume(volume:number){
    this.volume = volume;
  }
}

export const SoundManager = new SoundManagerClass();