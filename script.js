// Fetch API Info
async function fetchDeals(URL) {
    try {
        const response = await fetch(URL)
        const deals = await response.json()
        // console.log('Total Pages: ', response.headers.get('X-Total-Page-Count'))
        return deals
    } catch (error) {
        console.log('An Error has occured')
        console.log(error)
    }
}

// Deal HTML Reference
/* 
<a class="deal" href="#">
    <img src="./Images/placeholder/header.jpg" alt="">

    <div class="game-stats">
        <div class="game-info">
            <h2 class="game-title">Call of Duty: Black Ops III</h2>
            <p> <span class="rating">Legendary Deal</span> • <span class="review">Postive</span> </p>
        </div>

        <div class="game-price">
            <p> <span class="original-price">$59.99</span> <span class="deal-price">$20.99</span> </p>
        </div>
    </div>
</a> 
*/

// Takes a list of deals and renders it into the HTML
function generateDeals(deals) {

    const dealContainer = document.querySelector('.deals .container')

    deals.forEach(deal => {

        // Determine Deal Rating (Legendary, Rare, or Common)
        let ratingVar = null

        if (deal['metacriticScore'] >= 75 && (deal['savings'] >= 70 || deal['salePrice'] < 10)) {
            ratingVar = 'Legendary'
        } else if (deal['metacriticScore'] >= 50 && (deal['savings'] >= 90 || deal['salePrice'] < 5)) {
            ratingVar = 'Rare'
        } else {
            ratingVar = 'Common'
        }

        // Create Wrapper Deal Link
        const dealLink = document.createElement('a')
        dealLink.classList.add('deal')
        const dealID = deal['dealID']
        dealLink.setAttribute('href', `https://www.cheapshark.com/redirect?dealID=${dealID}`)
        dealLink.setAttribute('target', '_blank')

        // Game Steam Header Image
        const headerImg = document.createElement('img')

        if (deal['steamAppID'] === null) {
            headerImg.setAttribute('src', './Images/placeholder/missing.jpg')
        } else {
            const steamID = deal['steamAppID']
            headerImg.setAttribute('src', `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamID}/header.jpg`)
        }
        dealLink.append(headerImg)

        // Div for Game Title, Rating, Review, & Price
        const gameStats = document.createElement('div')
        gameStats.classList.add('game-stats')

        // Holds Game Title, Rating, & Review
        const gameInfo = document.createElement('div')
        gameInfo.classList.add('game-info')

        // Game Title 
        const gameTitle = document.createElement('h2')
        gameTitle.textContent = deal['title']
        gameTitle.classList.add('game-title')
        gameInfo.append(gameTitle)

        // Game Rating & Review
        const ratingReview = document.createElement('p')

        const rating = document.createElement('span')
        rating.textContent = ratingVar
        if (ratingVar === 'Legendary') {
            dealLink.classList.add('legendary')
        } else if (ratingVar === 'Rare') {
            dealLink.classList.add('rare')
        } else {
            dealLink.classList.add('common')
        }

        rating.classList.add('rating')

        const separator = document.createElement('span')
        separator.textContent = '•'
        separator.classList.add('separator')

        const review = document.createElement('span')
        if (deal['steamRatingText'] === null) {
            review.textContent = 'None'
        } else {
            review.textContent = deal['steamRatingText']
        }
        review.classList.add('review')
        ratingReview.append(rating, separator, review)
        gameInfo.append(ratingReview)

        // Game Deal Price and the Original Price
        const gamePrice = document.createElement('div')
        gamePrice.classList.add('game-price')

        const gamePriceP = document.createElement('p')

        const originalPrice = document.createElement('span')
        originalPrice.textContent = "$" + deal['normalPrice']
        originalPrice.classList.add('original-price')

        const dealPrice = document.createElement('span')
        dealPrice.textContent = "$" + deal['salePrice']
        dealPrice.classList.add('deal-price')

        gamePriceP.append(originalPrice, dealPrice)
        gamePrice.append(gamePriceP)

        // Append Info Divs to Deal
        gameStats.append(gameInfo, gamePrice)
        dealLink.append(gameStats)

        // Append Deal to Deal Container
        dealContainer.append(dealLink)

    })

}

function removeDeals() {
    const dealContainer = document.getElementById('dealContainer')
    dealContainer.replaceChildren()
}

function filterDeals(deals) {

    if (isFilterOn === false) {
        console.log('test')
        return deals
    } else {
        return deals.filter(deal => {
            let ratingVar

            if (deal['metacriticScore'] >= 75 && (deal['savings'] >= 70 || deal['salePrice'] < 10)) {
                ratingVar = 'Legendary'
            } else if (deal['metacriticScore'] >= 50 && (deal['savings'] >= 90 || deal['salePrice'] < 5)) {
                ratingVar = 'Rare'
            } else {
                ratingVar = 'Common'
            }

            return ratingVar === filterOption
        })
    }

}

const URL = 'https://www.cheapshark.com/api/1.0/deals?storeID=1'
var scrolls = 1
const searchInput = document.querySelector('[data-search]')

// Filter/Sort Param variables
let userInput = null
let filterOption = null
let isFilterOn = false
let sortOption = null

let filters = {
    'Default': '',
    'Legendary': '',
    'Rare': '',
    'Common': '',
    'Under $5': '&upperPrice=5',
    'Under $10': '&upperPrice=10'
}

async function renderDeals(URL) {
    const deals = await fetchDeals(URL)
    const filteredDeals = filterDeals(deals)
    generateDeals(filteredDeals)
}


function addDeals() {

    let params = ''

    // Search Bar
    if (userInput !== null) {
        // renderDeals(URL + '&title=' + userInput + '&pageNumber=' + scrolls)
        params = params + '&title=' + userInput
    }

    // Filter Options
    if (filterOption !== null) {
        params = params + filters[filterOption]
    }

    renderDeals(URL + params + '&pageNumber=' + scrolls)
    scrolls += 1
}

// Infinte Scroll Listener
window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight && scrolls <= 50) {
        console.log('bottom reached') //BUG FOUND - Not registering when bottom is reached on laptops
        addDeals()
    }
})

//Search Bar Event Listener
searchInput.addEventListener('input', e => {
    const deals = document.querySelectorAll('.deal')

    deals.forEach(deal => {
        deal.classList.add('hidden')
    })

    userInput = e.target.value.toLowerCase()
    renderDeals(URL + '&title=' + userInput)
})

// Drop Down Options Event Listener
document.addEventListener('click', e => {
    const isDropdownButton = e.target.matches('[data-dropdown-button]')

    if (!isDropdownButton && e.target.closest('[data-dropdown') != null) return //clicks that are not the button AND are within the dropdown are ignored

    //get the closest data dropdown (parent) and set its class to active
    let currentDropdown
    if (isDropdownButton) {
        currentDropdown = e.target.closest('[data-dropdown]')
        currentDropdown.classList.toggle('active')
    }

    // Closes all dropdowns when either another dropdown is opened or when the user clicks off
    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        if (dropdown === currentDropdown) return
        dropdown.classList.remove('active')
    })
})

// Filter Options Event Listener
document.addEventListener('click', e => {
    if (e.target.matches('.filter-option')) {
        filterOption = e.target.textContent

        if (filterOption === 'Common' || filterOption === 'Rare' || filterOption === 'Legendary') {
            isFilterOn = true
        }

        removeDeals()
        renderDeals(URL + filters[filterOption])
    }
})

renderDeals(URL)
