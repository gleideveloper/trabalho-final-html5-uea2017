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
    //this.game.load.tilemap('levelpalafitas', 'assets/maps/tiled_level_palafitas.json', null, Phaser.Tilemap.TILED_JSON);

    //Carrega o tiles do spritesheets
    this.game.load.image('mapTiles', 'assets/spritesheets/tiles64px.png');

    this.game.load.image('dark-bg', 'assets/dark-bg.png');

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

    this.game.load.spritesheet('items', 'assets/spritesheets/powerup_draft.png', 64, 64, 16);
    this.game.load.spritesheet('enemies', 'assets/spritesheets/enemies_draft.png', 64, 64, 24);

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
    this.game.state.start("home", Phaser.Plugin.StateTransition.Out.SlideRight, Phaser.Plugin.StateTransition.In.SlideRight);
    //this.game.state.start("home");
}