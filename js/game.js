const gameWidth = 350;
const gameHeight = 300;
const topWalkBound = 0.45*gameHeight;
const maxMonsters = 3;

Game = {
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
    }
    
};