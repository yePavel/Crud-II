'use strict'

var gFilterBy = ''

function onInit() {
    render()
}

function render() {
    const elBooksTable = document.querySelector('table > tbody')
    const books = getBooks(gFilterBy)
    const emptyTable = `<tr><td>No matching books were found</td></tr>`
    const strHtmls = books.map(book =>
        `<tr>
            <td>${book.title}</td>
            <td class="price">${book.price}</td>
            <td class="btn-container">
                <button onclick="onBookDetails('${book.id}')">Details <img class="logo" src="/pic/info.png"></button>
                <button onclick="onUpdateBook('${book.id}')">Update <img class="logo" src="/pic/price.png"></button>
                <button onclick="onRemoveBook('${book.id}')">Delete <img class="logo" src="/pic/trash.png"></button>
            </td>
        </tr>`
    )
    if (books.length === 0) elBooksTable.innerHTML = emptyTable
    else elBooksTable.innerHTML = strHtmls.join('')
    renderStats()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    userMsg('The book has been removed', 'remove')
    render()
}

function onUpdateBook(bookId) {
    const price = +prompt('Enter your new book price: ')
    if(!price) return
    
    updatePrice(bookId, price)
    userMsg('The book has been updated', 'add')
    render()
}

function onAddBook() {
    const bookName = prompt('Enter your book name: ')
    const newBookPrice = +prompt('Enter your book price: ')

    if (typeof bookName === 'string' && bookName.length > 0 && !isNaN(newBookPrice) && newBookPrice >= 0) {
        addBook(bookName, newBookPrice)
        render()
        userMsg('The book has been successfully added', 'add')
    }
    else {
        alert('Error! Book name or price incorrect')
    }
}

function onBookDetails(bookId) {
    const book = getBookById(bookId)

    const elModal = document.querySelector('.book-details')
    const pre = elModal.querySelector('pre')
    const elImg = elModal.querySelector('div img')
    const elTitle = elModal.querySelector('h2 span')

    pre.innerHTML = JSON.stringify(book, null, 3)
    elTitle.innerText = book.title
    // const bookStr = `Book name: ${book.title} 
    // Price: ${book.price} 
    // Book summary: Quo vel architecto 
    // totam repudiandae perferendis!`

    elImg.src = `pic/${book.title}.jpg`
    // pre.innerHTML = bookStr
    elModal.showModal()
}

function onBookFilter() {
    const input = document.querySelector('input')
    gFilterBy = input.value

    render()
}

function onClearFilter() {
    const elSearch = document.querySelector('.menu input')
    elSearch.value = gFilterBy = ''
    
    render()
}

function userMsg(msg, mode) {
    const elMsg = document.querySelector('.alert-msg')
    
    elMsg.innerText = msg
    elMsg.classList.remove('hidden')

    if (mode === 'add') {
        elMsg.classList.remove('warning-msg')
        elMsg.classList.add('success-msg')
    } else if (mode === 'remove') {
        elMsg.classList.remove('success-msg')
        elMsg.classList.add('warning-msg')
    }
    setTimeout(() => elMsg.classList.add('hidden'), 2000)
}

function renderStats() {
    const elTotal = document.querySelector('.total-books')
    const elExpens = document.querySelector('.expensive-books')
    const elCheap = document.querySelector('.cheap-books')
    const elAvg = document.querySelector('.avg-books')

    elTotal.innerHTML = getTotalBooks()
    elExpens.innerHTML = getExpensBooks()
    elCheap.innerHTML = getCheapBooks()
    elAvg.innerHTML = getAvgBooks()

}