const gameWidth = 1000;
const gameHeight = 600;
const topWalkBound = 0.45*gameHeight;

Game = {
    
    start: function(){
        Crafty.init(gameWidth,gameHeight);
        Crafty.background('gray');
    }    
    
};