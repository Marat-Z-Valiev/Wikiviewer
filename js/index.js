const apiURL = "https://en.wikipedia.org/w/api.php?callback=?";
const resultsList = $('#results-list');
const submitButton = $('#submit-button');
const searchField = $('#search-field');
const clearButton = $('#clear-button');

$(function() {

  $(document).on('click', '#submit-button, .ui-menu-item', function() {
    resultsList.empty(); // clear prior search results
    $.getJSON(apiURL, {
        action: 'query',
        format: 'json',
        inprop: "url",
        formatversion: 2,
        generator: 'search',
        gsrsearch: $('#search-field').val(),
        gsrwhat: "text",
        prop: 'extracts|info',
        exsentences: 3,
        exintro: "",
        explaintext: "",
        exlimit: 20,
      })
      .success(function(response) {
        console.log(response);
        response.query.pages.forEach(function(resp) {
          resultsList.append(`<div id="results"><a href="${resp.fullurl}" target="_blank"><h2>${resp.title}</h2></a><p>${resp.extract}</p></div>`);
        });
      });
  }); // search

  // trigger submit on use of enter key
  searchField.keyup(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      submitButton.click();
    }
  });

  //Autocomplete
  searchField.autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        dataType: "jsonp",
        data: {
          'action': "opensearch",
          'format': "json",
          'search': request.term
        },
        success: function(data) {
          response(data[1]);
        }
      });
    }
  });

  //Clear text in the search field and search results
  clearButton.click(function() {
    searchField.val("");
    resultsList.empty();
  });
});
