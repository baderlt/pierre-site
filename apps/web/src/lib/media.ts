export function imageSource(value:string){return value.startsWith('/')?value:`/images/${value}.webp`;}

export function thumbnailSource(value:string){return imageSource(value).replace(/^\/media\/(\d+)\/(?:preview|texture)$/,'/media/$1/thumb');}
