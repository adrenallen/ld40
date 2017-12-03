const gameWidth = 350;
const gameHeight = 250;
const topWalkBound = 75;
const maxMonsters = 150;

Game = {
    levelProgress: 0,
    monsterKillPoints: 0,
    allyPoints: 0,
    shooting: false,
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
        GameDirector.checkForEvent(this.scoreCalculator);
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


GameDirector = {
    eventHistory: [],
    eventDistanceMax: 300,
    checkForEvent: function(progress){
        // this.nextEvent = Math.random()*this.eventMultiplier
    }
};

KeyboardCB = {
    mousedown: function(e){
        try{
            Crafty('PlayerCharacter').get(0).fireBullet({offsetX: cursor.x, offsetY: cursor.y});
            if(!Game.shooting){
                Game.shooting = true;
                Game.shootInterval = setInterval(function(){
                    Crafty('PlayerCharacter').get(0).fireBullet({offsetX: cursor.x, offsetY: cursor.y});
                }, 100, e);
            }
        }catch(e){
            console.log(e); //im ashamed of this
        }
        
        
    },
    mouseup: function(e){
        Game.shooting = false;
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


