webpackJsonp([1],{"0sCH":function(n,e,t){var r=t("RDIi");"string"==typeof r&&(r=[[n.i,r,""]]),r.locals&&(n.exports=r.locals);t("rjj0")("3638e4a2",r,!0)},F4NQ:function(n,e,t){var r=t("aj3X");"string"==typeof r&&(r=[[n.i,r,""]]),r.locals&&(n.exports=r.locals);t("rjj0")("5d394fd2",r,!0)},NHnr:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=t("7+uW"),a=t("gRE1"),i=t.n(a),o=new r.a,s={render:function(){var n=this.$createElement,e=this._self._c||n;return"x"===this.symbol?e("svg",{staticClass:"player-symbol player-x",attrs:{viewBox:"0 0 32 32",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"}},[e("g",{staticClass:"path",attrs:{stroke:"none","stroke-width":"1",fill:"#000000","fill-rule":"evenodd"}},[e("path",{attrs:{d:"M20,12 L28,12 C30.209139,12 32,13.790861 32,16 C32,18.209139 30.209139,20 28,20 L20,20 L20,28 C20,30.209139 18.209139,32 16,32 C13.790861,32 12,30.209139 12,28 L12,20 L4,20 C1.790861,20 0,18.209139 0,16 C0,13.790861 1.790861,12 4,12 L12,12 L12,4 C12,1.790861 13.790861,4.05812251e-16 16,0 C18.209139,-4.05812251e-16 20,1.790861 20,4 L20,12 Z",id:"Combined-Shape",transform:"translate(16.000000, 16.000000) rotate(-315.000000) translate(-16.000000, -16.000000) "}})])]):"o"===this.symbol?e("svg",{staticClass:"player-symbol player-o",attrs:{viewBox:"0 0 32 32",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"}},[e("g",{attrs:{id:"Symbols",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"}},[e("g",{attrs:{id:"shape/o",stroke:"#46FFCB","stroke-width":"8"}},[e("circle",{attrs:{id:"Oval",cx:"16",cy:"16",r:"12"}})])])]):this._e()},staticRenderFns:[]};var l=t("VU/8")({name:"PlayerSymbol",props:["symbol"]},s,!1,function(n){t("F4NQ")},"data-v-28cb6110",null).exports,d={name:"PlayerInfo",props:["player"],components:{PlayerSymbol:l}},c={render:function(){var n=this.$createElement,e=this._self._c||n;return e("div",{staticClass:"player-info",class:{active:this.player.turn,winner:this.player.hasWon}},[e("span",{staticClass:"player"},[e("PlayerSymbol",{attrs:{symbol:this.player.key}})],1)])},staticRenderFns:[]};var p=t("VU/8")(d,c,!1,function(n){t("avx9")},"data-v-ad776854",null).exports,h={name:"Cell",props:["parent-index","parent-board","index","move"],components:{PlayerSymbol:l},methods:{onClick:function(){!this.move&&this.parentBoard.active&&o.$emit("cell-click",this.parentIndex,this.index)}}},x={render:function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"cell",class:{clickable:!n.move&&n.parentBoard.active,winner:n.parentBoard.winner,"x-winner":n.parentBoard.winner&&"x"===n.parentBoard.winner.key,"o-winner":n.parentBoard.winner&&"o"===n.parentBoard.winner.key},on:{click:function(e){n.onClick()}}},[n.move?t("PlayerSymbol",{staticClass:"is-game-piece",attrs:{symbol:n.move.player.key}}):n._e()],1)},staticRenderFns:[]};var b={name:"InnerBoard",props:["index","board"],components:{Cell:t("VU/8")(h,x,!1,function(n){t("0sCH")},"data-v-4135552f",null).exports},methods:{onClick:function(){o.$emit("innerboard-click",this.index)}}},f={render:function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"inner-board",class:{active:n.board.active},on:{click:function(e){n.onClick()}}},n._l(n.board.cells,function(e,r){return t("Cell",{key:r,attrs:{"parent-index":n.index,"parent-board":n.board,index:r,move:e}})}))},staticRenderFns:[]};var u={name:"GameBoard",props:["players","currentPlayer","board"],components:{InnerBoard:t("VU/8")(b,f,!1,function(n){t("mmXy")},"data-v-42a28354",null).exports}},m={render:function(){var n=this.$createElement,e=this._self._c||n;return e("div",{staticClass:"gameboard"},[e("div",{staticClass:"gameboard-content"},this._l(this.board,function(n,t){return e("InnerBoard",{key:t,attrs:{index:t,board:n}})}))])},staticRenderFns:[]};var y={name:"app",components:{PlayerInfo:p,GameBoard:t("VU/8")(u,m,!1,function(n){t("sEDB")},"data-v-708f51d2",null).exports},data:function(){for(var n=[{index:0,key:"x",turn:!0,hasWon:!1},{index:1,key:"o",turn:!1,hasWon:!1}],e=[],t=0;t<9;t+=1)e.push({active:!0,cells:new Array(9).fill(null),lastMove:null,winner:null,numUsedCells:0,isFilled:!1});return{boardSize:3,gameBoard:e,players:n,totalPlayers:n.length,isStart:!0,gameOver:!1,winner:null,opponentPicksInnerBoard:!1}},computed:{currentPlayer:function(){return this.players.find(function(n){return!0===n.turn})}},mounted:function(){o.$on("innerboard-click",this.onInnerBoardClick),o.$on("cell-click",this.onCellClick)},methods:{getBoardCoords:function(n){return{x:Math.floor(n/this.boardSize),y:n%this.boardSize}},getNestedBoard:function(n){for(var e=[[],[],[]],t=0;t<n.length;t+=1){var r=this.getBoardCoords(t),a=n[t]&&n[t].player;e[r.x][r.y]=a?n[t].player.key:null}return e},getBoardWinners:function(){for(var n=[],e=0;e<this.gameBoard.length;e+=1){var t=this.gameBoard[e].winner?{player:this.gameBoard[e].winner}:null;n.push(t)}return n},getWinner:function(n,e){for(var t=null,r={col:0,row:0,diag:0,rdiag:0},a=this.getBoardCoords(e.index),o=this.getNestedBoard(n),s=0;s<this.boardSize;s+=1)o[a.x][s]===e.player.key&&(r.col+=1),o[s][a.y]===e.player.key&&(r.row+=1),o[s][s]===e.player.key&&(r.diag+=1),o[s][this.boardSize-1-s]===e.player.key&&(r.rdiag+=1);return i()(r).indexOf(this.boardSize)>=0&&(t=e.player),t},setNextPlayer:function(){var n=this.currentPlayer.index+1;n=n>=this.totalPlayers?0:n,this.currentPlayer.turn=!1,this.players[n].turn=!0},unsetPlayerTurns:function(){this.players.map(function(n){var e=n;return e.turn=!1,e})},setInnerBoardsActive:function(){this.gameBoard.map(function(n){var e=n;return e.active=!0,e})},setInnerBoardsInactive:function(){this.gameBoard.map(function(n){var e=n;return e.active=!1,e})},onInnerBoardClick:function(n){this.opponentPicksInnerBoard&&(this.gameBoard[n].isFilled||(this.opponentPicksInnerBoard=!1,this.setInnerBoardsInactive(),this.gameBoard[n].active=!0,this.setNextPlayer()))},onCellClick:function(n,e){if(!this.gameOver){var t={index:e,player:this.currentPlayer};this.isStart?(this.setInnerBoardsInactive(),this.isStart=!1):this.gameBoard[n].active=!1,this.gameBoard[n].lastMove=t,this.gameBoard[n].cells.splice(e,1,t),this.gameBoard[n].numUsedCells+=1;var r=this.gameBoard[n].numUsedCells,a=this.gameBoard[n].cells.length;if(this.gameBoard[n].isFilled=r>=a,null===this.gameBoard[n].winner&&(this.gameBoard[n].winner=this.getWinner(this.gameBoard[n].cells,this.gameBoard[n].lastMove),this.winner=this.getWinner(this.getBoardWinners(),{index:n,player:this.gameBoard[n].lastMove.player})),this.winner)return this.winner.hasWon=!0,this.gameOver=!0,void this.setInnerBoardsInactive();this.gameBoard[e].isFilled?(this.opponentPicksInnerBoard=!0,this.setInnerBoardsInactive()):(this.gameBoard[e].active=!0,this.setNextPlayer())}}}},v={render:function(){var n=this.$createElement,e=this._self._c||n;return e("div",{attrs:{id:"app"}},[e("PlayerInfo",{attrs:{player:this.players[1]}}),this._v(" "),e("GameBoard",{attrs:{players:this.players,currentPlayer:this.currentPlayer,board:this.gameBoard}}),this._v(" "),e("PlayerInfo",{attrs:{player:this.players[0]}})],1)},staticRenderFns:[]};var g=t("VU/8")(y,v,!1,function(n){t("lC8W")},null,null).exports;r.a.config.productionTip=!1,new r.a({el:"#app",template:"<App/>",components:{App:g}})},P33P:function(n,e,t){(n.exports=t("FZ+f")(void 0)).push([n.i,"\n.inner-board[data-v-42a28354] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  color: red;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  width: 33.3%;\n  height: 33.3%;\n  background: #0D0E2B;\n  border: 1px solid #FFF;\n  -webkit-box-shadow: 0px 0px 0px 0px transparent;\n          box-shadow: 0px 0px 0px 0px transparent;\n  -webkit-transition: border 1000ms, -webkit-box-shadow 1000ms;\n  transition: border 1000ms, -webkit-box-shadow 1000ms;\n  transition: border 1000ms, box-shadow 1000ms;\n  transition: border 1000ms, box-shadow 1000ms, -webkit-box-shadow 1000ms;\n}\n.inner-board[data-v-42a28354]:hover {\n    cursor: pointer;\n}\n.inner-board.active[data-v-42a28354] {\n    border: 1px solid #FFBA54;\n    -webkit-box-shadow: 0px 0px 0px 3px #FFBA54;\n            box-shadow: 0px 0px 0px 3px #FFBA54;\n    z-index: 2;\n}\n",""])},RDIi:function(n,e,t){(n.exports=t("FZ+f")(void 0)).push([n.i,"\n.cell[data-v-4135552f] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  width: 33.3%;\n  height: 33.3%;\n  background: #0D0E2B;\n  border: 1px solid rgba(87, 97, 114, 0.9);\n}\n.cell.clickable[data-v-4135552f] {\n    cursor: pointer;\n}\n.cell.clickable[data-v-4135552f]:hover {\n      background: #191b52;\n}\n.cell.x-winner[data-v-4135552f] {\n    background: rgba(255, 114, 114, 0.3);\n    border: 1px solid rgba(255, 114, 114, 0.2);\n}\n.cell.x-winner.clickable[data-v-4135552f]:hover {\n      background: rgba(255, 129, 129, 0.5);\n}\n.cell.o-winner[data-v-4135552f] {\n    background: rgba(70, 255, 208, 0.3);\n    border: 1px solid rgba(70, 255, 208, 0.2);\n}\n.cell.o-winner.clickable[data-v-4135552f]:hover {\n      background: rgba(85, 255, 212, 0.5);\n}\n.cell .player-symobl[data-v-4135552f] {\n    width: 50%;\n    height: 50%;\n}\n",""])},Ykh8:function(n,e,t){(n.exports=t("FZ+f")(void 0)).push([n.i,"\nhtml,\nbody,\n#app {\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  overflow: auto;\n}\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n*, *:before, *:after {\n  -webkit-box-sizing: inherit;\n          box-sizing: inherit;\n}\nbody {\n  margin: 0;\n  padding: 0;\n  background: #0D0E2B;\n}\n#app {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n",""])},aj3X:function(n,e,t){(n.exports=t("FZ+f")(void 0)).push([n.i,"\n.player-symbol[data-v-28cb6110] {\n  height: 32px;\n  width: 32px;\n}\n.player-symbol.player-x .path[data-v-28cb6110] {\n    fill: #FF6262;\n}\n.player-symbol.player-o .path[data-v-28cb6110] {\n    fill: #46FFCB;\n}\n.player-symbol.is-game-piece[data-v-28cb6110] {\n    height: 70%;\n    width: 70%;\n}\n",""])},avx9:function(n,e,t){var r=t("xkxf");"string"==typeof r&&(r=[[n.i,r,""]]),r.locals&&(n.exports=r.locals);t("rjj0")("e56827b4",r,!0)},lC8W:function(n,e,t){var r=t("Ykh8");"string"==typeof r&&(r=[[n.i,r,""]]),r.locals&&(n.exports=r.locals);t("rjj0")("2dbfa8f3",r,!0)},mmXy:function(n,e,t){var r=t("P33P");"string"==typeof r&&(r=[[n.i,r,""]]),r.locals&&(n.exports=r.locals);t("rjj0")("7eaa55aa",r,!0)},sEDB:function(n,e,t){var r=t("t7Cg");"string"==typeof r&&(r=[[n.i,r,""]]),r.locals&&(n.exports=r.locals);t("rjj0")("1d0b2ebe",r,!0)},t7Cg:function(n,e,t){(n.exports=t("FZ+f")(void 0)).push([n.i,'\n.gameboard[data-v-708f51d2] {\n  position: relative;\n  width: 60vh;\n  max-width: 90%;\n  margin: auto;\n  border: 1px solid #FFF;\n}\n.gameboard[data-v-708f51d2]:after {\n    content: "";\n    display: block;\n    padding-bottom: 100%;\n}\n.gameboard-content[data-v-708f51d2] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background: #0D0E2B;\n}\n',""])},xkxf:function(n,e,t){(n.exports=t("FZ+f")(void 0)).push([n.i,"\n.player-info[data-v-ad776854] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  width: 100%;\n  height: 20vh;\n  color: white;\n}\n.player-info .player[data-v-ad776854] {\n    border: 1px solid transparent;\n    padding: 12px 12px 10px 12px;\n}\n.player-info.active .player[data-v-ad776854] {\n    border: 4px solid #FFBA54;\n    border-radius: 50%;\n}\n.player-info.winner .player[data-v-ad776854] {\n    border: 4px solid #00FF66;\n    border-radius: 50%;\n}\n",""])}},["NHnr"]);
//# sourceMappingURL=app.6e59fce0b9008e31d3f8.js.map