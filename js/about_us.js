
var icon = document.getElementById("mission_title");


var div = document.createElement("div");
div.style.width = "200px";
div.style.height = "50px";
div.innerText = "txt";
div.style.backgroundColor = "pink";


div.style.display = "none";


div.style.position = "absolute"; 


document.body.append(div);

icon.addEventListener("mouseenter", function() {
    
    var rect = icon.getBoundingClientRect();
    div.style.left = rect.right + "px"; 
    div.style.top = rect.top + "px"; 

    div.style.display = "block";
});

icon.addEventListener("mouseleave", function() {
    div.style.display = "none";
});
