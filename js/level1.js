"use strict";

var GameState = function (game) {
    this.scoreLife = 5;
    this.arrayDeathLayer = [26, 43, 44, 45, 60, 61];
    this.xPlayer = 90;
    this.yPlayer = 160;
}

var weapon;

GameState.prototype.create = function () {
    // Inicializando sistema de física
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Set the games background colour
    //this.game.stage.backgroundColor = '#697e96';
  
    this.setParallaxBackground();

    this.createMapLevel1();

    this.createPlayer('playerNormal');

    this.createPowerUp();

    this.createEnemy();

    this.createControlKey();

    this.createSound();

    this.createScore();

    this.createBulletTambacuri();
}

GameState.prototype.update = function () {
    //this.parallaxBg.tilePosition.x -= 0.3;
    this.parallaxBg.x = game.camera.x * 0.5;

    //Seta colisão dos objetos
    this.setCollide();

    // Movimentação do player
    this.playerMovement();

    //Movimentação dos enemys
    this.emenyMoviment();
}

GameState.prototype.setCollide = function () {
    // Colisão com super Jump - executa a função superJump
    this.game.physics.arcade.collide(this.player, this.superJump, this.superJumpFunction, null, this);
    // Detecção de colisões do player com as paredes da fase, que é um layer
    this.game.physics.arcade.collide(this.player, this.trackLayer);

    // Cada colisão entre dois objetos terá um callback, que é o terceiro parâmetro
    // Colisão com os diamantes - devem ser coletados
    this.game.physics.arcade.overlap(this.player, this.powerups, this.itemCollect, null, this);
    // O jogador morre na colisão com a lava ou com os morcegos
    this.game.physics.arcade.collide(this.player, this.deathLayer, this.deathCollision, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.enemieCollision, null, this);

    this.game.physics.arcade.overlap(weapon, this.enemies, this.tambacuriCollision, null, this);
    // Adicionando colisão entre os morcegos e as paredes
    this.game.physics.arcade.collide(this.enemies, this.trackLayer);


}

GameState.prototype.itemCollect = function (player, powerup) {
    // Atualizando estado do jogo e HUD
    this.collectedPowerUp++;
    this.score += 100;
    this.scoreText.text = "Score: " + this.score;
    // Condição de vitória: pegar todos os diamantes
    if (this.collectedPowerUp == this.totalPowerUp) {
        //Globals.score = this.score; // Guardando score na variável global para o próximo estado
        this.music.stop();
        this.game.state.start('win',true,false,this.score);
    }
    //Define o ponto de colisão
    this.particleEmitter.x = powerup.x;
    this.particleEmitter.y = powerup.y;
    //Emite o efeito de particula
    this.particleEmitter.start(true, 500, null, 10);

    this.pickupSound.play(); // som de pegar o diamante
    powerup.kill(); // removendo o diamante do jogo
}

//GameState.prototype.setStatusPlayer = function (){
function setStatusPlayer() {
    this.xPlayer = this.player.x;
    this.yPlayer = this.player.y;
    switch (this.scoreLife) {
        case 4:
            this.createPlayer('playerSABD');
            break;
        case 3:
            this.createPlayer('playerSBD');
            break;
        case 2:
            this.createPlayer('playerSABE');
            break;
        case 1:
            this.createPlayer('playerSBE');
            break;
        default:
            this.lose();
    }
}

GameState.prototype.enemieCollision = function (player, enemie) {
    // Tratamento da colisão entre o jogador e os diamantes
    // Se o jogador colidir por baixo e o morcego por cima, isso indica que o jogador pulou
    // em cima do morcego, nesse caso vamos "matar" o morcego
    console.debug("Live: " + this.scoreLife);
    if (player.body.touching.down && enemie.body.touching.up) {
        // tocando som de morte do morcego
        this.enemyDeathSound.play();
        // adicionando um pequeno impulso vertical ao jogador
        this.player.body.velocity.y = -200;
        // atualizando score
        this.score += 200;
        this.scoreText.text = "Score: " + this.score;
        enemie.kill();
    } else{
        this.scoreLife--;
        console.debug("Live: " + this.scoreLife);
        this.player.kill();
        //this.setStatusPlayer();
        game.time.events.add(500, setStatusPlayer, this);
    }  // caso contrário, ir para condição de derrota
}

// Nesse caso, apenas desligamos a colisão com a lava para evitar chamar o evento
// repetidas vezes, e vamos para a condição de derrota
GameState.prototype.deathCollision = function () {
    this.level1.setCollision(this.arrayDeathLayer, false, this.deathLayer);
    this.music.stop();
    this.lose();
}

// Condição de derrota: guarde o score e siga para o próximo estado
GameState.prototype.lose = function () {
    console.debug("Morreu!");
    //Globals.score = this.score;
    this.playerDeathSound.play();
    this.music.stop();
    this.game.state.start("lose",true,false,this.score);
}

GameState.prototype.createPowerUp = function () {
// Grupo de diamantes
    this.powerups = this.game.add.physicsGroup();
    this.level1.createFromObjects('PowerUp', 'power', 'items', 5, true, false, this.powerups);
    // Para cada objeto do grupo, vamos executar uma função
    this.powerups.forEach(function (powerup) {
        // body.immovable = true indica que o objeto não é afetado por forças externas
        powerup.body.immovable = true;
        // Adicionando animações; o parâmetro true indica que a animação é em loop
        powerup.animations.add('spin', [4, 1, 1, 4, 1], 6, true);
        powerup.animations.play('spin');
    });

    //Emissor de particulas
    this.particleEmitter = this.game.add.emitter(0, 0, 100);
    this.particleEmitter.makeParticles('particle');
}

GameState.prototype.createEnemy = function () {
    // Grupo de morcegos:
    this.enemies = this.game.add.physicsGroup();
    this.level1.createFromObjects('Enemies', 'enemy', 'enemies', 8, true, false, this.enemies);
    this.enemies.forEach(function (enemy) {
        enemy.anchor.setTo(0.5, 0.5);
        enemy.body.immovable = true;
        enemy.animations.add('fly', [12, 13, 14, 15], 6, true);
        enemy.animations.play('fly');
        // Velocidade inicial do inimigo
        enemy.body.velocity.x = 100;
        // bounce.x=1 indica que, se o objeto tocar num objeto no eixo x, a força deverá
        // ficar no sentido contrário; em outras palavras, o objeto é perfeitamente elástico
        enemy.body.bounce.x = 1;
    });
}

GameState.prototype.createScore = function () {
    // HUD de score
    this.scoreText = this.game.add.text(10, 5, "Score: 0", {font: "25px Arial", fill: "#ffffff"});

    // Score fixo na câmera
    this.scoreText.fixedToCamera = true;

    // Estado do jogo - Variáveis para guardar quaisquer informações pertinentes para as condições de
    // vitória/derrota, ações do jogador, etc
    this.totalPowerUp = this.powerups.length;
    this.collectedPowerUp = 0;
    this.score = 0;
};

GameState.prototype.createSound = function () {
    // Criando assets de som
    this.jumpSound = this.game.add.audio('jumpSound');
    this.pickupSound = this.game.add.audio('pickupSound');
    this.playerDeathSound = this.game.add.audio('playerDeathSound');
    this.enemyDeathSound = this.game.add.audio('enemyDeathSound');
    // Música de fundo - criada da mesma forma, mas com o parâmetro loop = true
    this.music = this.game.add.audio('music');
    this.music.loop = true;
    // Já iniciamos a música aqui mesmo pra ficar tocando ao fundo
    this.music.play();
}

GameState.prototype.createControlKey = function () {
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.shotButton = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
}

GameState.prototype.setParallaxBackground = function () {
    /** Novo Exemplo para aplicar
     * http://mightyfingers.com/tutorials/advanced/parallax-background/
     */
    //Set the games background colour
    this.game.stage.backgroundColor = '#697e96';
    this.parallaxBg = this.game.add.tileSprite(0, 0,this.game.cache.getImage('dark-bg').width,
        this.game.cache.getImage('dark-bg').height,'dark-bg');
}

GameState.prototype.createMapLevel1 = function () {
    //Cria o mapa e os layers do Tiled no Phaser
    this.level1 = this.game.add.tilemap('level1');
    this.level1.addTilesetImage('tiles64px', 'mapTiles');

    //Cria os layers

    this.level1.createLayer('Bg')
    this.deathLayer = this.level1.createLayer('Death');
    this.trackLayer = this.level1.createLayer('Track');
    this.superJump = this.level1.createLayer('SuperJump');

    //Define quais tiles do layer walls NÃO terão colisões
    this.level1.setCollisionByExclusion([9, 10, 11, 12, 17, 18, 19, 20], true, this.trackLayer);

    // Define quais tiles do layer de death colidem
    this.level1.setCollision(this.arrayDeathLayer, true, this.deathLayer);
    // Define quais tiles do layer do SuperJump colidem
    this.level1.setCollision([41,42], true, this.superJump);

    // Redimensionando o tamanho do "mundo" do jogo
    this.trackLayer.resizeWorld();
}

GameState.prototype.createPlayer = function (player) {
    // cria o jogador adicionando-o na posição (160, 64) usando posição 5 do vetor
    console.debug("createPlayer: " + player);
    this.player = this.game.add.sprite(this.xPlayer, this.yPlayer, player, 5);
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.player);
    this.player.body.gravity.y = 750;
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);
    // Animações do jogador com os parâmetros: nome da animação, lista de quadros e número de FPS
    this.player.animations.add('walk', [0, 1, 2, 3], 6);
    this.player.animations.add('attack', [6, 7], 6);
    this.player.animations.add('idle', [14, 14, 14, 14, 15], 6);
    this.player.animations.add('jump', [8], 6);
}

GameState.prototype.emenyMoviment = function () {
    // Para cada morcego, verificar em que sentido ele está indo
    // Se a velocidade for positiva, a escala no eixo X será 1, caso
    // contrário -1
    this.enemies.forEach(function (enemy) {
        if (enemy.body.velocity.x != 0) {
            // Math.sign apenas retorna o sinal do parâmetro: positivo retorna 1, negativo -1
            enemy.scale.x = 1 * Math.sign(enemy.body.velocity.x);
        }
    });
}

GameState.prototype.playerMovement = function () {
    // Caso seja a tecla para a esquerda, ajustar uma velocidade negativa
    // ao eixo X, que fará a posição X diminuir e consequentemente o jogador
    // ir para a esquerda;
    if (this.keys.left.isDown) {
        this.player.body.velocity.x = -150; // Ajustar velocidade
        // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
        if (this.player.scale.x == 1){
            this.player.scale.x = -1;
            weapon.bulletSpeed=-600;
        }
        // Iniciando a animação 'walk'
        this.player.animations.play('walk');
    }
    // Se a tecla direita estiver pressionada (this.keys.right.isDown == true),
    // mover o sprite para a direita
    else if (this.keys.right.isDown) {
        // se a tecla direita estiver pressionada
        this.player.body.velocity.x = 150;  // Ajustar velocidade
        // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
        if (this.player.scale.x == -1){
            this.player.scale.x = 1;
            weapon.bulletSpeed=600;
        }
        // Iniciando a animação 'walk'
        this.player.animations.play('walk');
    }
    else {
        // Se nenhuma tecla estiver sendo pressionada:
        // Ajustar velocidade para zero
        this.player.body.velocity.x = 0;
        // Executar animação 'idle'
        this.player.animations.play('idle');
    }

    // Se o a barra de espaço ou a tecla cima estiverem pressionadas, e o jogador estiver com a parte de baixo tocando em alguma coisa
    if ((this.jumpButton.isDown || this.keys.up.isDown) && (this.player.body.touching.down || this.player.body.onFloor())) {
        // Adicione uma velocidade no eixo Y, fazendo o jogador pular
        this.player.body.velocity.y = -500;
        // Tocando o som de pulo
        this.jumpSound.play();
    }

    // Se o jogador não estiver no chão, inicie a animação 'jump'
    if (!this.player.body.touching.down && !this.player.body.onFloor()) {
        this.player.animations.play('jump');
    }

    // Se o jogador apertar o 'X', inicia a animação do tiro
    if (this.shotButton.isDown) {
        this.player.animations.play('attack');
        weapon.fireAtSprite(this.player);
    }
}

GameState.prototype.createBulletTambacuri = function () {
    weapon = this.game.add.weapon(1, 'tambacuri');
    //  The bullet will be automatically killed when it leaves the camera bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 600;

    weapon.trackSprite(this.player,0,0,true);
}

GameState.prototype.superJumpFunction = function () {
    console.debug("superJump function");
    //if(this.player.body.touching.down && this.player.body.onFloor()){
        // Adicione uma velocidade no eixo Y, fazendo o jogador pular
        this.player.body.velocity.y = -1500;
        // Tocando o som de pulo
        this.jumpSound.play();
    //}
}

GameState.prototype.tambacuriCollision = function (enemie) {
    this.enemyDeathSound.play();
    // atualizando score
    this.score += 100;
    this.scoreText.text = "Score: " + this.score;
    enemie.kill();
}

window.onkeydown = function(event) {
    if (event.keyCode ==  Phaser.Keyboard.ESC) {
            game.paused = !game.paused;
    }  
}


