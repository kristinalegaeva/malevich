function rectangle(x, y, width, height, fill, angle = 0) {
  const radians = angle * Math.PI / 180;
  return {
    x: x + (width * Math.cos(radians) - height * Math.sin(radians)) / 2,
    y: y + (width * Math.sin(radians) + height * Math.cos(radians)) / 2,
    width,
    height,
    angle,
    fill
  };
}

function circle(x, y, radius, fill, radiusY = radius) {
  return { x, y, radius, radiusY, width: radius * 2, height: radiusY * 2, angle: 0, fill };
}

function triangle(vertices, fill) {
  const xs = vertices.map(([x]) => x);
  const ys = vertices.map(([, y]) => y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const x = Math.min(...xs) + width / 2;
  const y = Math.min(...ys) + height / 2;
  const points = vertices.map(([px, py]) => `${px - x},${py - y}`).join(' ');
  return { x, y, width, height, points, angle: 0, fill };
}

export const figureViewBox = { left: -20, width: 1437, height: 581 };
export const storyFigures = [
  rectangle(201, 203, 88, 95, '#141414'),
  rectangle(490, 0, 72, 170, '#F4F1EA'),
  rectangle(1057, 558.615, 221, 30, '#1C3D86', -42.9622),
  rectangle(149.877, 289.28, 343.859, 22.4902, '#141414', -115.841),
  rectangle(685.694, 73.4521, 236.036, 11.1148, '#1C3D86', 152.979),
  rectangle(106.008, 435.741, 131.456, 30.53, '#1C3D86', 128.693),
  rectangle(788, 0, 144, 130, '#1C3D86'),
  rectangle(993, 0, 58, 65, '#1E1E1E'),
  circle(150, 186, 65, '#E8B923'),
  circle(630.5, 129.5, 45.5, '#F4F1EA'),
  circle(1293, 453, 54, '#C82822'),
  triangle([[756, 33.5], [849.75, -59.5977], [849.75, 126.598]], '#E8B923'),
  triangle([[347.347, 150.971], [275, -0.397672], [422.297, 76.0138]], '#C82822')
];

export const phoneFigureViewBox = { left: 0, width: 412, height: 917 };
export const phoneStoryFigures = [
  rectangle(348, 75, 64, 70, '#141414'),
  rectangle(-1, 633, 125, 53, '#F4F1EA'),
  rectangle(245, 835.364, 161.94, 21.9828, '#1C3D86', -42.9622),
  rectangle(73.824, 226.955, 251.966, 16.4799, '#141414', -115.841),
  rectangle(101.63, 625.777, 172.958, 8.14443, '#1C3D86', 109.936),
  rectangle(159.935, 451.879, 96.3258, 22.3712, '#1C3D86', 158.957),
  rectangle(312, 208, 105, 95, '#1C3D86'),
  rectangle(67, 86, 43, 48, '#1E1E1E'),
  circle(63, 157.5, 48, '#E8B923', 47.5),
  circle(69, 755, 33, '#F4F1EA'),
  circle(303.5, 735.5, 39.5, '#C82822'),
  triangle([[376.391, 242.172], [308.82, 222.483], [395.075, 174.317]], '#E8B923'),
  triangle([[432.275, 544.123], [326, 485.075], [442.353, 475.794]], '#C82822')
];
