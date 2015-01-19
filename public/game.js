var ttt = {};

ttt.init = function(container){
    ttt.containerElem = container;
    ttt.boxElems = [];
    
    container.innerHTML = "";
    
    for (var i = 0; i < 3*3; i++) {
        var box = document.createElement("div");
        box.classList.add("ttt-box");
        
        box.style.width = box.style.height = container.clientWidth / 3 + "px";
        box.style.float = "left";
        
        box.addEventListener("click", function(){
            ttt.fillBox(this);
        });
        
        container.appendChild(box);
        
        ttt.boxElems.push(box);
    }
};

ttt.fillBox = function(boxElem, opp){
    boxElem.dataset.filled = "true";
    if (opp) {
        boxElem.dataset.filledBy = "opp";
    } else {
        boxElem.dataset.filledBy = "self";
        var boxElems = ttt.boxElems.filter(function(boxElem){
            return !boxElem.dataset.filled;
        });

        var chosenBox = boxElems[Math.round(Math.random() * (boxElems.length - 1))];
        setTimeout(function(){
            ttt.fillBox(chosenBox, true);
        }, 500);
    }
    
    if (ttt.boxElems.filter(function(boxElem){return !boxElem.dataset.filled}).length === 0) {
        ttt.gameOver();
    }
};

ttt.gameOver = function(){
    alert("gaemover ;_;");
    ttt.init(ttt.containerElem);
};