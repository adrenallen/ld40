var assetsObj = {
    "sprites": {
        "sprites/player.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_player: [0,0],
                spr_player_arms: [1,0]
            },
            paddingX: 0,
            paddingY: 0,
            paddingAroundBorder: 0
        },
        "sprites/ally1.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_ally1: [0,0],
                spr_ally1_body: [3,3],
                spr_ally1_arms: [0,1]
            },
            paddingX: 0,
            paddingY: 0,
            paddingAroundBorder: 0
        },
        "sprites/bullet.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_bullet: [0,0]
            },
            paddingX: 0,
            paddingY: 0,
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
            paddingY: 0,
            paddingAroundBorder: 0
        },
        "sprites/bagger.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_bagger: [0,0],
            },
            paddingX: 0,
            paddingY: 0,
            paddingAroundBorder: 0
        },
        "sprites/cursor.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_cursor: [0,0],
            },
            paddingX: 0,
            paddingY: 0,
            paddingAroundBorder: 0
        },
        "sprites/buildings.png":{
            tile: 600,
            tileh: 75,
            map: {
                spr_building: [0,0],
            },
            paddingX: 0,
            paddingY: 0,
            paddingAroundBorder: 0
        },
        "sprites/car.png":{
            tile: 48,
            tileh: 48,
            map: {
                spr_car: [0,0],
            },
            paddingX: 0,
            paddingY: 0,
            paddingAroundBorder: 0
        },
    },
    "audio":{
        "playerhurt": ['hurt.wav'],
        "losegame": ['lose.wav'],
        "defaultgun": ['defaultgun.wav'],
        "monsterdeath": ['monsterdeath.wav'],
        "revive": ["revive.wav"],
        "allydeath": ["allydeath.wav"],
        "convert": ["convert.wav"]
    }
};

Crafty.paths({
    images: "assets/",
    audio: "assets/audio/"
});

Crafty.scene('Loading', function(){
    
    //load player sprite sheet
    Crafty.load(assetsObj, function(){

        Crafty.scene('Game');
    });
});

Crafty.scene('GameOver', function(){
    Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text("You died!");
    Crafty.audio.play('losegame');
});

Crafty.scene('Game', function(){
    

    //add player to the game!
    this.player = Crafty.e("PlayerCharacter");

    Crafty.e("TopBuildings");
    repeater = Crafty.e("TopBuildings");
    repeater.x = repeater.w;

    bottomBound = Crafty.e("SolidBottomPlayerOnly");
    bottomBound.w = 360;
    bottomBound.h = 5;
    bottomBound.x = -5;
    bottomBound.y = 250;
    bottomBound.color('red');

    leftBound = Crafty.e("SolidLeftPlayerOnly");
    leftBound.w = 5;
    leftBound.h = 310;
    leftBound.x = -5;
    leftBound.y = -5;
    leftBound.color('red');

    
    Crafty.e("CursorAimer");
    Crafty.e("DamageOverlay");
    Crafty.e("MoveBox");
    
    car = Crafty.e('CarObject');
    car.x = 200;
    car.y = 150;

    this.player.x=25;
    this.player.y=150;

    //spawns allies
    // for(var i = 0; i < 10; i++){
    //     test = Crafty.e("AllyCharacter").attr({x: -1*(i*20), y: 100+(i*5)});
    //     test.trigger('MoveTowardsPlayer');
    // }
    
    Game.addMonster(100, 150);

    bag = Crafty.e('BaggerCharacter');
    bag.x = 200;
    bag.y = 150;


    // setInterval(function(){
    //     Game.addMonster();
        
    // }, 2000);
    


    
    
    this.clickTracker = Crafty.e("2D");

    Crafty.addEvent(this.clickTracker, Crafty.stage.elem, "mousedown", function(e){
        Crafty('PlayerCharacter').get(0).fireBullet(e);
        
    });

    Crafty.addEvent(this.clickTracker, Crafty.stage.elem, "mouseup", function(e){
        clearInterval(Game.shootInterval);
    });

    Crafty.addEvent(this.clickTracker, Crafty.stage.elem, "mousemove", function(e){
        try{
            Crafty('PlayerCharacterArms').get(0).pointToMouse(e);
            cursor = Crafty('CursorAimer').get(0)
            cursor.x = e.offsetX;
            cursor.y = e.offsetY;
        }catch(e){
            console.log(e);
        }
    });

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
    

});


