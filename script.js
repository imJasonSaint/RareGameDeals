

const URL = 'https://www.cheapshark.com/api/1.0/deals?storeID=1'

// Fetch API Info
async function fetchDeals() {
    try {
        const response = await fetch(URL)
        const deals = await response.json()
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

        // Create Wrapper Deal Link
        const dealLink = document.createElement('a')
        dealLink.classList.add('deal')
        const dealID = deal['dealID']
        dealLink.setAttribute('href', `https://www.cheapshark.com/redirect?dealID=${dealID}`)
        dealLink.setAttribute('target', '_blank')

        // Game Steam Header Image
        const headerImg = document.createElement('img')
        const steamID = deal['steamAppID']
        headerImg.setAttribute('src', `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamID}/header.jpg`)
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
        rating.textContent = 'Legendary Deal'
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

async function renderDeals() {
    const deals = await fetchDeals()

    generateDeals(deals)
}

renderDeals()