var apiURL = "https://en.wikipedia.org/w/api.php?callback=?";

$(document).ready(function() {

  $(document).on('click', '#submit-button, .ui-menu-item', function() {
    $('#results-list').empty(); // clear prior search results
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
          $('#results-list').append(
            "<div id='results'><a href='" + resp.fullurl + "' target='_blank'><h3>" + resp.title + "</h3></a><p>" + resp.extract + "</p></div>");
        });
      });
  }); // search

  // trigger submit on use of enter key
  $("#search-field").keyup(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      $("#submit-button").click();
    }
  });

  //Autocomplete
  $("#search-field").autocomplete({
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
  $("#clear-button").click(function() {
    $("#search-field").val("");
    $("#results-list").empty();
  });
});
