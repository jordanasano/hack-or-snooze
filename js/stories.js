"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const starClass = generateStarClass(story);

  return $(`
      <li id="${story.storyId}">
        <i class="${starClass}"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Takes in a story instance, checks if that story is in
 *  currentUser.favorites. If so, returns 'fas fa-star'.
 *  Otherwise, returns 'far fa-star'.
 */
function generateStarClass(story) {
  for (let favorite of currentUser.favorites) {
    if (favorite.storyId === story.storyId) {
      return 'fas fa-star';
    }
  }

  return 'far fa-star';
}

/** Takes in the i tag of currStar, finds the clost li's id, then
 *  finds the story instance with that id and returns it.
 */
function findStory(currStar) {
  const currStoryId = currStar.closest('li').id;
  let targStory;
  console.log("currStoryId = ", currStoryId);

  for (let story of storyList.stories) {
    if (story.storyId === currStoryId) {
      targStory = story;
    }
  }

  if (targStory === undefined) {
    for (let story of currentUser.favorites) {
      if (story.storyId === currStoryId) {
        targStory = story;
      }
    }
  }

  console.log(targStory);
  return targStory;
}

/** Takes in the i tag of currStar and the targStory instance,
 *  finds out the currStar's second class. If it is 'far',
 *  invokes updateAndAddFavorite, it not, invokes updateAndUnFavorite.
 */
function favOrUnfav(currStar, targStory) {
  const starClass = currStar.classList[0];
  if (starClass === 'far') {
    updateAndAddFavorite(currStar, targStory)
  } else {
    updateAndUnFavorite(currStar, targStory);
  }
}

/** Takes in the i tag of currStar and the targStory instance,
 *  invokes addFavorite and updateStar.
  */
function updateAndAddFavorite(currStar, targStory) {
  currentUser.addFavorite(targStory);
  updateStar(currStar);
}

/** Takes in the i tag of currStar and the targStory instance,
 *  invokes unFavorite and updateStar.
  */
function updateAndUnFavorite(currStar, targStory) {
  currentUser.unFavorite(targStory);
  updateStar(currStar);
}

/** Takes in the i tag of currStar and toggles the star
 *  between solid or empty.
 */
function updateStar(currStar) {
  const starClass = currStar.classList[0];
  if (starClass === 'far') {
    $(currStar).removeClass("far fa-star").addClass("fas fa-star");
    // could refactor to use toggleClass
  } else {
    $(currStar).removeClass("fas fa-star").addClass("far fa-star");
    // could refactor to use toggleClass
  }
}

/** finds story based on star click calls fav or unfav */
function starHandleClick(evt) {
  const currStar = evt.target;
  const targStory = findStory(currStar);
  favOrUnfav(currStar, targStory);
}

$allStoriesList.on("click", [".far", ".fas"], starHandleClick);

/** takes in evt finds story and updates and unfavorites from favorites page */
function favoritesStarHandleClick(evt) {
  const currStar = evt.target;
  const targStory = findStory(currStar);
  console.log("targStory in favoritesStarHandleClick = ", targStory);
  updateAndUnFavorite(currStar, targStory);
}
$allFavoritesList.on("click", ".fas", favoritesStarHandleClick);

/** Gets list of favorites from server, generates their HTML, and puts on page. */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  const favoritesList = currentUser.favorites;
  $allFavoritesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let favorite of favoritesList) {
    const $favorite = generateStoryMarkup(favorite);
    $allFavoritesList.append($favorite);
  }

  $favoritesContainer.show();
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $("#favorites-loading-msg").hide();
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets user input from #add-story-form, passes input into
 *  addStory, then invokes putStoriesOnPage
 */
async function getAndDisplayStory(evt) {
  evt.preventDefault();
  const author = $("#author-name").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  console.log('author=', author, 'title=', title, 'url=', url);
  console.log("storyList=", storyList);

  const newStoryInstance = await storyList.addStory(currentUser, { author, title, url });
  storyList.stories.unshift(newStoryInstance);
  console.log("storyList after addStory=", storyList);

  hidePageComponents();
  putStoriesOnPage();
}

$addStoryForm.on('submit', getAndDisplayStory);
