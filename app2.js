const fetchUsersButton = document.getElementById("fetch-users");
const userCountSelect = document.getElementById("user-count");
const userNationalitySelect = document.getElementById("user-nationality");
const apiStatus = document.getElementById("api-status");
const userResults = document.getElementById("user-results");

fetchUsersButton.addEventListener("click", fetchUsers);

async function fetchUsers() {
  const count = userCountSelect.value;
  const nationality = userNationalitySelect.value;

  if (!count) {
    apiStatus.textContent = "Select the number of users first.";
    userResults.innerHTML = "";
    return;
  }

  const url = new URL("https://randomuser.me/api/");

  url.searchParams.set("results", count);
  if (nationality) {
    url.searchParams.set("nat", nationality);
  }

  setLoadingState(true);
  apiStatus.textContent = "Loading user profiles...";
  userResults.innerHTML = "";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    renderUsers(data.results || []);
    apiStatus.textContent = `Showing ${data.results.length} user profile(s).`;
  } catch {
    apiStatus.textContent = "Unable to load users right now. Please try again.";
    userResults.innerHTML = "";
  } finally {
    setLoadingState(false);
  }
}

function renderUsers(users) {
  if (users.length === 0) {
    apiStatus.textContent = "No users were returned for this selection.";
    return;
  }

  userResults.innerHTML = users
    .map(
      (user) => `
        <article class="user-card">
          <img class="user-avatar" src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
          <h3>${user.name.first} ${user.name.last}</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Location:</strong> ${user.location.city}, ${user.location.country}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
        </article>
      `
    )
    .join("");
}

function setLoadingState(isLoading) {
  fetchUsersButton.disabled = isLoading;
  fetchUsersButton.textContent = isLoading ? "Loading..." : "Fetch Users";
}
