document.addEventListener('DOMContentLoaded', function(){
    let colorList = [];
    let wait = true;
    let prevColor = '';
    let prevBox = '';
    let boxes ='';
    let twinCnt = 0;
    const myDiv = document.querySelector('div');
    const score = document.querySelector('#score');
    const newGame = document.querySelector('#newGame');
    let correctCount = 0;

    // New Game
    newGame.addEventListener('click', function(e){
        e.preventDefault();
        twinCnt=0;
        correctCount=0;
        score.innerText=0;
        wait=true;
        boxes = document.querySelectorAll('.box');
        for (let box of boxes){
            box.remove();
        }
        let noTwin = document.querySelector('#noTwin');
        twinCnt = noTwin.value;
        colorList = [];
        generateColors(twinCnt);

        // Randomize the order of colors
        for (let i=0; i<colorList.length; i++){
            j = Math.floor(Math.random() * colorList.length);
            let temp = colorList[j];
            colorList[j] = colorList[i];
            colorList[i] = temp;
        }
        
        // Diplsy the cards on the screen
        generateHTML(colorList);

        // add eventlistener to each card for 'click'
        boxes = document.querySelectorAll('.box');
        for (let box of boxes){
            box.addEventListener('click', handleClick);
        }

    })

    // Generate colors
    function generateColors(colorCnt){
        for (let i = 0; i < colorCnt ; i++){
        let red = Math.floor(Math.random() * 256);
        let green = Math.floor(Math.random() * 256);
        let blue = Math.floor(Math.random() * 256);
        
        colorList.push(`rgb(${red}, ${green}, ${blue})`);
        colorList.push(`rgb(${red}, ${green}, ${blue})`);
        }
    }

    // Generate HTML
    function generateHTML(myColorList){
           for (let ndx = 1; ndx <= myColorList.length; ndx ++){
            let mySection = document.createElement('section');
            mySection.innerText = ndx;
            mySection.className = 'box';
            mySection.id = `cb${ndx}`;
            mySection.dataset.color = myColorList[ndx-1];
            myDiv.appendChild(mySection);
        }
    }

    // with each click on a card check the following
    // 1- is it the first card turned?
    // 2- if it is the second card, are the colors same?
    // if color are same keep them face up, if not turn them back
    function handleClick(e){
        if (correctCount < twinCnt){
            let myBox = e.target;
            if (myBox.id === prevBox.id) return;
            if (myBox.classList.contains('done')) return;
            myBox.style.backgroundColor = myBox.dataset.color;
            // wait = false means it is the second card and execute controls
            // also updates the local storage if it is the last 2 cards and it is the best score
            if (wait === false){
                score.innerText++;
                if (prevBox.dataset.color === myBox.dataset.color){
                    myBox.classList.add('done');
                    prevBox.classList.add('done');
                    correctCount++;
                    prevColor = '';
                    prevBox= '';
                    if (correctCount === parseInt(twinCnt)){
                        let best = localStorage.getItem(`best${twinCnt}`);
                        if (best === null){
                            localStorage.setItem(`best${twinCnt}`,score.innerText);
                            alert ('CONGRATS - BEST SCORE');
                        } else{
                            if (parseInt(best)>score.innerText){
                                localStorage.setItem(`best${twinCnt}`,score.innerText);
                                alert ('CONGRATS - BEST SCORE');
                            }  
                        }
                    }
                 } else {
                    let temp = prevBox;
                    prevColor = '';
                    prevBox= '';
                    setTimeout (function(){
                        myBox.style.backgroundColor = 'grey';
                        temp.style.backgroundColor = 'grey';
                    },1000);
            }
                wait = true;
            } else {
                prevColor = myBox.dataset.color;
                prevBox= myBox;
                wait = false;
            }

    }
}
})