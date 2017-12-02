var assetsObj = {
    "sprites": {
        "sprites/player.png" :{
            tile: 16,
            tileh: 16,
            map: {
                spr_player: [0,0]
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
        }
    }
};

Crafty.paths({
    images: "assets/"
});

Crafty.scene('Loading', function(){
    
    //load player sprite sheet
    Crafty.load(assetsObj, function(){
        
        // Crafty.sprite(16, 'assets/sprites/player.png', {
        //     spr_player: [0,0]
        // });

        Crafty.e('2D, Canvas, spr_player').attr({x: 50, y:50});

        Crafty.scene('Game');
    });
});

Crafty.scene('Game', function(){
    

    //add player to the game!
    this.player = Crafty.e("PlayerCharacter");


    
    this.clickTracker = Crafty.e("2D");
    Crafty.addEvent(this.clickTracker, Crafty.stage.elem, "mousedown", function(e){
        Crafty('PlayerCharacter').get(0).fireBullet(e);
    });
    

});


