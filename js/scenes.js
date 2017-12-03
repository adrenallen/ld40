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
        "sprites/turbogun.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_turbogun: [0,0]
            },
            paddingX: 0,
            paddingY: 0,
            paddingAroundBorder: 0
        },
        "sprites/bloodspot.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_bloodspot: [0,0]
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
        "sprites/snek.png" :{
            tile: 32,
            tileh: 32,
            map: {
                spr_snek: [0,0],
            },
            paddingX: 0,
            paddingY: 0,
            paddingAroundBorder: 0
        },
        "sprites/snekbomb.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_snekbomb: [0,0],
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
        "sprites/road.png":{
            tile: 700,
            tileh: 175,
            map: {
                spr_road: [0,0],
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

Crafty.pixelart(true);

Crafty.scene('Loading', function(){
    
    //load player sprite sheet
    Crafty.load(assetsObj, function(){
        Crafty.scene('Intro');
        
    });
});

//intro should show controls
Crafty.scene('Intro', function(){
    Crafty.e("2D, Keyboard").one('KeyDown', KeyboardCB.gameOverKeydown);
    Crafty.e('GameIntroModal');
});

Crafty.scene('GameOver', function(){
    Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text("You died!");
    Crafty.audio.play('losegame');
});

Crafty.scene('Game', function(){
    
    setInterval(GameDirector.direct, 100);
    //add player to the game!
    this.player = Crafty.e("PlayerCharacter");

    Crafty.e("TopBuildings");
    repeater = Crafty.e("TopBuildings");
    repeater.x = repeater.w;

    Crafty.e("BottomRoad");
    repeater = Crafty.e("BottomRoad");
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
    
    // test = Crafty.e('SnekCharacter').attr({x: 200, y:150});

    Game.addSnek(200, 150);
    // Game.addMonster(250, 150);
    // Game.addMonster(200, 170);
    // Game.addMonster(175, 130);

    // Game.addBagger(200, 150);
    
    // Game.addTurboGun(150,150);

    
    Game.clickTracker = Crafty.e("2D, Canvas, Mouse");

    Crafty.addEvent(Game.clickTracker, Crafty.stage.elem, "mousedown", KeyboardCB.mousedown);

    Crafty.addEvent(Game.clickTracker, Crafty.stage.elem, "mouseup", KeyboardCB.mouseup);

    cursor = Crafty('CursorAimer').get(0);

    Crafty.addEvent(Game.clickTracker, Crafty.stage.elem, "mousemove", KeyboardCB.mousemove);

    Crafty.e("2D, Keyboard").bind('KeyDown', KeyboardCB.keydown);

    Crafty.e("2D, Keyboard").bind('KeyUp', KeyboardCB.keyup);

});
