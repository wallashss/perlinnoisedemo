"use strict";

function PerlinNoise()
{
    
    let seed = 
    {
        persistence: 0.5,
        offsetx : 0,
        offsety : 0,
        scalex : 0.05,
        scaley : 0.05
    }

    function noise2D(x, y)
    {
        // 8161 is the 1024nth prime, 1024 x 1024 is the limit for our texture.
        // This number will "guarantee" no repetition for our (x,y)
        // nth prime reference: https://primes.utm.edu/nthprime/index.php#nth
        let n = x * 8161 + y;
        n = parseFloat(n);
        n = (n<<5) ^ n;
        return ( 1.0 - parseFloat((((n * (n * n * 3 + 48611) + 23) & 0x7fffffff) / 38609.0)));
    }

    function smoothNoise(x, y)
    {
        let corners = ( noise2D(x - 1, y - 1) + noise2D(x + 1, y - 1) + noise2D(x - 1, y + 1)+noise2D(x+1, y+1) ) / 16;
        let sides   = ( noise2D(x - 1, y)  +noise2D(x + 1, y)  +noise2D(x, y - 1)  +noise2D(x, y +1) ) /  8;
        let center  =  noise2D(x, y) / 4;
        return corners + sides + center;
    }

    function interpolate(x, y, a)
    {
        return x*(1-a) + y*a;
    }

    function interpolatedNoise(x, y)
    {
        let fractional_X = x - Math.floor(x);

        let fractional_Y = y - Math.floor(y);

        let v1 = smoothNoise(parseInt(Math.floor(x)), parseInt(Math.floor(y)));
        let v2 = smoothNoise(parseInt(Math.floor(x))+ 1,  parseInt(Math.floor(y)));
        let v3 = smoothNoise(parseInt(Math.floor(x)), parseInt(Math.floor(y)) + 1);
        let v4 = smoothNoise(parseInt(Math.floor(x)) + 1, parseInt(Math.floor(y)) + 1);

        let i1 = interpolate(v1, v2, fractional_X);
        let i2 = interpolate(v3, v4, fractional_X);

        return interpolate(i1 , i2 , fractional_Y);
    }

    function getOctave(x, y, frequency, amplitude)
    {
        return interpolatedNoise(x * frequency, y * frequency) * amplitude;
    }

    this.getNoiseTexture = function(img, w, h, setAlpha, seed, octaves)
    {
        let allValues = new Array(w*h);
        let max = 0.0;
        let min = 0.0;

        let octavesParams = [];

        for(let i = 0; i < octaves.length; i++)
        {
            let frequency =  Math.pow(2, octaves[i]);
            let amplitude = Math.pow(seed.persistence, octaves[i]+1);
            octavesParams.push({frequency: frequency, amplitude: amplitude});
        }

        for(let i =0 ; i < w; i++)
        {
            for(let j =0; j < h ; j++)
            {
                let v = 0.0;
                for(let k = 0; k < octavesParams.length; k++)
                {    
                    let octave = octavesParams[k];
                    v += getOctave((parseFloat(i) + seed.offsety) * seed.scalex, 
                                    (parseFloat(j) + seed.offsetx) * seed.scaley, 
                                    octave.frequency, octave.amplitude);
                }
                allValues[i*h+j] = v;
                if(v > max)
                {
                    max  = v;
                }
                if(v < min)
                {
                    min = v;
                }
            }
        }

        for(let i =0; i < allValues.length; i++)
        {
            let v = allValues[i];
            v -= min;
            v /= (max - min);
            allValues[i] = v;
        }

        for(let i =0 ; i < w ; i++)
        {
            for(let j =0 ; j < h ; j++)
            {
                let v = allValues[ i*h +j];
                
                let pixel = v*255.0;
                img.data[i*h*4 + j*4 + 0] = pixel;
                img.data[i*h*4 + j*4 + 1] = pixel;
                img.data[i*h*4 + j*4 + 2] = pixel;
                img.data[i*h*4 + j*4 + 3] = setAlpha ? pixel : 255.0;
            }
        }
        return img;
    }
    
}