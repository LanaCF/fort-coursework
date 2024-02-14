const readBookBlock = doc.querySelector('.read-book-block');

getChaptersInfo();

function getChaptersInfo() {
    fetch(baseUrl + resources.chapters)
        .then((response) => response.json())
        .then((chapters) => renderChaptersList(chapters));

    return;
}

function renderChaptersList(info) {
    for (let item of info) {
        const { id, title } = item;

        const readBookChapter = doc.createElement('p');

        readBookChapter.className = 'read-book__text';
        readBookChapter.dataset.postId = id;
        readBookChapter.innerText = title;
        
        readBookBlock.append(readBookChapter);

        readBookChapter.onclick = (event) => {
            event.preventDefault();

            const postId = event.target.dataset.postId;

            console.log(postId)

            if (postId) {

                const selectedPost = info.find(post => post.id === postId);

                if (selectedPost) {
                    renderChapterBlock(selectedPost);
                }
            }
        };

    }
}

function renderChapterBlock(postChapter) {
    infoWindow = new ChapterModal({ w: 75, h: 585 }, { top: 10, left: 10 }, postChapter.id, postChapter.title, postChapter.text);
    infoWindow.create();
    console.log('test3', postChapter.id);
}