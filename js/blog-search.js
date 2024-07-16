function searchPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');

    if (!resultsContainer) {
        console.error('Results container not found');
        return;
    }

    resultsContainer.innerHTML = '';

    if (query.length === 0) {
        return;
    }

    // Filter blog posts based on the search query that matches the post title or description
    const filteredPosts = blogPosts.filter(post => post.title.toLowerCase().includes(query));

    filteredPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'search-result';
        postElement.innerHTML = `
            <img width="25" src="${post.img}" alt="${post.title}" />
            <a href="${post.url}">${post.title}</a>
        `;
        resultsContainer.appendChild(postElement);
    });

    if (filteredPosts.length === 0) {
        resultsContainer.innerHTML = '<p style="padding:5px 20px;">No posts found!</p>';
    }
}