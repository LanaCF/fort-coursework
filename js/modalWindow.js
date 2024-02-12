let infoWindow;

// MyWindow ----------------------------------------------------------------------

class MyWindow {
    constructor(size, position, postInfo) {
      this.size = size;
      this.position = position;
      this.url = `https://starwars-visualguide.com/assets/img/vehicles/${postInfo.url.split('/').slice(-2)[0]}.jpg`;
      this.name = postInfo.name; 
      this.model = postInfo.model; 
      this.manufacturer = postInfo.manufacturer; 
      this.vehicle_class = postInfo.vehicle_class; 
      this.cost_in_credits = postInfo.cost_in_credits; 
      this.max_atmosphering_speed = postInfo.max_atmosphering_speed; 
      this.length = postInfo.length; 
      this.cargo_capacity = postInfo.cargo_capacity; 
      this.crew = postInfo.crew; 
      this.passengers = postInfo.passengers;
    }
  
    create() {
        const myWindow = doc.createElement('div');
        const infoBox = doc.createElement('div');

        console.log('Creating modal window');

        const posOpt = Object.keys(this.position);

        myWindow.style.cssText = 
            `
            position: fixed;
            z-index: 20000;
            background-color: #bbcedf;
            padding: 35px;
            width: ${this.size.w}px;
            height: ${this.size.h}px;
            ${posOpt[0]}: ${this.position[posOpt[0]]}px;
            ${posOpt[1]}: ${this.position[posOpt[1]]}px;
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
                <img src="${this.url}" alt="" class="card__img-mod-wind" onerror="this.onerror=null;this.src='img/image_not_found.jpg';">
            </div>

            <div class="modulWind">
                <h2 class="info-style-title"><b>${this.name}</b></h2>
                <p class="info-style"><b>Model:</b> ${this.model}</p>
                <p class="info-style"><b>Manufacturer:</b> ${this.manufacturer}</p>
                <p class="info-style"><b>Class:</b> ${this.vehicle_class}</p>
                <p class="info-style"><b>Cost:</b> ${this.cost_in_credits} credits</p>
                <p class="info-style"><b>Speed:</b> ${this.max_atmosphering_speed}km/h</p>
                <p class="info-style"><b>Length:</b> ${this.length}m</p>
                <p class="info-style"><b>Cargo Capacity:</b> ${this.cargo_capacity} tons</p>
                <p class="info-style"><b>Mimimum Crew:</b> ${this.crew}</p>
                <p class="info-style"><b>Passengers:</b> ${this.passengers}</p>
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

        btnClose.onclick = () => {
            myWindow.remove();
            overlay.remove();
        }

        return myWindow;
    }
}
