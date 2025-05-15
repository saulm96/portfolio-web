interface Translation {
  [key: string]: string;
}

declare module "*.json" {
  const value: Translation;
  export default value;
}