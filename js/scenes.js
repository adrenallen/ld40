var assetsObj = {
    "sprites": {
        "sprites/player.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_player: [0,0]
            },
            paddingX: 0,
            paddingY: 1,
            paddingAroundBorder: 0
        },
        "sprites/ally1.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_ally1: [0,0]
            },
            paddingX: 0,
            paddingY: 1,
            paddingAroundBorder: 0
        },
        "sprites/bullet.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_bullet: [0,0]
            },
            paddingX: 0,
            paddingY: 1,
            paddingAroundBorder: 0
        },
        "sprites/monster1.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_monster1: [0,0],
                spr_monster1_body: [0,1]
            },
            paddingX: 0,
            paddingY: 1,
            paddingAroundBorder: 0
        }
    }
};

Crafty.paths({
    images: "assets/"
});

Crafty.scene('Loading', function(){
    
    //load player sprite sheet
    Crafty.load(assetsObj, function(){

        Crafty.scene('Game');
    });
});

Crafty.scene('GameOver', function(){
    Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text("You died!");
});

Crafty.scene('Game', function(){
    

    //add player to the game!
    this.player = Crafty.e("PlayerCharacter");

    this.player.x=25;
    this.player.y=150;

    this.player = Crafty.e("MonsterCharacter1");

    Crafty.e("2D, Keyboard").bind('KeyDown', function(e){
        if (e.key == Crafty.keys.E){
            Crafty('PlayerCharacter').get(0).attemptReviveBody();    
        }
    });

    Crafty.e("2D, Keyboard").bind('KeyUp', function(e){
        if (e.key == Crafty.keys.E){
            Crafty('PlayerCharacter').get(0).stopAttemptReviveBody();    
        }
    });
    
    this.clickTracker = Crafty.e("2D");
    Crafty.addEvent(this.clickTracker, Crafty.stage.elem, "mousedown", function(e){
        Crafty('PlayerCharacter').get(0).fireBullet(e);
    });
    

});


