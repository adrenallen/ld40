const gameWidth = 350;
const gameHeight = 250;
const topWalkBound = 75;
const maxMonsters = 3;

Game = {
    levelProgress: 0,
    monsterKillPoints: 0,
    allyPoints: 0,
    difficultyMultiplier: 1,
    start: function(){
        Crafty.init(gameWidth,gameHeight);
        Crafty.background('gray');
        Crafty.viewport.scale(5);
        Crafty.scene('Loading');
    },
    addMonster: function(x,y){
        if(Crafty("MonsterActor").get().length > maxMonsters){
            return false;
        }else{
            monster = Crafty.e("MonsterCharacter1");
            if (x && y){
                monster.x = x;
                monster.y = y;
            }else{
                monster.x = gameWidth+(Math.random()*topWalkBound);
                monster.y = (gameHeight*Math.random())+topWalkBound;
            }
        }
    },
    addBagger: function(x,y){
        if(Crafty("MonsterActor").get().length > maxMonsters){
            return false;
        }else{
            monster = Crafty.e("BaggerCharacter");
            if (x && y){
                monster.x = x;
                monster.y = y;
            }else{
                monster.x = gameWidth+(Math.random()*topWalkBound);
                monster.y = (gameHeight*Math.random())+topWalkBound;
            }
        }
    },
    moveMap: function(v){
        moveThese = Crafty("Scrolls").get();
        for (var i = 0; i < moveThese.length; i++){
            moveThese[i].shift(-1*v,0,0,0);
        }
        this.levelProgress += v;
        this.scoreDisplay.updateScore(this.scoreCalculator());
        // console.log(this.levelProgress);
        GameDirector.checkForEvent(this.levelProgress);
    },
    difficultyCalculator: function(){
    },
    addMonsterKillPoints: function(points){
        this.monsterKillPoints += points;
        this.scoreDisplay.updateScore(this.scoreCalculator());
    },
    addAllyPoints: function(points){
        this.allyPoints += points;
        this.scoreDisplay.updateScore(this.scoreCalculator());
    },
    scoreCalculator: function(){
        return Math.round(this.monsterKillPoints-this.allyPoints+this.levelProgress);
    },
    //fake distance is ~feet i think
    fakeDistance: function(){
        return Math.round(this.levelProgress/10);
    }
    
};

KeyboardCB = {
    mousedown: function(e){
        try{
            console.log('here');
            Crafty('PlayerCharacter').get(0).fireBullet({offsetX: cursor.x, offsetY: cursor.y});
            Game.shootInterval = setInterval(function(){
                Crafty('PlayerCharacter').get(0).fireBullet({offsetX: cursor.x, offsetY: cursor.y});
            }, 100, e);
        }catch(e){
            console.log(e); //im ashamed of this
        }
        
        
    },
    mouseup: function(e){
        clearInterval(Game.shootInterval);
    },
    mousemove: function(e){
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
        try{
            Crafty('PlayerCharacterArms').get(0).pointToMouse(e);        
        }catch(e){
            // console.log(e);
        }
    },
    keydown: function(e){
        try{
            if (e.key === Crafty.keys.E){
                Crafty('PlayerCharacter').get(0).attemptReviveBody();    
            }else if (e.key === Crafty.keys.C){
                Crafty('PlayerCharacter').get(0).attemptBeatBody();    
            }
        }catch(e){
            // console.log(e); //im ashamed of this
        }
    },
    keyup: function(e){
        try{
            if (e.key === Crafty.keys.E){
                Crafty('PlayerCharacter').get(0).stopAttemptReviveBody();    
            }else if (e.key === Crafty.keys.C){
                Crafty('PlayerCharacter').get(0).stopAttemptBeatBody();    
            }
        }catch(e){
            // console.log(e); //im ashamed of this
        }
    },
    gameOverKeydown: function(e){
        if (e.key === Crafty.keys.ENTER){
            Crafty.scene('Game');
        }
    }
};



GameDirector = {
    eventHistory: [],
    checkForEvent: function(progress){
        if(progress > 100 && !this.eventHistory[100]){
            this.eventHistory[100] = true;
            Game.addMonster();
            Game.addMonster();
            Game.addMonster();
            Game.addMonster();
            Game.addMonster();
        }
        if(progress > 500){

        }
        if(progress > 1000){
            Game.addBagger(gameWidth+100, Math.random()*gameHeight+topWalkBound);
            Game.addBagger(gameWidth+100, Math.random()*gameHeight+topWalkBound);
            Game.addMonster(gameWidth+75, Math.random()*gameHeight+topWalkBound);
            Game.addMonster(gameWidth+50, Math.random()*gameHeight+topWalkBound);
            Game.addMonster(gameWidth+60, Math.random()*gameHeight+topWalkBound);
        }
    }
};