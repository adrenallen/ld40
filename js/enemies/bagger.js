Crafty.c('BaggerCharacter', {
    required: "2D, Canvas, MonsterActor, spr_bagger, Motion, SpriteAnimation",
    init: function(){
        this.x = ((Crafty.viewport.width+50)*Math.random())-(Math.random()*50);
        this.y = (Crafty.viewport.height*Math.random())+75;
        
        this.origin("center");
        this.damage = 30;
        this.z = 750;
        this.bodiesBagged = 0;
        this.bodiesNeeded = 5;
        this.bodyHealthValue = 10;
        this.health = 65;
        this.huntPeopleDistance = 50;
        this.pointValue = 100;

        
        this.collision([
            2,6,
            8,4,
            14,10,
            11,14,
            3,11,
            1,9
        ]);

        this.speed = 150;

        this.pathfindingInterval = setInterval(function(mon){ mon.moveSomewhere(); }, 100, this);
        
        this.onHit('Projectile', this.takeBulletDamage);
        this.onHit('PlayerBullet', this.takeBulletDamage);

        this.reel("run", 750, [
            [0,0], [1,0], [2,0], [3,0]
        ]);

        this.reel("idle", 400, [
            [0,0]
        ]);

        this.reel("bag", 2500, [
            [0,1], [1,1], [2,1], [3,1],
            [0,1], [1,1], [2,1], [3,1],
            [0,1], [1,1], [2,1], [3,1]
        ]);

        this.reel("attack", 400, [
            [0,2], [1,2], [2,2], [3,2]
        ]);
        
        
        if(!this.isPlaying("run")){
            this.animate("run", -1);
        }
        

        this.onHit('Team1', function(e){
            if(!this.isPlaying("attack")){
                this.animate("attack", 1);
            }
            if(this.reelPosition() == 1){
                e[0].obj.takeDamage(this.damage);
                this.reelPosition(2);
            }      
        });

        this.onHit('Body', function(e){
            if(!this.isPlaying("bag")){
                this.animate("bag", 1);
            }
            this.x = e[0].obj.x;
            this.y = e[0].obj.y;
            if(this.reelPosition() == 11){
                Crafty.e('BloodSpot').attr({x: e[0].obj.x, y: e[0].obj.y});
                e[0].obj.destroy();

                this.bodiesBagged++;
                Game.collectedBodies++;
                this.health+= this.bodyHealthValue;
            }
        });

        this.bind("MotionChange", function(mon){
            return function(){
                if(mon.velocity().x !== 0 || mon.velocity().y !== 0){
                    if(!mon.isPlaying('run')){
                        mon.animate("run", -1);
                    }                    
                }else if(!mon.isPlaying('bag')){
                    if(!mon.isPlaying('run')){
                        mon.animate("run", -1);
                    }                    
                }
            };            
        }(this));
        
    },
    moveSomewhere: function(){
        bodyTarget = findClosestBody(this.x, this.y);

        if(bodyTarget !== null){
            try{

                delta = findEntityDelta(this.x, this.y, bodyTarget);
                this.velocity().x = delta.vx*this.speed;
                this.velocity().y = delta.vy*this.speed;

                if(delta.vx > 0){
                    this.flip();
                }else{
                    this.unflip();
                }
                
            }catch(e){
                // clearInterval(this.findPlayerInterval);
                console.log(e);
            }    
        }else{
            if(this.isPlaying("attack")){
                this.velocity().x = 1;   
                this.velocity().y = 1;
                return;
            }

            team1Target = findClosestTeam1(this.x, this.y);
            if(typeof team1Target == 'undefined'){
                return;
            }

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
                    if(!this.isPlaying('run')){
                        this.animate('run', -1);
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
        
        monsterBody = Crafty.e("BaggerBody");
        
        if(this['_flipX']){
            monsterBody.flip();
        }
        monsterBody.x = this.x;
        monsterBody.y = this.y;
    }

});


Crafty.c('BaggerBody', {
    required: "2D, Canvas, MonsterBodyActor, SpriteAnimation, spr_bagger, Body",
    init: function(){
        this.origin("center");
        this.reel("death", 600, [
            [0,3], [1,3], [2,3], [3,3]
        ]);
        this.animate("death", 1);
    }

});