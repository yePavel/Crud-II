'use strict'

var gBooks
_createBooks()


function getBooks(filterBy) {
    if (!filterBy) return gBooks
    var filterdBooks = gBooks.filter(book => book.title.toLowerCase().includes(filterBy.toLowerCase()))
    return filterdBooks
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

// private func

function _createBooks() {
    gBooks = loadFromStorage('booksDB')
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
    return {
        id: makeId(),
        title,
        price,
        imgUrl,
    }
}

function _saveBooks() {
    saveToStorage('booksDB', gBooks)
}

function getTotalBooks() {
    return gBooks.length
}
function getExpensBooks() {
    return gBooks.filter(book => book.price >= 200).length
}
function getCheapBooks() {
    return gBooks.filter(book => book.price <= 80).length
}
function getAvgBooks() {
    return gBooks.filter(book => book.price > 80 && book.price < 200).length
}

function getStats() {
    const stats = gBooks.reduce((acc, book) => {
        acc.total++
        if(book.price >= 200) acc.expensive++
        if(book.price <= 80) acc.cheap++
        if(book.price > 80 && book.price < 200) acc.avg++

        return acc
    }, { cheap: 0, avg: 0, expensive: 0, total: 0 })

    console.log('stats: ', stats)
    return stats
}