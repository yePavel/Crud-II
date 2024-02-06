'use strict'

const gQueryOptions = {
    filterBy: { txt: '', minRate: '' },
    sortBy: {}
}

function onInit() {
    render()
}

function render() {
    const elBooksTable = document.querySelector('table > tbody')
    const books = getBooks(gQueryOptions)
    const emptyTable = `<tr><td colspan="4">No matching books were found</td></tr>`
    const strHtmls = books.map(book =>
        `<tr>
            <td>${book.title}</td>
            <td>${book.rate}</td>
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
    if (!price) return

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

    pre.innerHTML = JSON.stringify(book, null, 4)
    elTitle.innerText = book.title

    elImg.src = `pic/${book.title}.jpg`

    elModal.showModal()
}

function onBookFilter() {
    const input = document.querySelector('fieldset input')
    const elSortByRate = document.querySelector('.rating')

    gQueryOptions.filterBy.txt = input.value
    gQueryOptions.filterBy.minRate = elSortByRate.value

    render()
}

function onSetSortBy() {
    const elSortBy = document.querySelector('.sort')
    const elDesc = document.querySelector('.sort-desc')
    const elAsce = document.querySelector('.sort-asce')
    const sortByCategory = elSortBy.value
    var dir = 1

    if (elDesc.checked) dir = -1
    else if (elAsce.checked) dir = 1

    gQueryOptions.sortBy = { [sortByCategory]: dir }

    render()
}

// function onClearFilter() {
//     const elSearch = document.querySelector('.search-by > input')
//     const elSortByRate = document.querySelector('.search-by >.rating')
//     console.log('elSearch:', elSearch)
//     console.log('elSortByRate:', elSortByRate)

//     gQueryOptions.filterBy.txt = elSearch.innerText = ''
//     gQueryOptions.filterBy.minRate = elSortByRate.innerText = ''

//     render()
// }

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
    const stats = getStats()

    elTotal.innerText = stats.total
    elExpens.innerText = stats.expensive
    elCheap.innerText = stats.cheap
    elAvg.innerText = stats.avg
}

