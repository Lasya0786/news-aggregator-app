
// Sample news data
const newsData = [
    {
        id: 1,
        title: "Artificial Intelligence Transforming the Future",
        description: "Discover how AI is changing technology and everyday life.",
        category: "Technology",
        source: "Sample News"
    },
    {
        id: 2,
        title: "Global Business Markets Show New Growth",
        description: "Explore the latest developments in the business world.",
        category: "Business",
        source: "Sample News"
    },
    {
        id: 3,
        title: "India Prepares for Major Sports Events",
        description: "Athletes continue their preparation for upcoming competitions.",
        category: "Sports",
        source: "Sample News"
    },
    {
        id: 4,
        title: "Scientists Discover New Research Opportunities",
        description: "New scientific research creates opportunities for innovation.",
        category: "Science",
        source: "Sample News"
    },
    {
        id: 5,
        title: "Health Experts Encourage Better Lifestyle Habits",
        description: "Simple daily habits can support a healthier lifestyle.",
        category: "Health",
        source: "Sample News"
    },
    {
        id: 6,
        title: "Technology Skills Create Career Opportunities",
        description: "Digital skills are becoming important for students and professionals.",
        category: "Technology",
        source: "Sample News"
    },
    {
        id: 7,
        title: "Latest Political Developments Around the World",
        description: "Explore important political developments and public policies.",
        category: "Politics",
        source: "Sample News"
    }
];

const newsGrid = document.getElementById("newsGrid");
const favoritesGrid = document.getElementById("favoritesGrid");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const categoryButtons = document.querySelectorAll(".category");

let selectedCategory = "All";
let searchTerm = "";

// Get saved favourites
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("newsFavorites")) || [];
    } catch {
        return [];
    }
}

// Save favourites
function saveFavorites(favorites) {
    localStorage.setItem(
        "newsFavorites",
        JSON.stringify(favorites)
    );
}

// Create news card
function createNewsCard(article, favoriteSection = false) {
    const card = document.createElement("div");
    card.className = "news-card";

    const category = document.createElement("div");
    category.className = "news-category";
    category.textContent = article.category;

    const title = document.createElement("h3");
    title.textContent = article.title;

    const description = document.createElement("p");
    description.textContent = article.description;

    const source = document.createElement("p");
    source.textContent = "Source: " + article.source;

    const actions = document.createElement("div");
    actions.className = "news-actions";

    const readLink = document.createElement("a");
    readLink.className = "read-link";
    readLink.href = article.url || "#";
    readLink.textContent = article.url ? "Read More ↗" : "Sample News";

    if (article.url) {
        readLink.target = "_blank";
        readLink.rel = "noopener noreferrer";
    } else {
        readLink.addEventListener("click", event => {
            event.preventDefault();
            alert("This is sample news. Real news links will be available after API integration.");
        });
    }

    const favoriteButton = document.createElement("button");
    favoriteButton.className = "favorite-btn";

    const favorites = getFavorites();
    const isSaved = favorites.some(item => item.id === article.id);

    favoriteButton.textContent = favoriteSection
        ? "Remove ♥"
        : isSaved ? "Saved ♥" : "♡ Save";

    favoriteButton.addEventListener("click", () => {
        const currentFavorites = getFavorites();

        if (currentFavorites.some(item => item.id === article.id)) {
            saveFavorites(
                currentFavorites.filter(item => item.id !== article.id)
            );
        } else {
            saveFavorites([...currentFavorites, article]);
        }

        renderNews();
        renderFavorites();
    });

    actions.append(readLink, favoriteButton);
    card.append(category, title, description, source, actions);

    return card;
}

// Display news
function renderNews() {
    newsGrid.replaceChildren();

    const filteredNews = newsData.filter(article => {
        const matchesCategory =
            selectedCategory === "All" ||
            article.category === selectedCategory;

        const content =
            `${article.title} ${article.description} ${article.category}`;

        const matchesSearch = content
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    resultCount.textContent =
        filteredNews.length + " articles";

    if (filteredNews.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No news found. Try another search.";
        newsGrid.appendChild(message);
        return;
    }

    filteredNews.forEach(article => {
        newsGrid.appendChild(createNewsCard(article));
    });
}

// Display favourites
function renderFavorites() {
    favoritesGrid.replaceChildren();

    const favorites = getFavorites();

    if (favorites.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No favourite news saved yet.";
        favoritesGrid.appendChild(message);
        return;
    }

    favorites.forEach(article => {
        favoritesGrid.appendChild(
            createNewsCard(article, true)
        );
    });
}

// Search functionality
searchForm.addEventListener("submit", event => {
    event.preventDefault();

    searchTerm = searchInput.value.trim();

    renderNews();

    document.getElementById("news").scrollIntoView({
        behavior: "smooth"
    });
});

// Category filter
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        categoryButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        renderNews();
    });
});

// Initial display
renderNews();
renderFavorites();
