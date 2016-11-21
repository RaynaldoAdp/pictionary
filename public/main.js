var pictionary = function() {
    var socket = io();
    var drawing;
    var canvas, context;
    
    var draw = function(position) {
            context.beginPath();
            context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
            context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function(event){
        drawing = true; 
    });
    
    canvas.on('mouseup', function(event){
        drawing = false; 
    });
    
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        if(drawing === true){
            draw(position);
        }
        
        socket.emit('draw', position);
        
        socket.on('draw', draw);
    });
    
    var guessBox;

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
    
        console.log(guessBox.val());
        socket.emit('guess', guessBox.val());
        guessBox.val('');
    };
    
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    
    var guessed = function(data){
        $('#results p').append(data + '<br>');
    }
    
    socket.on('guess', guessed);
};



$(document).ready(function() {
    pictionary();
});