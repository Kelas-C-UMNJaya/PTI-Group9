function userInput() {
    let name = document.querySelector("#name-input").value;
    //get src
    let image = document.querySelector(".carousel-item.active").querySelector("img").getAttribute("src");
    let user = {
        name: name,
        image: image
    };
    return user;
}

function checkUserInput() {
    let btn = document.querySelector(".inputbutton");
    btn.addEventListener("click", () => {
        console.log(userInput());
    });
}

checkUserInput();