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
            
            [<p style="text-transform:capitalize;font-size:.7rem;"> ${post.url.split('/').slice(0, -1).map((dir, index, arr) => index === arr.length - 1 ? `<a href="${arr.slice(0, index + 1).join('/') || '/'}">${dir}</a>` : '').filter(Boolean).join('')} </p>]
            <a href="${post.url}">${post.title}</a>
        `;
        resultsContainer.appendChild(postElement);
    });

    if (filteredPosts.length === 0) {
        resultsContainer.innerHTML = '<p style="padding:5px 20px;">No posts found!</p>';
    }
}