import Phaser from 'phaser';

import DownStair from './DownStair';
import EndScene from './EndScene';

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: window.innerWidth - 20,
  height: window.innerHeight - 20,
  physics: {
    default: 'arcade',
  },
  scene: [DownStair, EndScene],
};

export default new Phaser.Game(config);
