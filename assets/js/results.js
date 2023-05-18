var randomBtn = $('#random-btn');
var customizeBtn = $('#generate-customized');
var generateImgBtn = $('#generate-image');
var generateQuoteBtn = $('#generate-quote');
var changeFontBtn = $('#change-font');
var changePositionBtn = $('#change-position')
var changeBorderBtn = $('#change-border-color')
var changeFontColorBtn = $('#change-font-color')
var resultsHTML = './results.html'
var fullQuote = $(".full-quote");
var fullAuthor = $(".full-author");
var quoteEl = $('#quote');
var authorEl = $('#author');
var bodyEl = $('body');
var imageEL = $('#image');
var divEl = $('#img-container');
var downloadBtn = $('#download-btn');

/* Initializes Materialize Forms */
$(document).ready(function() {
    $('select').formSelect();
 });


/* Modal event listener */
document.addEventListener("DOMContentLoaded", function() {
    var modal = document.querySelectorAll(".modal")
    M.Modal.init(modal)
    });

    
/* Collapisble accordion listerner */
$(document).ready(function(){
    $('.collapsible').collapsible();
  });

/* Generate quote either randomly or with category based on dropdown input */

/* Quote generation function */
var getQuote = function(theme) {
    
    var categories = {
        inspirational: 'inspirational', 
        courage: 'courage',
        empathy: 'empathy',
        friendship: 'friendship', 
        imagination: 'imagination', 
        happiness: 'happiness', 
        knowledge: 'knowledge'
    };
    
    var category;
    
    if (theme && categories.hasOwnProperty(theme)) {
        category = categories[theme];
    } else {
        var categoryKeys = Object.keys(categories);
        var randomIndex = Math.floor(Math.random() * categoryKeys.length);
        category = categories[categoryKeys[randomIndex]];
    }

    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/quotes?category=' + category,
        headers: { 'X-Api-Key': 'v0tccXcwsiP+3vSXv3/lOg==q1GzyzemvaKPl4ad'},
        contentType: 'application/json',
    }).then(function(result) {
            localStorage.setItem('Quote', result[0].quote)
            fullQuote.html(result[0].quote);
            quoteEl.append(fullQuote);
            localStorage.setItem('Author', result[0].author)
            fullAuthor.html(result[0].author);
            authorEl.append(fullAuthor);
        },  
    );
}

/* Function which appends a different font-family to the .full-quote and .full-author classes based on dropdown value */

/* Displays quote and image saved in local storage */
if(localStorage.getItem('Quote') != null){
    fullQuote.html(localStorage.getItem('Quote'));
    quoteEl.append(fullQuote);
    fullAuthor.html(localStorage.getItem('Author'));
    authorEl.append(fullAuthor);

    var font = localStorage.getItem('font-family')
    var posterImage = localStorage.getItem('posterImage');
    $(".poster").css("background-image", `url(${posterImage})`);
    $(".full-quote").css("font-family", font)
    $(".full-author").css("font-family", font)
} else {
    chooseFont();
    getQuote();
    makeImg();
}


/* Event listener for Generate button */
randomBtn.click(function() {
    localStorage.removeItem('Quote');
    localStorage.removeItem('Author');
    localStorage.removeItem('posterImage');
    localStorage.removeItem('font-family');
    chooseFont();
    getQuote();
    makeImg(animal);
    clearPoster();

    var fullQuote = $(".full-quote").html(localStorage.getItem('Quote'));
    quoteEl.append(fullQuote);
    var fullAuthor = $(".full-author").html(localStorage.getItem('Author'));
    authorEl.append(fullAuthor);
    
    var posterImage = localStorage.getItem('posterImage');
    $(".poster").css("background-image", `url(${posterImage})`);

    $("#quote-container").css('align-items', 'center')
    $("#quote-container").css('text-align', 'center')
    fullAuthor.css("color", '#ffffff')
    fullQuote.css("color", '#ffffff')
    $('#poster-container').css("border-color", "#000000")
})

/* Removes previous image and quote from poster div */
function clearPoster() {
    fullQuote.html("");
    fullAuthor.html("");
}

/* Downloads poster as jpg */
downloadBtn.click(function(){
    console.log("hrllo");
    domtoimage.toBlob(document.getElementById("poster-container")).then(function(blob) {
        window.saveAs(blob, "motivated.jpg")
    })
})

/* Function that selects a single api to pull an image from or selects from a random one */
function makeImg(animal) {
    var backgroundImg = {
        dogs: "http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true",
        birds: "https://shibe.online/api/birds?count=1&urls=true&httpsUrls=true",
        cats: "https://shibe.online/api/cats?count=1&urls=true&httpsUrls=true",
    };

    var generateImg;
    if (animal && backgroundImg[animal]) {
        generateImg = backgroundImg[animal];
    } else {
        var cuteImgs = Object.keys(backgroundImg);
        var randomIndex = Math.floor(Math.random() * cuteImgs.length);
        var randomImg = cuteImgs[randomIndex];
        generateImg = backgroundImg[randomImg];
    }

    fetch(generateImg)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data[0]);
        localStorage.setItem('posterImage', data[0]);
        $(".poster").css("background-image", `url(${data[0]})`);
    });
}

function chooseFont(){
    // var fontArray = ["Roboto", "Poppins", "Dancing Script", "Indie Flower", "Soace Mono"]
    // var index = Math.floor(Math.random() * fontArray.length)
    // var font = fontArray[index]
    console.log($('#font'))
    var fontInput = $("#font option:selected").val();
    var allFonts = $('#font');

    var fontArray = [];
    for (var i = 0; i < allFonts.children('#font-style').length; i++){
        fontArray[i] = allFonts.children('#font-style')[i].value;
    }

    if(fontInput == '' || localStorage.getItem('font-family') == 'null'){
        var index = Math.floor(Math.random() * fontArray.length)
        fontInput = fontArray[index]
    }
    console.log(fontArray)
    console.log(fontInput)

    localStorage.setItem("font-family", fontInput)
    $(".full-quote").css("font-family", fontInput)
    $(".full-author").css("font-family", fontInput)
}
/* Listener for generate button on the customizable modal to pass values to each function  */
customizeBtn.click(function() {
    localStorage.removeItem('Quote');
    localStorage.removeItem('Author');
    localStorage.removeItem('posterImage');
    var animal = $("#animal").val();
    var theme = $("#theme").val();
    var font = $("#font").val();
    localStorage.setItem('font-family', font);
    console.log(animal);
    console.log(theme);
    console.log(font);
    chooseFont();
    makeImg(animal);
    getQuote(theme);
    changeBorderColor()
    changeQuotePosition()
    changeFontColor()
});

generateImgBtn.click(function() {
    localStorage.removeItem('posterImage');
    var animal = $("#animal").val();
    makeImg(animal);
});

generateQuoteBtn.click(function() {
    localStorage.removeItem('Quote');
    localStorage.removeItem('Author');
    var theme = $("#theme").val();
    getQuote(theme);
});

changeFontBtn.click(function() {
    var font = $("#font").val();
    chooseFont(font);
    console.log(font);
})

changePositionBtn.click(function() {
    changeQuotePosition()
})

function changeQuotePosition() {
    var quoteFlex = $("#position").val();
    $("#quote-container").css('align-items', quoteFlex)
    if (quoteFlex === "flex-start") {
        $("#quote-container").css('text-align', 'left')
    } else if (quoteFlex === "center") {
        $("#quote-container").css('text-align', 'center')
    } else {
        $("#quote-container").css('text-align', 'right')
    }     
    console.log(quoteFlex);
}

changeBorderBtn.click(function() {
    changeBorderColor()
})

function changeBorderColor() {
    var borderColor = $("#border-color").val();
    $('#quote-container').css("border-color", borderColor)
    console.log(borderColor);
    }

changeFontColorBtn.click(function() {
    changeFontColor()
})

function changeFontColor() {
    var fontColor = $("#font-color").val();
    $('.full-author').css("color", fontColor)
    $('.full-quote').css("color", fontColor)
    console.log(fontColor);
    }