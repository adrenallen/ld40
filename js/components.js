const movementSpeed = 100;
const reviveConversionTime = 60000; //actual conversion time is Math.random() to this

Crafty.c('PlayerCharacterArms', {
    required: "2D, Canvas, Motion, spr_player_arms, Mouse",
    init: function(){
        this.origin('center');
        this.flipped = false;
        this.z=999;
    },
    pointToMouse: function(e){
        calcs = calculateVXYRotation(e.offsetX, e.offsetY, this.x, this.y);
        this.rotation = calcs.rotation-90;

        if(this.rotation > 90 || this.rotation < -90){
            if(!this.flipped){
                this.flip();
                Crafty('PlayerCharacter').get(0).flip();
                this.flipped = true;
            }
            this.rotation-=180;
        }else{
            if(this.flipped){
                this.unflip();
                Crafty('PlayerCharacter').get(0).unflip();
                this.flipped = false;
            }
        }
    }
});

Crafty.c('PlayerCharacter', {
    required: "2D, Canvas, Collision, Fourway, Motion, spr_player, Team1, SpriteAnimation",
    init: function(){
        this.origin("center");
        this.health = 200;
        this.z=998;
        this.collision([3,0,
                        12, 0,
                        12, 16,
                        3, 16,
                        3, 8]);


        this.healthBar = Crafty.e('PlayerHealthBar');
        Game.scoreDisplay = Crafty.e('PlayerScore');
        this.healthBar.maxHealth = this.health;
        this.turboFireSpeed = 10;
        this.defaultFireSpeed = 200;
        this.ammoCount = 0;

        this.fireSpeed = this.defaultFireSpeed;
        this.fireCooldown = false;

        
        this.direction = 1;

        this.arms = Crafty.e('PlayerCharacterArms');

        this.attach(this.arms);

        this.reel('idle', 1000, [[0,0], [0,0]]);
        // this.animate('idle', -1);
        

        this.reel("revive", 1500, [
            [0,1], [1,1], [2,1], [3,1]
        ]);

        this.reel("run", 500, [
            [0,2], [1,2], [2,2], [3,2]
        ]);

        this.reel("death", 500, [
            [0,3], [1,3], [2,3], [3,3]
        ]);

        this.reel("beat", 2000, [
            [0,4], [1,4], [2,4], [3,4],
            [1,4], [2,4], [3,4],
            [1,4], [2,4], [3,4],
            [1,4], [2,4], [3,4],
            [1,4], [2,4], [3,4],
            [1,4], [2,4], [3,4]
        ]);

        
        
        this.fourway(movementSpeed);
        this.onHit('Projectile', this.takeBulletDamage);

        //this is now done via the monster classes
        // this.onHit('MonsterActor', this.takeMonsterDamage);

        
        this.bind("MotionChange", function(player){
            return function(){
                if(player.velocity().x !== 0 || player.velocity().y !== 0){
                    if(!player.isPlaying('run') && !player.isPlaying('revive') && !player.isPlaying('beat')){
                        player.animate("run", -1);
                    }
                    
                }else if(!player.isPlaying('revive') && !player.isPlaying('beat')){
                    player.animate("idle", -1);
                }
            };            
        }(this));

        this.onHit('Solid', function(e){
            hitData = e[0];
            if (hitData.type === 'SAT') { // SAT, advanced collision resolution
                // move player back by amount of overlap
                this.x -= hitData.overlap * hitData.normal.x;
                this.y -= hitData.overlap * hitData.normal.y;
              } else { // MBR, simple collision resolution
                // move player to position before he moved (on respective axis)
                // this[evt.axis] = evt.oldValue;
              }
        });

        this.onHit('SolidBottomPlayerOnly', function(e){
            hitData = e[0];
            if (hitData.type === 'SAT') { // SAT, advanced collision resolution
                // move player back by amount of overlap
                this.y -= hitData.overlap * hitData.normal.y;
              } else { // MBR, simple collision resolution
                // move player to position before he moved (on respective axis)
                // this[evt.axis] = evt.oldValue;
              }
        });

        this.onHit('SolidLeftPlayerOnly', function(e){
            hitData = e[0];
            if (hitData.type === 'SAT') { // SAT, advanced collision resolution
                // move player back by amount of overlap
                this.x -= hitData.overlap * hitData.normal.x;
              } else { // MBR, simple collision resolution
                // move player to position before he moved (on respective axis)
                // this[evt.axis] = evt.oldValue;
              }
        });

        this.onHit('SolidRightPlayerOnly', function(e){
            hitData = e[0];
            if (hitData.type === 'SAT') { // SAT, advanced collision resolution
                // move player back by amount of overlap
                this.x -= Math.abs(hitData.overlap * hitData.normal.x);
              } else { // MBR, simple collision resolution
                // move player to position before he moved (on respective axis)
                // this[evt.axis] = evt.oldValue;
              }
        });

        this.onHit('MoveBox', function(e){
            hitData = e[0];
            if (hitData.type === 'SAT') { // SAT, advanced collision resolution
                // move player back by amount of overlap
                if(Game.mapScrollEnabled){
                    this.x -= Math.abs(hitData.overlap * hitData.normal.x);
                }
                Game.moveMap(hitData.overlap * hitData.normal.x);
              } 
        });

        
    },
    pickupTurboGun: function(){
        this.fireSpeed = this.turboFireSpeed;
        this.fireCooldown = false;
        this.ammoCount = 150;
    },

    fireBullet: function(e){

        if(this.isPlaying('revive') || this.isPlaying('beat')){
            return; //cant fire while reviving
        }

        if(this.fireCooldown){
            return; //cooldown in effect
        }

        this.fireCooldown = true;
        setTimeout(function(e){ return function(){
            e.fireCooldown = false;
        }}(this), this.fireSpeed);

        if(this.ammoCount <= 0 && this.fireSpeed != this.defaultFireSpeed){
            this.fireSpeed = this.defaultFireSpeed;
            this.fireCooldown = true;
        }else{
            this.ammoCount--;
        }
        var newBullet = Crafty.e("PlayerBullet");

        newBullet.x = this.attr('x');
        newBullet.y = this.attr('y'); //8 because sprite is 16x16
        //set the click direction for bullet
        
        newBullet.clickDirection(e.offsetX, e.offsetY);

        // Crafty.e("2D, Canvas, Color").attr({x: e.offsetX, y: e.offsetY, w:10, h:10}).color('red');
    },

    //attempt to revive a body you are touching
    attemptReviveBody: function(){
        if(this.isPlaying('revive') || this.isPlaying('beat')){
            return; //can't revive we are already doing it
        }
        this.checkHits('ReviveBody').bind('HitOn', this.reviveBodyBind);
    },
    reviveBodyBind: function(hitData){
        player = Crafty('PlayerCharacter').get(0);
        
        player.arms.visible = false;
        
        // player.resetMotion();
        player.fourway(0.0000001);
        player.animate("revive", 1);
        

        setTimeout(function(e){
            return function(){
                e.revive();
                player = Crafty('PlayerCharacter').get(0);
                player.arms.visible=true;
                player.animate('idle', -1);
                player.fourway(movementSpeed);
            };
        }(hitData[0].obj), 1500);


        //hitData[0].obj is the obj
        
    },

    //attempt to beat the body you are touching, removes it from the game
    attemptBeatBody: function(){
        if(this.isPlaying('beat') || this.isPlaying('revive')){
            return; //can't revive we are already doing it
        }
        this.checkHits('Body').bind('HitOn', this.beatBodyBind);
    },

    beatBodyBind: function(hitData){
        player = Crafty('PlayerCharacter').get(0);
        
        player.arms.visible = false;
        
        // player.resetMotion();
        player.fourway(0.0000001);
        player.animate("beat", 1);

        setTimeout(function(e){
            return function(){
                Crafty.e('BloodSpot').attr({x: e.x, y: e.y});
                e.destroy();
                player = Crafty('PlayerCharacter').get(0);
                player.arms.visible=true;
                player.animate('idle', -1);
                player.fourway(movementSpeed);
            };
        }(hitData[0].obj), 2000);
        
    },

    stopAttemptReviveBody: function(){
        this.unbind('HitOn', this.reviveBodyBind);
        this.ignoreHits('ReviveBody');
    },

    stopAttemptBeatBody: function(){
        this.unbind('HitOn', this.beatBodyBind);
        this.ignoreHits('Body');
    },

    takeBulletDamage: function(hitData){
        this.takeDamage(hitData[0].obj.attr('damage'));
        hitData[0].obj.destroy();
    },
    takeMonsterDamage: function(hitData){
        this.takeDamage(hitData[0].obj.attr('damage'));
    },
    takeDamage: function(dmg){
        this.health-=dmg;

        Crafty('DamageOverlay').get(0).showDamage();
        
        this.healthBar.adjustHealthBar(this.health);
        if (this.health < 1){
            this.death();
        }
    },
    takeHeal: function(heal){
        this.health += heal;
        if(this.health > this.healthBar.maxHealth){
            this.health = this.healthBar.maxHealth;
        }
        this.healthBar.adjustHealthBar(this.health);        
    },
    death: function(){
        
        playerBody = Crafty.e("PlayerBody");
        playerBody.x = this.x;
        playerBody.y = this.y;
        this.destroy();

        Crafty.e('GameOverModal');
    }
});

Crafty.c('PlayerBody', {
    required: "2D, Canvas, SpriteAnimation, spr_player, Body",
    init: function(){
        this.origin("center");
        this.reel("death", 500, [
            [0,3], [1,3], [2,3], [3,3]
        ]);
        this.animate("death", 1);
    }

});


Crafty.c('Team1', {
});
Crafty.c('Team2', {
    required: "Scrolls"
    
});

Crafty.c('AllyCharacterArms', {
    required: "2D, Canvas, Motion, spr_ally1_arms",
    init: function(){
        this.origin('center');
        this.flipped = false;
        this.z = 801;

    },
    pointToTarget: function(e){
        calcs = calculateVXYRotation(e.x, e.y, this.x, this.y);
        this.rotation = calcs.rotation-90;

        if(this.rotation > 90 || this.rotation < -90){
            if(!this.flipped){
                this.flip();
                this.flipped = true;
            }
            this.rotation-=180;
        }else{
            if(this.flipped){
                this.unflip();
                this.flipped = false;
            }
        }
    }
});

Crafty.c('AllyCharacter', {
    required: "2D, Canvas, Collision, SpriteAnimation, Motion, spr_ally1, Team1, Scrolls",
    init: function(){
        this.speed = 75;
        this.followDistanceMax = 40;
        this.followDistanceMin = 20;
        this.followDistance = Math.random()*this.followDistanceMax;
        this.z = 800;
        this.collision([3,0,
            12, 0,
            12, 16,
            3, 16,
            3, 8]);
        this.pointValue = 10;


        this.reel("run", 500, [
            [0,4], [1,4], [2,4], [3,4]
        ]);

        this.reel("idle", 500, [
            [0,0]
        ]);

        if(this.followDistance < this.followDistanceMin){
            this.followDistance+= this.followDistanceMin;
        }
        this.findPlayerInterval = false;
        this.health = 50;
        this.waitChance = Math.random();

        this.bind('MoveTowardsPlayer', this.moveTowardsPlayer);
        this.bind('ConvertToMonster', this.convertToMonster);

        
        this.arms = Crafty.e('AllyCharacterArms');
        this.arms.visible = false;
        this.attach(this.arms);

        this.onHit('Solid', function(e){
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

        this.onHit('Team1', function(e){
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

        // this.onHit('MonsterActor', this.takeMonsterDamage);

        this.shootInterval = setInterval(function(ally){
            if(ally.health <= 0){
                clearInterval(this.shootInterval);
            }
            t2Target = findClosestTeam2(ally.x, ally.y);
            if(t2Target){
                ally.arms.pointToTarget(t2Target);
                ally.fireBullet(t2Target.x, t2Target.y);
            }
        },800, this);
    },
    moveTowardsPlayer: function(){
        if(Crafty("PlayerCharacter").get().length < 1){
            return;
        }
        if (this.findPlayerInterval === false){
            this.findPlayerInterval = setInterval(function(mon){ mon.moveTowardsPlayer(); }, 100, this);
            this.arms.visible = true;   //This doesn't work quite right but close enuff
        }
        try{
            
            if(distanceToPlayer(this.x, this.y) < this.followDistance && typeof this.delta !== 'undefined'){
                if(Math.random() > this.waitChance || this.waiting){
                    this.velocity().x = 0;
                    this.velocity().y = 0;
                    this.waiting = true;
                }else{
                    this.velocity().x = this.delta.vx*this.speed/2;
                    this.velocity().y = this.delta.vy*this.speed/2;
                }
            }else{
                this.delta = findPlayerDelta(this.x, this.y);
                this.velocity().x = this.delta.vx*this.speed;
                this.velocity().y = this.delta.vy*this.speed;
            }

            if(this.velocity().x > 0){
                this.unflip();
            }else if (this.velocity().x < 0){
                this.flip();
            }

            if ((this.velocity().x !== 0 || this.velocity().y !== 0) && !this.isPlaying('run')){
                this.animate('run', -1);
            }else if (!this.isPlaying('idle')){
                this.animate('idle', -1);
            }
            
        }catch(e){
            console.log('got error', e, 'clearing movement interval');
            clearInterval(this.findPlayerInterval);
        }
    },
    convertToMonster: function(){
        Crafty.audio.play('convert');
        monster = Crafty.e('AllyConvertCharacter');
        monster.x = this.x;
        monster.y = this.y;
        monster.animate('convert');
        monster.one('AnimationEnd', function(e){
            return function(){
                e.moveTowardsPlayer();
            };            
        }(monster));


        clearInterval(this.shootInterval);
        Game.addAllyPoints(this.pointValue);
        this.destroy();
    },
    takeMonsterDamage: function(hitData){
        this.takeDamage(hitData[0].obj.attr('damage'));
    },
    takeDamage: function(dmg){
        this.health-=dmg;
        
        if (this.health < 1){
            this.death();
        }
    },
    fireBullet: function(x,y){
        var newBullet = Crafty.e("PlayerBullet");

        
        newBullet.x = this.attr('x');
        newBullet.y = this.attr('y');
        //set the click direction for bullet
        
        newBullet.clickDirection(x, y);

        // Crafty.e("2D, Canvas, Color").attr({x: e.offsetX, y: e.offsetY, w:10, h:10}).color('red');
    },
    death: function(){
        Crafty.audio.play('allydeath');
        clearInterval(this.conversionTimer);
        clearInterval(this.shootInterval);
        Game.addAllyPoints(this.pointValue);
        this.destroy();
        allyBody = Crafty.e("AllyBody1");
        
        allyBody.x = this.x;
        allyBody.y = this.y;

    }

});


//TODO - make the monster sprite sheet varied and pick a random row for different looks
Crafty.c('MonsterCharacter1', {
    required: "2D, Canvas, MonsterActor, spr_monster1, Motion, SpriteAnimation",
    init: function(){
        this.x = ((Crafty.viewport.width+50)*Math.random())-(Math.random()*50);
        this.y = (Crafty.viewport.height*Math.random())+75;
        this.origin("center");
        this.damage = 25;
        this.z = 750;
        this.health = 20;   
        this.pointValue = 10;
        
        this.onHit('Projectile', this.takeBulletDamage);
        this.onHit('PlayerBullet', this.takeBulletDamage);

        this.collision([
            3,0,
            12, 0,
            12, 16,
            3, 16
            
        ]);

        this.speed = 45;
        

        this.findPlayerInterval = setInterval(function(mon){ mon.moveTowardsPlayer(); }, 100, this);


        this.reel("idle", 1000, [
            [0,0], [1,0], [2,0], [3,0]
        ]);

        this.reel("attack", 750, [
            [0,2], [1,2], [2,2], [3,2]
        ]);

        this.animate("idle", -1);

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
        team1Target = findClosestTeam1(this.x, this.y);

        if( typeof team1Target == 'undefined'){
            return;
        }

        if(this.isPlaying("attack") && !this.hit('Team1') && this.reelPosition() >= 3){
            this.animate('idle', -1);
        }else if (this.isPlaying("attack")){
            this.velocity().x = 0;
            this.velocity().y = 0;
            return;
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
        
        monsterBody = Crafty.e("MonsterBody1");
        
        if(this['_flipX']){
            monsterBody.flip();
        }
        monsterBody.x = this.x;
        monsterBody.y = this.y;
        // Crafty.e("MonsterCharacter1");
    }

});

Crafty.c('AllyBody1', {
    required: "2D, Canvas, AllyBodyActor, SpriteAnimation, spr_ally1_body, Body",
    init: function(){
        this.origin("center");
        this.reel("death", 500, [
            [0,3], [1,3], [2,3], [3,3]
        ]);
        this.animate("death", 1);
    }

});

Crafty.c('Body', {
    required: "Scrolls, Collision",
    init: function(){
        this.z = 1;

        this.onHit('SolidLeftPlayerOnly', this.removeBody);

    },
    removeBody: function(e){
        if(!entityInViewport(this)){
            // this.destroy();
        }
        
    }
});

Crafty.c('ReviveBody', {
    required: "Scrolls, Body",
    init: function(){
        this.z = 1;
    }
});

//dead bodies of monsters
Crafty.c('AllyBodyActor', {
    required: "2D, Canvas, Collision",
    init: function(){
        
    }
    
    
});

Crafty.c('MonsterBody1', {
    required: "2D, Canvas, MonsterBodyActor, SpriteAnimation, spr_monster1_body, ReviveBody",
    init: function(){
        this.origin("center");
        this.reel("death", 500, [
            [0,1], [1,1], [2,1], [3,1]
        ]);
        this.animate("death", 1);
    }

});

Crafty.c('MonsterActor', {
    required: "2D, Canvas, Collision, Team2",
    init: function(){
        

        this.onHit('Solid', function(e){
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
    }
});

//dead bodies of monsters
Crafty.c('MonsterBodyActor', {
    required: "2D, Canvas, Collision",
    init: function(){
        this.isReviving = false;
        this.collision([1,13,
                        14,13,
                        14,15,
                        1,15
                    ])
    },
    revive: function(){
        this.destroy();

        //added this to avoid duplicate revives for one body
        if (!this.isReviving){
            this.isReviving = true;
            Crafty.audio.play('revive');
            newAlly = Crafty.e('AllyCharacter');
            newAlly.x = this.x;
            newAlly.y = this.y;
            newAlly.reel("standing", 500, [
                [0,2], [1,2], [2,2], [3,2], [0,0]
            ]);
            newAlly.animate("standing", 1);

            newAlly.bind('AnimationEnd', function(e){
                e.trigger('MoveTowardsPlayer');
            }(newAlly));

            newAlly.conversionTimer = setTimeout(function(e){
                return function(){ e.convertToMonster(); }; }(newAlly), Math.floor(reviveConversionTime*Math.random()));
        }
    },
    
});

Crafty.c('Projectile', {
    required: "2D, Canvas",
    init: function(){
        this.damage = 1;
    }
});

Crafty.c('PlayerBullet', {
    required: "2D, Canvas, Motion, spr_bullet, Collision",
    init: function(){
        Crafty.audio.play('defaultgun');
        this.origin('center');
        this.bulletSpeed = 500;
        this.damage = 10;
        this.collision([
            6,5,
            10,5,
            10,9,
            6,9
        ]);
    },

    clickDirection: function(x,y){

        calcs = calculateVXYRotation(x, y, this.attr('x'), this.attr('y'));

        this.attr({rotation: calcs.rotation});
        
        
        //set velocity
        this.velocity().x = calcs.vx*this.bulletSpeed;
        this.velocity().y = calcs.vy*this.bulletSpeed;
        


        
    }
});






function calculateVXYRotation(destX, destY, originX, originY){
         // //set rotation
         deltaY = destY-originY;
         deltaX = destX-originX;
 
         RAD2DEG = 180 / Math.PI;
         rotRads = Math.atan2(deltaY, deltaX);
 
         rotDeg = (rotRads * RAD2DEG)+90;
 
         vx = Math.cos(rotRads);
         vy = Math.sin(rotRads);
         
        return {vx: vx/(Math.abs(vx)+Math.abs(vy)),
                vy: vy/(Math.abs(vx)+Math.abs(vy)),
                rotation: rotDeg};
}

function calculateDistanceBetween(destX, destY, originX, originY){
    // //set rotation
    v1 = new Crafty.math.Vector2D(destX, destY);
    v2 = new Crafty.math.Vector2D(originX, originY);
    return Math.abs(v2.distance(v1));
}

function distanceToPlayer(x, y){
    player = Crafty('PlayerCharacter').get(0);
    return distanceToEntity(x,y,player);
}

function distanceToEntity(x,y,ent){
    if (typeof ent == 'undefined'){
        return 0;
    }
    return calculateDistanceBetween(ent.attr('x'), ent.attr('y'), x, y);
}

function findPlayerDelta(x,y){
    player = Crafty('PlayerCharacter').get(0);
    return calculateVXYRotation(player.x, player.y, x,y);
}

function findEntityDelta(x,y,ent){
    return calculateVXYRotation(ent.x, ent.y, x,y);
}

//find closets team1 (friendly) target
function findClosestTeam1(x,y){
    team1 = Crafty('Team1').get();
    // console.log(team1);

    var target = team1[0];
    var closestDistance = -1;

    for(var i = 0; i < team1.length; i++){
        dist = distanceToEntity(x,y,team1[i]);
        if(closestDistance < 0 || closestDistance > dist){
            target = team1[i];
            closestDistance = dist;
        }
    }

    return target;
}

//find closets team2 (enemy) target
function findClosestTeam2(x,y){
    team2 = Crafty('Team2').get();

    var target = null;
    var closestDistance = -1;

    for(var i = 0; i < team2.length; i++){
        if(!entityInViewport(team2[i])){
            continue;
        }
        dist = distanceToEntity(x,y,team2[i]);
        if(closestDistance < 0 || closestDistance > dist){
            target = team2[i];
            closestDistance = dist;
        }
    }

    return target;
}

//find closets team1 (friendly) target
function findClosestBody(x,y){
    bodies = Crafty('Body').get();
    // console.log(team1);

    var target = null;
    var closestDistance = -1;

    for(var i = 0; i < bodies.length; i++){
        dist = distanceToEntity(x,y,bodies[i]);
        if(closestDistance < 0 || closestDistance > dist){
            target = bodies[i];
            closestDistance = dist;
        }
    }

    return target;
}

function entityInViewport(ent){
    if(ent.x > Crafty.viewport.width || ent.x < 0 || ent.y > Crafty.viewport.height || ent.y < 0){
        return false;
    }
    return true;
}