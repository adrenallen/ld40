const movementSpeed = 100;

Crafty.c('PlayerCharacterArms', {
    required: "2D, Canvas, Motion, spr_player_arms, Mouse",
    init: function(){
        this.origin('center');
        this.flipped = false;
    },
    pointToMouse: function(e){
        calcs = calculateVXYRotation(e.offsetX, e.offsetY, this.x, this.y);
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

Crafty.c('PlayerCharacter', {
    required: "2D, Canvas, Collision, Fourway, Motion, spr_player, Team1",
    init: function(){
        this.origin("center");
        this.health = 50;
        
        this.collision([3,0,
                        12, 0,
                        12, 16,
                        3, 16,
                        3, 8]);

        //TODO - change sprite direction based on which way pointing
        this.direction = 1;

        this.arms = Crafty.e('PlayerCharacterArms');
        this.attach(this.arms);

        //TODO - some kind of timeout so you can only be hurt so many times a second
        
        this.fourway(movementSpeed);
        this.onHit('Projectile', this.takeBulletDamage);
        this.onHit('MonsterActor', this.takeMonsterDamage);

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
    },

    fireBullet: function(e){
        var newBullet = Crafty.e("PlayerBullet");

        //TODO - make it appear ahead of the way we are looking slightly
        newBullet.x = this.attr('x');
        newBullet.y = this.attr('y'); //8 because sprite is 16x16
        //set the click direction for bullet
        
        newBullet.clickDirection(e.offsetX, e.offsetY);

        // Crafty.e("2D, Canvas, Color").attr({x: e.offsetX, y: e.offsetY, w:10, h:10}).color('red');
    },

    //attempt to revive a body you are touching
    attemptReviveBody: function(){
        this.checkHits('MonsterBodyActor').bind('HitOn', function(hitData){
            //hitData[0].obj is the obj
            hitData[0].obj.revive();
        });
    },

    stopAttemptReviveBody: function(){
        this.ignoreHits('MonsterBodyActor');
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
        
        if (this.health < 1){
            this.death();
        }
    },
    death: function(){
        Crafty.scene('GameOver');
    }
});

Crafty.c('Team1', {
    
});
Crafty.c('Team2', {
    
});

Crafty.c('AllyCharacterArms', {
    required: "2D, Canvas, Motion, spr_ally1_arms",
    init: function(){
        this.origin('center');
        this.flipped = false;
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
    required: "2D, Canvas, Collision, SpriteAnimation, Motion, spr_ally1, Team1",
    init: function(){
        this.speed = 75;
        this.followDistance = 40;
        this.findPlayerInterval = false;
        this.health = 10;
        this.arms = 
        this.bind('MoveTowardsPlayer', this.moveTowardsPlayer);

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

        this.onHit('MonsterActor', this.takeMonsterDamage);

        setInterval(function(ally){
            t2Target = findClosestTeam2(ally.x, ally.y);
            ally.arms.pointToTarget(t2Target);
            ally.fireBullet(t2Target.x, t2Target.y);
        },500, this);
    },
    moveTowardsPlayer: function(){
        if (this.findPlayerInterval === false){
            this.findPlayerInterval = setInterval(function(mon){ mon.moveTowardsPlayer(); }, 100, this);
            this.arms.visible = true;   //This doesn't work quite right but close enuff
        }
        try{
            
            if(distanceToPlayer(this.x, this.y) < this.followDistance && typeof this.delta !== 'undefined'){
                this.velocity().x = this.delta.vx*this.speed/2;
                this.velocity().y = this.delta.vy*this.speed/2;
            }else{
                this.delta = findPlayerDelta(this.x, this.y);
                this.velocity().x = this.delta.vx*this.speed;
                this.velocity().y = this.delta.vy*this.speed;
            }
            
        }catch(e){
            console.log('got error', e, 'clearing movement interval');
            clearInterval(this.findPlayerInterval);
        }
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

        //TODO - make it appear ahead of the way we are looking slightly
        newBullet.x = this.attr('x');
        newBullet.y = this.attr('y');
        //set the click direction for bullet
        
        newBullet.clickDirection(x, y);

        // Crafty.e("2D, Canvas, Color").attr({x: e.offsetX, y: e.offsetY, w:10, h:10}).color('red');
    },
    death: function(){
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
        this.x = Crafty.viewport.width+25
        this.y = Crafty.viewport.height*Math.random();
        this.origin("center");
        this.damage = 15;

        this.collision([
            3,0,
            12, 0,
            12, 16,
            3, 16
            
        ]);

        this.speed = 25;


        this.findPlayerInterval = setInterval(function(mon){ mon.moveTowardsPlayer(); }, 100, this);


        this.reel("idle", 1000, [
            [0,0], [1,0], [2,0], [3,0]
        ]);

        this.animate("idle", -1);


        

        //TODO better collision
        // this.collision([-4, 8, -4, 4, 4, 4, 4, 8]);
    },
    moveTowardsPlayer: function(){
        team1Target = findClosestTeam1(this.x, this.y);
        try{
            delta = findEntityDelta(this.x, this.y, team1Target);
            this.velocity().x = delta.vx*this.speed;
            this.velocity().y = delta.vy*this.speed;
        }catch(e){
            clearInterval(this.findPlayerInterval);
        }
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
    init: function(){
        this.z = 0;
    }
})

//dead bodies of monsters
Crafty.c('AllyBodyActor', {
    required: "2D, Canvas, Collision",
    init: function(){
        
    }
    
    
});

Crafty.c('MonsterBody1', {
    required: "2D, Canvas, MonsterBodyActor, SpriteAnimation, spr_monster1_body, Body",
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
        this.health = 15;   

        this.onHit('Projectile', this.takeBulletDamage);
        this.onHit('PlayerBullet', this.takeBulletDamage);

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
    },
    takeBulletDamage: function(hitData){
        
        this.health-=hitData[0].obj.attr('damage');
        hitData[0].obj.destroy();
        if (this.health < 1){
            this.death();
        }
    },
    death: function(){
        this.destroy();
        monsterBody = Crafty.e("MonsterBody1");
        
        monsterBody.x = this.x;
        monsterBody.y = this.y;
        Crafty.e("MonsterCharacter1");
    }
});

//dead bodies of monsters
Crafty.c('MonsterBodyActor', {
    required: "2D, Canvas, Collision",
    init: function(){
        this.isReviving = false;
    },
    revive: function(){
        this.destroy();

        //added this to avoid duplicate revives for one body
        if (!this.isReviving){
            this.isReviving = true;
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
    required: "2D, Canvas, Motion, spr_bullet",
    init: function(){
        
        this.origin('center');
        this.bulletSpeed = 500;
        this.damage = 5;
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

    var target = team2[0];
    var closestDistance = -1;

    for(var i = 0; i < team2.length; i++){
        dist = distanceToEntity(x,y,team2[i]);
        if(closestDistance < 0 || closestDistance > dist){
            target = team2[i];
            closestDistance = dist;
        }
    }

    return target;
}