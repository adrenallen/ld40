//dead bodies of monsters
Crafty.c('TopBuildings', {
    required: "2D, Canvas, Collision, Color, Solid",
    init: function(){
        this.color('#202020');
        this.x = 0;
        this.y = 0;
        this.w = Crafty.viewport.width;
        this.h = 75;
    }
});

