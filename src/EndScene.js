import Phaser from 'phaser';

export default class EndScene extends Phaser.Scene {
  scoreLabel;

  scoreTexts;

  constructor() {
    super({ key: 'EndScene' });
  }

  init(data) {
    this.score = data.score;
    if (this.score >= 69) {
      this.scoreTexts = `Your Score: ${this.score}\nYou have been rick rolled ${Math.floor(this.score / 69)} times`;
    } else {
      this.scoreTexts = `Your Score: ${this.score}`;
    }
  }

  create() {
    this.gameOverButton = this.add.text(window.innerWidth / 2, this.cameras.main.height / 4, 'Game Over', {
      fontSize: '50px',
      fontStyle: 900,
    });
    this.gameOverButton.setOrigin(0.5, 0.5);

    this.scoreLabel = this.add.text(window.innerWidth / 2, (this.cameras.main.height / 2), `${this.scoreTexts}`, {
      fontSize: '50px',
      fontStyle: 900,
      align: 'center',
      wordWrap: { width: window.innerWidth, useAdvancedWrap: true },
    });
    this.scoreLabel.setOrigin(0.5, 0.5);

    this.restartButton = this.add.text(window.innerWidth / 2, (this.cameras.main.height / 4) * 3, 'Restart', {
      fontSize: '50px',
      fontStyle: 900,
    }).setInteractive().on('pointerdown', () => {
      this.scene.stop();
      this.scene.launch('DownStair');
    });
    this.restartButton.setOrigin(0.5, 0.5);
  }
}
