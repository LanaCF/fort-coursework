let infoWindow;

// MyWindow ----------------------------------------------------------------------

class MyWindow {
    constructor(size, position, id, img, name, birthday, nationality, profession, info, title, text ) {
      this.size = size;
      this.position = position;

      this.id = id;
      this.img = img;
      this.name = name;
      this.birthday = birthday;
      this.nationality = nationality;
      this.profession = profession;
      this.info = info;

      this.title = title;
      this.text = text; 
    }
  
    create() {
        const myWindow = doc.createElement('div');
        const infoBox = doc.createElement('div');
        const posOpt = Object.keys(this.position);

        myWindow.style.cssText = 
            `
            position: fixed;
            z-index: 20000;
            padding: 35px;
            max-width: ${this.size.w}%;
            height: ${this.size.h}px;
            ${posOpt[0]}: ${this.position[posOpt[0]]}%;
            ${posOpt[1]}: ${this.position[posOpt[1]]}%;
            `;

        infoBox.className = 'modal-window-info-block';
        infoBox.style.cssText =
            `
            width: 100%;
            height: 100%;
            text-align: justify;
            hyphens: auto;
            background-color: white;
            padding: 15px;
            overflow: hidden;
            overflow-y: scroll;
            `;

        infoBox.innerHTML = 
            `
            <div class="modulWind">
                <img src="${ this.img }" alt="" class="card__img-mod-wind" onerror="this.onerror=null;this.src='img/image_not_found.jpg';">
            </div>

            <div class="modulWind">
                <h2 class="info-style-title"><b>${this.name}</b></h2>
                <p class="info-style"><b>Дата народження:</b> ${this.birthday}</p>
                <p class="info-style"><b>Національність:</b> ${this.nationality}</p>
                <p class="info-style"><b>Професія:</b> ${this.profession}</p>
                <p class="info-style"><b>Інформація:</b> ${this.info}</p>
            </div>
            `;

        document.body.append(myWindow);
        myWindow.append(infoBox);

        return myWindow;
    }
}
    
// ModalWindow ----------------------------------------------------------------------
  
class ModalWindow extends MyWindow {
    create() {
        const myWindow = super.create();
        this.myWindow = myWindow;
        this.overlay = document.createElement('div');
        const overlay = this.overlay;

        overlay.style.cssText = 
            `
            position: fixed;
            z-index: 10000;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, .7);
            overflow: hidden;
            `;
        
        document.body.append(overlay);

        overlay.innerHTML = 
            `
            <img src="img/close2.png" alt="" class='btn-close'>
            `;

        const btnClose = document.querySelector('.btn-close');
        btnClose.style.cssText = 
            `
            width: 30px;
            margin: 25px;
            position: absolute;
            cursor: pointer;
            top: 0;
            right: 0;
            `;

        overlay.onclick = () => {
            myWindow.remove();
            overlay.remove();
        };
        
        btnClose.onclick = () => {
            myWindow.remove();
            overlay.remove();
        }

        return myWindow;
    }
}
   
// ChapterModal ----------------------------------------------------------------------
 
class ChapterModal extends MyWindow {
    constructor(size, position, id, title, text) {
        super(size, position);
        this.id = id;
        this.title = title;
        this.text = text;
    }

    create() {
        const myWindow = super.create();
        const { id, title, text } = this;

        const infoBox = myWindow.querySelector('.modal-window-info-block');

        infoBox.innerHTML = `
            <h2 class="info-style-title"><b>${title}</b></h2>
            <p>${text}</p>
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            z-index: 10000;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, .7);
            overflow: hidden;
        `;
        document.body.append(overlay);

        const btnClose = document.createElement('img');
        btnClose.src = "img/close2.png";
        btnClose.alt = "";
        btnClose.className = 'btn-close';
        btnClose.style.cssText = `
            width: 30px;
            margin: 25px;
            position: absolute;
            cursor: pointer;
            top: 0;
            right: 0;
        `;
        overlay.append(btnClose);

        overlay.onclick = () => {
            myWindow.remove();
            overlay.remove();
        };

        btnClose.onclick = () => {
            myWindow.remove();
            overlay.remove();
        };

        return myWindow;
    }
}