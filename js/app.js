const btnContainer = document.getElementById("btn-container");
const cardContainer = document.getElementById("card-container");
const empty = document.getElementById("empty");
let selected = 1000;
let sortByView = false;

const sortBtn = document.getElementById("sort-btn");
sortBtn.addEventListener("click", () => {
  sortByView = true; // Set sortByView to true when the sort button is clicked
  fetchCard(selected, sortByView);
});

const loadCategories = async () => {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/videos/categories"
    );
    const { data } = await res.json();
    fetchCategories(data, sortByView); // Pass sortByView to fetchCategories
  } catch (error) {
    console.log("Something Happened", error);
  }
};

function fetchCategories(categories, sortByView) {
  btnContainer.innerHTML = ""; // Clear previous buttons
  categories.forEach((category) => {
    const newBtn = document.createElement("button");
    newBtn.innerText = category.category;
    newBtn.classList = `clicked btn bg-slate-200 px-4 py-2`;
    newBtn.addEventListener("click", () => {
      fetchCard(category.category_id, sortByView);
      highlightButton(newBtn);
    });
    btnContainer.appendChild(newBtn);
  });
}

const fetchCard = async (categoryID, sortByView) => {
  selected = categoryID;
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/videos/category/${categoryID}`
    );
    const { data } = await res.json();
    handleCard(data, sortByView); // Pass sortByView to handleCard
  } catch (error) {
    console.log("Something Happened", error);
  }
};

function handleCard(cards, sortByView) {
  if (sortByView) {
    cards.sort((a, b) => {
      const totalViewFirst = parseFloat(a.others?.views.replace("K", "") || 0);
      const totalViewSecond = parseFloat(b.others?.views.replace("K", "") || 0);
      return totalViewSecond - totalViewFirst;
    });
  }

  renderCards(cards);
}

function renderCards(cards) {
  cardContainer.innerHTML = "";
  if (cards.length === 0) {
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
    cards.forEach((card) => {
      const verifiedElement = card.authors[0].verified
        ? `<img src="./image/fi_10629607.png" alt="" /><span class="ml-1">${card.others.views} views</span>`
        : `<span class="ml-1">${card.others.views} views</span>`;
      const newCard = document.createElement("div");
      newCard.classList = `bg-[#ffffff] text-black overflow-hidden max-w-sm mx-auto`;
      newCard.innerHTML = `
        <div class="relative">
          <img src="${card.thumbnail}" alt="" class="w-[400px] h-[200px] rounded-lg cursor-pointer" />
          <p class="text-[#ffffff] bg-black p-2 rounded-2xl text-[12px] mt-2 absolute bottom-4 right-2">3hrs 56 min ago</p>
        </div>
        <div class="mt-4">
          <h2 class="text-lg font-bold w-[90%] cursor-pointer">${card.title}</h2>
          <div class="flex items-center space-x-2 mt-4">
          <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <img class="aspect-square h-full w-full" alt="" src="${card.authors[0].profile_picture}" />
        </span>
        <div class="text-sm">
          <p class="cursor-pointer">${card.authors[0].profile_name}</p>
          <div class="flex items-center">
            ${verifiedElement}
          </div>
        </div>
      </div>
    </div>
  `;
      cardContainer.appendChild(newCard);
    });
  }
}

// Function to highlight the clicked button
function highlightButton(clickedBtn) {
  const allBtn = document.querySelectorAll(".clicked");
  for (let btn of allBtn) {
    btn.classList.remove("bg-[#FF1F3D]");
  }
  clickedBtn.classList.add("bg-[#FF1F3D]");
}

// Call loadCategories to initiate the fetching process
loadCategories();
fetchCard(selected, sortByView);