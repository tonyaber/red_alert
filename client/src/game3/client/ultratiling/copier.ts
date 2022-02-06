function copierInit(){
  const copier = document.createElement('canvas');
  copier.width = 900;
  copier.height = 700;
  const ctx = copier.getContext('2d');
  return ctx;
}

export const copier = copierInit();