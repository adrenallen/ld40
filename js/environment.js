//dead bodies of monsters
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

Crafty.c('SolidLeftPlayerOnly', {
    required: "2D, Canvas, Collision, Color",
    init: function(){
    }
});

Crafty.c('SolidBottomPlayerOnly', {
    required: "2D, Canvas, Collision, Color",
    init: function(){
    }
});

Crafty.c('MoveBox', {
    required: "2D, Canvas, Collision, Color",
    init: function(){
        this.color('blue');
        this.alpha = 0;
        this.x = 300;
        this.y = 0;
        this.w = 50;
        this.h = 300;
    }
});

