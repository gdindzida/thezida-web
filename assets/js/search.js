(() => {
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");
    const status = document.getElementById("search-status");

    if (!input || !results || !status) {
        return;
    }

    let posts = [];

    const escapeHTML = (value) => {
        const div = document.createElement("div");
        div.textContent = value;
        return div.innerHTML;
    };

    const normalize = (value) =>
        String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const getSearchText = (post) =>
        normalize(
            [
                post.title,
                post.summary,
                post.content,
                ...(post.tags || []),
                ...(post.categories || [])
            ].join(" ")
        );

    const renderResults = (matches) => {
        if (matches.length === 0) {
            results.innerHTML = `
        <p class="search-no-results">
          No results found.
        </p>
      `;
            return;
        }

        results.innerHTML = matches
            .map(
                (post) => `
          <article class="search-result">
            <h2>
              <a href="${escapeHTML(post.url)}">
                ${escapeHTML(post.title)}
              </a>
            </h2>

            <time datetime="${escapeHTML(post.date)}">
              ${escapeHTML(post.date)}
            </time>

            ${post.summary
                        ? `<p>${escapeHTML(post.summary)}</p>`
                        : ""
                    }
          </article>
        `
            )
            .join("");
    };

    const search = (query) => {
        const normalizedQuery = normalize(query).trim();

        if (!normalizedQuery) {
            status.textContent = "";
            results.innerHTML = "";
            return;
        }

        const terms = normalizedQuery.split(/\s+/);

        const matches = posts
            .map((post) => {
                const text = getSearchText(post);

                // Every search term must occur somewhere in the post.
                const matchesAllTerms = terms.every((term) =>
                    text.includes(term)
                );

                if (!matchesAllTerms) {
                    return null;
                }

                // Simple relevance score.
                let score = 0;

                terms.forEach((term) => {
                    if (normalize(post.title).includes(term)) {
                        score += 10;
                    }

                    if (normalize(post.summary).includes(term)) {
                        score += 5;
                    }

                    if (text.includes(term)) {
                        score += 1;
                    }
                });

                return {
                    post,
                    score
                };
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score)
            .map((item) => item.post);

        status.textContent =
            `${matches.length} result${matches.length === 1 ? "" : "s"}`;

        renderResults(matches);
    };

    fetch(window.searchIndexURL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return response.json();
        })
        .then((data) => {
            posts = Array.isArray(data) ? data : [];

            status.textContent =
                posts.length > 0
                    ? `Search ${posts.length} post${posts.length === 1 ? "" : "s"}`
                    : "No posts available.";

            input.addEventListener("input", () => {
                search(input.value);
            });

            input.focus();
        })
        .catch((error) => {
            console.error("Unable to load search index:", error);

            status.textContent = "Unable to load search index.";
        });
})();