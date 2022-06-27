'use sctrict';

class Sudoku {
   constructor({ wrapper, gameField, gameImages, iconImages }) {
      this.wrapper = document.querySelector(wrapper);
      this.gameField = this.wrapper.querySelectorAll(gameField);
      this.gameImages = this.wrapper.querySelectorAll(gameImages);
      this.iconImages = this.wrapper.querySelectorAll(iconImages);
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
            data.forEach(item => {
               if (item.level == 'first') {
                  this.createStyle(item.images, item.backgroundImage, item.icons);
               }
            })
         })
         .catch((error) => console.error(error));
   }

   createStyle(img, bgi, icon) {
      this.gameImages.forEach((item) => {
         item.setAttribute('src', img);
      });
      this.iconImages.forEach((item, index) => {
         item.setAttribute('src', icon[index]);
      });
      this.wrapper.style.backgroundImage = `url(${bgi})`;
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

   dragEnter() {
      this.classList.add('hovered');
   }

   dragLeave() {
      this.classList.remove('hovered');
   }

   dragDrop(event) {
      let card = event.dataTransfer.getData('img');
      this.innerHTML = card;
      this.classList.remove('hovered');
   }

   toRightDrags() {
      this.gameField.forEach((cell) => {
         cell.addEventListener('dragover', this.dragOver);
         cell.addEventListener('dragenter', this.dragEnter);
         cell.addEventListener('dragleave', this.dragLeave);
         cell.addEventListener('drop', this.dragDrop);
      });
   }

   init() {
      console.dir(this);
      this.getConditionsGame();
      this.dragStart();
      this.toRightDrags();
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
