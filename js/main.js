window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload()
    {
        game.load.image('car', 'assets/car.png');
        game.load.image('redcar', 'assets/redbadcar.png');
        game.load.image('bluecar', 'assets/bluebadcar.png');
        game.load.image('greencar', 'assets/greenbadcar.png');
        game.load.audio('carEngine', 'assets/carEngine.wav');
        game.load.tilemap('road', 'assets/roadrace.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image( 'gameTiles', 'assets/tiles.png' );
    }
    
    //maps for 
    var map;
    var road;
    var offroad;
    var finishLine;
    
    var player;
    var playerEngine;
    
    var playing = false;
    var speed = 70;
    
    var enemies;
    var greenOpponent;
    var redOpponent;
    var blueOpponent;
	
    var introText;
    var gameoverText;
    
    var badCars;
    var cars;
    
    function create() 
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
       // game.physics.arcade.checkCollision.up = false;
        
        map = game.add.tilemap('road');
        map.addTilesetImage('tiles', 'gameTiles');
        
        road = map.createLayer('roadLayer');
        map.setCollisionBetween(1, 1000, true, 'roadLayer');
        road.resizeWorld();
        
        offroad = map.createLayer('offRoadLayer');
        map.setCollisionBetween(1, 1000, true, 'offRoadLayer');
        offroad.resizeWorld();
        
        finishLine = map.createLayer('finishLayer');
        map.setCollisionBetween(1, 1000, true, 'finishLayer');
        finishLine.resizeWorld();
        
        player = game.add.sprite(400, game.world.height - 160, 'car');
        game.physics.arcade.enable(player);
        game.camera.follow(player);
        playerEngine = game.add.audio('carEngine');
    	playerEngine.play('', 0, .1, true);
    	
    	
    	enemies = game.add.group();
    	enemies.enableBody = true
    	greenOpponent = enemies.create(200, game.world.height - 160, 'greencar');
    	redOpponent = enemies.create(300, game.world.height - 160, 'redcar');
    	blueOpponent = enemies.create(500, game.world.height - 160, 'bluecar');
    	
    	cars = game.add.group();
        cars.enableBody = true;
        createCar();
    	game.time.events.loop(Phaser.Timer.SECOND * 2, createCar, this);
    	
    	introText = game.add.text(game.world.centerX, 400, '- click to start racing -', { font: "40px Arial", fill: "#ffffff", align: "center" });

	introText.fixedToCamera = true;
	game.input.onDown.add(startPlay, this);
    }
    
    function update() 
    {
    	//player and opponents hit badCars
    	game.physics.arcade.collide(player, cars, destroyCar, null, this);
    	game.physics.arcade.collide(enemies, cars, enemydestroycar, null, this);
    	
    	//player and opponents collide
    	game.physics.arcade.collide(player, enemies);
    	game.physics.arcade.collide(enemies, enemies);
    	
    	//player and opponents overlap with offroad slows, road speeds up, finishline ends game
    	game.physics.arcade.overlap(player, offroad, slowed, null, this);
    	game.physics.arcade.overlap(player, road, speedup, null, this);
    	game.physics.arcade.overlap(player, finishLine, gameover, null, this);
    	
    	game.physics.arcade.overlap(enemies, offroad, enemyslow, null, this);
    	game.physics.arcade.overlap(enemies, road, enemyspeed, null, this);
    	game.physics.arcade.overlap(enemies, finishLine, gameover, null, this);
    	if (playing == true)
    	{
    		game.physics.arcade.moveToPointer(player, speed, game.input.activePointer);
    	
    	}
    }
    
    function destroyCar(player, cars)
    {
    	cars.kill();
    	speed = 35;
    }
    
    function enemydestroycar(enemies, cars)
    {
    	cars.kill();
    	enemies.body.velocity.y = -50;
    }

    
    function createCar()
    {
    	var i = 1;
    	for (i; i > 0; i--)
    	{
    		var carColor = game.rnd.integerInRange(0,2);
    		if (carColor = 0)
    		{
    			badCars = cars.create(game.rnd.integerInRange(138,862), game.rnd.integerInRange(75, 300) * -1, 'redcar');	
    		}
    		else if (carColor = 1)
    		{
    			badCars = cars.create(game.rnd.integerInRange(138,862), game.rnd.integerInRange(75, 300) * -1, 'bluecar');
    		}
    		else if (carColor = 2)
    		{
    			badCars = cars.create(game.rnd.integerInRange(138,862), game.rnd.integerInRange(75, 300) * -1, 'greencar');
    		}
    		badCars.body.gravity.y = 70;
    	}
    }
    
    function slowed()
    {
    	speed = 35;
    }
    
    function speedup()
    {
    	speed = 70;
    }
    
    function enemyslow(enemies)
    {
    	enemies.body.velocity.y -= 10;
    	enemies.body.velocity.x -= 5;
    	if (enemies.body.velocity.y < 50)
    	{
    		enemies.body.velocity.y = 50;
    	}
    	if (enemies.body.velocity.x < 0)
    	{
    		enemies.body.velocity.x = 0	
    	}
    }
    
    function enemySideways(enemies)
    {
    	//input sideways movement 
    }
    
    function enemyspeed(enemies)
    {
    	enemies.body.velocity.y += 10;
    	if (enemies.body.velocity.y > speed)
    	{
    		enemies.body.velocity.y = speed;
    	}
    	if (enemies.body.velocity.x > 50)
    	{
    		enemies.body.velocity.x = 50	
    	}
    }

    
    
    function startPlay()
    {
    	introText.visible = false;
    	playing = true;
    	greenOpponent.body.velocity.y = speed;
    	redOpponent.body.velocity.y = speed;
    	blueOpponent.body.velocity.y = speed;
    }
    
    function gameover()
    { 
    	playing = false;
	player.body.velocity = 0;
	enemies.body.velocity = 0;
	var gameoverText = game.add.text(350, 300, 'Game Over', { fontSize: '128px', fill: 'red' });
	gameoverText.fixedToCamera = true;
    }
};
