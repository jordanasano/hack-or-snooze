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
  console.log('generateStoryMarkup ran. story=', story);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

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
  console.log("storyList after addStory=", storyList)

  putStoriesOnPage();
}

$("#add-story-form").on('submit', getAndDisplayStory);
