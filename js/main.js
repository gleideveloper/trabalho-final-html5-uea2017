// Global variables - accessible on all states
var Globals = { 
    //score: 0
};
// Mapa do jogo em Tiles 64 (60 x 20) => Tamanho de tela(3840, 1280)
// Tela do Jogo em Tiles 64 (20 x 10) => Tamanho de tela(1280, 640)

var game = new Phaser.Game(1280, 640, Phaser.CANVAS, 'phaser-canvas');
game.state.add('boot', BootState);
game.state.add('preload', PreloadState);
game.state.add('home', HomeState);
game.state.add('level1', GameState);
game.state.add('win', WinState);
game.state.add('lose', LoseState);
game.state.start('boot');
