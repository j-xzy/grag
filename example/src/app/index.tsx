import * as React from 'react';
import { initialState } from './initialState';
import { Canvas, Feature, GragProvider } from '../../../src';

export function App() {
  const gragRef: React.MutableRefObject<IGrag.IGragInterface | null> = React.useRef(null);
  return (
    <GragProvider initialState={initialState as any} ref={gragRef}>
      <div className='comp-bar'>
        <FtrFunc />
        <FtrClass />
        <FtrBox />
        <FtrChart />
      </div>
      <div className="tools">
        <button onClick={() => console.debug('getCanvas', JSON.stringify(gragRef.current?.getCanvas()))}>getCanvas</button>
      </div>
      <div className='border1'>
        <Canvas id="canvas1" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className='border2'>
        <Canvas id="canvas2" style={{ width: '100%', height: '100%' }} />
      </div>
    </GragProvider>
  );
}

function FtrFunc() {
  return (
    <Feature id='id_func' component={Table}>
      {(ref) => <div ref={ref} className='preview'>Func组件</div>}
    </Feature>
  );
}

function FtrClass() {
  return (
    <Feature id='id_class' component={Select}>
      {(ref) => <div ref={ref} className='preview'>Class组件</div>}
    </Feature>
  );
}

function FtrBox() {
  return (
    <Feature id='id_box' allowChild={true} component={Box}>
      {(ref) => <div ref={ref} className='preview'>Box</div>}
    </Feature>
  );
}

function FtrChart() {
  return (
    <Feature id='id_chart' img="/preview.png" component={Chart}>
      {(ref) => <div ref={ref} className='preview'>chart</div>}
    </Feature>
  );
}

class Select extends React.Component {
  public render() {
    return (<span style={{ border: '1px solid #000' }}>select</span>);
  }
}

function Box(props: React.Props<any>) {
  return (
    <div style={{ border: '1px solid #000', width: 150, height: 150 }}>
      {props.children}
    </div>
  );
}

function Table() {
  const [title, setState] = React.useState('title');
  React.useEffect(() => {
    setState('xxxx');
  }, []);
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={2}>{title}</th>
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

function Chart() {
  const domRef = React.useRef(null);
  const myChart: any = React.useRef(null);
  React.useEffect(() => {
    if (domRef.current) {
      myChart.current = (window as any).echarts.init(domRef.current);
      myChart.current.setOption({
        grid: {
          top: 10,
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
    }
  }, []);
  return <div ref={domRef} style={{ width: 200, height: 200 }}></div>;
}
