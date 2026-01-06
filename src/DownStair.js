import Phaser from 'phaser';

const initialSpeed = -window.innerHeight / 8;
const initialPlayerSpeed = window.innerWidth / 4;
const initialPlatformDelay = 2000;
export default class DownStair extends Phaser.Scene {
  cursors;

  player;

  scoreLabel;

  score;

  addPlatformEvent;

  constructor() {
    super({ key: 'DownStair' });
  }

  preload() {
    this.load.image('sky', './assets/sky.png');
    this.load.image('ground', './assets/platform.png');
    this.load.spritesheet('coolImage', './assets/coolsprite.png', {
      frameWidth: 440, frameHeight: 466,
    });
    this.load.image('hachimi', './assets/hachimi.png');
    this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('scream', './assets/scream.mp3');
    this.load.audio('backgroundMusic', './assets/backgroundmusic.mp3');
    this.load.audio('coolSound', './assets/coolsound.mp3');
  }

  create() {
    this.createAnims();

    this.coolSound = this.sound.add('coolSound');
    this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.3 });
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play();
    this.gameOverSound = this.sound.add('scream');
    this.layer = this.add.layer();
    const backgroundImage = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky');
    const scaleX = window.innerWidth / backgroundImage.width;
    const scaleY = window.innerHeight / backgroundImage.height;
    backgroundImage.scaleX = scaleX;
    backgroundImage.scaleY = scaleY;

    this.addPlatformEvent = this.time.addEvent({
      delay: 2000,
      callback: this.addOnePlatform,
      callbackScope: this,
      loop: true,
    });

    this.removePlatformEvent = this.time.addEvent({
      delay: 2000,
      callback: this.removeOutOfScreenPlatForm,
      callbackScope: this,
      loop: true,
    });

    this.player = this.physics.add.sprite(this.cameras.main.width / 2, 300, 'hachimi');
    this.player.scaleX = 0.175;
    this.player.scaleY = 0.17;
    this.platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    const firstPlatform = this.physics.add.sprite(this.cameras.main.width / 2, 400, 'ground');
    this.platforms.add(firstPlatform);
    firstPlatform.setVelocityY(initialSpeed);
    firstPlatform.scaleX = 0.4;
    firstPlatform.scaleY = 0.25;
    firstPlatform.body.setSize(firstPlatform.width, firstPlatform.height * 0.7);
    firstPlatform.body.setOffset(0, firstPlatform.height * 0.35);
    firstPlatform.refreshBody();
    this.physics.add.collider(this.player, firstPlatform);

    this.score = 0;

    this.player.setCollideWorldBounds(true);

    this.player.body.onWorldBounds = true;

    this.player.body.allowGravity = false;
    this.cursors = this.input.keyboard.createCursorKeys();

    this.events.on('resume', () => {
      this.backgroundMusic.resume();
      if (this.coolSound.isPaused) {
        this.coolSound.resume();
      }
    });
    // game over
    this.physics.world.on('worldbounds', (_, up, down) => {
      if (up || down) {
        this.backgroundMusic.stop();
        this.coolSound.stop();
        this.gameOverSound.play();
        this.scene.pause();
        this.scene.launch('EndScene', { score: this.score });
      }
    });

    this.scoreLabel = this.add.text(20, 20, '0', {
      fontSize: '50px',
      fontStyle: 900,
      fontFamily: '"Outfit", sans-serif',
      color: '#333333',
    });

    this.pauseButton = this.add.text(window.innerWidth - 200, 20, 'Pause', {
      fontSize: '50px',
      fontStyle: 900,
      fontFamily: '"Outfit", sans-serif',
      color: '#333333',
    }).setInteractive().on('pointerdown', () => {
      if (this.coolSound.isPlaying) {
        this.coolSound.pause();
      }

      this.scene.pause();
      this.backgroundMusic.pause();

      this.scene.launch('PauseScene');
    });

    this.layer.add([backgroundImage, this.player, this.scoreLabel]);
  }

  removeOutOfScreenPlatForm() {
    for (let i = 0; i < this.platforms.children.size; i += 1) {
      if (this.platforms.children.entries[i].y < 0) {
        this.platforms.children.entries[i].destroy();
      }
    }
  }

  getCurrentSpeed() {
    return initialSpeed - Math.floor(this.score / 10) * 10;
  }

  getPlatformDelay() {
    return initialPlatformDelay / (this.getCurrentSpeed() / initialSpeed);
  }

  getPlayerSpeed() {
    return ((this.getCurrentSpeed() / initialSpeed) * initialPlayerSpeed) / 2;
  }

  getPlayerFallSpeed() {
    return -this.getCurrentSpeed();
  }

  addOnePlatform() {
    const platformScale = window.innerWidth / 2000;
    const singlePlatform = this.physics.add.sprite(Phaser.Math.Between((400 * platformScale) / 2, window.innerWidth - ((400 * platformScale) / 2)), window.innerHeight, 'ground');
    this.platforms.add(singlePlatform);
    singlePlatform.setData('score', true);
    singlePlatform.scaleX = platformScale;
    singlePlatform.scaleY = 0.25;
    singlePlatform.body.setSize(singlePlatform.width, singlePlatform.height * 0.7);
    singlePlatform.body.setOffset(0, singlePlatform.height * 0.35);
    singlePlatform.body.updateFromGameObject();
    singlePlatform.setVelocityY(this.getCurrentSpeed());
    this.physics.add.collider(this.player, singlePlatform, (player, platform) => {
      if (player.body.touching.down && platform.getData('score')) {
        this.score += 1;
        if ((this.score % 69) === 0) {
          if (this.coolImage) {
            this.coolImage.setVisible(true);
            this.coolImage.anims.play('cool', true);
            this.coolSound.play();
          } else {
            this.coolImage = this.add.sprite(this.cameras.main.width / 2, 500, 'coolImage');
            this.layer.add(this.coolImage);
            this.layer.bringToTop(this.player);
            this.coolImage.anims.play('cool', true);
            this.coolSound.play();
            this.coolSound.on('complete', () => {
              this.coolImage.setVisible(false);
            });
          }
        }
        this.scoreLabel.text = this.score;
        this.platforms.setVelocityY(this.getCurrentSpeed());
        this.addPlatformEvent.delay = this.getPlatformDelay();
        platform.setData('score', false);
      }
    });
  }

  update() {
    const { left, right } = this.cursors;

    if (left.isDown) {
      this.player.setVelocityX(-this.getPlayerSpeed());

      // this.player.anims.play('left', true);
    } else if (right.isDown) {
      this.player.setVelocityX(this.getPlayerSpeed());

      // this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      // this.player.anims.play('turn');
    }

    if (!this.player.body.onFloor()) {
      this.player.setVelocityY(this.getPlayerFallSpeed());
    }
  }

  createAnims() {
    if (!this.anims.exists('cool')) {
      this.anims.create({
        key: 'cool',
        frames: this.anims.generateFrameNumbers('coolImage', {
          start: 0,
          end: 27,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // if (!this.anims.exists('left')) {
    //   this.anims.create({
    //     key: 'left',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    //     frameRate: 10,
    //     repeat: -1,
    //   });

    //   this.anims.create({
    //     key: 'turn',
    //     frames: [{ key: 'dude', frame: 4 }],
    //     frameRate: 20,
    //   });

    //   this.anims.create({
    //     key: 'right',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    //     frameRate: 10,
    //     repeat: -1,
    //   });
    // }
  }
}
