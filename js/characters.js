const bookCharactersBlock = doc.querySelector('.book-characters__block');

getCharactersInfo();

function getCharactersInfo() {
    fetch(baseUrl + resources.characters)
        .then((response) => response.json())
        .then((characters) => renderCharactersList(characters));

    return;
}

function renderCharactersList(info) {
    for (let item of info) {
        const { id, img } = item;

        const bookCharactersBox = doc.createElement('div');
        const bookCharactersImg = doc.createElement('img');

        bookCharactersBox.className = 'book-characters__box';
        bookCharactersBox.dataset.postId = id;

        bookCharactersImg.className = 'book-characters__img';
        bookCharactersImg.src = img;

        bookCharactersBlock.append(bookCharactersBox);
        bookCharactersBox.append(bookCharactersImg);

        bookCharactersBox.onclick = (event) => {
            event.preventDefault();

            const postId = event.currentTarget.dataset.postId;

            console.log(postId)

            if (postId) {

                const selectedPost = info.find(post => post.id === postId);

                if (selectedPost) {
                    renderInfoBlock(selectedPost);
                }
            }
        };

    }
}

function renderInfoBlock(postInfo) {
    infoWindow = new ModalWindow({ w: 80, h: 500 }, { top: 10, left: 10 }, postInfo.id, postInfo.img, postInfo.name, postInfo.birthday, postInfo.nationality, postInfo.profession, postInfo.info);
    infoWindow.create();
    console.log('test2', postInfo.id);
}










