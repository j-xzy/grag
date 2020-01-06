import * as React from 'react';
import { createBoard, Feature, GragProvider } from '../../../src';

const Board = createBoard();

export function App() {
  return (
    <GragProvider>
      <div className='comp-bar'>
        <FtrFunc />
        <FtrClass />
      </div>
      <Board className='border' />
    </GragProvider>
  );
}

function FtrFunc() {
  return (
    <Feature component={Table}>
      {(ref) => <div ref={ref} className='preview'>Func组件</div>}
    </Feature>
  );
}

function FtrClass() {
  return (
    <Feature component={Select}>
      {(ref) => <div ref={ref} className='preview'>Class组件</div>}
    </Feature>
  );
}

class Select extends React.Component {
  public render() {
    return (
      <select style={{ width: '60px', height: '30px' }}>
        <option>opt1</option>
        <option>opt2</option>
        <option>opt3</option>
      </select>
    );
  }
}

function Table() {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={2}>The table header</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>The table body</td>
          <td>with two columns</td>
        </tr>
      </tbody>
    </table>
  );
}
