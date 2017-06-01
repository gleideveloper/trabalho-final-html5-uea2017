/**
 * Created by gleidesilva on 25/05/17.
 */

var HomeState = function (game) {
}

HomeState.prototype = {
    create: function(){
        //Set the games background colour
        this.game.stage.backgroundColor = '#697e96';

        var homeImage = this.game.add.sprite(640,320,"home");
        homeImage.anchor.setTo(0.5,0.5);


        var titleHome = this.game.add.text(1100, 320, "Click Play", {font: "40px Arial", fill: "#ffffff"});
        titleHome.anchor.setTo(0.5,0.5);

        var playButton = this.game.add.button(1100,380,"play",this.playTheGame,this);
        playButton.anchor.setTo(0.5,0.5);
    },
    playTheGame: function(){
        this.game.state.start("level1");
    }
}