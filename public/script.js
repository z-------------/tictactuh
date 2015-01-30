var t = {};

t.arrangements = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8],
    
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    
    [0, 4, 8],
    [2, 4, 6]
];

t.init = function(container){
    t.containerElem = container;
    t.boxElems = [];
    
    container.innerHTML = "";
    
    for (var i = 0; i < 3*3; i++) {
        var box = document.createElement("div");
        box.classList.add("ttt-box");
        
        box.style.width = box.style.height = container.clientWidth / 3 + "px";
        box.style.float = "left";
        
        box.addEventListener("click", function(){
            t.fillBox(this);
        });
        
        container.appendChild(box);
        
        t.boxElems.push(box);
    }
    
    t.sessionId = new Date().getTime().toString() + Math.round(Math.random() * 10000).toString();
};

t.enableBoxes = function(dir){
    var action = "removeAttribute";
    if (dir === -1) {
        action = "setAttribute";
    }
    
    t.boxElems.forEach(function(boxElem){
        boxElem[action]("disabled", "true");
    });
};

t.fillBox = function(boxElem, opp){
    if (boxElem && !boxElem.dataset.filled) {
        boxElem.dataset.filled = "true";
        
        if (opp) {
            boxElem.dataset.filledBy = "opp";
            t.enableBoxes();
        } else {
            boxElem.dataset.filledBy = "self";
            var boxElems = t.boxElems.filter(function(boxElem){
                return !boxElem.dataset.filled;
            });

            t.enableBoxes(-1);
            
            socket.emit("fill box", {
                boxI: [].slice.call(t.containerElem.querySelectorAll(".ttt-box")).indexOf(boxElem)
            });
        }

        if (t.boxElems.filter(function(boxElem){return !boxElem.dataset.filled}).length === 0) {
            t.gameOver();
        }
    }
};

t.gameOver = function(msg){
    alert(msg || ";_;");
    t.init(t.containerElem);
};

t.init(document.querySelector(".ttt-container"));

var socket = io.connect(location.host);
socket.on("join-game", function(data){
    console.log(data.gameID);
});

socket.emit("join");

socket.on("fill box", function(data){
    console.log("fill box", data);
    var boxElem = t.boxElems[data.boxI];
    t.fillBox(boxElem, true);
});

socket.on("opp left", function(){
    alert("opponent left the game ;_;");
    location.reload();
});