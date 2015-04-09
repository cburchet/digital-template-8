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
    	if (playing == true)
    	{
    		game.physics.arcade.moveToPointer(player, speed, game.input.activePointer);
		greenOpponent.body.velocity.y = -100;
        	redOpponent.body.velocity.y = -100;
        	blueOpponent.body.velocity.y = -100;
    	}
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
