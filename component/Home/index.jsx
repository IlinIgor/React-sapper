import React from "react";
import classNames from "classnames";

import Box from '../atoms/Box';
import Label from '../atoms/Label';
import Mine from "../Icons/Mine";
import Flag from "../Icons/Flag";

import style from "./style.css";

const GameOver = {
  play: 0,
  lose: 1,
  win: 2
}

const FieldSize = [6, 9, 18, 24, 36];

export default class Home extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      size: 18,
      mine: 24,
      mineCoordinate: [],
      field: [],
      gameOver: GameOver.play
    }

    this.openCell = [];
    this.onClickCell = this.onClickCell.bind(this);
    this.onPutFlag = this.onPutFlag.bind(this);
  }

  componentDidMount() {
    if (this.state.mineCoordinate.length === 0) {
      this.createMineCoordinate();
    }
  }

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createMineCoordinate() {
    this.setState({gameOver: GameOver.play});
    let mineCoordinate = [];
    let mine = this.state.mine;
    if (mine > this.state.size*2) mine = this.state.size*2 - 1
    for (let m = 0; m < this.state.mine; m++) {
      let row = this.randomNumber(0, this.state.size-1);
      let cell = this.randomNumber(0, this.state.size-1);
      mineCoordinate.push([row, cell]);
    }
    this.setState({mineCoordinate}, () => this.createField());
  }

  createField() {
    let field = new Array();
    for (let i = 0; i < this.state.size; i++) {
      field[i] = new Array();
      for (let j = 0; j < this.state.size; j++) {
        field[i][j] = new Object;
        field[i][j].opened = false;
        field[i][j].flag = false;
        let mine = this.state.mineCoordinate.filter(itemCellMine => [i, j].every((value, index) => value === itemCellMine[index]));
        if (mine.length !== 0) {
          field[i][j].value = '-';
        } else {
          field[i][j].value = this.countMineBeside(i, j);
        }
      }
    }
    this.setState({field});
  }

  countMineBeside(i, j) {
    let mineBeside = 0;
    let countCellAround = [[i-1,j-1],[i-1,j],[i-1,j+1],[i,j-1],[i,j+1],[i+1,j-1],[i+1,j],[i+1,j+1]];
    countCellAround.forEach((itemCellAriund, indexCellAround, arrCellAround) => {
      let mine = this.state.mineCoordinate.filter(itemCellMine => itemCellAriund.every((value, index) => value === itemCellMine[index]));
      if (mine.length !== 0) mineBeside ++;
    })
    if (mineBeside === 0) mineBeside = null;
    return mineBeside;
  }

  onCheckWin() {
    let progressGame = 0;
    this.state.field.forEach((cell, index) => {
      this.state.field[index].forEach(item => {
        if (item.opened || item.value === '-') progressGame += 1;
      })
    });
    if (progressGame/this.state.size === this.state.size) {
      this.setState({gameOver: GameOver.win})
    }
  }

  onClickCell(row, cell) {
    if (this.state.gameOver === GameOver.lose || this.state.field[row][cell].flag || this.state.gameOver === GameOver.win) return false;
    if (row < this.state.size && cell < this.state.size) {
      let field = this.state.field;
      field[row][cell].opened = true;
      if (!field[row][cell].value) {
        for(let ks=0;ks<9;ks++) {
          if (row-(Math.floor(ks/3)-1) < this.state.size &&
          row-(Math.floor(ks/3)-1) >= 0 &&
          cell-((ks%3)-1) < this.state.size &&
          cell-((ks%3)-1) >= 0) {
            if (!field[row-(Math.floor(ks/3)-1)][cell-((ks%3)-1)].value &&
            field[row-(Math.floor(ks/3)-1)][cell-((ks%3)-1)].opened === false) {
              field[row-(Math.floor(ks/3)-1)][cell-((ks%3)-1)].opened = true;
              this.onClickCell(row-(Math.floor(ks/3)-1),cell-((ks%3)-1))
            } else {
              field[row-(Math.floor(ks/3)-1)][cell-((ks%3)-1)].opened = true;
            }
          }
        }
      }
      this.setState({field});
      if (this.state.field[row][cell].value == '-') {
          return this.setState({gameOver: GameOver.lose});
      }
    }
    this.onCheckWin();
  }

  textSize(count) {
    return `${count}x${count}`;
  }

  handleChangeSize(event) {
    this.setState({size: Number(event.target.value)});
  }

  handleVhangeMine(event) {
    this.setState({mine: event.target.value});
  }

  onPutFlag(event, row, cell) {
    event.preventDefault();
    let field = this.state.field;
    if (field[row][cell].flag) {
      field[row][cell].flag = false;
    } else {
      field[row][cell].flag = true;
    }
    this.setState({field});
  }

  onKeyDown(event) {
    let {keyCode, shiftKey} = event;
    if ((!/^[0-9\s]+$/.test(String.fromCharCode(keyCode)) || shiftKey) && keyCode != 8) {
      event.preventDefault();
    }
  }

  render() {
    return(
      <div className = {style.container}>
        <Box>
          <Label text = 'Mines number:'>
            <input className = {style.mineCount}
              value = {this.state.mine}
              onKeyDown = {this.onKeyDown.bind(this)}
              onChange = {this.handleVhangeMine.bind(this)}/>
          </Label>
          <Label text = 'Field size:'>
            <select value={this.state.size}
              onChange={this.handleChangeSize.bind(this)}
              className = {style.dropdown}>
              {FieldSize.map((item, index) => {
                return <option key = {index} value={item}>{this.textSize(item)}</option>;
              })}
            </select>
          </Label>
          <button onClick = {this.createMineCoordinate.bind(this)} className = {style.newGame}>New game</button>
        </Box>
        <Box>
          <div className = {style.field}>
            <div className = {style.clearfix}>
              {this.state.field.length !== 0 ? this.state.field.map((item, row) =>
                <div key = {row} className = {style.row}>
                  {this.state.field[row].map((item, cell) =>
                    <div key = {cell}
                      className = {classNames(style.cell, {
                        [style.openCell]: this.state.field[row][cell].opened,
                        [style.mineCell]: this.state.field[row][cell].value == '-' && this.state.field[row][cell].opened
                      })}
                      onClick = {() => this.onClickCell(row, cell)}
                      onContextMenu = {(event) => this.onPutFlag(event, row, cell)}>
                      {this.state.field[row][cell].opened ?
                        this.state.field[row][cell].value == '-' ? <Mine className = {style.mine}/> : this.state.field[row][cell].value
                      : null}
                      {this.state.field[row][cell].flag && !this.state.field[row][cell].opened ? <Flag className = {style.flag}/> : null}
                    </div>
                  )}
                </div>
              ) : null}
              {this.state.gameOver === GameOver.win ? <div className = {style.gameOver}>You win!</div> : null}
            </div>
          </div>
        </Box>
      </div>
    )
  }
}
