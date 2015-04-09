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
    var speed = 100;
    
    var greenOpponent;
    var redOpponent;
    var blueOpponent;
	
    var introText;
    var gameoverText;
    
    function create() 
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
       // game.physics.arcade.checkCollision.up = false;
        
        map = game.add.tilemap('road');
        map.addTilesetImage('tiles', 'gameTiles');
        
        road = map.createLayer('roadLayer');
        road.resizeWorld();
        
        offroad = map.createLayer('offRoadLayer');
        map.setCollisionBetween(1, 1000, true, 'offRoadLayer');
        offroad.resizeWorld();
        
        finishLine = map.createLayer('finishLayer');
        map.setCollisionBetween(1, 1000, true, 'offRoadLayer');
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
    	
    	introText = game.add.text(game.world.centerX, 400, '- click to start racing -', { font: "40px Arial", fill: "#ffffff", align: "center" });

	introText.fixedToCamera = true;
	game.input.onDown.add(startPlay, this);
    }
    
    function update() 
    {
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
		greenOpponent.body.velocity.y = -100;
        	redOpponent.body.velocity.y = -100;
        	blueOpponent.body.velocity.y = -100;
    	}
    }
    
    void slowed()
    {
    	speed = 50;
    }
    
    void speedup()
    {
    	speed = 100;
    }
    
    void redslow()
    {
    	redOpponent.body.velocity.y = -50;
    }
    
    void redspeed()
    {
    	redOpponent.body.velocity.y = -100;
    }
    
    void blueslow()
    {
    	blueOpponent.body.velocity.y = -50;
    }
    
    void bluespeed()
    {
    	blueOpponent.body.velocity.y = -100;
    }
    
    void greenslow()
    {
    	greenOpponent.body.velocity.y = -50;
    }
    
    void greenspeed()
    {
    	greenOpponent.body.velocity.y = -100;
    }
    
    void startPlay()
    {
    	introText.visible = false;
    	playing = true;
    }
    
    function gameover()
    { 
    	playing = false;
	player.body.velocity.x = 0;
	greenOpponent.body.velocity = 0;
        redOpponent.body.velocity = 0;
        blueOpponent.body.velocity = 0;
	var gameoverText = game.add.text(350, 300, 'Game Over', { fontSize: '128px', fill: 'red' });
	gameoverText.fixedToCamera = true;
    }
};
