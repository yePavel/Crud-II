'use strict'

var gBooks
const STORAGE_KEY = 'booksDB'
_createBooks()

function getBooks(options = {}) {
    if (!options.filterBy) return gBooks
    var books = _searchBooks(options.filterBy)

    if (options.sortBy.title) {
        books.sort((book1, book2) => book1.title.localeCompare(book2.title) * options.sortBy.title)
    }
    else if (options.sortBy.price) {
        console.log('options.sortBy.price:', options.sortBy.price)
        books.sort((book1, book2) => (book1.price - book2.price) * options.sortBy.price)
    }
    else if (options.sortBy.rating) {
        books.sort((book1, book2) => (book1.rate - book2.rate) * options.sortBy.rating)
    }

    if (options.page) {
        const startIdx = options.page.idx * options.page.size
        books = books.splice(startIdx, startIdx + options.page.size)
    }

    return books
}


function removeBook(bookId) {
    const idx = gBooks.findIndex(books => books.id === bookId)
    gBooks.splice(idx, 1)

    _saveBooks()
}

function updatePrice(bookId, price) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = price

    _saveBooks()
}

function addBook(name, price) {
    gBooks.unshift(_createBook(name, price))

    _saveBooks()
}

function getBookById(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    return book
}

function getStats() {
    const stats = gBooks.reduce((acc, book) => {
        acc.total++
        if (book.price >= 200) acc.expensive++
        if (book.price <= 80) acc.cheap++
        if (book.price > 80 && book.price < 200) acc.avg++

        return acc
    }, { cheap: 0, avg: 0, expensive: 0, total: 0 })

    return stats
}

// private func ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
    if (!gBooks || gBooks.length === 0) {
        gBooks = [
            _createBook('The adventures of Lori Ipsi', 120, 'lori-ipsi.jpg'),
            _createBook('World Atlas', 300, 'world-atlas.jpg'),
            _createBook('Zorba The Greek', 87, 'Zorba.jpg')
        ]
        _saveBooks()
    }
}

function _createBook(title, price = 99, imgUrl = 'emptyBook.jpg') {
    const rate = getRandomInt(1, 5)
    console.log('rate:', rate)
    return {
        id: makeId(),
        title,
        price,
        imgUrl,
        rate,
    }
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function _searchBooks(filterBy) {
    const filterdBooks = gBooks.filter(book => book.title.toLowerCase().includes(filterBy.txt.toLowerCase()) &&
        book.rate >= filterBy.minRate)

    return filterdBooks
}

function _getBooksCount(filterBy) {
    return _searchBooks(filterBy).length
}

