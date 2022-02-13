declare module '*.png' {
  const res: string;
  export default res;
}

declare module '*.css' {
  const res: Record<string, string>;
  export default res;
}