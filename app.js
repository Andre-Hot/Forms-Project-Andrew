"use strict";

const endpoint = "https://andrew-exercise-default-rtdb.firebaseio.com/";
let posts;
let formPost;

window.addEventListener("load", initApp);


function initApp() {
    updatePostsGrid();
    
    document.querySelector("#btn-create-post").addEventListener("click", showCreatePostDialog);
    document.querySelector("#form-create-post").addEventListener("submit", createPostClicked);
    document.querySelector("#form-update-post").addEventListener("submit", updatePostClicked);
    document.querySelector("#form-delete-post").addEventListener("submit", deletePostClicked);
    document.querySelector("#form-delete-post .btn-cancel").addEventListener("click", deleteCancelClicked);
    document.querySelector("#select-sort-by").addEventListener("change", sortByChanged);
    document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
    document.querySelector("#input-search").addEventListener("search", inputSearchChanged);
}


async function createPost(title, body, image) {
    const newPost = { title, body, image };
    const json = JSON.stringify(newPost);

    const response = await fetch(`${endpoint}/posts.json`, {
        method: "POST",
        body: json
    
    });

    if (response.ok) {
        console.log("New post succesfully added to firebase");

    }

} 

function showCreatePostDialog() {
  document.querySelector("#dialog-create-post").showModal(); 
}

function createPostClicked(event) {
  const form = event.target; 
  const title = form.title.value;
  const body = form.body.value;
  const image = form.image.value;
  createPost(title, body, image); 
  form.reset(); 
}

function updatePostClicked(event) {
  const form = event.target; 
  const title = form.title.value;
  const body = form.body.value;
  const image = form.image.value;
  
  const id = form.getAttribute("data-id");
  updatePost(id, title, body, image); 
}

function deletePostClicked(event) {
  const id = event.target.getAttribute("data-id"); 
  deletePost(id); 
}

function deleteCancelClicked() {
  document.querySelector("#dialog-delete-post").close(); 
}

function sortByChanged(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "title") {
    posts.sort(compareTitle);
  } else if (selectedValue === "body") {
    posts.sort(compareBody);
  }

  showPosts(posts);
}

function inputSearchChanged(event) {
  const value = event.target.value;
  const postsToShow = searchPosts(value);
  showPosts(postsToShow);
}

async function updatePostsGrid() {
  posts = await getPosts(); 
  showPosts(posts); 
}

async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`); 
  const data = await response.json(); 
  const posts = prepareData(data); 
  return posts; 
}
function showPosts(listOfPosts) {
  document.querySelector("#posts").innerHTML = ""; 

  for (const post of listOfPosts) {
    showPost(post); 
  }
}

function showPost(postObject) {
  const html = /*html*/ `
        <article class="grid-item">
            <img src="${postObject.image}" />
            <h3>${postObject.title}</h3>
            <p>${postObject.body}</p>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </div>
        </article>
    `; 
  document.querySelector("#posts").insertAdjacentHTML("beforeend", html); 

  
  document.querySelector("#posts article:last-child .btn-delete").addEventListener("click", deleteClicked);
  document.querySelector("#posts article:last-child .btn-update").addEventListener("click", updateClicked);
}

 function deleteClicked(post) {
   
   document.querySelector("#dialog-delete-post-title").textContent = postObject.title;
   
   document.querySelector("#form-delete-post").setAttribute("data-id", postObject.id);
   
   document.querySelector("#dialog-delete-post").showModal();
 }

  function updateClicked(post) {
    const updateForm = document.querySelector("#form-update-post"); 
    updateForm.title.value = postObject.title; 
    updateForm.body.value = postObject.body; 
    updateForm.image.value = postObject.image; 
    updateForm.setAttribute("data-id", postObject.id); 
    document.querySelector("#dialog-update-post").showModal(); 
  }

  function searchPosts(searchValue) {
    searchValue = searchValue.toLowerCase();

    const results = posts.filter(checkTitle);

    

    function checkTitle(post) {
      const title = post.title.toLowerCase();
      return title.includes(searchValue);
    }

    return results;
  }

async function createPost(title, body, image) {
    const newPost = { title, body, image }; 
    const json = JSON.stringify(newPost); 
    const response = await fetch(`${endpoint}/posts.json`, {
        method: "POST",
        body: json
    });
    
    if (response.ok) {
        console.log("New post succesfully added to Firebase");
        updatePostsGrid(); 
    }
}

    async function deletePost(id) {
        const response = await fetch(`${endpoint}/posts/${id}.json`, {
            method: "PUT",
            body: json
        });

        if (response.ok) {
            console.log("New post succesfully deleted from firebase");
            updatePostsGrid();
        }
    }


async function updatePost(id, title, body, image) {
     const postToUpdate = { title, body, image }; 
    const json = JSON.stringify(postToUpdate); 
    const response = await fetch(`${endpoint}/posts/${id}.json`, {
        method: "PUT",
        body: json
    });
    

    if (response.ok) {
        console.log("Post succesfully updated in Firebase 🔥");
        updatePostsGrid(); 
    }
}
    
function prepareData(dataObject) {
  const array = []; 
  
  for (const key in dataObject) {
    const object = dataObject[key]; 
    object.id = key; 
    array.push(object);
  }
  return array; 
}

function compareTitle(post1, post2) {
  return post1.title.localeCompare(post2.title);
}

function compareBody(post1, post2) {
  return post1.body.localeCompare(post2.body);
}

