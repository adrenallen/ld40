Crafty.c('PlayerHealthBar', {
    required: "2D, Canvas, Color",
    init: function(){
        this.bg = Crafty.e("2D, Canvas, Color").attr({
            x:0,
            y:10,
            w:104,
            h:12,
            z:999,
            alpha:0.8
        }).color('black');

        this.fg = Crafty.e("2D, Canvas, Color").attr({
            x:2,
            y:12,
            w:100,
            h:8,
            z:1000,
            alpha:0.8
        }).color('red');
    },
    adjustHealthBar: function(health){
        if (health < 0){
            health = 0;
        }
        this.fg.w = health/(this.maxHealth || 200)*100;
    }
});