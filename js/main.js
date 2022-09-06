'use sctrict';

class Sudoku {
   constructor({ wrapper, gameField, gameImages, iconImages }) {
      this.wrapper = document.querySelector(wrapper);
      this.gameField = this.wrapper.querySelectorAll(gameField);
      this.gameImages = this.wrapper.querySelectorAll(gameImages);
      this.iconImages = this.wrapper.querySelectorAll(iconImages);
      this.gamesData = null;
   }

   getConditionsGame() {
      fetch('../game.json')
         .then((response) => {
            if (response.status !== 200) {
               throw new Error('Response status is not 200');
            }
            return response.json();
         })
         .then((data) => {
            this.gamesData = data;
            data.forEach(item => {
               if (item.level == 'first') {
                  this.createStyle(item.images, item.backgroundImage, item.icons);
                  this.randomStart(item.icons);
               }
            })
         })
         .catch((error) => console.error(error));
   }

   createStyle(img, bgi, icon) {
      this.gameField.forEach((item) => item.classList.remove('active'));
      this.gameImages.forEach((item) => item.setAttribute('src', img));
      this.gameImages.forEach((item) => item.setAttribute('draggable', 'false'));
      this.gameField.forEach((item) => item.innerHTML = this.gameImages[0].outerHTML);
      this.iconImages.forEach((item, index) => {
         item.setAttribute('src', icon[index]);
         item.setAttribute('data_value', index + 1);
      });

      this.wrapper.style.backgroundImage = `url(${bgi})`;
   }

   randomStart(icon) {
      for (let i = 0; i < this.iconImages.length; i++) {
         let randomNumber = Math.floor(Math.random() * (16 - 0)) + 0;
         this.gameImages[randomNumber].setAttribute('src', icon[i]);
         this.gameImages[randomNumber].setAttribute('data_value', i + 1);
         this.gameField[randomNumber].innerHTML = this.gameImages[randomNumber].outerHTML;
         this.gameField[randomNumber].classList.add('active');
      }
   }

   dragStart() {
      this.wrapper.addEventListener('dragstart', (event) => {
         if (event.target.matches('img')) {
            event.dataTransfer.setData('img', event.target.outerHTML);
         }
      })
   }

   dragOver(event) {
      event.preventDefault();
   }

   dragDrop(event) {
      let card = event.dataTransfer.getData('img');
      this.innerHTML = card;
      this.classList.add('active');
      this.firstElementChild.classList.add('game__cell__img');
      this.firstElementChild.classList.remove('icon__img');
      this.firstElementChild.setAttribute('draggable', 'false');

      // Для того что-бы запретить менять уже установленные картинки, нужно расскоментировать код ниже, а выше закоментировать

      // if (!this.matches('.active')) {
      //    let card = event.dataTransfer.getData('img');
      //    this.innerHTML = card;
      //    this.classList.add('active');
      //    this.firstElementChild.classList.add('game__cell__img');
      //    this.firstElementChild.classList.remove('icon__img');
      //    this.firstElementChild.setAttribute('draggable', 'false');
      // }
   }

   gameDrags() {
      this.gameField.forEach((cell) => {
         cell.addEventListener('dragover', this.dragOver);
         cell.addEventListener('drop', this.dragDrop);
         cell.addEventListener('drop', this.gameLogic.bind(this));
      });
   }

   gameLogic() {
      let count = 0;
      this.gameField.forEach((item) => {
         if (item.matches('.active')) {
            count++;
         }
      });
      if (this.gameField.length == count) {
         this.checkForWinn();
      }
   }

   checkForWinn() {
      if (
         (+this.gameField[0].children[0].getAttribute('data_value') + +this.gameField[1].children[0].getAttribute('data_value') + +this.gameField[2].children[0].getAttribute('data_value') + +this.gameField[3].children[0].getAttribute('data_value') == 10)
         &&
         (+this.gameField[4].children[0].getAttribute('data_value') + +this.gameField[5].children[0].getAttribute('data_value') + +this.gameField[6].children[0].getAttribute('data_value') + +this.gameField[7].children[0].getAttribute('data_value') == 10)
         &&
         (+this.gameField[8].children[0].getAttribute('data_value') + +this.gameField[9].children[0].getAttribute('data_value') + +this.gameField[10].children[0].getAttribute('data_value') + +this.gameField[11].children[0].getAttribute('data_value') == 10)
         &&
         (+this.gameField[12].children[0].getAttribute('data_value') + +this.gameField[13].children[0].getAttribute('data_value') + +this.gameField[14].children[0].getAttribute('data_value') + +this.gameField[15].children[0].getAttribute('data_value') == 10)
         &&
         (+this.gameField[0].children[0].getAttribute('data_value') + +this.gameField[4].children[0].getAttribute('data_value') + +this.gameField[8].children[0].getAttribute('data_value') + +this.gameField[12].children[0].getAttribute('data_value') == 10)
         &&
         (+this.gameField[1].children[0].getAttribute('data_value') + +this.gameField[5].children[0].getAttribute('data_value') + +this.gameField[9].children[0].getAttribute('data_value') + +this.gameField[13].children[0].getAttribute('data_value') == 10)
         &&
         (+this.gameField[2].children[0].getAttribute('data_value') + +this.gameField[6].children[0].getAttribute('data_value') + +this.gameField[10].children[0].getAttribute('data_value') + +this.gameField[14].children[0].getAttribute('data_value') == 10)
         &&
         (+this.gameField[3].children[0].getAttribute('data_value') + +this.gameField[7].children[0].getAttribute('data_value') + +this.gameField[11].children[0].getAttribute('data_value') + +this.gameField[15].children[0].getAttribute('data_value') == 10)
      ) {
         alert('Поздравляю!!! Ты выиграл');
         let choise = confirm('Хочешь перейти на слеующий уровень?');
         if (choise) {
            this.gamesData.forEach(item => {
               if (item.level == 'second') {
                  this.createStyle(item.images, item.backgroundImage, item.icons);
                  this.randomStart(item.icons);
               }
            })
         } else {
            alert('Игра закончена!');
         }
      } else {
         alert('Ты проиграл');
         this.gamesData.forEach(item => {
            if (item.level == 'first') {
               this.createStyle(item.images, item.backgroundImage, item.icons);
               this.randomStart(item.icons);
            }
         })
      }
   }

   init() {
      console.dir(this);
      this.getConditionsGame();
      this.dragStart();
      this.gameDrags();
   }
}

let obj = {
   wrapper: '.wrapper',
   gameField: '.game__cell',
   gameImages: '.game__cell__img',
   iconImages: '.icon__img',
}

const game = new Sudoku(obj);
game.init();
