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
                  // this.randomStart(item.icons);
               }
            })
         })
         .catch((error) => console.error(error));
   }

   createStyle(img, bgi, icon) {
      this.gameImages.forEach((item) => {
         item.removeAttribute('src')
      });
      this.gameField.forEach((item) => item.classList.remove('active'));
      setTimeout((this.gameImages.forEach((item) => item.setAttribute('src', img))), 0);
      // this.gameImages.forEach((item) => {
      //    item.removeAttribute('src')
      //    // item.setAttribute('src', img)
      // });
      this.iconImages.forEach((item, index) => item.setAttribute('src', icon[index]));
      this.wrapper.style.backgroundImage = `url(${bgi})`;
   }

   randomStart(icon) {
      for (let i = 0; i < this.iconImages.length; i++) {
         let randomNumber = Math.floor(Math.random() * (16 - 0)) + 0;
         this.gameImages[randomNumber].setAttribute('src', icon[i]);
         this.gameImages[randomNumber].closest('.game__cell').classList.add('active');
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
      if (!this.matches('.active')) {
         let card = event.dataTransfer.getData('img');
         this.innerHTML = card;
         this.classList.add('active');
         this.firstElementChild.classList.add('game__cell__img');
         this.firstElementChild.classList.remove('icon__img');
      }
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
         ((this.gameField[0].innerHTML != this.gameField[1].innerHTML && this.gameField[0].innerHTML != this.gameField[2].innerHTML && this.gameField[0].innerHTML != this.gameField[3].innerHTML)
            && (this.gameField[1].innerHTML != this.gameField[2].innerHTML && this.gameField[1].innerHTML != this.gameField[3].innerHTML)
            && (this.gameField[2].innerHTML != this.gameField[3].innerHTML))
         &&
         ((this.gameField[4].innerHTML != this.gameField[5].innerHTML && this.gameField[4].innerHTML != this.gameField[6].innerHTML && this.gameField[4].innerHTML != this.gameField[7].innerHTML)
            && (this.gameField[5].innerHTML != this.gameField[6].innerHTML && this.gameField[5].innerHTML != this.gameField[7].innerHTML)
            && (this.gameField[6].innerHTML != this.gameField[7].innerHTML))
         &&
         ((this.gameField[8].innerHTML != this.gameField[9].innerHTML && this.gameField[8].innerHTML != this.gameField[10].innerHTML && this.gameField[8].innerHTML != this.gameField[11].innerHTML)
            && (this.gameField[9].innerHTML != this.gameField[10].innerHTML && this.gameField[9].innerHTML != this.gameField[11].innerHTML)
            && (this.gameField[10].innerHTML != this.gameField[11].innerHTML))
         &&
         ((this.gameField[12].innerHTML != this.gameField[13].innerHTML && this.gameField[12].innerHTML != this.gameField[14].innerHTML && this.gameField[12].innerHTML != this.gameField[15].innerHTML)
            && (this.gameField[13].innerHTML != this.gameField[14].innerHTML && this.gameField[13].innerHTML != this.gameField[15].innerHTML)
            && (this.gameField[14].innerHTML != this.gameField[15].innerHTML))
         &&
         ((this.gameField[0].innerHTML != this.gameField[4].innerHTML && this.gameField[0].innerHTML != this.gameField[8].innerHTML && this.gameField[0].innerHTML != this.gameField[12].innerHTML)
            && (this.gameField[4].innerHTML != this.gameField[8].innerHTML && this.gameField[4].innerHTML != this.gameField[12].innerHTML)
            && (this.gameField[8].innerHTML != this.gameField[12].innerHTML))
         &&
         ((this.gameField[1].innerHTML != this.gameField[5].innerHTML && this.gameField[1].innerHTML != this.gameField[9].innerHTML && this.gameField[1].innerHTML != this.gameField[13].innerHTML)
            && (this.gameField[5].innerHTML != this.gameField[9].innerHTML && this.gameField[5].innerHTML != this.gameField[13].innerHTML)
            && (this.gameField[9].innerHTML != this.gameField[13].innerHTML))
         &&
         ((this.gameField[2].innerHTML != this.gameField[6].innerHTML && this.gameField[2].innerHTML != this.gameField[10].innerHTML && this.gameField[2].innerHTML != this.gameField[14].innerHTML)
            && (this.gameField[6].innerHTML != this.gameField[10].innerHTML && this.gameField[6].innerHTML != this.gameField[14].innerHTML)
            && (this.gameField[10].innerHTML != this.gameField[14].innerHTML))
         &&
         ((this.gameField[3].innerHTML != this.gameField[7].innerHTML && this.gameField[3].innerHTML != this.gameField[11].innerHTML && this.gameField[3].innerHTML != this.gameField[15].innerHTML)
            && (this.gameField[7].innerHTML != this.gameField[11].innerHTML && this.gameField[7].innerHTML != this.gameField[15].innerHTML)
            && (this.gameField[11].innerHTML != this.gameField[15].innerHTML))
      ) {
         alert('Поздравляю!!! Ты выиграл');
         let choise = confirm('Хочешь перейти на слеующий уровень?');
         if (choise) {
            this.gamesData.forEach(item => {
               if (item.level == 'second') {
                  this.createStyle(item.images, item.backgroundImage, item.icons);
                  // this.randomStart(item.icons);
               }
            })
         } else {
            alert('Игра закончена!');
         }
      } else {
         alert('Ты проиграл')
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
