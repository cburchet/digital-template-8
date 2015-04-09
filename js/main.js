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
    	
    	greenOpponent = game.add.sprite(200, game.world.height - 160, 'greencar');
    	game.physics.arcade.enable(greenOpponent);
    	redOpponent = game.add.sprite(300, game.world.height - 160, 'redcar');
    	game.physics.arcade.enable(redOpponent);
    	blueOpponent = game.add.sprite(500, game.world.height - 160, 'bluecar');
    	game.physics.arcade.enable(blueOpponent);
    	
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
    	game.physics.arcade.collide(player, cars);
    	game.physics.arcade.collide(redOpponent, cars);
    	game.physics.arcade.collide(greenOpponent, cars);
    	game.physics.arcade.collide(blueOpponent, cars);
    	
    	//player and opponents collide
    	game.physics.arcade.collide(player, greenOpponent);
    	game.physics.arcade.collide(player, redOpponent);
    	game.physics.arcade.collide(player, blueOpponent);
    	
    	game.physics.arcade.collide(greenOpponent, redOpponent);
    	game.physics.arcade.collide(greenOpponent, blueOpponent);
    	
    	game.physics.arcade.collide(redOpponent, blueOpponent);
    	
    	//player and opponents overlap with offroad slows, road speeds up, finishline ends game
    	game.physics.arcade.overlap(player, offroad, slowed, null, this);
    	game.physics.arcade.overlap(player, road, speedup, null, this);
    	game.physics.arcade.overlap(player, finishLine, gameover, null, this);
    	
    	game.physics.arcade.overlap(greenOpponent, offroad, greenslow, null, this);
    	game.physics.arcade.overlap(greenOpponent, road, greenspeed, null, this);
    	game.physics.arcade.overlap(greenOpponent, finishLine, gameover, null, this);
    	game.physics.arcade.overlap(redOpponent, offroad, redslow, null, this);
    	game.physics.arcade.overlap(redOpponent, road, redspeed, null, this);
    	game.physics.arcade.overlap(redOpponent, finishLine, gameover, null, this);
    	game.physics.arcade.overlap(blueOpponent, offroad, blueslow, null, this);
    	game.physics.arcade.overlap(blueOpponent, road, bluespeed, null, this);
    	game.physics.arcade.overlap(blueOpponent, finishLine, gameover, null, this);
    	if (playing == true)
    	{
    		game.physics.arcade.moveToPointer(player, speed, game.input.activePointer);
    		
    		if (greenOpponent.body.x > badCars.body.x - 75)
    		{
    			greenOpponent.body.velocity.x = -20;
    		}
    		else if (greenOpponent.body.x < badCars.body.x + 75)
    		{
    			greenOpponent.body.velocity.x = 20;
    		}
    		
    		if (redOpponent.body.x > badCars.body.x - 75)
    		{
    			redOpponent.body.velocity.x = -20;
    		}
    		else if (redOpponent.body.x < badCars.body.x + 75)
    		{
    			redOpponent.body.velocity.x = 20;
    		}
    		
    		if (blueOpponent.body.x > badCars.body.x - 75)
    		{
    			blueOpponent.body.velocity.x = -20;
    		}
    		else if (blueOpponent.body.x < badCars.body.x + 75)
    		{
    			blueOpponent.body.velocity.x = 20;
    		}
    		
    		if (greenOpponent.body.velocity.x != 0)
    		{
    			greenOpponent.body.velocity.y = -45;
    		}
    		else
    		{
    			greenOpponent.body.velocity.y = -90;
    		}
    		if (redOpponent.body.velocity.x != 0)
    		{
    			redOpponent.body.velocity.y = -45;
    		}
    		else
    		{
    			redOpponent.body.velocity.y = -90;
    		}
    		if (blueOpponent.body.velocity.x != 0)
    		{
    			blueOpponent.body.velocity.y = -45;
    		}
    		else
    		{
    			blueOpponent.body.velocity.y = -90;
    		}
    	}
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
    
    function redslow()
    {
    	redOpponent.body.velocity.y = -50;
    }
    
    function redspeed()
    {
    	redOpponent.body.velocity.y = -100;
    }
    
    function blueslow()
    {
    	blueOpponent.body.velocity.y = -50;
    }
    
    function bluespeed()
    {
    	blueOpponent.body.velocity.y = -100;
    }
    
    function greenslow()
    {
    	greenOpponent.body.velocity.y = -50;
    }
    
    function greenspeed()
    {
    	greenOpponent.body.velocity.y = -100;
    }
    
    
    function startPlay()
    {
    	introText.visible = false;
    	playing = true;
    }
    
    function gameover()
    { 
    	playing = false;
	player.body.velocity = 0;
	greenOpponent.body.velocity = 0;
        redOpponent.body.velocity = 0;
        blueOpponent.body.velocity = 0;
	var gameoverText = game.add.text(350, 300, 'Game Over', { fontSize: '128px', fill: 'red' });
	gameoverText.fixedToCamera = true;
    }
};
