let minCanvas = document.getElementById("minCanvas");
let ctx = minCanvas.getContext("2d");
let theGameIsOn = true;
let hdnPoeng = document.getElementById("hdnPoeng");
let hdnRekord = document.getElementById("hdnRekord");
let poeng = 0;
if(localStorage.rekord === undefined){
        localStorage.rekord = 0;
    }
    hdnRekord.innerHTML = "Rekord:" + localStorage.rekord;

let bane = {
    bredde: minCanvas.clientWidth,
    hoyde: minCanvas.clientHeight,
    gressfarge: "Black",
    linjefarge: "White",
    linjetykkelse: 4
};

const tegnBane = () => {
    ctx.fillStyle = bane.gressfarge;
    ctx.fillRect(0,0, bane.bredde, bane.hoyde);
    ctx.fillStyle = bane.linjefarge;
    ctx.fillRect(bane.bredde / 2 - bane.linjetykkelse / 2,0, bane.linjetykkelse, bane.hoyde);
}
let ball = {
    radius: 7,
    xpos: 100,
    ypos: 100,
    farge: "red",
    xretning: -1,
    yretning: 1,
    xfart: 4,
    yfart:4
};
const tegnBall = () => {
    ctx.beginPath();
    ctx.arc(ball.xpos, ball.ypos, ball.radius,0, Math.PI*2);
    ctx.closePath();
    ctx.fillStyle = ball.farge;
    ctx.fill();
    ball.xpos = ball.xpos + ball.xfart * ball.xretning;
    ball.ypos = ball.ypos + ball.yfart * ball.yretning;
}
let racket = {
    "bredde": 10,
    "hoyde": 50,
    "farge": "White",
    "xpos": bane.bredde - 15,
    "ypos": bane.hoyde / 2,
    "yretning": 0,
    "yfart": 5
};

let motspiller = {
    "bredde": 10,
    "hoyde": 50,
    "farge": "White",
    "xpos": 15,
    "ypos": ball.ypos
}

const tegnRacket = () => {
    ctx.fillStyle = racket.farge;
    ctx.fillRect(racket.xpos, racket.ypos, racket.bredde, racket.hoyde);
    if (racket.ypos <= 0 && racket.yretning === -1){
        return;
    }
    if(racket.ypos + racket.hoyde >= bane.hoyde && racket.yretning === 1){
        return;
    }
    racket.ypos = racket.ypos + racket.yfart * racket.yretning;
}

const tegnMotspiller = () => {
    ctx.fillStyle = motspiller.farge;
    ctx.fillRect(motspiller.xpos, ball.ypos - motspiller.hoyde / 2, motspiller.bredde, motspiller.hoyde);
}

const sjekkOmBallTrefferVegg = () => {
    if(ball.xpos <= ball.radius + motspiller.xpos + motspiller.bredde){
        ball.xretning = 1;
    }
    if(ball.ypos + ball.radius >= bane.hoyde){
        ball.yretning = -1;
    }
    if(ball.ypos <= ball.radius){
        ball.yretning = 1;
    }
}
    
    const sjekkOmBallTrefferRacket = () => {
        let ballenErTilVenstre = ball.xpos + ball.radius < racket.xpos;
        let ballenErTilHoyre = ball.xpos - ball.radius > racket.xpos + racket.bredde;
        let ballenErOver = ball.ypos + ball.radius < racket.ypos;
        let ballenErUnder = ball.ypos - ball.radius > racket.ypos + racket.hoyde;
        if(!ballenErTilVenstre &&!ballenErTilHoyre&&!ballenErOver&&!ballenErUnder){
        ball.xretning = -1;
        poeng = poeng + 1;
        hdnPoeng.innerHTML ="Poeng:" + poeng;
        if(poeng > localStorage.rekord){
            localStorage.rekord = poeng;
            hdnRekord.innerHTML = "Ny rekord:" + poeng; 
            hdnRekord.style.color = "White";
        }
    }
}

const sjekkOmBallErUtenforBanen = () => {
    if(ball.x > bane.bredde + ball.radius * 2){
        theGameIsOn = false;
    }
}

const gameLoop = () => {
    tegnBane();
    tegnBall();
    tegnRacket();
    tegnMotspiller();
    sjekkOmBallTrefferVegg();
    sjekkOmBallTrefferRacket();
    sjekkOmBallErUtenforBanen();
    if (theGameIsOn){
        requestAnimationFrame(gameLoop);
    }
}
gameLoop();

document.onkeydown = function(evt){
    let tastekode = evt.keyCode;
    if(tastekode === 38){
        racket.yretning = -1;
    }
    if(tastekode === 40){
        racket.yretning = 1;
    }
}

document.onkeyup = function (evt){
    let tastekode = evt.keyCode;
    if(tastekode === 38 && racket.yretning === -1){
        racket.yretning = 0;}
    if(tastekode === 40 && racket.yretning === 1){
        racket.yretning = 0;}

}

