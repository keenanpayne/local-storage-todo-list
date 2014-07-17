// Create empty notes array
var notes = []; 

// Key to store and retrieve from local storage
var key = "notesapp";

window.onload = function() { 
    // Click handler used to add a note whenever the 
    // Submit button is clicked.
    var submitButton = document.getElementById("submit");
	submitButton.onclick = createNote;
    
    // Check for localStorage capabilities 
    if (!window.localStorage) {
        // If localStorage is unavailable, warn user.  
		alert("You are using a web browser that is too old for this program. Please upgrade your web browser if you wish to get the full experience.");
	} else {
        // If localStorage is available, display notes.  
		loadNotes();
	}
    
    // Click handler used to remove notes
    var deleteNotesButton = document.getElementById("delete-notes");
	deleteNotesButton.onclick = deleteNotes;
    
    // Click handler used to export notes
    var exportNotesButton = document.getElementById("export-notes");
    exportNotesButton.onclick = exportNotes;
}

function createNote() { 
    // Get content of note
    var noteText = document.getElementById("note");
	text = noteText.value;
    
    // Ensure that note text is not empty
    if (text == null || text == "" || text.length == 0) {
		alert("Please enter a note!");
		return;
	}
    
    // Determine color selected
    var colorSelect = document.getElementById("color");
    var index = colorSelect.selectedIndex;
    var color = colorSelect[index].value;
    
    // Set note properties
    var note = {};
	note.text = text;
	note.color = color;
	notes.push(note);
    
    // Store our notes
	storeNotes();
    
    // Display note on page	
	addNoteToPage(note);
}

function addNoteToPage(note) { 
    // Determine where to place notes on page
    var notesUl = document.getElementById("notes");
	var li = document.createElement("li");
    
    // Add class name and attributes to notes
    li.className = "note";
    li.setAttribute('draggable', 'true'); // Enable columns to be draggable.
    
    // Add event listeners for dragging/dropping notes
    li.addEventListener('dragstart', this.handleDragStart, false);
    li.addEventListener('dragenter', this.handleDragEnter, false);
    li.addEventListener('dragover', this.handleDragOver, false);
    li.addEventListener('dragleave', this.handleDragLeave, false);
    li.addEventListener('drop', this.handleDrop, false);
    li.addEventListener('dragend', this.handleDragEnd, false);
    
    // Display the note text with appropriate background color
	li.innerHTML = note.text;
	li.style.backgroundColor = note.color;
    
	if (notesUl.childElementCount > 0) {
		notesUl.insertBefore(li, notesUl.firstChild);
	} else {
		notesUl.appendChild(li);
	}
}

function storeNotes() { 
    // Convert array of notes to string
    var jsonNotes = JSON.stringify(notes);
    
    // Store the note
	localStorage.setItem(key, jsonNotes);
}

function loadNotes() { 
    // Get our notes
    var jsonNotes = localStorage.getItem(key);
    
	if (jsonNotes != null) {
		notes = JSON.parse(jsonNotes);
        
		for (var i = 0; i < notes.length; i++) {
			addNoteToPage(notes[i]);
		}
	}
}

function deleteNotes() { 
    // Remove all notes from local storage
    window.onbeforeunload = function() {
        localStorage.removeItem(key);
        return 'Are you sure you want to delete all of your notes?';
    };
}

(function () {
    var id_ = 'notes';
    var cols_ = document.querySelectorAll('#' + id_ + ' .note');
    var dragSrcEl_ = null;

    this.handleDragStart = function (e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);

        dragSrcEl_ = this;

        // this/e.target is the source node.
        this.addClassName('moving');
    };

    this.handleDragOver = function (e) {
        if (e.preventDefault) {
            e.preventDefault(); // Allows us to drop.
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
    };

    this.handleDragEnter = function (e) {
        this.addClassName('over');
    };

    this.handleDragLeave = function (e) {
        // this/e.target is previous target element.
        this.removeClassName('over');
    };

    this.handleDrop = function (e) {
        // this/e.target is current target element.
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        // Don't do anything if we're dropping on the same column we're dragging.
        if (dragSrcEl_ != this) {
            dragSrcEl_.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        return false;
    };

    this.handleDragEnd = function (e) {
        // this/e.target is the source node.
        [].forEach.call(cols_, function (col) {
            col.removeClassName('over');
            col.removeClassName('moving');
        });
    };
})();

function exportNotes() {
    // Display "Download" icon
    document.getElementById("results").className = "icon icon-2x download";

    var item = localStorage.csv=",what you want in the CSV,";
    var ary = localStorage.getItem( "csv" ); //csv as a string
    var blob = new Blob([ary], {type: "text/csv"});
    var url = URL.createObjectURL(blob);
    var a = document.querySelector("#results"); // id of the <a> element to render the download link
    
    // Set URL path and file name for exported file
    a.href = url;
    a.download = "locallist_export.csv";
}