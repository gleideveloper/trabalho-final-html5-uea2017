// Global variables - accessible on all states
var Globals = { 
    score: 0 
};
// Tamanho em Tiles 32 (20 x 15) => Resolução de tela(640, 480)
// Tamanho em Tiles 64 (15 x 10) => Resolução de tela(960, 640)
var game = new Phaser.Game(960, 640, Phaser.AUTO, 'phaser-canvas');
game.state.add('game', GameState);
game.state.add('win', WinState);
game.state.add('lose', LoseState);
game.state.start('game');