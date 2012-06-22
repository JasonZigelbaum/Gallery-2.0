/*  Enclose the namespace in a self invoking function   */
(function () {
    /*  Create a global object in our namespace.    */
    Gallery = function () {
        /*  Set up arguments in any order    */
        var args            = arguments[0],
        id                  = args.id,
        transition_in       = args.transition_in,
        transition_out      = args.transition_out,
        images              = args.images,
        timer               = args.timer || 5000,
        cur_index           = 0,
        /*  Add canvas and context    */
        canvas              = function() {
            var canvas      = document.createElement("canvas");
            document.getElementById(id).appendChild(canvas);
            return canvas
        }(),
        context              = canvas.getContext('2d');

        /*  Set up our private methods    */
        var draw_new_image = function () {
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

        var adjust_canvas = function() {
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
            setInterval(loop, timer);
        };

        var loop = function () {
            /*  Trigger slide   */
            Animations.animate( context, img, undefined, transition_out, draw_new_image );
        };

        /*  Reveal our public methods using the revealing module pattern.    */
        return {
            init : init
            }
        };
}())
