/*  Enclose the namespace in a self invoking function   */
(function () {
    /*  Create a global object in our namespace.    */
    Gallery = function () {
        /*  Set up arguments in any order    */
        var args            = arguments[0],
            id              = args.id,
            transition_in   = args.transition_in,
            transition_out  = args.transition_out,
            images          = args.images,
            timer           = args.timer || 5000,
            cur_index       = 0,
        /*  Add canvas and context    */
            elements        = function() {

            var wrapper     = document.createElement("div"),
                canvas      = document.createElement("canvas"),
                left        = document.createElement("div"),
                right       = document.createElement("div");
                
            wrapper.id = "gallery_wrapper";
            left.id = "left";
            right.id = "right";
            left.addEventListener("click", function() { setTimeout(go_left(), 5000) }, false);
            right.addEventListener("click", function() { setTimeout(go_right(), 5000) }, false);
            wrapper.addEventListener("mouseover", 
                function() { 
                    left.style.opacity  = 1;
                    right.style.opacity = 1; 
                }
                , false);
            wrapper.addEventListener("mouseout", 
                function() { 
                    left.style.opacity  = 0;
                    right.style.opacity = 0; 
                }
                , false);
            document.getElementById(id).appendChild(wrapper)
            wrapper.appendChild(left);
            wrapper.appendChild(canvas);            
            wrapper.appendChild(right);
            return { canvas : canvas, wrapper : wrapper };
        }(),
            wrapper             = elements.wrapper,
            canvas              = elements.canvas,
            context             = canvas.getContext('2d'),
            interval;
        
        /*  Set up our private methods    */
        var draw_next_image = function () {
            cur_index = ++cur_index % images.length;
            context.clearRect(0, 0, canvas.width, canvas.height);
            img = new Image();
            img.onload = function() {
                adjust_canvas();
                context.drawImage( img, 0, 0, img.width, img.height );
                var copy = Animations.Helpers.copy_image(img);
                Animations.Helpers.clear_image(img);
                Animations.animate( context, img, copy, transition_in, undefined);
            }
            img.src = images[cur_index];
        };

        var draw_prev_image = function () {
            cur_index = Math.abs(--cur_index % images.length);
            context.clearRect(0, 0, canvas.width, canvas.height);
            img = new Image();
            img.onload = function() {
                adjust_canvas();
                context.drawImage( img, 0, 0, img.width, img.height );
                var copy = Animations.Helpers.copy_image(img);
                Animations.Helpers.clear_image(img);
                Animations.animate( context, img, copy, transition_in, undefined);
            }
            img.src = images[cur_index];
        };
        
        var adjust_canvas = function() {
            wrapper.style.width     = [img.width + 100 ,'px'].join('');
            wrapper.style.height    = [img.height + 16,'px'].join('');
            wrapper.width           = img.width + 100;
            wrapper.height          = img.height;
            canvas.style.width     = [img.width ,'px'].join('');
            canvas.style.height    = [img.height ,'px'].join('');
            canvas.width           = img.width;
            canvas.height          = img.height;
        };

        var init = function () {
            /*  Base Case    */
            cur_index = cur_index;
            img = new Image();
            img.onload = function() {
                adjust_canvas();
                context.drawImage( img, 0, 0, img.width, img.height );
            };
            img.src = images[cur_index];
            
            /*  Set the interval    */
            interval = setInterval(loop, timer);
        };

        var loop = function () {
            /*  Trigger slide   */
            Animations.animate( context, img, undefined, transition_out, draw_next_image );
        };

        /*  Add event listener function objects    */
        var go_left = function() {
            /*  Stop the loop    */
            clearInterval(interval);
            /*  Go back and animate.    */
            Animations.animate( context, img, undefined, transition_out, draw_next_image );
            /*  Set the interval again    */
            interval = setInterval(loop, timer);
        }
        
        var go_right = function() {
            /*  Stop the loop    */
            clearInterval(interval);
            /*  Go back and animate.    */
            Animations.animate( context, img, undefined, transition_out, draw_prev_image );
            /*  Set the interval again    */
            interval = setInterval(loop, timer);
        }
        /*  Reveal our public methods using the revealing module pattern.    */
        return {
            init : init
            }
        };
}())
