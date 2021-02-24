//Alan Castillo

let img = lib220.loadImageFromURL("https://people.cs.umass.edu/~joydeepb/robot.jpg");

//imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMapXY(image, func) {
    let imgCopy = image.copy();
    for(let x=0; x<image.width; ++x) {
        for(let y=0; y<image.height; ++y) {
            imgCopy.setPixel(x,y, func(imgCopy, x, y));
        }
    }
    return imgCopy;
}

//imageMask(img: Image, func: (img: Image, x: number, y: number) => boolean, maskValue: Pixel): Image  
function imageMask(image, func, maskValue) {
    //when func(img, x, y) returns true, set pixel to maskValue
    //else dont change the pixel
    function callback(image, x, y) {
      return func(image, x, y)? maskValue: image.getPixel(x,y);
    }
    return imageMapXY(image, callback);
}

//blurPixel(img: Image, x: number, y: number): Pixel
function blurPixel(image, x, y) {
    let tempRed = 0;
    let tempGreen = 0;
    let tempBlue = 0;
    let count = 0;
    for(let i=x-1; i<x+2; ++i) {
        for(let j=y-1; j<y+2; ++j) {
            if(i<0 || i>image.width-1 || j<0 || j>image.height-1) {
                continue;
            } else {
                let pixel = img.getPixel(i,j);
                tempRed += pixel[0];
                tempGreen += pixel[1];
                tempBlue += pixel[2];
                ++count;
            }
        }
    }
    return [tempRed/count, tempGreen/count, tempBlue/count];
}

//blurImage(img: Image): Image
function blurImage(image) {
    return imageMapXY(image, blurPixel);
}

//testing
//imageMask(img, function(img, x, y) {return (y % 10 === 0);}, [1, 0, 0]).show();
//blurImage(img).show();