'use strict'

const gQueryOptions = {
    filterBy: { txt: '', minRate: '' },
    sortBy: {},
    page: { idx: 0, size: 5 }
}

function onInit() {
    readQueryParams()
    render()
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

    userMsg('The book price has been updated', 'add')
    render()
}

function onShowAddBook() {
    const elModal = document.querySelector('.book-edit')
    elModal.showModal()
}

function onAddBook() {
    const elName = document.querySelector('.new-name')
    const elPrice = document.querySelector('.new-price')

    if (!elName.value || !elPrice.value) return
    addBook(elName.value, elPrice.value)

    elName.value = ''
    elPrice.value = ''

    render()
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

// QueryParams

function readQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)

    gQueryOptions.filterBy = {
        txt: queryParams.get('txt') || '',
        minRate: queryParams.get('minRate') || ''
    }

    if (queryParams.get('sortBy')) {
        const prop = queryParams.get('sortBy') || ''
        console.log('prop:', prop)
        const dir = +queryParams.get('sortDir')
        gQueryOptions.sortBy[prop] = dir
    }

    if (queryParams.get('pageIdx')) {
        gQueryOptions.page.idx = +queryParams.get('pageIdx')
        gQueryOptions.page.size = +queryParams.get('pageSize')
    }
    renderQueryParams()

}

function renderQueryParams() {
    document.querySelector('.books-filter .search').value = gQueryOptions.filterBy.txt
    document.querySelector('.books-filter select').value = gQueryOptions.filterBy.minRate

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    const sortBy = sortKeys[0]
    const dir = +gQueryOptions.sortBy[sortKeys[0]]

    document.querySelector('.sortBy .sort').value = sortBy
    document.querySelector('.sort-dir input').checked = (dir === -1) ? true : false

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

    const newUrl =
        window.location.protocol + "//" +
        window.location.host +
        window.location.pathname + '?' + queryParams.toString()

    window.history.pushState({ path: newUrl }, '', newUrl)
}