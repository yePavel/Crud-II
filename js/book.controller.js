'use strict'

const gQueryOptions = {
    filterBy: { txt: '', minRate: '' },
    sortBy: {},
    page: { idx: 0, size: 5 }
}

var gChosenBookId = ''
var gBookToEdit = false

function onInit() {
    readQueryParams()
    render()
    doTrans()
}

function render() {
    const elBooksTable = document.querySelector('table > tbody')
    const books = getBooks(gQueryOptions)
    const emptyTable = `<tr><td colspan="4">No matching books were found</td></tr>`
    const strHtmls = books.map(book =>
        `<tr>
            <td>${book.title}</td>
            <td>${book.rate.stars}</td>
            <td class="price">${book.price}</td>
            <td class="btn-container">
                <button data-trans="book-details" onclick="onBookDetails('${book.id}')">Details <img class="logo" src="/pic/info.png"></button>
                <button data-trans="book-update" onclick="onUpdateBook('${book.id}')">Update <img class="logo" src="/pic/price.png"></button>
                <button data-trans="book-delete" onclick="onRemoveBook('${book.id}')">Delete <img class="logo" src="/pic/trash.png"></button>
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

function onSaveBook() {
    const elForm = document.querySelector('.book-edit form')
    const elBook = elForm.querySelector('.new-name')
    const elPrice = elForm.querySelector('.new-price')

    var bookName = elBook.value
    var bookPrice = elPrice.value

    if (gBookToEdit) {
        var book = updatePrice(gBookToEdit.id, bookName, bookPrice)
        gBookToEdit = null
    }
    else {
        var book = addBook(bookName, bookPrice)
    }
    elForm.reset()
    render()
}

function onUpdateBook(bookId) {
    gBookToEdit = getBookById(bookId)
    const elModal = document.querySelector('.book-edit')
    elModal.querySelector('h2').innerText = 'Update Book'

    elModal.querySelector('.new-name').value = gBookToEdit.title
    elModal.querySelector('.new-price').value = gBookToEdit.price

    elModal.showModal()
}

function onAddBook() {
    const elModal = document.querySelector('.book-edit')
    elModal.querySelector('h2').innerText = 'Add Book'
    elModal.querySelector('.book-edit-btn').innerHTML = `<button onclick="onUpdateBook()">Edit Book</button>`
    elModal.showModal()
}

function onBookDetails(bookId) {
    const book = getBookById(bookId)
    console.log('book:', book)
    const elModal = document.querySelector('.book-details')
    const pre = elModal.querySelector('pre')
    const elImg = elModal.querySelector('div img')
    const elTitle = elModal.querySelector('h2 span')

    pre.innerHTML = `    Book Price: ${book.price} 
    Book Rating: ${book.rate.stars}
    Description: ${book.description}`

    elTitle.innerText = book.title
    elImg.src = `pic/${book.title}.jpg`

    elModal.showModal()
    gChosenBookId = bookId
    setQueryParams()
}


function onBookFilter() {
    const input = document.querySelector('fieldset input')
    const elSortByRate = document.querySelector('.rating')

    gQueryOptions.filterBy.txt = input.value
    gQueryOptions.filterBy.minRate = elSortByRate.value

    setQueryParams()
    render()
}

function onSetSortBy() {
    const elSortBy = document.querySelector('.sort')
    const elDir = document.querySelector(`[name="sort_dir"]:checked`)
    const sortByCategory = elSortBy.value

    gQueryOptions.sortBy = { [sortByCategory]: elDir.value }
    gQueryOptions.page.idx = 0

    setQueryParams()
    render()
}

function onClearFilter() {
    document.querySelector('.search-by input').value = ''
    document.querySelector('.search-by .rating').value = ''

    gQueryOptions.filterBy.txt = ''
    gQueryOptions.filterBy.minRate = ""

    render()
}

function onCloseModal() {
    document.querySelector('.book-edit').close()
    document.querySelector('.book-details').close()

    gChosenBookId = 0
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
    const stats = getStats()

    elTotal.innerText = stats.total
    elExpens.innerText = stats.expensive
    elCheap.innerText = stats.cheap
    elAvg.innerText = stats.avg
}

function onNextPage() {
    const bookCount = _getBooksCount(gQueryOptions.filterBy)
    if (bookCount > (gQueryOptions.page.idx + 1) * gQueryOptions.page.size)
        gQueryOptions.page.idx++
    else gQueryOptions.page.idx = 0

    setQueryParams()
    render()
}

function onPrevPage() {
    const bookCount = _getBooksCount(gQueryOptions.filterBy) / gQueryOptions.page.size
    const lastPage = Math.ceil(bookCount) - 1
    if (gQueryOptions.page.idx === 0)
        gQueryOptions.page.idx = lastPage
    else gQueryOptions.page.idx--

    setQueryParams()
    render()
}

// function addPagesBtn() {
//     const elPages = document.querySelector('.actions .pages')
//     const bookCount = _getBooksCount(gQueryOptions.filterBy) / gQueryOptions.page.size
//     const lastPage = Math.ceil(bookCount)
//     console.log('lastPage:', lastPage)
//     var i = 0
//     while (i < lastPage) {
//         elPages.innerHTML += `${i}Page`
//         i++
//     }
// }

function onSetLang(lang) {
    setLang(lang)
    // if lang is hebrew add RTL class to document.body
    if (lang === 'he') {
        document.body.classList.add('rtl')
        document.querySelector('.actions').innerHTML = `<img class="nextPage" src="/pic/nextPage.png" onclick="onNextPage()">
        <img class="prePage" src="/pic/prePage.png" onclick="onPrevPage()">`
    }
    else {
        document.body.classList.remove('rtl')
        document.querySelector('.actions').innerHTML = `<img class="prePage" src="/pic/prePage.png" onclick="onPrevPage()">
        <img class="nextPage" src="/pic/nextPage.png" onclick="onNextPage()">`
    }
    render()
    doTrans()
    setQueryParams()
}

// QueryParams

function readQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)

    gQueryOptions.filterBy = {
        txt: queryParams.get('txt') || '',
        minRate: queryParams.get('minRate') || ''
    }

    if (queryParams.get('sortBy')) {
        const prop = queryParams.get('sortBy') || ''
        const dir = +queryParams.get('sortDir')
        gQueryOptions.sortBy[prop] = dir
    }

    if (queryParams.get('pageIdx')) {
        gQueryOptions.page.idx = +queryParams.get('pageIdx')
        gQueryOptions.page.size = +queryParams.get('pageSize')
    }
    gChosenBookId = queryParams.get('bookDetails')
    gCurrLang = queryParams.get('lang')

    renderQueryParams()
}

function renderQueryParams() {
    document.querySelector('.books-filter .search').value = gQueryOptions.filterBy.txt
    document.querySelector('.books-filter select').value = gQueryOptions.filterBy.minRate

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    const sortBy = sortKeys[0] || ''
    const dir = +gQueryOptions.sortBy[sortKeys[0]]

    document.querySelector('.sortBy .sort').value = sortBy

    if (dir === 1) {
        document.querySelector('.sort-asce').checked = true
    } else document.querySelector('.sort-desc').checked = true
    if (gChosenBookId) onBookDetails(gChosenBookId)
    if (gCurrLang) {
        onSetLang(gCurrLang)
        document.querySelector('.trans select').value = gCurrLang
    }

}

function setQueryParams() {
    const queryParams = new URLSearchParams()

    queryParams.set('txt', gQueryOptions.filterBy.txt)
    queryParams.set('minRate', gQueryOptions.filterBy.minRate)

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    if (sortKeys.length) {
        queryParams.set('sortBy', sortKeys[0])
        queryParams.set('sortDir', gQueryOptions.sortBy[sortKeys[0]])
    }

    if (gQueryOptions.page) {
        queryParams.set('pageIdx', gQueryOptions.page.idx)
        queryParams.set('pageSize', gQueryOptions.page.size)
    }
    if (gChosenBookId) queryParams.set('bookDetails', gChosenBookId)
    queryParams.set('lang', gCurrLang)

    const newUrl =
        window.location.protocol + "//" +
        window.location.host +
        window.location.pathname + '?' + queryParams.toString()

    window.history.pushState({ path: newUrl }, '', newUrl)
}