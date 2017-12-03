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
            }
        }
    },
    moveMap: function(v){
        moveThese = Crafty("Scrolls").get();
        for (var i = 0; i < moveThese.length; i++){
            moveThese[i].shift(-1*v,0,0,0);
        }
        this.levelProgress += v;
        Crafty('PlayerCharacter').get(0).scoreDisplay.updateScore(this.scoreCalculator());
        // console.log(this.levelProgress);
        GameDirector.checkForEvent(this.levelProgress);
    },
    difficultyCalculator: function(){
    },
    addMonsterKillPoints: function(points){
        this.monsterKillPoints += points;
        Crafty('PlayerCharacter').get(0).scoreDisplay.updateScore(this.scoreCalculator());
    },
    addAllyPoints: function(points){
        this.allyPoints += points;
        Crafty('PlayerCharacter').get(0).scoreDisplay.updateScore(this.scoreCalculator());
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
    checkForEvent: function(progress){
        if(progress > 1000){
            Game.addBagger(gameWidth+100, Math.random()*gameHeight+topWalkBound);
            Game.addBagger(gameWidth+100, Math.random()*gameHeight+topWalkBound);
            Game.addMonster(gameWidth+75, Math.random()*gameHeight+topWalkBound);
            Game.addMonster(gameWidth+50, Math.random()*gameHeight+topWalkBound);
            Game.addMonster(gameWidth+60, Math.random()*gameHeight+topWalkBound);

        }
    }
};