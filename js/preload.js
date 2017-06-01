"use strict"; //sempre começar o arquivo com essa linha

var PreloadState = function (game) {
};

PreloadState.prototype.preload = function () {
    //Set the games background colour
    this.game.stage.backgroundColor = '#697e96';

    //Carrega a barra de status
    this.loadingText = this.game.add.text(640, 300, "Loading...!", {font: "20px Arial", fill: "#ffffff"});
    this.loadingText.anchor.setTo(0.5,0.5);
    this.loadingBar = this.add.sprite(640, 320, "loading");
    this.loadingBar.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    //Carrega o arquivo Tiled no formato JSON
   this.game.load.tilemap('level1', 'assets/maps/tiled_level_palafitas.json', null, Phaser.Tilemap.TILED_JSON);

    //Carrega o tiles do spritesheets
    this.game.load.image('mapTiles', 'assets/spritesheets/tiles64px.png');

    this.game.load.image('dark-bg', 'assets/Bb_Level1.png');

    // Carrega um spritesheet, os sprites são de 46X64(wxh) pixels, e há 16 sprites no arquivo
    this.game.load.spritesheet('playerNormal', 'assets/spritesheets/PlayerNormal.png', 46, 64, 16);

    //playerSABD => player Sem Anti Braço Direito
    this.game.load.spritesheet('playerSABD', 'assets/spritesheets/playerSABD.png', 46, 64, 16);

    //playerSBD => player Sem Braço Direito
    this.game.load.spritesheet('playerSBD', 'assets/spritesheets/playerSBD.png', 46, 64, 16);

    //playerSABE => player Sem Anti Braço Esquerdo
    this.game.load.spritesheet('playerSABE', 'assets/spritesheets/playerSABE.png', 46, 64, 16);

    //playerSBE => player Sem Braço Esquerdo
    this.game.load.spritesheet('playerSBE', 'assets/spritesheets/playerSBE.png', 46, 64, 16);

    this.game.load.spritesheet('items', 'assets/spritesheets/powerUp.png', 46, 64, 16);
    this.game.load.spritesheet('enemies', 'assets/spritesheets/enemies.png', 64, 64, 24);

    //carrega tambacuri bullet
    this.game.load.image('tambacuri', 'assets/spritesheets/tambacuri.png');

    //Carrega a particula do efeito do diamante
    this.game.load.image('particle', 'assets/pixel.png');

    //Button Controls
    this.game.load.image("home","assets/home.png");
    this.game.load.image("play","assets/play-button.png");
    this.game.load.image("pause","assets/pause-button.png");

    // Carregas os sons
    this.game.load.audio('jumpSound', 'assets/sounds/ourSounds/jump.wav');
    this.game.load.audio('pickupSound', 'assets/sounds/ourSounds/powerUp.wav');
    this.game.load.audio('playerDeathSound', 'assets/sounds/ourSounds/death.wav');
    this.game.load.audio('enemyDeathSound', 'assets/sounds/ourSounds/hit.ogg');
    this.game.load.audio('music', 'assets/sounds/ourSounds/BG.wav');
}

PreloadState.prototype.create = function () {
    //Cria o delay na transição de tela
    game.time.events.add(2000, startGame, this);
}

function startGame() {
    this.game.state.start("home");
}