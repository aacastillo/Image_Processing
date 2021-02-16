//Alan Castill0
//Higher Order Function Design w/ Image Processing
let img = lib220.loadImageFromURL("https://people.cs.umass.edu/~joydeepb/robot.jpg");

  /*The function takes an image as its argument and then returns a new red image.
  This is done by removing the green and blue components of each pixel [r,g,b] --> [r, 0, 0]*/
//removeBlueAndGreen(image: Image): Image
function removeBlueAndGreen(image) {
  let redImg = image.copy();
  for (let x=0; x < redImg.width; ++x) {
    for (let y=0; y < redImg.height; ++y) {
      let pixel = redImg.getPixel(x,y);
      let redPixel = pixel[0];
      redImg.setPixel(x, y, [redPixel, 0.0, 0.0]);
    }
  }
  return redImg;
}

  /*The function takes an image and returns a new image on the grayscale
  Pixel's are objects with red, green, and blue components, these components are stored in an array [r, g, b]
  and each component is given a floating point number that represents the respective color's intensity
  this function takes the average, m, of the colors intensity (r + g + b)/3 = m and then sets every Pixel's
  components to this intensity average, Pixel = [r,g,b] --> [m, m, m] */
//makeGrayscale(image: Image): Image
function makeGrayscale(image) {
  let grayImg = image.copy();
  for (let x=0; x < grayImg.width; ++x) {
    for (let y=0; y < grayImg.height; ++y) {
      let pixel = grayImg.getPixel(x,y);
      let avgPixelIntensity = (pixel[0] + pixel[1] + pixel[2])/3;
      grayImg.setPixel(x, y, [avgPixelIntensity, avgPixelIntensity, avgPixelIntensity]);
    }
  }
  return grayImg;
}

//HOF DESIGN

  /*This function takes a pixel as its arguments and returns a new red pixel.
  This is done by setting the green and blue components to 0 and keeping the original red component.
  This function is the helper method to the function mapToRed.*/
//mapToRed(pixel: Pixel): Pixel
function redPixel(pixel) {
  return [pixel[0], 0.0, 0.0];
}

  /*This function takes a pixel as its arguments and returns a grayscale pixel.
  This is done by finding the average intensity of the pixel, (r+g+b)/3, and setting each of
  the components of the new pixel to the average intensity */
//mapToGrayscale(pixel: Pixel): Pixel
function grayPixel(pixel) {
  let avgPixelIntensity = (pixel[0] + pixel[1] + pixel[2])/3;
  return [avgPixelIntensity, avgPixelIntensity, avgPixelIntensity];
}

  /*This function takes an image and a function as its argument and returns a new image. 
    The new image depends on the function, which performs an operation on each pixel of the image.
    This is done by traversing through each pixel in the given image*/
//imageMap(image: Image, func: (pixel: Pixel) => Pixel): Image
function imageMap(image, func) {
  let newImg = image.copy();
  for (let x=0; x < newImg.width; ++x) {
    for (let y=0; y < newImg.height; ++y) {
      let pixel = newImg.getPixel(x,y);
      newImg.setPixel(x, y, func(pixel));
    }
  }
  return newImg;
}

  /*This function takes an image as an argument and returns a red version of the same image.
  It is equivalent to the function removeBlueAndGreen above, but uses the higher order function imageMap
  and helper function redPixel */
//mapToRed(image: Image): Image
function mapToRed(image) {
  return imageMap(image, redPixel);
}

  /*This function takes an image as an argument and returns a grayscale version of the same image.
  It is equivalent to the makeGrayscale function, but uses the higher order function imageMap
  and helper function grayScale */
//mapToGrayscale(image: Image): Image
function mapToGrayscale(image) {
  return imageMap(image, grayPixel);
}

//avgPixel(pixel: Pixel): Pixel
function avgPixel(pixel) {
  let avgPixel = (pixel[0] + pixel[1] + pixel[2])/3;
  return avgPixel;
}

//highlightEdges(img: Image): Image
function highlightEdges(img) {
  let highlightImg = img.copy();
  for (let x=0; x < highlightImg.width; ++x) {
    for (let y=0; y < highlightImg.height; ++y) {
      if (y === highlightImg.height - 1) {
        highlightImg.setPixel(x, y, [0,0,0]);
      } else {
        let m1 = avgPixel(highlightImg.getPixel(x,y));
        let m2 = avgPixel(highlightImg.getPixel(x,y+1));
        let absVal = Math.abs(m1 - m2);
        highlightImg.setPixel(x, y, [absVal, absVal, absVal]);
      }
    }
  }
  return highlightImg;
}

//blur(img: Image): Image
function blur(img) {
  let blurImg = img.copy();
  //traverse all pixels
  for(let x=0; x<blurImg.width-1; ++x) {
    for(let y=0; y<blurImg.height-1; ++y) {
      //square average
      let tempRed = 0.0;
      let tempGreen = 0.0;
      let tempBlue = 0.0;
      let count = 0;
      
      for(let i=x-1; i<x+2; ++i) {
        for(let j=y-1; j<y+2; ++j) {
          //edge cases
          if(i<0 || i>blurImg.width-1 || j<0 || j>blurImg.height-1) {
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
      blurImg.setPixel(x,y, [tempRed/count, tempGreen/count, tempBlue/count]);
    }
  }
  return blurImg;
}

//swapGB(img: Image): Image
function swapGB(img) {
  function swap(pixel) {
    return pixel = [pixel[0], pixel[2], pixel[1]];
  }
  return imageMap(img, swap);
}

//shiftRGB(img: Image): Image
function shiftRGB(img) {
  function shift(pixel) {
    return pixel = [pixel[2], pixel[0], pixel[1]];
  }
  return imageMap(img, shift);
}

//TEST CASES

  /*This function takes two pixels as arguments and returns true or false, true if the comparison 
  of each component of the Pixel is within the threshold */
//pixelEq(p1: Pixel, p2: Pixel): boolean
function pixelEq (p1, p2) {
  const epsilon = 0.002;
  for (let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon) {
      return false;
    }
  }
  return true;
}

test('No blue or green in removeBlueAndGreen result', function() {
  const inputPixel = [0.1, 0.2, 0.3]
  // Create a test image, of size 10 pixels x 10 pixels, and set it to all a color.
  const image = lib220.createImage(10, 10, inputPixel);

  //Process image.
  const outputImage = removeBlueAndGreen(image);

  //Check top left pixel
  const tlPixel = outputImage.getPixel(0, 0);
  assert(pixelEq(tlPixel, [0.1, 0, 0]));
  
  //Check center pixel
  const centerPixel = outputImage.getPixel(5,5);
  assert(pixelEq(centerPixel, [0.1, 0, 0]));
  
  //Check bottom right pixel
  const brPixel = outputImage.getPixel(9,9);
  assert(pixelEq(brPixel, [0.1, 0, 0]));
});

test('No blue or green in mapToRed result', function() {
  const inputPixel = [0.1, 0.2, 0.3]
  // Create a test image, of size 10 pixels x 10 pixels, and set it to all a color.
  const image = lib220.createImage(10, 10, inputPixel);

  //Process image.
  const outputImage = mapToRed(image);

  //Check top left pixel
  const tlPixel = outputImage.getPixel(0, 0);
  assert(pixelEq(tlPixel, [0.1, 0, 0]));
  
  //Check center pixel
  const centerPixel = outputImage.getPixel(5,5);
  assert(pixelEq(centerPixel, [0.1, 0, 0]));
  
  //Check bottom right pixel
  const brPixel = outputImage.getPixel(9,9);
  assert(pixelEq(brPixel, [0.1, 0, 0]));
});

test('average pixel intensity in makeGrayscale result', function() {
  const inputPixel = [0.1, 0.2, 0.3]
  // Create a test image, of size 10 pixels x 10 pixels, and set it to all a color.
  const image = lib220.createImage(10, 10, inputPixel);

  //Process image.
  const outputImage = makeGrayscale(image);

  //Check top left pixel
  const tlPixel = outputImage.getPixel(0, 0);
  assert(pixelEq(tlPixel, [0.2, 0.2, 0.2]));
  
  //Check center pixel
  const centerPixel = outputImage.getPixel(5,5);
  assert(pixelEq(centerPixel, [0.2, 0.2, 0.2]));
  
  //Check bottom right pixel
  const brPixel = outputImage.getPixel(9,9);
  assert(pixelEq(brPixel, [0.2, 0.2, 0.2]));
});

test('average pixel intensity in mapToGrayscale result', function() {
  const inputPixel = [0.1, 0.2, 0.3]
  // Create a test image, of size 10 pixels x 10 pixels, and set it to all a color.
  const image = lib220.createImage(10, 10, inputPixel);

  //Process image.
  const outputImage = mapToGrayscale(image);

  //Check top left pixel
  const tlPixel = outputImage.getPixel(0, 0);
  assert(pixelEq(tlPixel, [0.2, 0.2, 0.2]));
  
  //Check center pixel
  const centerPixel = outputImage.getPixel(5,5);
  assert(pixelEq(centerPixel, [0.2, 0.2, 0.2]));
  
  //Check bottom right pixel
  const brPixel = outputImage.getPixel(9,9);
  assert(pixelEq(brPixel, [0.2, 0.2, 0.2]));
});
