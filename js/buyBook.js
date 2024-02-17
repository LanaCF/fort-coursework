const priceEbookInfo = doc.querySelector('.price-ebook');
const pricePrintedBook = doc.querySelector('.price-printed-book');
const payment = doc.querySelector('.payment');

let bookTypeSelection = false;

getPriceEbook();
getPrintedBook();

isBreedsSelectEl.onchange = (e) => {
    isBreedsSelect = e.target.checked;
    showBreedsSelect();
}

function getPriceEbook() {
    fetch(baseUrl + resources.priceEbook)
        .then((response) => response.json())
        .then((price) => {
            priceEbookInfo.innerHTML = 
            `
                <span class="text-bold">
                    Вартість електронної книги:
                </span>
                ${ price[0].priceE } грн.
            `;
        })
        .catch(error => console.error('Помилка при отриманні коментарів:', error));
}

function getPrintedBook() {
    fetch(baseUrl + resources.pricePrintedBook)
        .then((response) => response.json())
        .then((price) => {
            pricePrintedBook.innerHTML = 
            `
                <span class="text-bold">
                    Вартість друкованої книги:
                </span>
                ${ price[0].priceP } грн.
            `;
        })
        .catch(error => console.error('Помилка при отриманні коментарів:', error));
}

function rederPaymentEbook() {
    payment.innerHTML = 
    `
        <form id="paymentForm">
            <div class="form-group">
                <label for="email">Електронна пошта:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="bookPrice">Вартість книги:</label>
                <input type="number" id="bookPrice" name="bookPrice" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="commission">Комісія:</label>
                <input type="number" id="commission" name="commission" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="toPay">До сплати:</label>
                <input type="number" id="toPay" name="toPay" min="0" step="0.01" required readonly>
            </div>
            <div class="form-group">
                <label for="amount">Внесіть суму оплати:</label>
                <input type="number" id="amount" name="amount" min="0" step="0.01" required>
            </div>
            <button type="submit">Оплатити</button>
        </form>
    `;
}



const bookTypeSelection = document.querySelector('.book_type_selection');
const paymentContainer = document.querySelector('.payment');

// Додаємо обробник подій для вибору типу книги
bookTypeSelection.addEventListener('change', function(event) {
    const selectedBookType = event.target.value;
    if (selectedBookType === 'electronic') {
        // Показуємо форму оплати для електронної книги
        showPaymentForm();
    } else {
        // Ховаємо форму оплати для друкованої книги
        hidePaymentForm();
    }
});