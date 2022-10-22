// SELECTORS

let $start = document.querySelector("#start");
let $length = document.querySelector("#length");
let $game = document.querySelector("#game");
let $result = document.querySelector("#result");
let $win_player = document.querySelector("#win_player");
let $select = document.querySelector("#select");
let $reset = document.querySelector("#reset");
let $property = document.querySelector(".properties")



let humanPlayer = "X";
let compPlayer = "O";
let playerInTurn= humanPlayer;

let arr = [];
let oneLeft= [];
let directions = 
                [
                    [[-1,-1], [1,1]],
                    [[-1,0], [1,0]],
                    [[0,-1], [0,1]],
                    [[-1,1], [1,-1]],
                ];



// EVENTS


$select.addEventListener("change", setThePlayer);
$start.addEventListener("click", createBoard);
$game.addEventListener("click", humanStep);
$reset.addEventListener("click", resetBoard);



// FUNCTIONS



function resetBoard() {
    getInitial();
    $result.innerText = "";
}


function setThePlayer() {
    humanPlayer = this.value;
    if (humanPlayer == "X") {
        compPlayer = "O";
        playerInTurn = humanPlayer;

    }
    else {
        compPlayer = "X"; 
        playerInTurn = compPlayer;

    } 
    
}


function createBoard(){
    if($length.value>8) return false;
    hide($win_player);
    hide($start);
    hide($property)
    $reset.classList.remove("hide");


    let table = document.createElement("table");
    table.classList.add("table");

    for (let i=0; i<$length.value; i++){
        let tr = document.createElement("tr");
        arr[i] = [];
        for (let j=0; j<$length.value; j++){
            let td = document.createElement("td");
            td.setAttribute("data-col", j);
            td.setAttribute("data-row", i);
            td.style.width =td.style.height = 100/$length.value + "%";
            tr.appendChild(td);
            arr[i][j] = [];
        }
        table.append(tr);
    }
    $game.appendChild(table);

    if (playerInTurn == compPlayer) {
        computerStep(compPlayer);
    }
}


function humanStep(ev){
    if(ev.target.tagName=="TD" && playerInTurn==humanPlayer) {
        if(!ev.target.textContent) {
            ev.target.textContent = arr[ev.target.dataset.row][ev.target.dataset.col] = humanPlayer;
            ev.target.style.color = "#044a05";
            ev.target.style.fontSize = "400%";
            let cell_x = +ev.target.dataset.row;
            let cell_y = +ev.target.dataset.col;
            if (checkFinished(cell_x, cell_y)){
                setTimeout(function() {
                    getInitial();  
                },2000)
                
            }
            else {
                playerInTurn = compPlayer;
                computerStep(playerInTurn, cell_x, cell_y);

            }        
    
        }
    }
}


function computerStep(compPlayer, human_cell_x, human_cell_y) { 
    let stepDone = false;
    let computer_cell_x = null;
    let computer_cell_y = null;


    // ONE LEFT TO WIN

    for (let i=0; i<arr.length; i++) {
        for (let j=0; j<arr.length; j++) {
            if(!stepDone) {
                let oneLeft = getOneWinDirection(compPlayer, i, j);
                if(oneLeft) {
                    for (let point of oneLeft) {
                        let i = point[0], j = point[1];
                        if (inBoard(i,j) && (arr[i][j]!="X" && arr[i][j]!="O")) {
                            computer_cell_x = i;
                            stepDone = true;
                            computer_cell_y = j;
                            break ;                        

                        }     
                    }
                    if (stepDone) break;
                }

            }
            
            }
            if (stepDone) break;

        }
    
  
    // PREVENT HUMAN FROM WINNING


    if(!stepDone) {
        let oneLeft = preventWinDirection(humanPlayer, human_cell_x, human_cell_y);  
        if(oneLeft) {
            console.log(oneLeft);
            for (let point of oneLeft) {
                let i = point[0], j = point[1];
                if (inBoard(i,j) && (arr[i][j]!="X" && arr[i][j]!="O")) {
                    computer_cell_x = i;
                    computer_cell_y = j;
                    stepDone = true;
                    break;
                }
            }
        } 
    }
          
    // IF EMPTY OR MY PLAYERS
    if(!stepDone) {
        for (let i=0; i<arr.length; i++) {
            for (let j=0; j<arr.length; j++) {
                    let oneLeft = getEmptyDirection(compPlayer, i, j);
                    if(oneLeft) {
                        for (let point of oneLeft) {
                            let i = point[0], j = point[1];
                            if (inBoard(i,j) && (arr[i][j]!="X" && arr[i][j]!="O")) {
                                computer_cell_x = i;
                                computer_cell_y = j;
                                stepDone = true;
                                 break;                        
    
                            }     
                        }
                         if (stepDone) break;
    
                }
                
            }
            if (stepDone) break;
        }
    }


    // RANDOM CASE

    if(!stepDone) {
        let obj = {};
        let count = 0;
        for (let i=0; i<arr.length; i++) {
            for (let j=0; j<arr.length; j++) {
                if(arr[i][j]!=="X" && arr[i][j]!=="O") {
                    count++;
                    obj[count] = [i, j];

                }
            }
        }
        [computer_cell_x, computer_cell_y] = obj[randomNumber(1, count+1)];
        stepDone = true
    }
  
   


    
    arr[computer_cell_x][computer_cell_y] = compPlayer;

    let td = document.querySelectorAll('td[data-row="' + computer_cell_x +'"]')[computer_cell_y];
    setTimeout(function() {
        td.innerText = compPlayer;
        playerInTurn = humanPlayer;
      
    },1000) 

    if(checkFinished(computer_cell_x, computer_cell_y)){

        setTimeout(function(){
            getInitial(); 
        },2000)
       

    };

     
}


function getEmptyDirection(player, cell_x, cell_y) {
    let emptyArr = [];
    let finalArr = [];
    let maxCountComputer = 0;

    
    
    for (let subdir of directions) {
        let countComputer = 0;
        let countEmpty = 0;
        emptyArr.push([cell_x, cell_y]);


        if (arr[cell_x][cell_y]==player) countComputer++;
        if (arr[cell_x][cell_y]!="X" && arr[cell_x][cell_y]!="O") countEmpty++;       

        for (let dir of subdir) {
            let i = dir[0];
            let j = dir[1];
            let cursor_x = cell_x;
            let cursor_y = cell_y;
            
                
            while(inBoard(cursor_x +i, cursor_y + j)) {  
            
                cursor_x += i;
                cursor_y += j;  
                emptyArr.push([cursor_x, cursor_y]);    
               
                if(arr[cursor_x] ) {
                    if (arr[cursor_x][cursor_y]==player) {
                        countComputer++;
                    } else if(arr[cursor_x][cursor_y]!="X" &&  arr[cursor_x][cursor_y]!="O") {
                        countEmpty++;
                    }
                }  

           }
            
        } 
        // if(emptyArr.length==arr.length){return emptyArr};
        if ((countComputer + countEmpty)==arr.length &&  
                                countComputer>=maxCountComputer && emptyArr.length==arr.length) {
            finalArr = [...emptyArr];
            maxCountComputer = countComputer;
            emptyArr = [];
        } else {
            emptyArr = [];
        }
        
    }

    if (finalArr.length!=0) return finalArr;
    return false;
   
}


function getOneWinDirection(player, cell_x, cell_y) {
    let oneLeft = [];
    for (let subdir of directions) {
        let count = 0;
        for (let dir of subdir) {
            let i = dir[0];
            let j = dir[1];
            let cursor_x = cell_x;
            let cursor_y = cell_y;
            oneLeft.push([cursor_x, cursor_y]);
          
            while(inBoard(cursor_x, cursor_y)) {  
            
                cursor_x += i;
                cursor_y += j;  
                oneLeft.push([cursor_x, cursor_y]);

               
                if(arr[cursor_x] && arr[cursor_x][cursor_y]==player) {
                    count++;                               
                }
           }
            
        }
             
        if ((count + 1)==arr.length) {
            return oneLeft;
        } else {
            oneLeft = [];
        }
        
    }
    return false;
    
}


function preventWinDirection(player, cell_x, cell_y) {
    let oneLeft = [];
    for (let subdir of directions) {
        let count = 1;
        let countEmpty = 0;
        oneLeft.push([cell_x, cell_y])
        for (let dir of subdir) {
            let i = dir[0];
            let j = dir[1];
            let cursor_x = cell_x;
            let cursor_y = cell_y;
            
          
            while(inBoard(cursor_x+i, cursor_y+j)) {  
            
                cursor_x += i;
                cursor_y += j;  
                oneLeft.push([cursor_x, cursor_y]);

               
                if(arr[cursor_x] && arr[cursor_x][cursor_y]==player) {
                    count++;                               
                }
                if(arr[cursor_x][cursor_y]!=="X" && arr[cursor_x][cursor_y]!=="O") {
                    countEmpty++;                               
                }
           }
            
        }
             
        if ((count + 1)==arr.length && countEmpty==1) {
            return oneLeft;
        } else {
            oneLeft = [];
        }
        
    }
    return false;
    
}



function checkWon(playerInTurn, cell_x, cell_y){
    for (let subdir of directions) {
        let count = 1;
        for (let dir of subdir) {
            let i = dir[0];
            let j = dir[1];
            let cursor_x = cell_x;
            let cursor_y = cell_y;
          
            while(inBoard(cursor_x, cursor_y)) {  
                cursor_x += i;
                cursor_y += j;  
                if(arr[cursor_x] && arr[cursor_x][cursor_y]==playerInTurn) {
                    count++;        
                }
            }
        }
        if (count==arr.length) {
            console.log(arr);
            return true;     
        }
    }
    return false;
}



function checkAllFilled(){
    return arr.every(subarr=>{
        return subarr.every(elem=>{
            return elem!="";
        })
    });
}

function getInitial(){

    humanPlayer = "X";
    compPlayer = "O";
    playerInTurn= humanPlayer;
    

    game_finished = false;
    arr = [];
    oneLeft = []; 
    value_i = value_j =null;
    let board = document.querySelector(".table");
    board.remove();

 
    show($win_player);
    show($start);
    show($property);

    $select.value = "X";
    $reset.classList.add("hide");
}


function checkFinished(cell_x, cell_y) {
    if(checkWon(playerInTurn, cell_x, cell_y)) {
        if (playerInTurn == humanPlayer) {
            $result.innerText = "YOU WON!!";
        } else {
            $result.innerText = "SORRY YOU LOST";
        }   
        return true;
    } else if (checkAllFilled()){
        $result.innerText = "NO PLAYER WON";
        return true;
    }
    return false;
   
}

function show(el){
    el.classList.remove("hide");
}

function hide(el){
    el.classList.add("hide");
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}


function inBoard(cell_x, cell_y){
    return (cell_x>=0 && cell_x<arr.length && cell_y>=0 && cell_y<arr.length)
}


