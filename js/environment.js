Crafty.c('TopBuildings', {
    required: "2D, Canvas, Collision, Color, Solid, spr_building, Scrolls",
    init: function(){
        this.color('#202020');
        this.x = 0;
        this.y = 0;
        this.w = 700;
        this.h = 75;


        this.bind('Move', function(e){
            return function(){
                e.checkForRepeat();
            }
        }(this));
    },
    checkForRepeat: function(){
        if(this.x <= -1*this.w){
            
            buildings = Crafty('TopBuildings').get();
            for(var i =0; i < buildings.length; i++){
                buildings[i].destroy();
            }
            //build new one
            Crafty.e("TopBuildings");
            repeater = Crafty.e("TopBuildings");
            repeater.x = repeater.w;
        }

    }
});

Crafty.c('BottomRoad', {
    required: "2D, Canvas, spr_road, Scrolls",
    init: function(){
        this.x = 0;
        this.y = 76;
        this.w = 700;
        this.h = 175;
        this.z=-1;


        this.bind('Move', function(e){
            return function(){
                e.checkForRepeat();
            }
        }(this));
    },
    checkForRepeat: function(){
        if(this.x <= -1*this.w){
            
            roads = Crafty('BottomRoad').get();
            for(var i =0; i < roads.length; i++){
                roads[i].destroy();
            }
            //build new one
            Crafty.e("BottomRoad");
            repeater = Crafty.e("BottomRoad");
            repeater.x = repeater.w;
        }

    }
});

Crafty.c('CarObject', {
    required: "2D, Canvas, Collision, Solid, spr_car, Scrolls",
    init: function(){
        this.collision([
            4,30,
            14,25,
            14,17,
            25,13,
            35,8,
            47,20,
            20,46,

        ]);
    }
});

Crafty.c('BoxObject', {
    required: "2D, Canvas, Collision, Solid, spr_box, Scrolls",
    init: function(){
        this.collision([
            3,12,
            3,6,
            7,3,
            12,5,
            12,12,
            8,15,
            5,15,

        ]);
    }
});

Crafty.c('SolidLeftPlayerOnly', {
    required: "2D, Canvas, Collision, Color",
    init: function(){
    }
});

Crafty.c('SolidRightPlayerOnly', {
    required: "2D, Canvas, Collision, Color",
    init: function(){
    }
});

Crafty.c('SolidBottomPlayerOnly', {
    required: "2D, Canvas, Collision, Color",
    init: function(){
    }
});

Crafty.c('BloodSpot', {
    required: "2D, Canvas, spr_bloodspot, Scrolls",
    init: function(){
        this.origin('center');
        
    }
});

Crafty.c('MoveBox', {
    required: "2D, Canvas, Collision, Color",
    init: function(){
        this.color('blue');
        this.alpha = 0;
        this.x = 275;
        this.y = 0;
        this.w = 75;
        this.h = 300;
    }
});

Crafty.c('TurboGun', {
    required: "2D, Canvas, Collision, SpriteAnimation, Scrolls, spr_turbogun",
    init: function(){
        this.onHit('PlayerCharacter', this.pickedUp);
    },
    pickedUp: function(hitDatas){
        hitData = hitDatas[0].obj;
        hitData.pickupTurboGun();
        this.destroy();
    }
});

Crafty.c('Medkit', {
    required: "2D, Canvas, Collision, SpriteAnimation, Scrolls, spr_medkit",
    init: function(){
        this.healAmount = 35;
        this.onHit('PlayerCharacter', this.pickedUp);
    },
    pickedUp: function(hitDatas){
        hitData = hitDatas[0].obj;
        hitData.takeHeal(this.healAmount);
        Crafty.audio.play('heal');
        this.destroy();
    }
});

