const priceEbookInfo = doc.querySelector('.price-ebook');
const pricePrintedBook = doc.querySelector('.price-printed-book');
const payment = doc.querySelector('.payment');
const isSelectElectronic = doc.querySelector('.electronic');
const isSelectPrinted = doc.querySelector('.printed');
const ebookLabel = doc.querySelector('.ebook-label');
const pbookLabel = doc.querySelector('.pbook-label');
const congratsPurchase = doc.querySelector('.congrats-purchase-text');

let selection = false;

getPriceEbook();
getPrintedBook();
getQuantitySoldEbook();
getQuantitySoldPbook();

isSelectElectronic.onchange = (e) => {
    payment.innerHTML = '';
    congratsPurchase.style.display = 'none';
    pbookLabel.classList.remove('active');
    selection = e.target.checked;
    ebookLabel.classList.add('active');
    renderPaymentEbook();
}

isSelectPrinted.onchange = (e) => {
    payment.innerHTML = '';
    congratsPurchase.style.display = 'none';
    ebookLabel.classList.remove('active');
    selection = e.target.checked;
    pbookLabel.classList.add('active');
    renderPaymentPrintedBook();
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

async function renderPaymentEbook() {
    payment.innerHTML = 
    `
        <form id="paymentForm" class="form-payment">
            <div class="form-group">
                <label for="email" class="form-label">Електронна пошта:</label>
                <input type="email" id="email" name="email" placeholder="example@gmail.com" class="form-input-style email-box" required>
            </div>

            <div class="error-comment-box">
                <p class="warning-buy warning-email">
                    Поле заповнено некоректно.
                </p>
            </div>

            <div class="form-group">
                <label for="bookPrice" class="form-label">Вартість книги:</label>
                <span class="price-ebook-buy"></span>
            </div>

            <div class="form-group">
                <label for="commission" class="form-label">Комісія:</label>
                <span class="commission-ebook-buy"></span>
            </div>

            <div class="form-group">
                <label for="toPay" class="form-label">До сплати:</label>
                <span class="cost"></span>
            </div>

            <div class="form-group">
                <label for="cardNumber" class="form-label">Номер карти:</label>
                <input type="text" id="cardNumber" name="cardNumber" class="form-input-style card-type" placeholder="XXXX XXXX XXXX XXXX" required>
            </div>

            <div class="error-comment-box">
                <p class="warning-buy warning-card">
                    Поле заповнено некоректно.
                </p>
            </div>

            <div class="form-group">
                <label for="expiryDate" class="form-label">Термін дії:</label>
                <input type="text" id="expiryDate" name="expiryDate" class="form-input-style term-type" placeholder="MM/RR" required>
            </div>

            <div class="error-comment-box">
                <p class="warning-buy warning-term">
                    Поле заповнено некоректно.
                </p>
            </div>

            <div class="form-group">
                <label for="cvv" class="form-label">CVV:</label>
                <input type="password" id="cvv" name="cvv" class="form-input-style cvv-type" placeholder="•••" required>
            </div>

            <div class="error-comment-box">
                <p class="warning-buy warning-cvv">
                    Поле заповнено некоректно.
                </p>
            </div>

            <button type="submit" class="form-button-buy">
                Оплатити
            </button>
        </form>
    `;
    
    commission();
    cardType();
    termType();
    cvvType();

    fetch(baseUrl + resources.priceEbook)
        .then((response) => response.json())
        .then((price) => {
            const priceEbookBuy = doc.querySelector('.price-ebook-buy');
            priceEbookBuy.innerText = `${ price[0].priceE } грн.`;
        })
        .catch(error => console.error('Помилка при отриманні коментарів:', error));

    const costElement = doc.querySelector('.cost');

    try {
        const [ebookPrice, comm] = await Promise.all([costEbook(), commissionCost()]);
        const totalCost = ebookPrice + comm;
        costElement.innerText = `${totalCost} грн.`;
    } catch (error) {
        console.error('Помилка під час обчислення загальної суми для сплати:', error);
    }

    const btnBuyEbook = doc.querySelector('.form-button-buy');
    const warningEmail = doc.querySelector('.warning-email');
    const warningCard = doc.querySelector('.warning-card');
    const warningTerm = doc.querySelector('.warning-term');
    const warningCvv = doc.querySelector('.warning-cvv');
    const emailBox = doc.querySelector('.email-box');
    const cardBox = doc.querySelector('.card-type');
    const termBox = doc.querySelector('.term-type');
    const cvvBox = doc.querySelector('.cvv-type');

    btnBuyEbook.addEventListener('click', function(event) {
        event.preventDefault();

        const emailBoxValue = emailBox.value;
        const cardBoxValue = cardBox.value;
        const termBoxValue = termBox.value;
        const cvvBoxValue = cvvBox.value;
        let allFieldsValid = false;
        
        if (auditEmail(emailBoxValue) && auditCard(cardBoxValue) && auditTerm(termBoxValue) && auditCvv(cvvBoxValue)) {
            allFieldsValid = true;
            warningEmail.style.display = 'none';
            warningCard.style.display = 'none';
            warningTerm.style.display = 'none';
            warningCvv.style.display = 'none';
        } else {
            allFieldsValid = false;
            if (!auditEmail(emailBoxValue)) {
                warningEmail.style.display = 'initial';
            } else {
                warningEmail.style.display = 'none';
            }
            if (!auditCard(cardBoxValue)) {
                warningCard.style.display = 'initial';
            } else {
                warningCard.style.display = 'none';
            }
            if (!auditTerm(termBoxValue)) {
                warningTerm.style.display = 'initial';
            } else {
                warningTerm.style.display = 'none';
            }
            if (!auditCvv(cvvBoxValue)) {
                warningCvv.style.display = 'initial';
            } else {
                warningCvv.style.display = 'none';
            }
        }

        if (allFieldsValid) {
            fetch(baseUrl + resources.boughtEbooks + "/0792")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(bookData => {
                const currentQuantity = bookData.quantityE;
                const updatedQuantity = currentQuantity + 1;

                return fetch(baseUrl + resources.boughtEbooks + "/0792", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantityE: updatedQuantity })
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Кількість куплених книг оновлена успішно:', data);
                ebookLabel.classList.remove('active');
                isSelectElectronic.checked = false;
                congratsPurchase.style.display = 'initial';
                getQuantitySoldEbook();
                getQuantitySoldPbook();

                const ebookPurchaseData = {
                    email: `${ emailBoxValue }`,
                    cardNumber: `${ cardBoxValue }`,
                    expiryDate: `${ termBoxValue }`,
                    cvv: `${ cvvBoxValue }`
                };

                sendPurchaseDataToServer(ebookPurchaseData, "ebookBuyerData");
            })
            .catch(error => {
                console.error('Сталася помилка при оновленні кількості куплених книг:', error);
            });

            payment.innerHTML = '';
        }
    });
}

async function renderPaymentPrintedBook() {
    payment.innerHTML = 
    `
    <form id="printBookPaymentForm" class="form-payment">
        <div class="form-group">
            <label for="surnamePbook" class="form-label">Прізвище:</label>
            <input type="text" id="surnamePbook" name="fullName" class="form-input-style surname-box" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-surname">
                Поле заповнено некоректно.
            </p>
        </div>

        <div class="form-group">
            <label for="namePbook" class="form-label">Ім'я:</label>
            <input type="text" id="namePbook" name="fullName" class="form-input-style name-box" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-name">
                Поле заповнено некоректно.
            </p>
        </div>

        <div class="form-group">
            <label for="middleNamePbook" class="form-label">По батькові:</label>
            <input type="text" id="middleNamePbook" name="fullName" class="form-input-style middle-name-box" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-middle-name">
                Поле заповнено некоректно.
            </p>
        </div>

        <div class="form-group">
            <label for="emailPbook" class="form-label">Електронна пошта:</label>
            <input type="email" id="emailPbook" name="email" class="form-input-style email-box" placeholder="example@gmail.com" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-email">
                Поле заповнено некоректно.
            </p>
        </div>

        <div class="form-group">
            <label for="phonePbook" class="form-label">Телефон:</label>
            <input type="tel" id="phonePbook" name="phone" class="form-input-style phone-number" placeholder="+__ (___) ___-__-__" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-phone">
                Поле заповнено некоректно.
            </p>
        </div>

        <div class="form-group">
            <label for="addressPbook" class="form-label">Адреса:</label>
            <input type="text" id="addressPbook" name="address" class="form-input-style address-box" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-address">
                Поле заповнено некоректно.
            </p>
        </div>

        <div class="form-group">
            <p>Спосіб доставки:</p>
            <div class="delivery-method">
                <input type="radio" id="ukrPoshtaPbook" name="delivery" class="post ukr-post-check" required>
                <p class="form-label ukr-post">
                    "Укрпошта" №
                </p>
                <input type="number" id="numberUkrPostPbook" name="numberUkrPost" min="1" class="ukr-number-post ukr-not-active" required>
            </div>

            <div class="delivery-method">
                <input type="radio" id="novaPoshtaPbook" name="delivery" class="post new-post-check" required>
                <p class="form-label new-post">
                    "Нова пошта" №
                </p>
                <input type="number" id="numberPostPbook" name="numberPost" class="new-number-post new-not-active" min="1" required>
            </div>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-post">
                Оберіть спосіб доставки.
            </p>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-post-number">
                Вкажіть поштове відділення.
            </p>
        </div>

        <div class="form-group">
            <label for="quantityPbook" class="form-label">Кількість екземплярів:</label>
            <input type="number" id="quantityPbook" name="quantity" class="form-input-style quantity" min="1" value="" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-quantity">
                Будь ласка, вкажіть кількість екземплярів.
            </p>
        </div>

        <div class="form-group">
            <label for="bookPrice" class="form-label">Вартість книги:</label>
            <span class="price-pbook-buy"></span>
        </div>

        <div class="form-group">
            <label for="commission" class="form-label">Комісія:</label>
            <span class="commission-ebook-buy"></span>
        </div>

        <div class="form-group">
            <label for="toPay" class="form-label">До сплати:</label>
            <span class="cost"></span>
        </div>

        <div class="form-group">
            <label for="cardNumberPbook" class="form-label">Номер карти:</label>
            <input type="text" id="cardNumberPbook" name="cardNumber" class="form-input-style card-type" placeholder="XXXX XXXX XXXX XXXX" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-card">
            Будь ласка, вкажіть кількість екземплярів.
            </p>
        </div>

        <div class="form-group">
            <label for="expiryDatePbook" class="form-label">Термін дії:</label>
            <input type="text" id="expiryDatePbook" name="expiryDate" class="form-input-style term-type" placeholder="MM/RR" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-term">
            Будь ласка, вкажіть кількість екземплярів.
            </p>
        </div>

        <div class="form-group">
            <label for="cvvPbook" class="form-label">CVV:</label>
            <input type="password" id="cvvPbook" name="cvv" class="form-input-style cvv-type" placeholder="•••" required>
        </div>

        <div class="error-comment-box">
            <p class="warning-buy warning-cvv">
            Будь ласка, вкажіть кількість екземплярів.
            </p>
        </div>

        <button type="submit" class="form-button-buy">
            Оплатити
        </button>
    </form>
    `;
    
    phoneType();
    commission();
    cardType();
    termType();
    cvvType();

    const ukrPostCheck = doc.querySelector('.ukr-post-check');
    const newPostCheck = doc.querySelector('.new-post-check');
    const ukrPost = doc.querySelector('.ukr-post');
    const newPost = doc.querySelector('.new-post');
    const ukrNotActive = doc.querySelector('.ukr-not-active');
    const newNotActive = doc.querySelector('.new-not-active');
    const ukrNumberPost = doc.querySelector('.ukr-number-post');
    const newNumberPost = doc.querySelector('.new-number-post');

    newNotActive.disabled = true;
    ukrNotActive.disabled = true;

    ukrPostCheck.onchange = (e) => {
        newNumberPost.value = '';
        newPost.classList.remove('active');
        newNotActive.disabled = true;
        selection = e.target.checked;
        ukrPost.classList.add('active');
        ukrNotActive.disabled = false;
    }

    newPostCheck.onchange = (e) => {
        ukrNumberPost.value = '';
        ukrPost.classList.remove('active');
        ukrNotActive.disabled = true;
        selection = e.target.checked;
        newPost.classList.add('active');
        newNotActive.disabled = false;
    }

    fetch(baseUrl + resources.pricePrintedBook)
        .then((response) => response.json())
        .then((price) => {
            const pricePbookBuy = doc.querySelector('.price-pbook-buy');
            pricePbookBuy.innerText = `${ price[0].priceP } грн.`;
        })
        .catch(error => console.error('Помилка при отриманні коментарів:', error));

    const costElement = doc.querySelector('.cost');
    const quantity = doc.querySelector('.quantity');

    let totalCost;

    quantity.addEventListener('input', async () => {
        try {
            const [printedPrice, comm] = await Promise.all([costPbook(), commissionCost()]);
            totalCost = printedPrice * quantity.value + comm;
            costElement.innerText = `${totalCost} грн.`;
        } catch (error) {
            console.error('Помилка під час обчислення загальної суми для сплати:', error);
        }
    });
    
    const btnBuyEbook = doc.querySelector('.form-button-buy');

    const warningSurname = doc.querySelector('.warning-surname');
    const warningName = doc.querySelector('.warning-name');
    const warningMiddleName = doc.querySelector('.warning-middle-name');
    const warningPphone = doc.querySelector('.warning-phone');
    const warningAddress = doc.querySelector('.warning-address');
    const warningPost = doc.querySelector('.warning-post');
    const warningPostNumber = doc.querySelector('.warning-post-number');
    const warningQuantity = doc.querySelector('.warning-quantity');
    const warningEmail = doc.querySelector('.warning-email');
    const warningCard = doc.querySelector('.warning-card');
    const warningTerm = doc.querySelector('.warning-term');
    const warningCvv = doc.querySelector('.warning-cvv');

    const surnameBox = doc.querySelector('.surname-box');
    const nameBox = doc.querySelector('.name-box');
    const middleNameBox = doc.querySelector('.middle-name-box');
    const emailBox = doc.querySelector('.email-box');
    const phoneNumber = doc.querySelector('.phone-number');
    const addressBox = doc.querySelector('.address-box');
    const ukrPostCheckBox = doc.querySelector('.ukr-post-check');
    const newPostCheckBox = doc.querySelector('.new-post-check');
    const quantityBox = doc.querySelector('.quantity');
    const cardBox = doc.querySelector('.card-type');
    const termBox = doc.querySelector('.term-type');
    const cvvBox = doc.querySelector('.cvv-type');

    btnBuyEbook.addEventListener('click', function(event) {
        event.preventDefault();

        const surnameBoxValue = surnameBox.value;
        const nameBoxValue = nameBox.value;
        const middleNameBoxValue = middleNameBox.value;
        const emailBoxValue = emailBox.value;
        const phoneNumberValue = phoneNumber.value;
        const addressBoxValue = addressBox.value;
        const ukrPostCheckBoxValue = ukrPostCheckBox.value;
        const newPostCheckBoxValue = newPostCheckBox.value;
        const ukrNumberPostValue = ukrNumberPost.value;
        const newNumberPostValue = newNumberPost.value;
        const quantityBoxValue = quantityBox.value;
        const cardBoxValue = cardBox.value;
        const termBoxValue = termBox.value;
        const cvvBoxValue = cvvBox.value;

        let allFieldsValid = false;
        
        if (auditName(surnameBoxValue) && auditName(nameBoxValue) && auditName(middleNameBoxValue) && auditPhone(phoneNumberValue) && auditAddress(addressBoxValue) && auditEmail(emailBoxValue) && auditCard(cardBoxValue) && auditTerm(termBoxValue) && auditCvv(cvvBoxValue) && (newPostCheck.checked || ukrPostCheck.checked) && (auditPost(ukrNumberPostValue) || auditPost(newNumberPostValue)) && auditQuantity(quantityBoxValue)) {
            allFieldsValid = true;
            
            warningSurname.style.display = 'none';
            warningName.style.display = 'none';
            warningMiddleName.style.display = 'none';
            warningPphone.style.display = 'none';
            warningEmail.style.display = 'none';
            warningAddress.style.display = 'none';
            warningPost.style.display = 'none';
            warningPostNumber.style.display = 'none';
            warningQuantity.style.display = 'none';
            warningCard.style.display = 'none';
            warningTerm.style.display = 'none';
            warningCvv.style.display = 'none';
        } else {
            allFieldsValid = false;

            if (!auditName(surnameBoxValue)) {
                warningSurname.style.display = 'initial';
            } else {
                warningSurname.style.display = 'none';
            }

            if (!auditName(nameBoxValue)) {
                warningName.style.display = 'initial';
            } else {
                warningName.style.display = 'none';
            }

            if (!auditName(middleNameBoxValue)) {
                warningMiddleName.style.display = 'initial';
            } else {
                warningMiddleName.style.display = 'none';
            }

            if (!auditPhone(phoneNumberValue)) {
                warningPphone.style.display = 'initial';
            } else {
                warningPphone.style.display = 'none';
            }

            if (!auditEmail(emailBoxValue)) {
                warningEmail.style.display = 'initial';
            } else {
                warningEmail.style.display = 'none';
            }

            if (!auditAddress(addressBoxValue)) {
                warningAddress.style.display = 'initial';
            } else {
                warningAddress.style.display = 'none';
            }

            if (!newPostCheck.checked && !ukrPostCheck.checked) {
                warningPost.style.display = 'initial';
            } else {
                warningPost.style.display = 'none';
            }

            if (ukrPostCheck.checked && !ukrPostCheckBoxValue) {
                warningPostNumber.style.display = 'initial';
            } else {
                warningPostNumber.style.display = 'none';
            }
            
            if (newPostCheck.checked && !newPostCheckBoxValue) {
                warningPostNumber.style.display = 'initial';
            } else {
                warningPostNumber.style.display = 'none';
            }

            if ((ukrPostCheck.checked && !auditPost(ukrNumberPostValue)) || (newPostCheck.checked && !auditPost(newNumberPostValue))) {
                warningPostNumber.style.display = 'initial';
            } else {
                warningPostNumber.style.display = 'none';
            }

            if (!auditQuantity(quantityBoxValue)) {
                warningQuantity.style.display = 'initial';
            } else {
                warningQuantity.style.display = 'none';
            }

            if (!auditCard(cardBoxValue)) {
                warningCard.style.display = 'initial';
            } else {
                warningCard.style.display = 'none';
            }

            if (!auditTerm(termBoxValue)) {
                warningTerm.style.display = 'initial';
            } else {
                warningTerm.style.display = 'none';
            }

            if (!auditCvv(cvvBoxValue)) {
                warningCvv.style.display = 'initial';
            } else {
                warningCvv.style.display = 'none';
            }
        }

        if (allFieldsValid) {
            fetch(baseUrl + resources.boughtPrintedBooks + "/4699")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(bookData => {
                const currentQuantity = bookData.quantityP;
                const updatedQuantity = currentQuantity + Number(quantityBoxValue);

                return fetch(baseUrl + resources.boughtPrintedBooks + "/4699", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantityP: updatedQuantity })
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Кількість куплених книг оновлена успішно:', data);
                pbookLabel.classList.remove('active');
                isSelectPrinted.checked = false;
                congratsPurchase.style.display = 'initial';
                getQuantitySoldEbook();
                getQuantitySoldPbook();

                const pbookPurchaseData = {
                    surname: `${ surnameBoxValue }`,
                    name: `${ nameBoxValue }`,
                    middleName: `${ middleNameBoxValue }`,
                    email: `${ emailBoxValue }`,
                    phone: `${ phoneNumberValue }`,
                    address: `${ addressBoxValue }`,
                    post: ukrPostCheck.checked ? 'Укрпошта' : 'Нова пошта',
                    numberPost: ukrPostCheck.checked ? ukrNumberPostValue : newNumberPostValue,
                    quantity: `${ quantityBoxValue }`,
                    cost: `${ totalCost }`,
                    cardNumber: `${ cardBoxValue }`,
                    expiryDate: `${ termBoxValue }`,
                    cvv: `${ cvvBoxValue }`
                };

                sendPurchaseDataToServer(pbookPurchaseData, "pbookBuyerData");
            })
            .catch(error => {
                console.error('Сталася помилка при оновленні кількості куплених книг:', error);
            });

            payment.innerHTML = '';
        }
    });
}

function phoneType() {
    const phoneInput = doc.querySelector('.phone-number');

    phoneInput.addEventListener('input', function(event) {
        let input = event.target.value.replace(/[^0-9]/g, '');
        
        let formattedInput = '';

        if (input.length > 0) {
            formattedInput += `+${ input.slice(0, 2) }`;
        }

        if (input.length > 2) {
            formattedInput += ` (${ input.slice(2, 5) }`;
        }

        if (input.length > 5) {
            formattedInput += `) ${ input.slice(5, 8) }`;
        }

        if (input.length > 8) {
            formattedInput += `-${ input.slice(8, 10) }`;
        }

        if (input.length > 10) {
            formattedInput += `-${ input.slice(10, 12) }`;
        }
    
        event.target.value = formattedInput;
    });
}

function cardType() {
    const cardForm = doc.querySelector('.card-type');

    cardForm.addEventListener('input', function(event) {
        let inputT = event.target.value.replace(/[^0-9]/g, '');

        let formattedInput = '';

        if(inputT.length > 0) {
            formattedInput += `${ inputT.slice(0, 4) } `;
        }

        if(inputT.length > 4) {
            formattedInput += `${ inputT.slice(4, 8) } `;
        }

        if(inputT.length > 8) {
            formattedInput += `${ inputT.slice(8, 12) } `;
        }

        if(inputT.length > 12) {
            formattedInput += `${ inputT.slice(12, 16)}`;
        }

        event.target.value = formattedInput;
    });
}

function termType() {
    let term = doc.querySelector('.term-type');

    term.addEventListener('input', function(event) {
        let inputTerm = event.target.value.replace(/[^0-9]/g, '');

        let formattedInput = '';
        if (inputTerm.length > 0) {
            let month = inputTerm.slice(0, 2);
            if (parseInt(month, 10) <= 12) {
                formattedInput += month;
            }
        }

        if (inputTerm.length > 2) {
            formattedInput += '/';
        }

        if(inputTerm.length > 2) {
            formattedInput += `${ inputTerm.slice(2, 4) }`;
        }

        event.target.value = formattedInput;
    });
}

function cvvType() {
    let cvv = doc.querySelector('.cvv-type');

    cvv.addEventListener('input', function(event) {
        let inputCVV = event.target.value.replace(/[^0-9]/g, '');

        let formattedInput = '';

        if(inputCVV.length > 0) {
            formattedInput += `${ inputCVV.slice(0, 3) }`;
        }
        
        event.target.value = formattedInput;
    })
}

function costEbook() {
    return fetch(baseUrl + resources.priceEbook)
            .then((response) => response.json())
            .then((price) => {
                return price[0].priceE;
            })
            .catch(error => console.error('Помилка при отриманні коментарів:', error));
}

function costPbook() {
    return fetch(baseUrl + resources.pricePrintedBook)
            .then((response) => response.json())
            .then((price) => {
                return price[0].priceP;
            })
            .catch(error => console.error('Помилка при отриманні коментарів:', error));
}

function commissionCost() {
    return fetch(baseUrl + resources.commissionBuy)
            .then((response) => response.json())
            .then((comm) => {
                return comm[0].commission;
            })
            .catch(error => console.error('Помилка при отриманні коментарів:', error));
}

function commission() {
    fetch(baseUrl + resources.commissionBuy)
        .then((response) => response.json())
        .then((comm) => {
            const commissionEbookBuy = doc.querySelector('.commission-ebook-buy');
            commissionEbookBuy.innerText = `${ comm[0].commission } грн.`;
        })
        .catch(error => console.error('Помилка при отриманні коментарів:', error));
}

function auditName(str) {
    const regexp = /^[А-ЯІЇа-яіїA-Za-z\-]+$/gi;
    const res = str.match(regexp);

    return res;
}

function auditEmail(str) {
    const regexp = /^[\wа-яА-Яії]+\.?[\wа-яА-Яії]+@[\wа-яА-Яії]+\.[a-zA-Z]{2,}$/gi;
    const res = str.match(regexp);

    return res;
}

function auditPhone(str) {
    const regexp = /\+\d{2}\s\(\d{3}\)\s\d{3}\-\d{2}\-\d{2}/mgi;
    const res = str.match(regexp);

    return res;
}

function auditAddress(str) {
    const regexp = /^[А-ЯІЇа-яіїA-Za-z\-.\s]+$/gi;
    const res = str.match(regexp);

    return res;
}

function auditPost(str) {
    const regexp = /^\d+$/g;
    const res = str.match(regexp);

    return res;
}

function auditQuantity(str) {
    const regexp = /^[1-9][0-9]*$/g;
    const res = str.match(regexp);

    return res;
}

function auditCard(str) {
    const regexp = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/g;
    const res = str.match(regexp);

    return res;
}

function auditTerm(str) {
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear() % 100;
    const currentYearAudit = currentYear + 20;
    let currentMonth = currentDate.getMonth() + 1; 
    
    let newStr = str.split('/');
    let inputMonth = newStr[0];
    const inputYear = Number(newStr[1]);

    inputMonth = inputMonth < 10 ? inputMonth.slice(1) : inputMonth;
    inputMonth = Number(inputMonth);

    if (inputYear > currentYear && inputYear < currentYearAudit || (inputYear === currentYear && inputMonth >= currentMonth)) {
        return true;
    } else {
        return false;
    }
}

function auditCvv(str) {
    const regexp = /^\d{3}$/g;
    const res = str.match(regexp);

    return res;
}

function getQuantitySoldEbook() {
    fetch(baseUrl + resources.boughtEbooks + "/0792")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(bookData => {
            const ebookQuantitySold = doc.querySelector('.ebook-quantity-sold');
            ebookQuantitySold.innerText = bookData.quantityE;
            animateCounterEbook(bookData.quantityE, 2000);
        })
        .catch(error => {
            console.error('Сталася помилка при отриманні кількості куплених книг:', error);
        });
}

function getQuantitySoldPbook() {
    fetch(baseUrl + resources.boughtPrintedBooks + "/4699")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(bookData => {
            const pbookQuantitySold = doc.querySelector('.pbook-quantity-sold');
            pbookQuantitySold.innerText = bookData.quantityP;
            animateCounterPbook(bookData.quantityP, 2000);
        })
        .catch(error => {
            console.error('Сталася помилка при отриманні кількості куплених книг:', error);
        });
}

function animateCounterEbook(targetValue, duration) {
    const counter = document.querySelector('.ebook-quantity-sold');
    const interval = 50;
    const steps = duration / interval;
    const increment = targetValue / steps;
    let currentValue = 0;

    const timer = setInterval(() => {
        currentValue += increment;
        counter.innerText = Math.ceil(currentValue);

        if (currentValue >= targetValue) {
        counter.innerText = targetValue;
        clearInterval(timer);
        }
    }, interval);
}

function animateCounterPbook(targetValue, duration) {
    const counter = document.querySelector('.pbook-quantity-sold');
    const interval = 50;
    const steps = duration / interval;
    const increment = targetValue / steps;
    let currentValue = 0;

    const timer = setInterval(() => {
        currentValue += increment;
        counter.innerText = Math.ceil(currentValue);

        if (currentValue >= targetValue) {
        counter.innerText = targetValue;
        clearInterval(timer);
        }
    }, interval);
}

function sendPurchaseDataToServer(purchaseData, resourceName) {
    fetch(baseUrl + resources[resourceName], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Дані успішно відправлено на сервер:', data);
    })
    .catch(error => {
        console.error('Сталася помилка при відправленні даних на сервер:', error);
    });
} 











// emailBox.value = '';
// cardBox.value = '';
// termBox.value = '';
// cvvBox.value = '';





 // if (allFieldsValid) {
        //     (async () => {
        //         try {
        //             const response = await fetch(baseUrl + resources.boughtPrintedBooks + "/4699");
        //             if (!response.ok) {
        //                 throw new Error('Network response was not ok');
        //             }
        //             const bookData = await response.json();
        //             const currentQuantity = bookData.quantityP;
        //             const updatedQuantity = currentQuantity + Number(quantityBoxValue);
        
        //             const updateResponse = await fetch(baseUrl + resources.boughtPrintedBooks + "/4699", {
        //                 method: 'PUT',
        //                 headers: {
        //                     'Content-Type': 'application/json'
        //                 },
        //                 body: JSON.stringify({ quantityP: updatedQuantity })
        //             });
        //             if (!updateResponse.ok) {
        //                 throw new Error('Network response was not ok');
        //             }
        //             const updatedData = await updateResponse.json();
        //             console.log('Кількість куплених книг оновлена успішно:', updatedData);
        //             setTimeout(() => {
        //                 getQuantitySoldEbook();
        //                 getQuantitySoldPbook();
        //             }, 1000);
        //             payment.innerHTML = ''; // Поміщаємо в середину блоку try
        //         } catch (error) {
        //             console.error('Сталася помилка при оновленні кількості куплених книг:', error);
        //             // Обробка помилки
        //         }
        //     })();
        // }