// 数学工具函数

interface IVector {
  x: number;
  y: number;
}

interface IPoint {
  x: number;
  y: number;
}

/**
 * 弧度转换角度
 */
export function rad2Deg(rad: number) {
  return rad * 180 / Math.PI;
}

/**
 * 角度转弧度
 */
export function deg2Rad(deg: number) {
  return deg * Math.PI / 180;
}

/**
 * 计算两向量夹角弧度制
 */
export function calAngleByVectors(a: IVector, b: IVector) {
  // 内积
  const ab = a.x * b.x + a.y * b.y;
  const al = Math.sqrt(a.x * a.x + a.y * a.y);
  const bl = Math.sqrt(b.x * b.x + b.y * b.y);
  // 余弦定理
  let rad = Math.acos(ab / (al * bl));
  if (isNaN(rad)) {
    return 0;
  }
  while(rad > Math.PI) {
    rad = Math.PI * 2 - rad;
  }
  return rad;
}

/**
 * 旋转向量
 */
export function rotateVector(vectror: IVector, rotate: number, unit: 'deg' | 'rad' = 'deg') {
  const rad = unit === 'rad' ? rotate : deg2Rad(rotate);
  return {
    x: vectror.x * Math.cos(rad) - vectror.y * Math.sin(rad),
    y: vectror.x * Math.sin(rad) + vectror.y * Math.cos(rad)
  };
}

/**
 * 点在面内 
 */
export function pointInRegion(point: IPoint, region: IPoint[]) {
  if (region.length < 3) {
    return false;
  }
  let nCross = 0;
  for (let i = 0; i < region.length; ++i) {
    const pt1 = region[i];
    const pt2 = region[(i + 1) % region.length];

    if (pt1.y === pt2.y) {
      // 水平跳过
      continue;
    }
    if (point.y < Math.min(pt1.y, pt2.y)) {
      // 低于线段跳过
      continue;
    }
    if (point.y > Math.max(pt1.y, pt2.y)) {
      // 高于线段跳过
      continue;
    }
    // 交点x
    const x = (point.y - pt1.y) * (pt2.x - pt1.x) / (pt2.y - pt1.y) + pt1.x;
    if (point.x <= x) {
      // 从目标点向右发出射线并相交
      ++nCross;
    }
  }
  // 奇数在面内
  return nCross % 2 === 1;
}
