var background = document.querySelector("#background"),
	chars = [],
	downTimer = null,
	createTimer = null,
	countRight = 0,
	countAll = 0,
	game = new Game();

background.style.width = `${window.innerWidth}px`;
background.style.height = `${window.innerHeight}px`;

function Game(){
	this.question = function(){
		showtime = Number( prompt( "请输入每产生一个字母所需的时间(秒)(建议0.5秒)" ) ) * 1000;
		downtime = Number( prompt( "请输入每个字母下降单位高度所需的时间(秒)(建议0.1秒)" ) )  * 1000;
		if( !showtime || !downtime ){
			alert("输入错误, 请重新输入!");
			question();
		}
	}
	this.downChar = function(){
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
	this.changeData = function(){
		document.querySelector("#all").innerText = countAll;
		document.querySelector("#count").innerText = countRight;
		document.querySelector("#right").innerText = Math.round( countRight / countAll * 100 ) + "%";
	}
	this.gameOver = function (){
		alert("Game Over, You are faild! 游戏结束, 你输了!");
		clearInterval( createTimer );
		clearInterval( downTimer );
		countAll = 0;
		countRight = 0;
		return;
	}
	this.removeRight = function( findIndex, chars, char ){
		if( findIndex != -1 ){
			countRight ++;
			chars.splice( findIndex, 1 );

			char.ele.style.opacity = '0';
			char.ele.style.transform = 'scale( 0 ) rotate( ' + ( Math.random() > 0.5 ? Math.random() * 360 : -Math.random() * 360 ) + 'deg )';

			setTimeout( () => {
				char.ele.remove();
			}, 3000 );
		}
	}
	this.keyDown = function( e ){
		let key = e.key,
			findIndex = chars.findIndex( item => item.text === key ),
			char = chars[ findIndex ];
		countAll ++;
		game.changeData();
		game.removeRight( findIndex, chars, char );
		if( countAll - countRight >= 75 ) game.gameOver();
	}
}
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
	this.create = function(){
		chars.push( this );
		background.append( this.ele );
	}
}

game.question();

createTimer = setInterval( () => { new Char().create(); }, showtime );
downTimer = setInterval( game.downChar, downtime );

document.addEventListener( "keydown", game.keyDown );