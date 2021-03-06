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

Crafty.c("GameIntroModal", {
    required: "2D, Canvas, Image, Mouse",
    init: function(){
        padding = 25;
        this.attr({
            x: padding,
            y: padding,
            h: gameHeight-(padding*2),
            w: gameWidth-(padding*2),
            z: 1500,
            alpha: 1
        });
        this.image("assets/intro.png");

        Crafty.e("2D, Keyboard").bind('KeyDown', KeyboardCB.gameOverKeydown);
        Game.reset();
    }
});

Crafty.c("GameWinModal", {
    required: "2D, Canvas, Image, Mouse",
    init: function(){
        Crafty.audio.pause('background');
        Crafty.audio.play('heal');
        padding = 25;
        this.attr({
            x: padding,
            y: padding,
            h: gameHeight-(padding*2),
            w: gameWidth-(padding*2),
            z: 1500,
            alpha: 0.9
        });
        this.image("assets/gameover.png");

        timeToDisplay = 2500;

        scrTO = 1;
        if(timeToDisplay < Game.scoreCalculator()){
            scrTO = Math.round(timeToDisplay/Game.scoreCalculator())
        }
        
        //Game.scoreCalculator()
        score = Crafty.e("2D, Canvas, Text").attr({ x: 156+padding, y: 68+padding, z:1501}).text(0);
        for( var i = 0; i <= Game.scoreCalculator(); i++){
            setTimeout(function(tx, scr){
                return function(){
                    tx.text(scr + ' points');
                };
            }(score, i), i*scrTO);
        }
        
        distTO = 1;
        if(timeToDisplay < Game.fakeDistance()){
            distTO = Math.round(timeToDisplay/Game.fakeDistance());
        }
        //Game.fakeDistance();
        distance = Crafty.e("2D, Canvas, Text").attr({ x: 156+padding, y: 110+padding, z:1501}).text(0);
        for( var i = 0; i <= Game.fakeDistance(); i++){
            setTimeout(function(tx, scr){
                return function(){
                    tx.text(scr + ' ft');
                };
            }(distance, i), i*distTO);
        }

        Crafty.e("2D, Canvas, Text").attr({ x: (gameWidth/2)-(padding), y: (gameHeight/3)-10, z:1501}).text('YOU WIN!').textColor('red');


        KeyboardCB.mouseup();
        KeyboardCB.keyup();
        
        Crafty.removeEvent(Game.clickTracker, Crafty.stage.elem, "mousedown", KeyboardCB.mousedown);
        Crafty.removeEvent(Game.clickTracker, Crafty.stage.elem, "mouseup", KeyboardCB.mouseup);

        Crafty.e("2D, Keyboard").unbind('KeyDown', KeyboardCB.keydown);
        Crafty.e("2D, Keyboard").unbind('KeyUp', KeyboardCB.keyup);
        Crafty.e("2D, Keyboard").bind('KeyDown', KeyboardCB.gameOverKeydown);
    }
});


Crafty.c("GameOverModal", {
    required: "2D, Canvas, Image, Mouse",
    init: function(){
        Crafty.audio.pause('background');
        Crafty.audio.play('losegame');
        padding = 25;
        this.attr({
            x: padding,
            y: padding,
            h: gameHeight-(padding*2),
            w: gameWidth-(padding*2),
            z: 1500,
            alpha: 0.9
        });
        this.image("assets/gameover.png");

        timeToDisplay = 2500;

        scrTO = 1;
        if(timeToDisplay < Game.scoreCalculator()){
            scrTO = Math.round(timeToDisplay/Game.scoreCalculator());
        }
        
        //Game.scoreCalculator()
        score = Crafty.e("2D, Canvas, Text").attr({ x: 156+padding, y: 68+padding, z:1501}).text(0);
        for( var i = 0; i <= Game.scoreCalculator(); i++){
            setTimeout(function(tx, scr){
                return function(){
                    tx.text(scr + ' points');
                };
            }(score, i), i*scrTO);
        }
        
        distTO = 1;
        if(timeToDisplay < Game.fakeDistance()){
            distTO = Math.round(timeToDisplay/Game.fakeDistance())
        }
        //Game.fakeDistance();
        distance = Crafty.e("2D, Canvas, Text").attr({ x: 156+padding, y: 110+padding, z:1501}).text(0);
        for( var i = 0; i <= Game.fakeDistance(); i++){
            setTimeout(function(tx, scr){
                return function(){
                    tx.text(scr + ' ft');
                };
            }(distance, i), i*distTO);
        }

        
        //to unstick the fire interval
        KeyboardCB.mouseup();
        KeyboardCB.keyup();

        Crafty.removeEvent(Game.clickTracker, Crafty.stage.elem, "mousedown", KeyboardCB.mousedown);
        Crafty.removeEvent(Game.clickTracker, Crafty.stage.elem, "mouseup", KeyboardCB.mouseup);

        Crafty.e("2D, Keyboard").unbind('KeyDown', KeyboardCB.keydown);
        Crafty.e("2D, Keyboard").unbind('KeyUp', KeyboardCB.keyup);
        Crafty.e("2D, Keyboard").bind('KeyDown', KeyboardCB.gameOverKeydown);
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