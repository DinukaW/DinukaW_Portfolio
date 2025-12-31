// Fetch Medium posts via RSS feed
async function fetchMediumPosts() {
  const mediumUsername = 'dinukaw95';
  const timestamp = Date.now();
  const rssUrl = `https://medium.com/feed/@${mediumUsername}?t=${timestamp}`;
  
  // Try with corsproxy.io
  try {
    const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`;
    const response = await fetch(corsProxyUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    const rssText = await response.text();
    
    const parser = new DOMParser();
    const xml = parser.parseFromString(rssText, 'text/xml');
    const items = xml.querySelectorAll('item');
    
    if (items.length > 0) {
      const posts = Array.from(items).slice(0, 6).map(item => {
        const contentEncoded = item.getElementsByTagName('content:encoded')[0]?.textContent ||
                              item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent;
        const description = item.querySelector('description')?.textContent || contentEncoded || '';
        
        return {
          title: item.querySelector('title')?.textContent || 'Untitled',
          link: item.querySelector('link')?.textContent || item.querySelector('guid')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
          description: description
        };
      });
      
      displayPosts(posts);
      return;
    }
  } catch (error) {
    console.error('Failed to fetch from corsproxy.io:', error);
  }
  
  // Try RSS2JSON as fallback
  try {
    const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const response = await fetch(rss2jsonUrl, { cache: 'no-store' });
    const data = await response.json();
    
    if (data.status === 'ok' && data.items && data.items.length > 0) {
      displayPosts(data.items.slice(0, 6));
      return;
    }
  } catch (error) {
    console.error('Failed to fetch from RSS2JSON:', error);
  }
  
  // If all methods fail, show error
  showError();
}

function displayPosts(posts) {
  const blogContainer = document.getElementById('blog-posts-container');
  blogContainer.innerHTML = '';
  
  posts.forEach((post, index) => {
    const publishDate = new Date(post.pubDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    // Extract description (remove HTML tags and limit length)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.description;
    let description = tempDiv.textContent || tempDiv.innerText || '';
    description = description.substring(0, 150).trim() + '...';
    
    const delay = (index % 3) * 100;
    
    const postCard = `
      <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up" data-aos-offset="50" data-aos-duration="500" data-aos-delay="${delay}">
        <div class="card blog-card">
          <div class="card-body">
            <h5 class="blog-card-title">${post.title}</h5>
            <p class="blog-card-description">${description}</p>
            <div class="blog-card-meta">
              <span class="blog-card-date"><i class="fa fa-calendar"></i> ${publishDate}</span>
              <a href="${post.link}" target="_blank" class="blog-card-link">Read More <i class="fa fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    blogContainer.innerHTML += postCard;
  });
  
  // Reinitialize AOS animations for dynamically added elements
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}

function showError() {
  const blogContainer = document.getElementById('blog-posts-container');
  blogContainer.innerHTML = `
    <div class="col-12 text-center" style="padding: 40px;">
      <i class="fa fa-exclamation-triangle fa-3x" style="color: #ff9800;"></i>
      <p style="margin-top: 20px; color: #666;">Unable to load posts. Please visit my Medium profile to read my latest articles.
      </p>
    </div>
  `;
}

// Fetch posts when page loads
document.addEventListener('DOMContentLoaded', fetchMediumPosts);
