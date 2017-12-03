Crafty.c('SnekCharacter', {
    required: "2D, Canvas, MonsterActor, spr_snek, Motion, SpriteAnimation",
    init: function(){
        this.x = ((Crafty.viewport.width+50)*Math.random())-(Math.random()*50);
        this.y = (Crafty.viewport.height*Math.random())+75;
        
        this.origin("center");
        this.damage = 30;
        this.z = 750;
        this.health = 85;
        this.meleeDistance = 20;
        this.pointValue = 150;

        
        //TODO collision
        // this.collision([
        //     2,6,
        //     8,4,
        //     14,10,
        //     11,14,
        //     3,11,
        //     1,9
        // ]);

        this.speed = 110;

        this.pathfindingInterval = setInterval(function(mon){ mon.moveSomewhere(); }, 100, this);
        
        this.onHit('Projectile', this.takeBulletDamage);
        this.onHit('PlayerBullet', this.takeBulletDamage);

        this.reel("run", 750, [
            [0,0], [1,0], [2,0], [3,0]
        ]);

        this.reel("idle", 400, [
            [0,0]
        ]);

        this.reel("attack", 500, [
            [0,1], [1,1], [2,1], [3,1]
        ]);

        this.animate("run", -1);

        this.onHit('Team1', function(e){
            if(!this.isPlaying("attack")){
                this.animate("attack", 1);
            }
            if(this.reelPosition() == 1){
                e[0].obj.takeDamage(this.damage);
                this.reelPosition(2);
            }      
        });

        //TODO this probably wont work since it doesnt on the bagger
        this.bind("MotionChange", function(mon){
            return function(){
                if(mon.velocity().x !== 0 || mon.velocity().y !== 0){
                    mon.animate("run", -1);
                }else if(!mon.isPlaying('bag')){
                    mon.animate("run", -1);
                }
            };            
        }(this));
        
    },
    moveSomewhere: function(){

    
        if(this.isPlaying("attack")){
            this.velocity().x = 1;   
            this.velocity().y = 1;
            return;
        }

        team1Target = findClosestTeam1(this.x, this.y);

        try{
            if(distanceToEntity(this.x, this.y, team1Target) < this.huntPeopleDistance){
                delta = findEntityDelta(this.x, this.y, team1Target);
                this.velocity().x = delta.vx*this.speed;
                this.velocity().y = delta.vy*this.speed;
                
                if(delta.vx > 0){
                    this.flip();
                }else{
                    this.unflip();
                }
            }else{
                //escape off screen until next body
                if(!this.isPlaying("run")){
                    this.animate("run", -1);
                }
                
                if(this.x < Crafty.viewport.width+this.huntPeopleDistance){
                    this.velocity().x = this.speed;
                    this.flip();
                }else{
                    this.velocity().x = 0;
                    this.velocity().y = 0;
                }
            }
        }catch(e){
            console.log(e);
        }

        // if(this.isPlaying("attack") && !this.hit('Team1')aaa && this.reelPosition() >= 3){
        //     this.animate('idle', -1);
        // }else if (this.isPlaying("attack")){
        //     this.velocity().x = 0;
        //     this.velocity().y = 0;
        //     return;
        // }
        
    },
    takeBulletDamage: function(hitData){
        
        this.health-=hitData[0].obj.attr('damage');
        hitData[0].obj.destroy();
        if (this.health < 1){
            this.death();
        }
    },
    death: function(){
        Game.addMonsterKillPoints(this.pointValue);
        this.destroy();
        Crafty.audio.play('monsterdeath');
        
        monsterBody = Crafty.e("SnekBody");
        
        if(this['_flipX']){
            monsterBody.flip();
        }
        monsterBody.x = this.x;
        monsterBody.y = this.y;
    }

});


Crafty.c('SnekBody', {
    required: "2D, Canvas, MonsterBodyActor, SpriteAnimation, spr_snek, Body",
    init: function(){
        this.origin("center");
        this.reel("death", 600, [
            [3,1]
        ]);
        this.animate("death", 1);
        // this.shift(0,0,0,-1*this.h/2);
        // this.height=this.height/8;
    }

});