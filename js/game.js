const gameWidth = 350;
const gameHeight = 200;
const topWalkBound = 0.45*gameHeight;

Game = {
    bullets: [],
    start: function(){
        Crafty.init(gameWidth,gameHeight);
        Crafty.background('gray');
        Crafty.viewport.scale(5);
        Crafty.scene('Loading');
    }    
    
};