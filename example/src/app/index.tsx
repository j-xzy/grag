import * as React from 'react';
import { Board, BoradProvider, Feature } from '../../../src';

export function App() {
  return (
    <BoradProvider>
      <div className='comp-bar'>
        <FtrNode />
        <FtrFunc />
        <FtrClass />
      </div>
      <Board />
    </BoradProvider>
  );
}

function FtrNode() {
  return (
    <Feature component={<button>Node</button>}>
      {(ref) => <div ref={ref} style={{ border: '1px solid #000', display: 'inline-block' }}>Node组件</div>}
    </Feature>
  );
}

function FtrFunc() {
  return (
    <Feature component={Table}>
      {(ref) => <div ref={ref} style={{ border: '1px solid #000', display: 'inline-block' }}>Func组件</div>}
    </Feature>
  );
}

function FtrClass() {
  return (
    <Feature component={Select}>
      {(ref) => <div ref={ref} style={{ border: '1px solid #000', display: 'inline-block' }}>Class组件</div>}
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
