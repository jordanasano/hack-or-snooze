"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
  $storiescontainer.show();
  $storiescontainer.css("display", "block");


}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  // add .main-nav-links into nav tag between .navbar-brand and .navbar-right
  $mainnavlinks.show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When the submit link in the nav bar is clicked, shows
 *  the #add-story-form.
 */
function navSubmitClick() {
  hidePageComponents();
  $addstoryform.show();
  $addstoryinput.show();
}

$navsubmitstory.on("click", navSubmitClick);

/** calls hidepagecomponents which hides everything on page then shows
 * favorites container then fills favorites container by calling
 * put favorites on page */
function navFavoriteClick() {
  hidePageComponents();
  $favoritesContainer.show();
  putFavoritesOnPage();
}

$navfavorites.on("click", navFavoriteClick);
