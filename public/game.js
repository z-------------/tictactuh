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
        } else {
            boxElem.dataset.filledBy = "self";
            var boxElems = t.boxElems.filter(function(boxElem){
                return !boxElem.dataset.filled;
            });

            t.enableBoxes(-1);

            var chosenBox = boxElems[Math.round(Math.random() * (boxElems.length - 1))];
            t.fillBox(chosenBox, true);
            t.enableBoxes();
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