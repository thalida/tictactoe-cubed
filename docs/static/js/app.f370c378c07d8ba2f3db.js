webpackJsonp([1],{NHnr:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=t("7+uW"),r=t("gRE1"),i=t.n(r),o=new a.a,s={render:function(){var e=this.$createElement,n=this._self._c||e;return"x"===this.symbol?n("svg",{staticClass:"player-symbol player-x",attrs:{viewBox:"0 0 32 32",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"}},[n("g",{staticClass:"path",attrs:{stroke:"none","stroke-width":"1",fill:"#000000","fill-rule":"evenodd"}},[n("path",{attrs:{d:"M20,12 L28,12 C30.209139,12 32,13.790861 32,16 C32,18.209139 30.209139,20 28,20 L20,20 L20,28 C20,30.209139 18.209139,32 16,32 C13.790861,32 12,30.209139 12,28 L12,20 L4,20 C1.790861,20 0,18.209139 0,16 C0,13.790861 1.790861,12 4,12 L12,12 L12,4 C12,1.790861 13.790861,4.05812251e-16 16,0 C18.209139,-4.05812251e-16 20,1.790861 20,4 L20,12 Z",id:"Combined-Shape",transform:"translate(16.000000, 16.000000) rotate(-315.000000) translate(-16.000000, -16.000000) "}})])]):"o"===this.symbol?n("svg",{staticClass:"player-symbol player-o",attrs:{viewBox:"0 0 32 32",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"}},[n("g",{attrs:{id:"Symbols",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"}},[n("g",{attrs:{id:"shape/o",stroke:"#46FFCB","stroke-width":"8"}},[n("circle",{attrs:{id:"Oval",cx:"16",cy:"16",r:"12"}})])])]):this._e()},staticRenderFns:[]};var l=t("VU/8")({name:"PlayerSymbol",props:["symbol"]},s,!1,function(e){t("NsXk")},"data-v-6d840a14",null).exports,d={name:"PlayerInfo",props:["player"],components:{PlayerSymbol:l}},c={render:function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"player-info",class:{active:this.player.turn,specialMove:this.player.specialMove,winner:this.player.hasWon}},[n("span",{staticClass:"player"},[n("PlayerSymbol",{attrs:{symbol:this.player.key}})],1)])},staticRenderFns:[]};var p=t("VU/8")(d,c,!1,function(e){t("WoVH")},"data-v-2fc17c26",null).exports,h={name:"Cell",props:["parent-index","parent-board","index","move"],components:{PlayerSymbol:l},methods:{onClick:function(){!this.move&&this.parentBoard.active&&o.$emit("cell-click",this.parentIndex,this.index)}}},b={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"cell",class:{clickable:!e.move&&e.parentBoard.active,winner:e.parentBoard.winner,"x-winner":e.parentBoard.winner&&"x"===e.parentBoard.winner.key,"o-winner":e.parentBoard.winner&&"o"===e.parentBoard.winner.key},on:{click:function(n){n.stopPropagation(),e.onClick()}}},[e.move?t("PlayerSymbol",{staticClass:"is-game-piece",attrs:{symbol:e.move.player.key}}):e._e()],1)},staticRenderFns:[]};var u={name:"InnerBoard",props:["index","board"],components:{Cell:t("VU/8")(h,b,!1,function(e){t("T0jm")},"data-v-6ad75e7c",null).exports},methods:{onClick:function(){this.board.selectable&&o.$emit("innerboard-click",this.index)}}},f={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"inner-board",class:{active:e.board.active,selectable:e.board.selectable},on:{click:function(n){e.onClick()}}},e._l(e.board.cells,function(n,a){return t("Cell",{key:a,attrs:{"parent-index":e.index,"parent-board":e.board,index:a,move:n}})}))},staticRenderFns:[]};var x={name:"GameBoard",props:["players","currentPlayer","board"],components:{InnerBoard:t("VU/8")(u,f,!1,function(e){t("mqqL")},"data-v-1f944f7d",null).exports}},m={render:function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"gameboard"},[n("div",{staticClass:"gameboard-content"},this._l(this.board,function(e,t){return n("InnerBoard",{key:t,attrs:{index:t,board:e}})}))])},staticRenderFns:[]};var y={name:"app",components:{PlayerInfo:p,GameBoard:t("VU/8")(x,m,!1,function(e){t("sEDB")},"data-v-708f51d2",null).exports},data:function(){for(var e=[{index:0,key:"x",turn:!0,hasWon:!1,specialMove:!1},{index:1,key:"o",turn:!1,hasWon:!1,specialMove:!1}],n=[],t=0;t<9;t+=1)n.push({selectable:!1,active:!0,cells:new Array(9).fill(null),lastMove:null,winner:null,numUsedCells:0,isFilled:!1});return{boardSize:3,gameBoard:n,players:e,totalPlayers:e.length,isStart:!0,gameOver:!1,winner:null,selectableBoards:!1}},computed:{currentPlayer:function(){return this.players.find(function(e){return!0===e.turn})}},mounted:function(){o.$on("innerboard-click",this.onInnerBoardClick),o.$on("cell-click",this.onCellClick)},methods:{getBoardCoords:function(e){return{x:Math.floor(e/this.boardSize),y:e%this.boardSize}},getNestedBoard:function(e){for(var n=[[],[],[]],t=0;t<e.length;t+=1){var a=this.getBoardCoords(t),r=e[t]&&e[t].player;n[a.x][a.y]=r?e[t].player.key:null}return n},getBoardWinners:function(){for(var e=[],n=0;n<this.gameBoard.length;n+=1){var t=this.gameBoard[n].winner?{player:this.gameBoard[n].winner}:null;e.push(t)}return e},getWinner:function(e,n){for(var t=null,a={col:0,row:0,diag:0,rdiag:0},r=this.getBoardCoords(n.index),o=this.getNestedBoard(e),s=0;s<this.boardSize;s+=1)o[r.x][s]===n.player.key&&(a.col+=1),o[s][r.y]===n.player.key&&(a.row+=1),o[s][s]===n.player.key&&(a.diag+=1),o[s][this.boardSize-1-s]===n.player.key&&(a.rdiag+=1);return i()(a).indexOf(this.boardSize)>=0&&(t=n.player),t},setNextPlayer:function(){var e=this.currentPlayer.index+1;e=e>=this.totalPlayers?0:e,this.currentPlayer.specialMove=!1,this.currentPlayer.turn=!1,this.players[e].specialMove=!1,this.players[e].turn=!0},unsetPlayerTurns:function(){this.players.map(function(e){var n=e;return n.turn=!1,n})},setInnerBoardsActive:function(){this.gameBoard.map(function(e){var n=e;return n.active=!0,n})},setInnerBoardsInactive:function(){this.gameBoard.map(function(e){var n=e;return n.active=!1,n})},setInnerBoardsSelectable:function(){this.selectableBoards=!0,this.gameBoard.map(function(e){var n=e;return n.selectable=!0,n})},setInnerBoardsUnselectable:function(){this.selectableBoards=!1,this.gameBoard.map(function(e){var n=e;return n.selectable=!1,n})},onInnerBoardClick:function(e){this.gameBoard[e].selectable&&!this.gameBoard[e].isFilled&&(this.setInnerBoardsUnselectable(),this.setInnerBoardsInactive(),this.gameBoard[e].active=!0,this.setNextPlayer())},onCellClick:function(e,n){if(!this.gameOver){var t={index:n,player:this.currentPlayer};this.isStart?(this.setInnerBoardsInactive(),this.isStart=!1):this.gameBoard[e].active=!1,this.gameBoard[e].lastMove=t,this.gameBoard[e].cells.splice(n,1,t),this.gameBoard[e].numUsedCells+=1;var a=this.gameBoard[e].numUsedCells,r=this.gameBoard[e].cells.length;if(this.gameBoard[e].isFilled=a>=r,null===this.gameBoard[e].winner&&(this.gameBoard[e].winner=this.getWinner(this.gameBoard[e].cells,this.gameBoard[e].lastMove),this.winner=this.getWinner(this.getBoardWinners(),{index:e,player:this.gameBoard[e].lastMove.player})),this.winner)return this.winner.hasWon=!0,this.gameOver=!0,void this.setInnerBoardsInactive();if(this.gameBoard[n].isFilled)return this.setInnerBoardsInactive(),this.setInnerBoardsSelectable(),void(this.currentPlayer.specialMove=!0);this.gameBoard[n].active=!0,this.setNextPlayer()}}}},v={render:function(){var e=this.$createElement,n=this._self._c||e;return n("div",{attrs:{id:"app"}},[n("PlayerInfo",{attrs:{player:this.players[1]}}),this._v(" "),n("GameBoard",{attrs:{players:this.players,currentPlayer:this.currentPlayer,board:this.gameBoard}}),this._v(" "),n("PlayerInfo",{attrs:{player:this.players[0]}})],1)},staticRenderFns:[]};var g=t("VU/8")(y,v,!1,function(e){t("bsln")},null,null).exports;a.a.config.productionTip=!1,new a.a({el:"#app",template:"<App/>",components:{App:g}})},NsXk:function(e,n,t){var a=t("qyTT");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);t("rjj0")("b462e254",a,!0)},O9HI:function(e,n,t){(e.exports=t("FZ+f")(void 0)).push([e.i,"\nhtml,\nbody,\n#app {\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  overflow: auto;\n}\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n*, *:before, *:after {\n  -webkit-box-sizing: inherit;\n          box-sizing: inherit;\n}\nbody {\n  margin: 0;\n  padding: 0;\n  background: #0D0E2B;\n}\n#app {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.selectBoard {\n  color: white;\n}\n",""])},T0jm:function(e,n,t){var a=t("bllm");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);t("rjj0")("107dd1c9",a,!0)},WoVH:function(e,n,t){var a=t("yD5u");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);t("rjj0")("35261e18",a,!0)},Y1HM:function(e,n,t){(e.exports=t("FZ+f")(void 0)).push([e.i,'\n.inner-board[data-v-1f944f7d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  color: red;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  width: 33.3%;\n  height: 33.3%;\n  background: #0D0E2B;\n  border: 2px solid #FFF;\n  -webkit-box-shadow: 0px 0px 0px 0px transparent;\n          box-shadow: 0px 0px 0px 0px transparent;\n  -webkit-transition: border 300ms, -webkit-box-shadow 300ms;\n  transition: border 300ms, -webkit-box-shadow 300ms;\n  transition: border 300ms, box-shadow 300ms;\n  transition: border 300ms, box-shadow 300ms, -webkit-box-shadow 300ms;\n}\n.inner-board[data-v-1f944f7d]:hover {\n    cursor: pointer;\n}\n.inner-board.active[data-v-1f944f7d] {\n    border: 2px solid #FFBA54;\n    -webkit-box-shadow: 0px 0px 0px 3px #0D0E2B;\n            box-shadow: 0px 0px 0px 3px #0D0E2B;\n    z-index: 2;\n}\n.inner-board.selectable[data-v-1f944f7d]:after {\n    content: "";\n    display: block;\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    cursor: pointer;\n}\n',""])},bllm:function(e,n,t){(e.exports=t("FZ+f")(void 0)).push([e.i,"\n.cell[data-v-6ad75e7c] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-flex: 0;\n      -ms-flex: 0 1 auto;\n          flex: 0 1 auto;\n  width: 33.3%;\n  height: 33.3%;\n  background: #0D0E2B;\n  border: 1px solid rgba(87, 97, 114, 0.9);\n}\n.cell.clickable[data-v-6ad75e7c] {\n    cursor: pointer;\n}\n.cell.clickable[data-v-6ad75e7c]:hover {\n      background: #191b52;\n}\n.cell.x-winner[data-v-6ad75e7c] {\n    background: rgba(255, 114, 114, 0.3);\n    border: 1px solid rgba(255, 114, 114, 0.2);\n}\n.cell.x-winner.clickable[data-v-6ad75e7c]:hover {\n      background: rgba(255, 129, 129, 0.5);\n}\n.cell.o-winner[data-v-6ad75e7c] {\n    background: rgba(70, 255, 208, 0.3);\n    border: 1px solid rgba(70, 255, 208, 0.2);\n}\n.cell.o-winner.clickable[data-v-6ad75e7c]:hover {\n      background: rgba(85, 255, 212, 0.5);\n}\n",""])},bsln:function(e,n,t){var a=t("O9HI");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);t("rjj0")("25016941",a,!0)},mqqL:function(e,n,t){var a=t("Y1HM");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);t("rjj0")("3f5dab60",a,!0)},qyTT:function(e,n,t){(e.exports=t("FZ+f")(void 0)).push([e.i,"\n.player-symbol[data-v-6d840a14] {\n  height: 32px;\n  width: 32px;\n}\n.player-symbol.player-x .path[data-v-6d840a14] {\n    fill: #FF6262;\n}\n.player-symbol.player-o .path[data-v-6d840a14] {\n    fill: #46FFCB;\n}\n.player-symbol.is-game-piece[data-v-6d840a14] {\n    height: 50%;\n    width: 50%;\n}\n",""])},sEDB:function(e,n,t){var a=t("t7Cg");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);t("rjj0")("1d0b2ebe",a,!0)},t7Cg:function(e,n,t){(e.exports=t("FZ+f")(void 0)).push([e.i,'\n.gameboard[data-v-708f51d2] {\n  position: relative;\n  width: 60vh;\n  max-width: 90%;\n  margin: auto;\n  border: 1px solid #FFF;\n}\n.gameboard[data-v-708f51d2]:after {\n    content: "";\n    display: block;\n    padding-bottom: 100%;\n}\n.gameboard-content[data-v-708f51d2] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background: #0D0E2B;\n}\n',""])},yD5u:function(e,n,t){(e.exports=t("FZ+f")(void 0)).push([e.i,"\n.player-info[data-v-2fc17c26] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  width: 100%;\n  height: 20vh;\n  color: white;\n}\n.player-info .player[data-v-2fc17c26] {\n    border: 1px solid transparent;\n    padding: 12px 12px 10px 12px;\n}\n.player-info.active .player[data-v-2fc17c26] {\n    border: 4px solid #FFBA54;\n    border-radius: 50%;\n}\n.player-info.specialMove .player[data-v-2fc17c26] {\n    border: 4px dashed #FFBA54;\n    border-radius: 50%;\n}\n.player-info.winner .player[data-v-2fc17c26] {\n    border: 4px solid #00FF66;\n    border-radius: 50%;\n}\n",""])}},["NHnr"]);
//# sourceMappingURL=app.f370c378c07d8ba2f3db.js.map