const movementSpeed = 100;



Crafty.c('PlayerCharacter', {
    required: "2D, Canvas, Fourway, spr_player",
    init: function(){
        this.x = 50;
        this.y = 50;
        this.bullets = ['asdf'];
        this.origin("center");
        
        this.fourway(movementSpeed);
        this.fireBullet({offsetX: this.x, offsetY: this.y});
    },

    fireBullet: function(e){
        var newBullet = Crafty.e("PlayerBullet");

        //TODO - make it appear ahead of the way we are looking slightly
        newBullet.x = this.attr('x');
        newBullet.y = this.attr('y')+3; //8 because sprite is 16x16
        //set the click direction for bullet
        
        newBullet.clickDirection(e.offsetX, e.offsetY);

        // Crafty.e("2D, Canvas, Color").attr({x: e.offsetX, y: e.offsetY, w:10, h:10}).color('red');
    }
});

Crafty.c('PlayerBullet', {
    required: "2D, Canvas, Motion, spr_bullet",
    init: function(){
        
        this.origin('center');
        this.bulletSpeed = 500;
    },

    clickDirection: function(x,y){
        // //set rotation
        deltaY = y-this.attr('y');
        deltaX = x-this.attr('x');

        console.log('y', deltaY)
        console.log('x', deltaX)

        RAD2DEG = 180 / Math.PI;
        rotRads = Math.atan2(deltaY, deltaX);

        rotDeg = (rotRads * RAD2DEG)+90;

        this.attr({rotation: rotDeg});

        vx = Math.cos(rotRads);
        vy = Math.sin(rotRads);
        
        //set velocity
        this.velocity().x = vx/(Math.abs(vx)+Math.abs(vy))*this.bulletSpeed;
        this.velocity().y = vy/(Math.abs(vx)+Math.abs(vy))*this.bulletSpeed;


        
    }
});