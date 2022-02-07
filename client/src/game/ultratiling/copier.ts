function copierInit(){
  const copier = document.createElement('canvas');
  copier.width = 1100;
  copier.height = 900;
  const ctx = copier.getContext('2d');
  return ctx;
}

export const copier = copierInit();