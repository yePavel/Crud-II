'use strict'

const gTrans = {
    title: {
        en: 'Books Shop📖',
        he: 'חנות ספרים📖'
    },
    'filter-sort': {
        en: 'Filter & Sorting',
        he: 'מיון & סינון'
    },
    'search-placeholder': {
        en: 'Search..',
        he: 'חיפוש'
    },
    'filter-rate': {
        en: 'Select book rate',
        he: 'בחר דירוג'
    },
    'clear-search': {
        en: 'Clear',
        he: 'נקה חיפוש'
    },
    'sort-filter-by': {
        en: 'Select sort filter',
        he: 'בחר סינון'
    },
    'desc-sort': {
        en: 'Descending',
        he: 'סדר יורד'
    },
    'asce-sort': {
        en: 'Ascending',
        he: 'סדר עולה'
    },
    'add-book': {
        en: 'Add book',
        he: 'הוספת ספר'
    },
    'book-title': {
        en: 'Title',
        he: 'שם הספר'
    },
    'book-rate': {
        en: 'Rating',
        he: 'דירוג'
    },
    'book-price': {
        en: 'Price',
        he: 'מחיר'
    },
    'book-actions': {
        en: 'Actions',
        he: 'פעולות'
    },
    'book-details': {
        en: 'Details',
        he: 'מידע'
    },
    'book-update': {
        en: 'Update',
        he: 'עדכון'
    },
    'book-delete': {
        en: 'Delete',
        he: 'מחיקה'
    },
    'footer-total': {
        en: 'Total Books:',
        he: 'סה"כ ספרים:'
    },
    'footer-expen': {
        en: 'Expensive books:',
        he: 'ספרים יקרים:'
    },
    'footer-cheap': {
        en: 'Cheap books:',
        he: 'ספרים זולים:'
    },
    'footer-avg': {
        en: 'Average:',
        he: 'ספרים בטווח מחירים ממוצע:'
    }
}

var gCurrLang = 'en'

function getTrans(transKey) {
    // console.log('transKey:', transKey) // 'sure'
    // get from gTrans
    const transMap = gTrans[transKey] // {'en':,'es:','he':}
    // if key is unknown return 'UNKNOWN'
    if (!transMap) return 'UNKNOWN'
    let transTxt = transMap[gCurrLang]
    // If translation not found - use english
    if (!transTxt) transTxt = transMap.en
    return transTxt
}

function doTrans() {
    // get the data-trans and use getTrans to replace the innerText
    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const transTxt = getTrans(transKey)
        // support placeholder 
        if (el.placeholder) el.placeholder = transTxt
        else el.innerText = transTxt
    })
}

function setLang(lang) {
    gCurrLang = lang
}