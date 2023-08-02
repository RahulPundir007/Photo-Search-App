// const endpoint = "https://api.unsplash.com/search/photos?query=${}&per_page=${}&page=${}&client_id=${}"
// let accessKey = "alA5wgscMpuiarOAh75rfd_MUk6prmAMgKl_QijmpX8"

let maxImages = 12;
let currentPage = 1;
let lastPage = 0;
let apiKey = "alA5wgscMpuiarOAh75rfd_MUk6prmAMgKl_QijmpX8";

const searchBtn = document.getElementById("searchBtn");
searchBtn.onclick = makeSearch;

async function searchUnsplash(searchQuery) {
  const endpoint = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=${maxImages}&page=${currentPage}&client_id=${apiKey}`;
  let resp = await fetch(endpoint);

  if (!resp.ok) {
    // console.log("Error occured", resp);
    return;
  }

  const json = await resp.json();
  return json;
}

async function makeSearch() {
  let searchQuery = document.getElementById("searchInput").value;

  let response = await searchUnsplash(searchQuery);

  let htmlContent = "";

  response.results.forEach((eRes) => {
    let url = eRes.urls.small;
    let unsplashLink = eRes.links.html;
    let photographer = eRes.user.name;
    let photographerPage = eRes.user.links.html;

    htmlContent =
      htmlContent +
      `
      <div>
        <a href="${unsplashLink}" target="_blank">
            <div class="resultItem" style="background-image: url(${url});"></div>
        </a>
        <p class="photographer-name">
            <a href="${photographerPage}" target="_blank">Photo by ${photographer}</a>
        </p>
      </div>
    `;
  });

  lastPage = response.total_pages;

  let imgContainer = document.getElementById("imgContainer");
  imgContainer.innerHTML = htmlContent;

  let infoPara = document.getElementById("infoPara");
  infoPara.innerText = `About ${response.total} result found`;

  let countInfoPara = document.getElementById("countInfoPara");

  let startvalue = ((currentPage-1)* maxImages) + 1 ;
  let endvalue = (maxImages * currentPage);

  countInfoPara.innerText = `${startvalue} - ${endvalue} of page ${currentPage}`;

  btnUpdateState();
}

let nextBtn = document.getElementById("nextBtn");
let prevBtn = document.getElementById("prevBtn");

nextBtn.onclick = nextPage;
prevBtn.onclick = prevPage;

function btnUpdateState() {
  nextBtn.classList.remove("hidden");
  if (currentPage >= lastPage) {
    nextBtn.classList.add("hidden");
  }

  prevBtn.classList.remove("hidden");
  if (currentPage == 1) {
    prevBtn.classList.add("hidden");
  }
}

function nextPage() {
  if (currentPage >= lastPage) {
    return;
  } else {
    currentPage++;
  }
  makeSearch();
}

function prevPage() {
  if (currentPage == 1) {
    return;
  } else {
    currentPage--;
  }
  makeSearch();
}
