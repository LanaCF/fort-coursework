const bookCommentsBlock = doc.querySelector('.book-comments-block');
const inputName = doc.querySelector('.input-name');
const commentForm = doc.querySelector('.comment');
const commentButtonSend = doc.querySelector('.comment-button-send');
const warning = doc.querySelector('.warning');

//document.querySelector('body').onload = function() {getComments()};
getComments();

function getComments() {
    fetch(baseUrl + resources.comments)
        .then((response) => response.json())
        .then((comments) => renderComments(comments))
        .catch(error => console.error('Помилка при отриманні коментарів:', error));
}

function renderComments(comment) {
    comment.forEach(function(item) {        
        const commentBox = 
        `
            <div class="book-comment-box">
                <p class="user-name text-bold">
                    ${item.name}
                </p>

                <p class="user-comment">
                    ${item.text}
                </p>
            </div>
        `;

        bookCommentsBlock.insertAdjacentHTML('afterbegin', commentBox);
    });
}

commentButtonSend.addEventListener('click', (event) => {
    event.preventDefault();

    const inputNameValue = inputName.value;
    const commentFormValue = commentForm.value;

    if (inputNameValue === '' || commentFormValue === '') {
        warning.style.display = 'initial';
        return;
    }

    const newArr = {
        "name": `${ inputNameValue }`,
        "text":  `${ commentFormValue }`
    };

    fetch(baseUrl + resources.comments, {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(newArr)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        getComments();
        inputName.value = '';
        commentForm.value = '';
        warning.style.display = 'none';
    })
    .catch(error => {
        console.error('Помилка при додаванні нового поста:', error);
    });
});

