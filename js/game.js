const gameWidth = 350;
const gameHeight = 300;
const topWalkBound = 0.45*gameHeight;
const maxMonsters = 3;

Game = {
    levelProgress: 0,
    start: function(){
        Crafty.init(gameWidth,gameHeight);
        Crafty.background('gray');
        Crafty.viewport.scale(5);
        Crafty.scene('Loading');
    },
    addMonster: function(x,y){
        if(Crafty("MonsterActor").get().length > maxMonsters){
            return false;
        }else{
            monster = Crafty.e("MonsterCharacter1");
            if (x && y){
                monster.x = x;
                monster.y = y;
            }
        }
    },
    moveMap: function(v){
        moveThese = Crafty("Scrolls").get();
        for (var i = 0; i < moveThese.length; i++){
            moveThese[i].shift(-1*v,0,0,0);
        }
        this.levelProgress += v;
    }
    
};