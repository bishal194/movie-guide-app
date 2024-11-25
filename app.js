const searchForm = document.querySelector('form');
const movieContainer = document.querySelector('.movie-container');
const inputBox = document.querySelector('#movieInput'); // Input box selector
const suggestionsList = document.querySelector('#suggestions'); // Datalist selector

const myApiKey = "7ed02e80"; // Your OMDb API Key

// Function to fetch movie suggestions
const getMovieSuggestions = async (query) => {
    if (query.length < 3) return; // Only start searching after 3 characters
    const url = `https://www.omdbapi.com/?apikey=${myApiKey}&s=${query}`; // Updated to HTTPS

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            displaySuggestions(data.Search); // Display the search suggestions
        } else {
            suggestionsList.innerHTML = ''; // Clear suggestions if no results
        }
    } catch (error) {
        console.error('Error fetching movie suggestions:', error);
    }
}

// Function to display movie suggestions in the datalist
const displaySuggestions = (movies) => {
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    // Loop through the fetched movies and add them to the datalist
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.Title; // Movie name as the option value
        suggestionsList.appendChild(option);
    });
}

// Event listener for input changes to fetch suggestions
inputBox.addEventListener('input', (e) => {
    const query = e.target.value.trim(); // Get the query from input field
    getMovieSuggestions(query); // Fetch suggestions based on the input query
});

// Function to fetch and display movie details
const getMovieInfo = async (movie) => {
    const url = `https://www.omdbapi.com/?apikey=${myApiKey}&t=${movie}`; // Updated to HTTPS

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovie(data); // Display movie details
        } else {
            movieContainer.innerHTML = `<p>No results found for "${movie}". Please try again.</p>`;
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        movieContainer.innerHTML = '<p>Sorry, something went wrong. Please try again later.</p>';
    }
}

// Function to display movie details on the page
const displayMovie = (movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const imdbRating = movie.imdbRating !== "N/A" ? movie.imdbRating : "";
    const actors = movie.Actors !== "N/A" ? movie.Actors : "";
    const director = movie.Director !== "N/A" ? movie.Director : "";
    const producers = movie.Producer !== "N/A" ? movie.Producer : "";
    let budget = movie.BoxOffice !== "N/A" ? movie.BoxOffice : "";
    
    if (budget && budget.startsWith('$')) {
        const budgetInINR = parseInt(budget.replace(/[^\d]/g, "")) * 80;
        budget = `₹${budgetInINR.toLocaleString()}`;
    } else {
        budget = "";
    }

    movieCard.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300?text=No+Image"}" alt="${movie.Title}" />
        <h3>${movie.Title}</h3>
        <p>${movie.Year} | ${movie.Genre}</p>
        <p>${movie.Plot}</p>
        ${imdbRating ? `<p><strong>IMDb Rating: </strong>${imdbRating}</p>` : ""}
        ${actors ? `<p><strong>Actors: </strong>${actors}</p>` : ""}
        ${director ? `<p><strong>Director: </strong>${director}</p>` : ""}
        ${producers ? `<p><strong>Producers: </strong>${producers}</p>` : ""}
        ${budget ? `<p><strong>Budget: </strong>${budget}</p>` : ""}
    `;

    movieContainer.innerHTML = '';
    movieContainer.appendChild(movieCard);
}

// Event listener for the search form to display movie details
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const movieName = inputBox.value.trim();
    if (movieName !== '') {
        getMovieInfo(movieName);
    }
});
