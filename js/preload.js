"use strict"; //sempre começar o arquivo com essa linha

var PreloadState = function (game) {
};

PreloadState.prototype.preload = function () {
    //Carrega a barra de status
    this.loadingText = this.game.add.text(640, 300, "Loading...!", {font: "20px Arial", fill: "#ffffff"});
    this.loadingText.anchor.setTo(0.5,0.5);
    this.loadingBar = this.add.sprite(640, 320, "loading");
    this.loadingBar.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    //Carrega o arquivo Tiled no formato JSON
    this.game.load.tilemap('level1', 'assets/maps/tiled_level1.json', null, Phaser.Tilemap.TILED_JSON);

    //Carrega o tiles do spritesheets
    this.game.load.image('mapTiles', 'assets/spritesheets/tiles64px.png');

    // Carrega um spritesheet, os sprites são de 32x32(wxh) pixels, e há 8 sprites no arquivo
    this.game.load.spritesheet('player', 'assets/spritesheets/player64px.png', 64, 64, 8);
    this.game.load.spritesheet('items', 'assets/spritesheets/items.png', 32, 32, 16);
    //this.game.load.spritesheet('enemies', 'assets/spritesheets/enemies.png', 32, 32, 12);

    //Carrega a particula do efeito do diamante
    this.game.load.image('particle', 'assets/pixel.png');

    //Button Controls
    this.game.load.image("home","assets/home.png");
    this.game.load.image("play","assets/play-button.png");
    this.game.load.image("pause","assets/pause-button.png");

    // Carregas os sons
    this.game.load.audio('jumpSound', 'assets/sounds/jump.wav');
    this.game.load.audio('pickupSound', 'assets/sounds/pickup.wav');
    this.game.load.audio('playerDeathSound', 'assets/sounds/hurt3.ogg');
    this.game.load.audio('enemyDeathSound', 'assets/sounds/hit2.ogg');
    this.game.load.audio('music', 'assets/sounds/mystery.wav');
}

PreloadState.prototype.create = function () {
    //Cria o delay na transição de tela
    game.time.events.add(2000, startGame, this);
}

function startGame() {
    //game.add.tween(this.loadingBar).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    this.game.state.start("home");
}