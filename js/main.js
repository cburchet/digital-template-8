window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload()
    {
        game.load.image('car', 'assets/car.png');
        game.load.image('redcar', 'assets/redbadcar.png');
        game.load.image('bluecar', 'assets/bluebadcar.png');
        game.load.image('greencar', 'assets/greenbadcar.png');
        game.load.audio('carEngine', 'assets/carEngine.wav');
    }
    
    var background;
    var player;
    var playerEngine;
    
    var speed = 100;
    var greenOpponent;
	var redOpponent;
	var blueOpponent;
	
	var gameoverText;
    
    function create() 
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.checkCollision.up = false;
        
        
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
    }
    
    function update() 
    {
        game.physics.arcade.moveToPointer(player, speed, game.input.activePointer);
        greenOpponent.body.velocity.y = -90;
        redOpponent.body.velocity.y = -90;
        blueOpponent.body.velocity.y = -90;
    }
};
