const generateMemeBtn = document.querySelector(".generate-meme-btn");
const downloadMemeBtn = document.querySelector(".download-meme-btn");
const shareMemeBtn = document.querySelector(".share-meme-btn");
const favoriteMemeBtn = document.querySelector(".favorite-meme-btn");
const memeImage = document.querySelector(".meme-image");
const memeTitle = document.querySelector(".meme-title");
const memeAuthor = document.querySelector(".meme-author");
const searchInput = document.querySelector(".search-input");
const categorySelect = document.querySelector(".category-select");
const galleryContainer = document.querySelector(".gallery-container");
const favoriteMemeContainer = document.querySelector(".favorite-memes-container");

let memeData = [];
let favoriteMemesData = [];

const updateDetails = (url, title, author) => {
    memeImage.setAttribute("src", url);
    memeTitle.textContent = title;
    memeAuthor.textContent = `Meme by: ${author}`;
    downloadMemeBtn.setAttribute("download", `${title}.png`);
    downloadMemeBtn.href = url;
};

const generateMeme = () => {
    const category = categorySelect.value;
    const searchQuery = searchInput.value.trim().toLowerCase();
    let apiUrl = "https://meme-api.com/gimme";

    if (category !== "all") {
        apiUrl = `https://meme-api.com/gimme/${category}`;
    }

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            if (searchQuery && !data.title.toLowerCase().includes(searchQuery)) {
                generateMeme();
                return;
            }

            updateDetails(data.url, data.title, data.author);
            memeData.push(data);
            renderGallery();
            saveMemeData();
        });
};

const renderGallery = () => {
    galleryContainer.innerHTML = "";
    memeData.forEach((meme, index) => {
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");
        galleryItem.innerHTML = `
            <img src="${meme.url}" alt="${meme.title}">
            <h3 class="meme-title">${meme.title}</h3>
            <p class="meme-author">Meme by: ${meme.author}</p>
            <button class="remove-meme-btn">Remove</button>
        `;
        galleryContainer.appendChild(galleryItem);

        const removeMemeBtn = galleryItem.querySelector(".remove-meme-btn");
        removeMemeBtn.addEventListener("click", () => {
            memeData.splice(index, 1);
            renderGallery();
            saveMemeData();
        });

        galleryItem.addEventListener("click", () => {
            updateDetails(meme.url, meme.title, meme.author);
        });
    });
};

const renderFavoriteMemes = () => {
    favoriteMemeContainer.innerHTML = "";
    favoriteMemesData.forEach((meme, index) => {
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");
        galleryItem.innerHTML = `
            <img src="${meme.url}" alt="${meme.title}">
            <h3 class="meme-title">${meme.title}</h3>
            <p class="meme-author">Meme by: ${meme.author}</p>
            <button class="remove-meme-btn">Remove</button>
        `;
        favoriteMemeContainer.appendChild(galleryItem);

        const removeMemeBtn = galleryItem.querySelector(".remove-meme-btn");
        removeMemeBtn.addEventListener("click", () => {
            favoriteMemesData.splice(index, 1);
            localStorage.setItem("favoriteMemesData", JSON.stringify(favoriteMemesData));
            renderFavoriteMemes();
        });

        galleryItem.addEventListener("click", () => {
            updateDetails(meme.url, meme.title, meme.author);
        });
    });
};

const downloadMeme = () => {
    const link = document.createElement("a");
    link.download = `${memeTitle.textContent}.png`;
    link.href = memeImage.src;
    link.click();
};

const shareMeme = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memeImage.src)}`;
    window.open(shareUrl, "_blank");
};

const favoriteMeme = () => {
    const currentMeme = {
        url: memeImage.src,
        title: memeTitle.textContent,
        author: memeAuthor.textContent.replace("Meme by: ", ""),
    };

    favoriteMemesData.push(currentMeme);
    localStorage.setItem("favoriteMemesData", JSON.stringify(favoriteMemesData));
    alert("Meme added to favorites!");
    renderFavoriteMemes();
};

const saveMemeData = () => {
    localStorage.setItem("memeData", JSON.stringify(memeData));
};

generateMemeBtn.addEventListener("click", generateMeme);
downloadMemeBtn.addEventListener("click", downloadMeme);
shareMemeBtn.addEventListener("click", shareMeme);
favoriteMemeBtn.addEventListener("click", favoriteMeme);
searchInput.addEventListener("input", generateMeme);

// Load favorite memes from localStorage
const storedFavoriteMemesData = JSON.parse(localStorage.getItem("favoriteMemesData"));
if (storedFavoriteMemesData) {
    favoriteMemesData = storedFavoriteMemesData;
    renderFavoriteMemes();
}

// Load meme data from localStorage
const storedMemeData = JSON.parse(localStorage.getItem("memeData"));
if (storedMemeData) {
    memeData = storedMemeData;
    renderGallery();
}

generateMeme();
