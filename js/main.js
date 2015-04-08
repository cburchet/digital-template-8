window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload()
    {
        game.load.image('road', 'assets/road.jpg');
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
        
        background = game.add.tileSprite(0, 0, 1000, 600, 'road');
        
        player = game.add.sprite(400, game.world.height - 160, 'car');
        game.physics.arcade.enable(player);
        game.camera.follow(player);
        playerEngine = game.add.audio('carEngine');
    	playerEngine.play('', 0, .1, true);
    	
    	greenOpponent = game.add.sprite(200, game.world.height - 160, 'greencar');
    	redOpponent = game.add.sprite(300, game.world.height - 160, 'redcar');
    	blueOpponent = game.add.sprite(500, game.world.height - 160, 'bluecar');
    }
    
    function update() 
    {
        player.rotation = game.physics.arcade.moveToPointer(player, speed, game.input.activePointer);
    }
};
