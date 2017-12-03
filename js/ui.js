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

Crafty.c('PlayerScore', {
    required: "2D, Canvas,Text",
    init: function(){
        this.scoreText = Crafty.e("2D, Canvas, Text").attr({ x: 275, y: 10, h: 12}).textColor('white');;
        this.scoreText.z=1000;
        this.updateScore(0);
    },
    updateScore: function(score){
        this.scoreText.text('Score: '+score);
    }
});

Crafty.c('DamageOverlay', {
    required: "2D, Canvas, Color, Tween",
    init: function(){
        this.x = 0;
        this.y = 0;
        this.w = Crafty.viewport.width;
        this.h = Crafty.viewport.height;
        this.alpha = 0;
        this.z = 1000;
        this.color('red');
    },
    showDamage: function(){
        Crafty.audio.play("playerhurt");
        this.tween({alpha: 0.3}, 100);
        setTimeout(function(e){
            Crafty('DamageOverlay').get(0).tween({ alpha:0 }, 200);
        }, 500);
    }
});

Crafty.c("GameOverModal", {
    required: "2D, Canvas, Color, Tween, Mouse",
    init: function(){
        padding = 25;
        this.attr({
            x: padding,
            y: padding,
            h: gameHeight-(padding*2),
            w: gameWidth-(padding*2),
            z: 1500,
            alpha: 0.9
        });
        this.color('lightgray');

        
        Crafty.e("2D, Canvas, Text").attr({ x: (gameWidth/2)-(padding*2), y: gameHeight/3, z:1501}).text('Game Over!');
        Crafty.e("2D, Canvas, Text").attr({ x: (gameWidth/2)-(padding*2), y: (gameHeight/3)+padding, z:1501}).text('Final Score: ' + Game.scoreCalculator());
        Crafty.e("2D, Canvas, Text").attr({ x: (gameWidth/2)-(padding*2), y: (gameHeight/3)+(padding*2), z:1501}).text('Distance travelled: '+ Game.fakeDistance() + "ft");
        Crafty.e("2D, Canvas, Text").attr({ x: (gameWidth/2)-(padding*2), y: (gameHeight/3)+(padding*4), z:1501}).text('Press Enter to play again');
        
        Crafty.e("2D, Keyboard").unbind('KeyDown', KeyboardCB.keydown);
        Crafty.e("2D, Keyboard").one('KeyDown', KeyboardCB.gameOverKeydown);
    }
});

Crafty.c("MenuButton", {
    required: "2D, Canvas, Color, Mouse",
    init: function(){

    }
});

Crafty.c('CursorAimer', {
    required: "2D, Canvas, spr_cursor",
    init: function(){
        this.origin('center');
        this.alpha = 0.4;
        this.z = 9999;
    }
});