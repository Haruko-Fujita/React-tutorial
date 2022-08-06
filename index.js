import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// ターミナルでnpm start +Enterでlocalhost:3000が起動する
// コードを書くたびに自動でブラウザに反映される

// Square（マス目）コンポーネント
// 1 つの <button> をレンダーしている
// 親である Board コンポーネントから渡された値を表示するように、{/* TODO */} を {this.props.value} に書き換える

// Square コンポーネントがクリックされた場合に “X” と表示する
// 現在の Square の状態を this.state に保存して、マス目がクリックされた時にそれを変更する
// クラスにコンストラクタを追加して state を初期化
// render メソッドを書き換えて、クリックされた時に state の現在値を表示する
// class Square extends React.Component {
//   // Square はもはやゲームの状態を管理しなくなったので、Square の constructor を削除する
//   // constructor(props) {
//   //   super(props);
//   //   this.state = {
//   //     value: null,
//   //   };
//   // }

//   render() {
//     return (
//       <button 
//         className="square" 
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

// Square クラスを関数コンポーネントに書き換える
// render メソッドだけを有して自分の state を持たないコンポーネント
// props を入力として受け取り表示すべき内容を返す関数
function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

// 、Board（盤面）が 9 個のマス目をレンダーしている
// コンストラクタを追加し、初期 state として 9 個のマス目に対応する 9 個の null 値をセット
// squares と onClick プロパティを Game コンポーネントから受け取る
// Square の位置を onClick ハンドラに渡してどのマス目がクリックされたのかを伝える
class Board extends React.Component {
  // プレーヤが着手するたびに、どちらのプレーヤの手番なのかを決める xIsNext（真偽値）が反転され、ゲームの状態が保存される
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }
  
  // handleClick メソッドを Board コンポーネントから Game コンポーネントに移動
  // handleClick(i) {
  //   const squares = this.state.squares.slice();
    
  //   // handleClick を書き換えて、ゲームの決着が既についている場合やクリックされたマス目が既に埋まっている場合に早期に return する
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }

  //   // handleClick 関数を書き換えて xIsNext の値を反転させる
  //   // この変更により、“X” 側と “O” 側が交互に着手できるようになる
  //   // squares[i] = 'X';
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  // props として value という名前の値を Square に渡す
  // 個別の Square に現在の値（'X'、'O' または null）を伝えるように書き換える
  // Board から Square に関数を渡し、マス目がクリックされた時に Square にその関数を呼んでもらう
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => {this.props.onClick(i)}}
      />
    );
  }

  render() {
    // “status” テキストも変更して、どちらのプレーヤの手番なのかを表示する
    // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    // いずれかのプレーヤが勝利したかどうか判定し、決着がついた場合は “Winner: X” あるいは “Winner: O” のようなテキストを表示する
    // Game コンポーネントがゲームのステータステキストを表示するようになったので、対応するコードは Board 内の render メソッドからは削除
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    return (
      <div>
        {/* <div className="status">{status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// Game コンポーネントは盤面と、後ほど埋めることになるプレースホルダーを描画している
// 初期 state をコンストラクタ内でセット
//  state に stepNumber という値を加える。いま何手目の状態を見ているのかを表すのに使う
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // handleClick メソッドを Board コンポーネントから Game コンポーネントに移動
  // Game 内の handleClick メソッドで、新しい履歴エントリを history に追加
  // 「時間の巻き戻し」をしてからその時点で新しい着手を起こした場合に、そこから見て「将来」にある履歴（もはや正しくなくなったもの）を確実に捨て去る
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // handleClick を書き換えて、ゲームの決着が既についている場合やクリックされたマス目が既に埋まっている場合に早期に return する
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // handleClick 関数を書き換えて xIsNext の値を反転させる。この変更により、“X” 側と “O” 側が交互に着手できるようになる
    // 新しい着手が発生した場合は、this.setState の引数の一部として stepNumber: history.length を加えることで、stepNumber を更新する

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // jumpTo メソッドを定義してその stepNumber が更新されるようにする。
  // 更新しようとしている stepNumber の値が偶数だった場合は xIsNext を true に設定。
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  // render 関数を更新して、ゲームのステータステキストの決定や表示の際に最新の履歴が使われるようにする
  // render を書き換えて、常に最後の着手後の状態をレンダーするのではなく stepNumber によって現在選択されている着手をレンダーする
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

  // history に map を作用させる。着手履歴の配列をマップして画面上のボタンを表現する React 要素を作りだし、過去の手番に「ジャンプ」するためのボタンの一覧を表示する。
  // 着手順の連番数字をkeyとして持たせる
  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      </li>
    );
  });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// ゲームが決着して次の手番がなくなった時にそれを表示する
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}