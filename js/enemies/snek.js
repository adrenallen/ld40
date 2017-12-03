Crafty.c('SnekCharacter', {
    required: "2D, Canvas, MonsterActor, spr_snek, Motion, SpriteAnimation",
    init: function(){
        this.x = ((Crafty.viewport.width+50)*Math.random())-(Math.random()*50);
        this.y = (Crafty.viewport.height*Math.random())+75;
        
        this.origin("center");
        this.damage = 30;
        this.z = 750;
        this.health = 85;
        this.meleeDistance = 60;

        this.rangeDistance = 150;

        this.fireSpread = 25;

        this.pointValue = 200;

        this.collision([
            6,1,
            7,29,
            23,31,
            30,22,
            18,22,
            21,13,
            21,0,
        ]);

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

        this.reel("rangeattack", 1500, [
            [0,1], [0,1], [1,1], [2,1], [3,1]
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
                    if(!mon.isPlaying('run')){
                        mon.animate("run", -1);
                    }                    
                }else if(!mon.isPlaying('attack') && !mon.isPlaying('run')){
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

        if(typeof team1Target != 'undefined'){

            try{
                dist = distanceToEntity(this.x, this.y, team1Target);
                delta = findEntityDelta(this.x, this.y, team1Target);
                
                if(dist < this.meleeDistance){

                    
                    //close nuff to hit, move toward and melee attempt
                    this.velocity().x = delta.vx*this.speed;
                    this.velocity().y = delta.vy*this.speed;    
                    
                    if(delta.vx > 0){
                        this.flip();
                    }else{
                        this.unflip();
                    }
                }else if(dist < this.rangeDistance){
                    //close enough to shoot at them, let's do that
                    //escape off screen until next body
                    
                    this.velocity().x = 0;
                    this.velocity().y = 0;

                    if(!this.isPlaying("rangeattack")){
                        this.animate("rangeattack", 1);
                        this.firingRange = false;
                    }

                    if(this.reelPosition() == 2 && !this.firingRange){
                        this.shouldFire(team1Target.x, team1Target.y);
                    }else if (this.reelPosition() > 2){
                        this.firingRange = false;
                    }
                }else if(!this.isPlaying("rangeattack")){
                    if(!this.isPlaying("run")){
                        this.animate("run", -1);
                    }
                    this.velocity().x = delta.vx*this.speed;
                    this.velocity().y = delta.vy*this.speed;    
                    
                    //move towards nearing team1
                }else{
                    if(this.reelPosition() == 2 && !this.firingRange){
                        this.shouldFire(team1Target.x, team1Target.y);
                    }
                }

                if(this.velocity().x > 0){
                    this.flip();
                }else if(this.velocity().x < 0){
                    this.unflip();
                }


            }catch(e){
                console.log(e);
            }
        }
        
    },
    shouldFire: function(x,y){
        if(!entityInViewport(this)){
            return; //don't fire from off screen
        }
        this.firingRange = true;
        for(var i = 0; i < 1; i++){
            setTimeout(function(x,y,snek){
                return function(){
                    bomb = Crafty.e('SnekBomb');
                    bomb.x = snek.x;
                    bomb.y = snek.y;
                    bomb.fireDirection(x, y);
            
                    bomb = Crafty.e('SnekBomb');
                    bomb.x = snek.x;
                    bomb.y = snek.y;
                    bomb.fireDirection(x, y+snek.fireSpread);
            
                    bomb = Crafty.e('SnekBomb');
                    bomb.x = snek.x;
                    bomb.y = snek.y;
                    bomb.fireDirection(x, y-snek.fireSpread);
                };
            }(x,y,this), i*100);
        }        
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
        
        Crafty.audio.play('monsterdeath');
        
        monsterBody = Crafty.e("SnekBody");
        
        if(this['_flipX']){
            monsterBody.flip();
        }
        monsterBody.x = this.x;
        monsterBody.y = this.y;
        this.destroy();
    }

});


Crafty.c('SnekBody', {
    required: "2D, Canvas, MonsterBodyActor, SpriteAnimation, spr_snek, Body",
    init: function(){
        this.origin("center");
        this.reel("death", 1000, [
            [2,1],[0,2],[1,2],[2,2],[3,2]
        ]);
        this.animate("death", 1);
        this.collision([
            2,24,
            27,27,
            31,31,
            2,31
        ]);
    }

});

Crafty.c('SnekBomb', {
    required: "2D, Canvas, Motion, spr_snekbomb, Collision, SpriteAnimation",
    init: function(){
        //TODO better sounds yo
        Crafty.audio.play('defaultgun');
        this.origin('center');
        this.bulletSpeed = 250;
        this.damage = 20;
        this.z = 999;
        this.collision([
            4,10,
            4,4,
            13,3,
            13,12,
        ]);

        this.reel('moving', 250, [
            [0,0],[1,0],[2,0]
        ]);

        this.animate('moving', -1);

        this.onHit('Team1', function(e){
            hitData = e[0].obj;
            hitData.takeDamage(this.damage);
            Crafty.e("SnekBombPool").attr({x: this.x, y: this.y});
            this.destroy();
        });
    },
    fireDirection: function(x,y){

        calcs = calculateVXYRotation(x, y, this.attr('x'), this.attr('y'));

        // this.attr({rotation: calcs.rotation});
        // this.flip();
        
        //set velocity
        this.velocity().x = calcs.vx*this.bulletSpeed;
        this.velocity().y = calcs.vy*this.bulletSpeed;

        if(this.velocity().x > 0){
            this.flip();
        }

        
    }
});

Crafty.c('SnekBombPool', {
    required: "2D, Canvas, Motion, spr_snekbombpool, Collision, SpriteAnimation, Scrolls",
    init: function(){
        this.origin('center');
        this.damage = 3;
        this.z = 5;
        this.collision([
            1,1,
            15,1,
            15,15,
            1,15
        ]);

        this.onHit('Team1', function(e){
            hitData = e[0].obj;

            if(hitData.tookPoolDamage == true){
                return;
            }else{
                hitData.takeDamage(this.damage);
                hitData.tookPoolDamage = true;
                setTimeout(function(obj){
                    return function(){
                        obj.tookPoolDamage = false;
                    };
                }(hitData),500);
            }
        });

        setTimeout(function(pool){
            return function(){
                pool.destroy();
            };
        }(this),7500);
    },
});