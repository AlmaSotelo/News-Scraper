/* global bootbox */
$(document).ready(function() {
   //Getting a refrerence to the article container div we will be rendering all articles inside of
   var articleContainer = $(".article-container");
   //Ading event listeners for dynamically generated buttons for delating articles,
   //pulling up article notes, saving article notes, and deleting article notes
   $(document).on("click", ".btn.delete", handleArticleDelete);
   $(document).on("click", ".btn.notes", handleArticleNotes);
   $(document).on("click", ".btn.save", handleNoteSave);
   $(document).on("click", ".btn.note-delete", handleNoteDelete);

   //initPage kicks everything off when the page is loaded
   initPage();

   function initPage () {
      //Empty the article clontainer, run an AJAX request for any saved headlines
      articleContainer.empty();
      $.get("/?saved=true").then(function(data) {
         //if we have headlines, render them to the page
         if (data && data.length) {
            renderArticles(data);
         }
         else {
            //Otherwise render a message explaining we have no articles
            renderEmpty();
         }
      });
   }

   function renderArticles(articles) {
      //This function handles appending HTML containing our article data to the page
      //We are passed an array of JSON containing all available articles in or database
      var articlePanels = [];
      //We pass each article JSON object to the createPanel function wich returns a bootstrap
      for (var i=0; i< articles.length; i++) {
         articlePanels.push(createPanel(articles[i]));
      }
      //Once we have all of the HTML for the articles stored in our articlePanels array,
      articleContainer.append(articlePanels);
   }

   function createPanel(article) {
      //This function takes in a single JSON object for an article/headline
      //It constructos a Query element containing all of the formatted HTML for the
      //article panel
      var panel =
         $(["div class='panel panel-default'>",
            "div class='panel-heading'>", 
            "<h3>",
            article.headline,
            "<a class='btn-danger delete'>",
            "Delete From Saved",
            "</a>",
            "<a class='btn btn-info notes'>Article Notes</a>",
            "</h3>",
            "</div",
            "<div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
         ].join(""));
      //We attach the article's id to the jQuery element
      //We will use this when thrying to figure out which article the user wants to remove or open notes for
      panel.data("_id", article._id);
      //We return the constructed panel jQuery element
      return panel;   
   }

   function renderEmpty() {
      //This function render some HTML to the page explaining we don't have any articles to view
      //Using a joined array of HTML string data because it's easier to read/change than a concatenated string
      var emptyAlert =
         $(["<div class='alert alert-warning text-center'>",
         "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
         "<div>",
         "<div class='panel panel-default'>",
         "<div class='panel-heading text-center'>",
         "<h3>Would You Like to Browse Available Articles?</h3>",
         "</div>",
         "<div class='panel-body text-center'>",
         "<h4><a href='/'>Browse Articles</a></h4>",
         "</div>",
         "</div>",
         ].join(""));
      //Appending this data to the page
      articleContainer.append(emptyAlert);
   }

   function renderNotesList(data) {
      //This function handnles rendering note list items to our notes modal
      //Setting up an array of notes to render after finished
      //also setting up a currenNote variable to temporarlily store each note
      var notesToRender = [];
      var currentNote;
      if (!data.notes.length) {
         //if we have no notes, just display a message explaining this
         currentNote = [
            "<li class='list-group-item'>",
            "No notes for this article yet.",
            "</li>"
         ].join("");
         notesToRender.push(currentNote);
      }
      else {
        // if we do have notes, go through each one
        for (var i=0; i < data.notes.length; i++) {
           //Constructs an li element to contain our noteText and a delete button
           currentNote = $(["<li class='list-group-item note'>",
           data.notes[i].noteText,
           "<button class='btn btn-danger note-delete'>x</button>",
           "</li>"
            ].join(""));
            //store the note id on the delete button for easy access when trying to delete
            currentNote.children("button").data("_id", data.notes[i]._id);
            //Adding our currentNote to the notesToRender array
            notesToRender.push(currentNote);
        }
      }
      //Now append the notesToRender to the note-container inside the note modal
      $(".note-container").append(notesToRender);
   }

   function handleArticleDelete() {
      //This function handles deleting articles/headlines
      //We grab the id of the article to delete from the panel element the delete button sits inside
      var articleToDelete= $(this).parents(".panel").data();
      //Using a dlete method here just to be semantic since we are deleting an article/headline
      $.ajax({
         method:"DELETE",
         url: "//" + articleToDelete._id
      }).then(function(data) {
         //if this works out, run iniPage again which will render our list of saved articles
         if (data.ok) {
            initPAge();
         }
      }); 
   }

   function handleArticleNotes() {
      //This handles opening the notes nodal and displaying our notes
      //We grab the id of the article to get notes for from the panel element the delete button sits inside
      var currentArticle = $(this).parents(".panel").data();
      //Grabs any notes with this headline.article id
      $.get("/api/notes/" + currentArticle._id).then(function(data) {
         //Constructing our initial HTML to add to the notes modal
         var modalText = [
            "<div class='container-fluid text-center'>",
            "<h4>Notes for Article: ",
            currentArticle._id,
            "</h4>",
            "<hr />",
            "<ul class='list-group note-container'>",
            "</ul>",
            "<textarea placeholder='New Note' rows='4' cols='60></textarea>",
            "<button class='btn btn-success save'>Save Note</button>",
            "</div>"
         ].join("");
         //Adding the formatted HTML to the note modal
         bootbox.dialog({
            message: modalText,
            closeButton: true
         });
         var noteData = {
            _id: currentArticle._id,
            notes: data || []
         };
         //Adding some information about the article and article notes to the save button for easy access
         //when trying to add a new note
         $(".btn.save").data("article", noteData);
         //renderNoteList will populate the actual note HTML inside of the modal we just created/opened
         renderNotesList(noteData);
      });
   }

   function handleNoteSave () {
      //This function handles what happens when a user tries to save a new note for an article
      //Setting a variable to hold some formatted data about our note,
      //grabbing the note typed into the input box
      var noteData;
      var newNote = $(".bootbox-body textarea").val().trim();
      //if we actually have data typed into the note input field, format it
      //and por it to the "/api/notes" route and send the formatted noteData as well
      if(newNote) {
         noteData= {
            id:$(this).data("article"._id),
            noteText: newNote
         };
         $.post("/api/notes", noteData).then(function() {
            //when complete, close the modal
            bootbox.hideAll();
         });
      }
   }

   function handleNoteDelete() {
      //This function handles the deletion of notes
      //First we grab the id of the note we want to delete
      //we stored this data on the delete button when we created it
      var noteToDelete = $(this).data("_id");
      //Perform an DELETE reqyest ti "/api/notes" with the id of the note we're deleting as a parameter
      $$.ajax({
         url: "/api/notes/" + noteToDelete,
         method: "DELETE"
      }).then(function() {
         //When done, hide the modal
         bootbox.hideAll();
      });
   }
});
