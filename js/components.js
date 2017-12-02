const movementSpeed = 100;



Crafty.c('PlayerCharacter', {
    required: "2D, Canvas, Collision, Fourway, spr_player",
    init: function(){
        this.x = 50;
        this.y = 50;
        this.origin("center");
        
        this.fourway(movementSpeed);
        this.onHit('Projectile', this.takeBulletDamage);
    },

    fireBullet: function(e){
        var newBullet = Crafty.e("PlayerBullet");

        //TODO - make it appear ahead of the way we are looking slightly
        newBullet.x = this.attr('x')+20;
        newBullet.y = this.attr('y')+3; //8 because sprite is 16x16
        //set the click direction for bullet
        
        newBullet.clickDirection(e.offsetX, e.offsetY);

        // Crafty.e("2D, Canvas, Color").attr({x: e.offsetX, y: e.offsetY, w:10, h:10}).color('red');
    },
    takeBulletDamage: function(hitData){
        
        this.health-=hitData[0].obj.attr('damage');
        hitData[0].obj.destroy();
        if (this.health < 1){
            this.death();
        }
    },
    death: function(){
        Crafty.scene('GameOver');
    }
});

//TODO - make the monster sprite sheet varied and pick a random row for different looks
Crafty.c('MonsterCharacter1', {
    required: "2D, Canvas, MonsterActor, spr_monster1, WireHitBox",
    init: function(){
        this.x = Crafty.viewport.width*Math.random();
        this.y = Crafty.viewport.height*Math.random();
        this.origin("center");

        //TODO better collision
        // this.collision([-4, 8, -4, 4, 4, 4, 4, 8]);
    },

});

Crafty.c('MonsterActor', {
    required: "2D, Canvas, Collision",
    init: function(){
        this.health = 15;   

        this.onHit('Projectile', this.takeBulletDamage);
    },
    takeBulletDamage: function(hitData){
        
        this.health-=hitData[0].obj.attr('damage');
        hitData[0].obj.destroy();
        if (this.health < 1){
            this.death();
        }
        console.log(this.health);
    },
    death: function(){
        this.destroy();
        this.player = Crafty.e("MonsterCharacter1");
    }
});

Crafty.c('Projectile', {
    required: "2D, Canvas",
    init: function(){
        this.damage = 1;
    }
});

Crafty.c('PlayerBullet', {
    required: "2D, Canvas, Projectile, Motion, spr_bullet",
    init: function(){
        
        this.origin('center');
        this.bulletSpeed = 500;
        this.damage = 5;
    },

    clickDirection: function(x,y){

        // //set rotation
        deltaY = y-this.attr('y');
        deltaX = x-this.attr('x');

        console.log('y', deltaY);
        console.log('x', deltaX);

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