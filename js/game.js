const gameWidth = 350;
const gameHeight = 250;
const topWalkBound = 75;
const maxMonsters = {
    'snek': 4,
    'monster': 100,
    'bagger': 3
};

Game = {
    levelProgress: 0,
    monsterKillPoints: 0,
    allyPoints: 0,
    collectedBodies: 0,
    shooting: false,
    start: function(){
        Crafty.init(gameWidth,gameHeight);
        Crafty.background('gray');
        Crafty.viewport.scale(5);
        Crafty.scene('Loading');
    },
    addMonster: function(x,y){
        if(Crafty("MonsterCharacter1").get().length > maxMonsters.monster && !GameEvents.FinaleTriggered){
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
    addAlly: function(x,y){
        obj = Crafty.e("AllyCharacter");
        if (x && y){
            obj.x = x;
            obj.y = y;
        }else{
            obj.x = gameWidth+(Math.random()*topWalkBound);
            obj.y = (gameHeight*Math.random())+topWalkBound;
        }
        obj.trigger('MoveTowardsPlayer');
    },
    addBagger: function(x,y){
        if(Crafty("BaggerCharacter").get().length > maxMonsters.bagger && !GameEvents.FinaleTriggered){
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
    addSnek: function(x,y){
        if(Crafty("SnekCharacter").get().length > maxMonsters.snek && !GameEvents.FinaleTriggered){
            return false;
        }else{
            monster = Crafty.e("SnekCharacter");
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
    },
    addBox: function(x,y){
        obj = Crafty.e('BoxObject');
        if (x && y){
            obj.x = x;
            obj.y = y;
        }else{
            obj.x = gameWidth+(Math.random()*topWalkBound);
            obj.y = (gameHeight*Math.random())+topWalkBound;
        }
    },
    addAllyConvert: function(x,y){
        monster = Crafty.e("AllyConvertCharacter");
        if (x && y){
            monster.x = x;
            monster.y = y;
        }else{
            monster.x = gameWidth+(Math.random()*topWalkBound);
            monster.y = (gameHeight*Math.random())+topWalkBound;
        }
    },
    addTurboGun: function(x,y){
        gun = Crafty.e('TurboGun');
        gun.x = gameWidth+(Math.random()*topWalkBound);
        gun.y = (gameHeight*Math.random())+topWalkBound;
    },
    addMedkit: function(x,y){
        obj = Crafty.e('Medkit');
        if (x && y){
            obj.x = x;
            obj.y = y;
        }else{
            obj.x = gameWidth+(Math.random()*topWalkBound);
            obj.y = (gameHeight*Math.random())+topWalkBound;
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
        Game.levelProgress = 0;
        Game.monsterKillPoints = 0;
        Game.allyPoints = 0;
        Game.shooting = false;
        Game.collectedBodies = 0;
        // this.scoreDisplay.updateScore(0);

    }
    
};


GameDirector = {
    eventHistory: [],
    eventPerScore: 300,
    tierScoreGap: 1000,
    envPerMax: 300,
    envLast: 0,
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
        }

        if(Game.levelProgress > GameDirector.envLast + (Math.random()*GameDirector.envPerMax)+(GameDirector.envPerMax/4)){
            GameEvents.Environment[Math.floor(GameEvents.Environment.length*Math.random())]();
            GameDirector.envLast = Game.levelProgress;
        }


    },
    reset: function(){
        GameDirector.lastScoreEvent = 0;
        GameDirector.envLast = 0;
    }
};

GameEvents = {
    FinaleTriggered: false,
    Environment: [
        function(){
            Game.addCar();
        },
        function(){
            Game.addBox();
            Game.addBox();
            Game.addBox();
        },
        function(){
            if(Math.random() > 0.80){
                Game.addAlly();
            }            
        },
        function(){
            if(Math.random() > 0.90){
                Game.addMedkit();
            }
        }
    ],
    Tiers: {
        0: [
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
            }
        ],
        1: [
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addAlly();
            },
            function(){
                if(Math.random() > 0.75){
                    Game.addTurboGun();
                }else{
                    Game.addMonster();
                    Game.addMonster();
                    Game.addMonster();
                    Game.addMonster();
                    Game.addMonster();
                    Game.addMonster();
                    Game.addMonster();
                    Game.addAlly();
                    Game.addAlly();
                    Game.addAlly();
                }
                
            }
        ],
        2: [
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addBagger();
            }
        ],
        3: [
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addSnek();
            },
            function(){
                Game.addSnek();
                Game.addSnek();
                Game.addMedkit();
            },
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addBagger();
                Game.addMedkit();
            }
        ],
        4: [
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();

                Game.addSnek();
                Game.addSnek();
                Game.addSnek();
            },
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
            },
            function(){
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addMonster();
                Game.addBagger();
                Game.addAlly();
                Game.addAlly();
            }
        ]
    },
    Finale: function(){
            GameEvents.FinaleTriggered = true;

            Game.addTurboGun();

            
            for(var i = 0; i < 75; i++){
                Game.addMonster();
            }

            for(var i = 0; i < 5; i++){
                Game.addBagger();
            }

            for(var i = 0; i < 6; i++){    
                Game.addSnek();
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
                    player = Crafty('PlayerCharacter').get(0);
                    if(typeof player != 'undefined'){
                        player.fireBullet({offsetX: cursor.x, offsetY: cursor.y});
                    }
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
            Game.reset();
            // Crafty.scene('Loading');
            Crafty.scene('Game');
        }
    }
};


