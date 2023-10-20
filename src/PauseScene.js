import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    this.continueButton = this.add.text(window.innerWidth / 2, (this.cameras.main.height / 2), 'Continue', {
      fontSize: '50px',
      fontStyle: 900,
      align: 'center',
      wordWrap: { width: window.innerWidth, useAdvancedWrap: true },
    }).setInteractive().on('pointerdown', () => {
      this.scene.resume('DownStair');
      this.scene.stop();
    });
    this.continueButton.setOrigin(0.5, 0.5);
  }
}
