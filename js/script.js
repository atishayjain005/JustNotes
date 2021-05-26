console.log("welcome");
showNotes();

// if useradds a note to the local storage
let addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", function(e) {
    let addTxt = document.getElementById("addTxt");
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    notesObj.push(addTxt.value);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    addTxt.value = "";
    //console.log(notesObj);
    showNotes();
});

//functio to sjhow elements from local storage
function showNotes() {
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }
    let html = "";
    notesObj.forEach(function(element, index) {
        html += `
        <div class="noteCard border-5  card m-2" style="width: 18rem;border-radius: 40px 8px; ">
        <div class="card-body bg-transparent" >
          <h5 class="card-title text-center" contentEditable = "true">Note ${index + 1}</h5><hr>
          <p class="card-text p-2" contentEditable = "true">${element}</p>
          <button id="${index}" onClick="deleteNote(this.id)" class="btn btn-primary d-inline-flex justify-content-center align-self-center">Delete Note</button>
        </div>
      </div>
      `;
    });
    let notesElm = document.getElementById("notes");
    if (notesObj.length != 0) {
        notesElm.innerHTML = html;
    } else {
        notesElm.innerHTML = `Nothing to show!`;
    }
}

function deleteNote(index) {
    // console.log("I am deleting", index);
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }
    notesObj.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    showNotes();
}

let search = document.getElementById("searchTxt");
search.addEventListener("input", function() {
    let inputVal = search.value.toLowerCase();
    console.log("input eventfired!", inputVal);
    let noteCards = document.getElementsByClassName("noteCard");
    Array.from(noteCards).forEach(function(element) {
        let cardTxt = element.getElementsByTagName("p")[0].innerText;
        console.log(cardTxt);
        if (cardTxt.includes(inputVal)) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    });
});

//customization
var i = 0;

function change() {
    var doc = document.getElementById("bgColor");
    var color = [
        "rgba(255, 0, 0, 0.242)",
        "rgba(0, 0, 255, 0.242)",
        "rgba(0, 128, 0, 0.242)",
    ];
    doc.style.backgroundColor = color[i];
    i = (i + 1) % color.length;
}
setInterval(change, 2000);