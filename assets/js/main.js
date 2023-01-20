const books = [];
const RENDER_BOOK = 'render-book';
const SAVED_BOOK = 'saved-book';
const DELETED_BOOK = 'deleted-book';
const UPDATED_BOOK = 'updated-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage!');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_BOOK));
    }
}

function deleteData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(DELETED_BOOK));
    }
}

function updateData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(UPDATED_BOOK));
    }
}

function loadData() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_BOOK));
}

function addBook() {
    const bookID = bookId();
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const bookObject = generateBookObject(bookID, bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_BOOK));
    saveData();
}

function bookId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: parseInt(year),
        isComplete,
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
}

function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_BOOK));
    updateData();
}

function removeBook(bookId) {
    const isDelete = window.confirm("Apakah anda yakin ingin menghapus buku ini?")
    if (isDelete) {
        const bookTarget = findBookIndex((bookId));

        if (bookTarget === -1) return;

        books.splice(bookTarget, 1);
        alert("Buku berhasil dihapus");
        deleteData();
    } else {
        alert('Buku batal dihapus');
    }
    document.dispatchEvent(new Event(RENDER_BOOK));
}


function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_BOOK));
    updateData();
}

function searchBook() {
    const searchBook = document.getElementById("searchBookTitle");
    const filter = searchBook.value.toLowerCase();
    const bookItem = document.querySelectorAll("section.book_shelf > .book_list > .book_item");
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}

function checkButton() {
    const span = document.querySelector("span");
    if (inputBookIsComplete.checked) {
        span.innerText = "Selesai dibaca";
    } else {
        span.innerText = "Belum selesai dibaca";
    }
}

function makeBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = bookObject.year;

    const bookAction = document.createElement('div');
    bookAction.classList.add('action');

    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.innerHTML = "Belum selesai dibaca"
        undoButton.classList.add('green');

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id)
        });

        const trashButton = document.createElement('button');
        trashButton.innerHTML = "Hapus Buku"
        trashButton.classList.add('red');

        trashButton.addEventListener('click', function () {
            removeBook(bookObject.id);
        });

        bookAction.append(undoButton, trashButton);
    } else {
        const finishButton = document.createElement('button');
        finishButton.innerHTML = "Selesai dibaca"
        finishButton.classList.add('green');

        finishButton.addEventListener('click', function() {
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerHTML = "Hapus Buku"
        trashButton.classList.add('red');

        trashButton.addEventListener('click', function () {
            removeBook(bookObject.id);
        });

        bookAction.append(finishButton, trashButton);
    }

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(bookTitle, bookAuthor, bookYear, bookAction);

    return container;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitBook = document.getElementById('inputBook');
    const inputSearchBook = document.getElementById("searchBook");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");

    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadData();
    }

    inputSearchBook.addEventListener("keyup", function (event) {
        event.preventDefault();
        searchBook();
    });
    
    inputSearchBook.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    inputBookIsComplete.addEventListener("input", function (event) {
        event.preventDefault();
        checkButton();
    });
});

document.addEventListener(SAVED_BOOK, function() {
    console.log("Buku berhasil ditambahkan");
})

document.addEventListener(DELETED_BOOK, function() {
    console.log("Buku berhasil dihapus");
})

document.addEventListener(UPDATED_BOOK, function() {
    console.log("Informasi buku berhasil diperbarui");
})

document.addEventListener(RENDER_BOOK, function () {
    const incompleteBookList = document.getElementById('incompleteBookShelfList');
    incompleteBookList.innerHTML = '';

    const completeBookList = document.getElementById('completeBookShelfList');
    completeBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (bookItem.isComplete == false) {
            incompleteBookList.append(bookElement);
        } else {
            completeBookList.append(bookElement);
        }
    }
});