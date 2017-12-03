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
    addCar: function(x,y){
        car = Crafty.e('CarObject');
        car.x = gameWidth+(Math.random()*topWalkBound);
        car.y = (gameHeight*Math.random())+topWalkBound;
        car.rotation = Math.floor(Math.random()*90)-45;
    },
    moveMap: function(v){
        moveThese = Crafty("Scrolls").get();
        for (var i = 0; i < moveThese.length; i++){
            moveThese[i].shift(-1*v,0,0,0);
        }
        this.levelProgress += v;
        this.scoreDisplay.updateScore(this.scoreCalculator());
        // console.log(this.levelProgress);
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
    },
    reset: function(){
        GameDirector.reset();
        this.levelProgress = 0;
        this.monsterKillPoints = 0;
        this.allyPoints = 0;
        this.shooting = false;

    }
    
};


GameDirector = {
    eventHistory: [],
    eventPerScore: 300,
    tierScoreGap: 1000,
    lastPoll: [],
    lastScoreEvent: 0,
    direct: function(){
        score = Game.scoreCalculator(); 
        if(score > GameDirector.lastScoreEvent+(Math.random()*GameDirector.eventPerScore)+(GameDirector.eventPerScore/4)){
            GameDirector.lastScoreEvent =  score;

            tier = Math.floor(score/GameDirector.tierScoreGap);
            
            if(typeof GameEvents.Tiers[tier] == 'undefined'){

                // FINALE TIME BABY
                if(!GameEvents.FinaleTriggered){
                    GameEvents.Finale();
                }                

            }else{
                randEvent = Math.floor(Math.random()*GameEvents.Tiers[tier].length);
                GameEvents.Tiers[tier][randEvent]();
            
            }
            console.log(tier, score, randEvent);
        }else{
        }
    },
    reset: function(){
        this.eventHistory = [];
        this.lastPoll = [];
        this.lastScoreEvent = 0;
    }
};

GameEvents = {
    FinaleTriggered: false,
    Tiers: {
        0: [
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
            },
            function(){
                Game.addCar();
            }
        ],
        1: [
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addBagger();
            }
        ]
    },
    Finale: function(){
            GameEvents.FinaleTriggered = true;
            for(var i = 0; i < 100; i++){
                Game.addMonster();
            }

            for(var i = 0; i < 50; i++){
                Game.addBagger();
            }
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
            }else if (e.key === Crafty.keys.P){
                Crafty.pause(!Crafty.isPaused());
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


