"use strict"; //sempre começar o arquivo com essa linha

var BootState = function(game) {
    console.log("%cStarting my awesome game", "color:white; background:red");
};

BootState.prototype.preload = function() {
    this.game.load.image("loading","assets/loading.png");
}

// create: instanciar e inicializar todos os objetos dessa scene
BootState.prototype.create = function() {
    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.pageAlignHorizontally = true;
    //this.scale.setScreenSize();
    this.game.state.start("preload");
}
