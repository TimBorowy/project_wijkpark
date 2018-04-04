var button = document.getElementById('myBtn');
button.addEventListener("click", info_popup);

function info_popup(e){

    console.log(button)

}


// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
console.log(btn);

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    console.log("button test");
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    console.log("span test");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        console.log("modal event");
        modal.style.display = "none";
    }
}