var background = document.querySelector("#background"),
	chars = [],
	downTimer = null,
	createTimer = null,
	countRight = 0,
	countAll = 0;

background.style.width = `${window.innerWidth}px`;
background.style.height = `${window.innerHeight}px`;

question();

function Char(){
	this.x = Math.floor( Math.random() * background.clientWidth - background.clientWidth / 20 );
	this.x = this.x === 0 ? 10 : this.x;
	this.y = 0;
	this.w = background.clientWidth / 20;
	this.h = this.w;
	this.text = String.fromCharCode( Math.floor( 97 + Math.random() * 26 ) );
	this.ele = document.createElement("span");
	this.ele.innerText = this.text;
	this.ele.classList.add("char");
	this.ele.style.left = `${this.x}px`;

	chars.push( this );
	background.append( this.ele );
}

function question(){
	showtime = Number( prompt( "请输入每产生一个字母所需的时间(秒)" ) ) * 1000;
	downtime = Number( prompt( "请输入每个字母下降单位高度所需的时间(秒)" ) )  * 1000;
	if( !showtime || !downtime ){
		alert("输入错误, 请重新输入!");
		question();
	}
}

function GameOver(){
	alert("Game Over, You are faild! 游戏结束, 你输了!");
	clearInterval( createTimer );
	clearInterval( downTimer );
	for( let item of background.childNodes ) item.remove();

	document.querySelector("#all").innerText = 0;
	document.querySelector("#count").innerText = 0;
	document.querySelector("#right").innerText = "0%";

	document.body.append( button = document.createElement("button") );
	button.innerText = "Start Game";
	button.style.cssText = "width: 500px; height: 300px; background-color: #FFF; position: absolute; left: 50%; top: 50%; transform: translate( -50%, -50% ); color: #69C; font: italic normal bold 50px Consolas; text-align: center; line-height: 300px; z-index: 100; border: 0; border-radius: 10px; transition: all .1s linear 0s; cursor: pointer;";
	button.onmouseover = function(){
		this.style.backgroundColor = '#69C';
		this.style.border = '3px solid #FFF';
		this.style.color = '#FFF';
	}
	button.onmouseout = function(){
		this.style.backgroundColor = '#FFF';
		this.style.color = '#69C';
	}
	button.onclick = function(){
		this.remove();
		countRight = 0;
		countAll = 0;
		question();
		createTimer = setInterval( createChar, showtime );
		downTimer = setInterval( () => {
			downChar();
		}, downtime );
	}
}

function createChar(){
	new Char();
}

function downChar(){
	for( let item of chars ){
		item.y += 10;
		item.ele.style.top = `${item.y}px`;
		let elItem = chars.find( item => item.top > background.clientHeight )
		if( elItem ){
			elItem.ele.remove();
			chars.shift();
		}
	}
}

createTimer = setInterval( createChar, showtime );

downTimer = setInterval( () => {
	downChar();
}, downtime );

document.addEventListener( "keydown", ( e ) => {
	let key = e.key,
		findIndex = chars.findIndex( item => item.text === key ),
		char = chars[ findIndex ];
	countAll ++;

	if( findIndex != -1 ){
		countRight ++;
		chars.splice( findIndex, 1 );

		char.ele.style.opacity = '0';
		char.ele.style.transform = 'scale( 0 ) rotate( ' + ( Math.random() > 0.5 ? Math.random() * 360 : -Math.random() * 360 ) + 'deg )';

		setTimeout( () => {
			char.ele.remove();
		}, 3000 );
	}

	document.querySelector("#all").innerText = countAll;
	document.querySelector("#count").innerText = countRight;
	document.querySelector("#right").innerText = Math.round( countRight / countAll * 100 ) + "%";

	if( countRight / countAll < 0.1 ) GameOver();
	if( countAll - countRight >= 75 ) GameOver();
} );