export const mod = (arg: number, m: number) => {
  if (arg>=0){
    return arg % m;
  } else {
    if (arg % m == 0 ){
      return 0
    }
    return arg % m + m;
  }
}