declare module "*.jpg"{
    export default string;
}
declare module "url:*"{
    export default string;
}
declare module "*.css"{
    const value: {[className: string]: string} 
    export default value;
}