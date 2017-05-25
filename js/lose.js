"use strict"; //sempre começar o arquivo com essa linha

//Atenção sempre: 
// - Letras maiúsculas e minúsculas: sempre usar os "cases" corretos;
// - Abrir e fechar parênteses: um esquecimento pode gerar um erro difícil de notar;
// - Abrir e fechar chaves: mesmo caso anterior
// - Sempre veja o console no navegador apertando F12 caso algo não funcione como deveria

//Um estado é sempre um objeto JavaScript, com no mínimo as 3 funções principais: preload, create e update
//As funções sempre começam com NomeDoObjeto.prototype 
var LoseState = function(game) {};

// preload: carregar todos os assets necessários para esta scene ou para as próximas
LoseState.prototype.preload = function() {
    // Não há nenhum asset a ser carregado aqui, então a função fica vazia
}

LoseState.prototype.init = function(score){
    this.game.add.text(200, 300, "Score: " + score, {font: "35px Arial", fill: "#ffffff"});
    //alert("You scored: "+score)
}

// create: instanciar e inicializar todos os objetos dessa scene
LoseState.prototype.create = function() {
    this.game.add.text(200, 200, "You Lose!", {font: "35px Arial", fill: "#ffffff"});
    //Adiciona o Score
    //this.game.add.text(200, 300, "Score: " + Globals.score, {font: "35px Arial", fill: "#ffffff"});
    // Capturando tecla enter para uso posterior
    this.returnKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

// update: o que fazer a cada quadro por segundo
LoseState.prototype.update = function() {
    if(this.returnKey.isDown){
        this.game.state.start('game');
    }
}