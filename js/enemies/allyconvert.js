Crafty.c('AllyConvertCharacter', {
    required: "2D, Canvas, MonsterActor, spr_allyconvert, Motion, SpriteAnimation",
    init: function(){
        this.x = ((Crafty.viewport.width+50)*Math.random())-(Math.random()*50);
        this.y = (Crafty.viewport.height*Math.random())+75;
        this.origin("center");
        this.damage = 40;
        this.z = 750;
        this.health = 100;   
        this.pointValue = 15;
        this.findPlayerInterval = false;
        
        this.onHit('Projectile', this.takeBulletDamage);
        this.onHit('PlayerBullet', this.takeBulletDamage);

        this.collision([
            3,2,
            10,2,
            15,13,
            7,15,
            3,8,            
        ]);

        this.speed = 80;


        this.reel("run", 1000, [
            [0,0], [1,0], [2,0], [3,0]
        ]);

        this.reel("attack", 750, [
            [0,1], [1,1], [2,1], [3,1]
        ]);

        this.reel("convert", 750, [
            [0,3], [1,3], [2,3], [3,3]
        ]);

        // this.animate("run", -1);

        this.onHit('Team1', function(e){
            if(!this.isPlaying("attack")){
                this.animate("attack", 1);
            }
            if(this.reelPosition() == 1 && !this.attackCooling){
                e[0].obj.takeDamage(this.damage);
                this.reelPosition(2);
            }      
        });

        this.onHit('Team2', function(e){
            hitData = e[0];
            if (hitData.type === 'SAT') { // SAT, advanced collision resolution
                // move player back by amount of overlap
                this.x -= hitData.overlap * hitData.normal.x;
                this.y -= hitData.overlap * hitData.normal.y;
              } else { // MBR, simple collision resolution
                // move player to position before he moved (on respective axis)
                this[evt.axis] = evt.oldValue;
              }
        });
        
    },
    moveTowardsPlayer: function(){
        if(!this.findPlayerInterval){
            this.findPlayerInterval = setInterval(function(mon){ mon.moveTowardsPlayer(); }, 100, this);
        }
        team1Target = findClosestTeam1(this.x, this.y);

        if(typeof team1Target != 'undefined'){
            if(this.isPlaying("attack") && !this.hit('Team1') && this.reelPosition() >= 3){
                this.animate('run', -1);
            }else if (this.isPlaying("attack")){
                this.velocity().x = 0;
                this.velocity().y = 0;
                return;
            }else if (!this.isPlaying('run')){
                this.animate('run', -1);
            }
            try{
                delta = findEntityDelta(this.x, this.y, team1Target);
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
        this.destroy();
        Crafty.audio.play('monsterdeath');
        
        monsterBody = Crafty.e("AllyConvertBody");

        if(this['_flipX']){
            monsterBody.flip();
        }
        monsterBody.x = this.x;
        monsterBody.y = this.y;
    }

});

Crafty.c('AllyConvertBody', {
    required: "2D, Canvas, MonsterBodyActor, SpriteAnimation, spr_allyconvert, Body",
    init: function(){
        this.origin("center");
        this.reel("death", 1000, [
            [0,2], [1,2], [2,2], [3,2]
        ]);
        this.animate("death", 1);
        this.collision([
            1,11,
            15,11,
            15,15,
            1,15,
        ]);
    }

});