declare module "*.jpg" {
  export default "" as string;
}
declare module "*.png" {
  export default "" as string;
}
declare module "*.woff2"{
  export default "" as string;
}

declare module "*.module.scss"{
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module "*.svg"