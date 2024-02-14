const bookCommentsBlock = doc.querySelector('.book-comments-block');

getComments();

function getComments() {
    fetch(baseUrl + resources.comments)
        .then((response) => response.json())
        .then((comments) => renderComments(comments));

    return;
}

function renderComments(info) {

    info.forEach(function(item) {
        
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