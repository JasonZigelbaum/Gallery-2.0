var Animations = (function() {
    /*  Define getAnimationFrame so that the framerate is cross browser consistent    */
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    /*  Keep them global in the Animations module scope    */
    var cb, context, image, width, height, start, id, original;
    
    var animate = function (ctx, img, copy, transition, callback) {
        cb          = callback
        context     = ctx;
        image       = img;
        width       = img.width;
        height      = img.height;
        start       = Date.now();
        original    = copy;
        
        id = window.requestAnimationFrame(transition)
    }
    
    var burn_out = function (time) {
        var data    = context.getImageData(0, 0, image.width, image.height),
            pix     = data.data,
            tick    =  (time - start) / 1000;

        /*  Animation Loop    */
        for (var i = 0, n = pix.length; i < n; i += 4) {
            pix[i  ] *= 1 + tick; // red
            pix[i+1] *= 1 + tick; // green
            pix[i+2] *= 1 + tick; // blue
            pix[i+3] *= .95;
        }
        /*  Draw to context    */
        context.putImageData(data, 0, 0);

        /*  Terminate after 1 second    */
        if(tick < 1) {
            id = window.requestAnimationFrame( burn_out )
        } else {
            window.cancelAnimationFrame(id)
            cb();
        }
    }
    
    var burn_in = function (time) {
        var data     = context.getImageData(0, 0, image.width, image.height),
            pix      = data.data,
            tick     =  (time - start) / 1000;

        /*  Animation Loop    */
        for (var i = 0, n = pix.length; i < n; i += 4) {
            pix[i  ] += (original[i] - pix[i]);
            pix[i+1] += (original[i+1] - pix[i+1]);
            pix[i+2] += (original[i+2] - pix[i+2]);
            pix[i+3] += 20;
            if (pix[i+3] >= 255)
                pix[i+3] = 255;
        };

        /*  Draw to context    */
        context.putImageData(data, 0, 0);

        /*  Terminate after 1 second    */
        if(tick < 1) {
            id = window.requestAnimationFrame( burn_in )
        } else {
            window.cancelAnimationFrame(id)
        }
    }
    
    var dissolve_out = function (time) {
        var data    = context.getImageData(0, 0, image.width, image.height),
            pix     = data.data,
            tick    =  (time - start) / 1000;

        /*  Animation Loop    */
        for (var i = 0, n = pix.length; i < n; i += 4) {
            pix[i  ] += Math.random() * 10 + tick; // red
            pix[i+1] += Math.random() * 10 + tick; // green
            pix[i+2] += Math.random() * 10 + tick; // blue
            pix[i+3] += .95;
        }
        /*  Draw to context    */
        context.putImageData(data, 0, 0);

        /*  Terminate after 1 second    */
        if(tick < 1) {
            id = window.requestAnimationFrame( dissolve_out )
        } else {
            window.cancelAnimationFrame(id)
            cb();
        }
    }
    
    var dissolve_in = function (time) {
        var data     = context.getImageData(0, 0, image.width, image.height),
            pix      = data.data,
            tick     =  (time - start) / 1000;

        /*  Animation Loop    */
        for (var i = 0, n = pix.length; i < n; i += 4) {
            pix[i  ] += Math.random() * (original[i] - pix[i]);
            pix[i+1] += Math.random() * (original[i+1] - pix[i+1]);
            pix[i+2] += Math.random() * (original[i+2] - pix[i+2]);
            pix[i+3] += 20;
            if (pix[i+3] >= 255)
                pix[i+3] = 255;
        };

        /*  Draw to context    */
        context.putImageData(data, 0, 0);

        /*  Terminate after 1 second    */
        if(tick < 1) {
            id = window.requestAnimationFrame( dissolve_in )
        } else {
            window.cancelAnimationFrame(id)
        }
    }
    
    var Helpers = (function() {
        var copy_image = function (image) {
            var copy = [];
            var imaged = context.getImageData(0, 0, image.width, image.height);
            var pix = imaged.data;

            // Copy data
            for (var i = 0, n = pix.length; i < n; i += 4) {
                copy.push(pix[i  ]);
                copy.push(pix[i+1]);
                copy.push(pix[i+2]);
                copy.push(pix[i+3]);
            };

            return copy;
        }

        /*  Clear pixel array to 0 across the board    */
        var clear_image = function (image) {
            var copy = [];
            var imaged = context.getImageData(0, 0, image.width, image.height);
            var pix = imaged.data;

            for (var i = 0, n = pix.length; i < n; i += 4) {
                pix[i  ] = 0;
                pix[i+1] = 0;
                pix[i+2] = 0;
                pix[i+3] = 0;
            };

            context.putImageData(imaged, 0, 0);
        }
        
        return {
            copy_image : copy_image,
            clear_image : clear_image,
        }
    }())
    
    return {
        Helpers : Helpers,
        animate : animate,
        burn_out : burn_out,
        burn_in : burn_in,
        dissolve_out : dissolve_out,
        dissolve_in : dissolve_in
    }
}())