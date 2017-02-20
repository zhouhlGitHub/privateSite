import style from './index.css';
import imagesInit from '../../common/js/imagesInit.js';
import img1 from '../../images/pages/winter/winter_001.jpg';
import img2 from '../../images/pages/winter/winter_002.jpg';
import img3 from '../../images/pages/winter/winter_003.jpg';
import img4 from '../../images/pages/winter/winter_004.jpg';
import img5 from '../../images/pages/winter/winter_005.jpg';
import img6 from '../../images/pages/winter/winter_006.jpg';
import img7 from '../../images/pages/winter/winter_007.jpg';
import img8 from '../../images/pages/winter/winter_008.jpg';
import img9 from '../../images/pages/winter/winter_009.jpg';
import img10 from '../../images/pages/winter/winter_010.jpg';
import img11 from '../../images/pages/winter/winter_011.jpg';
import img12 from '../../images/pages/winter/winter_012.jpg';
imagesInit.load({
	imgdata:[
		// north
		{img:'images/winter_002.jpg', x:-1000, y:0, z:1500, nx:0, nz:1},
		{img:'images/winter_003.jpg', x:0,     y:0, z:1500, nx:0, nz:1},
		{img:'images/winter_004.jpg', x:1000,  y:0, z:1500, nx:0, nz:1},
		// east
		{img:'images/winter_005.jpg', x:1500,  y:0, z:1000, nx:-1, nz:0},
		{img:'images/winter_006.jpg', x:1500,  y:0, z:0, nx:-1, nz:0},
		{img:'images/winter_007.jpg', x:1500,  y:0, z:-1000, nx:-1, nz:0},
		// south
		{img:'images/winter_008.jpg', x:1000,  y:0, z:-1500, nx:0, nz:-1},
		{img:'images/winter_009.jpg', x:0,     y:0, z:-1500, nx:0, nz:-1},
		{img:'images/winter_010.jpg', x:-1000, y:0, z:-1500, nx:0, nz:-1},
		// west
		{img:'images/winter_011.jpg', x:-1500, y:0, z:-1000, nx:1, nz:0},
		{img:'images/winter_012.jpg', x:-1500, y:0, z:0, nx:1, nz:0},
		{img:'images/winter_001.jpg', x:-1500, y:0, z:1000, nx:1, nz:0}
	],
	structure:[
		{
			// wall
			fill: {r:255, g:255, b:255, light:1},
			x: [-1001,-490,-490,-1001],
			z: [-500,-500,-500,-500],
			y: [500,500,-500,-500]
		},{
			// wall
			fill: {r:255, g:255, b:255, light:1},
			x: [-501,2,2,-500],
			z: [-500,-500,-500,-500],
			y: [500,500,-500,-500]
		},{
			// wall
			fill: {r:255, g:255, b:255, light:1},
			x: [0,502,502,0],
			z: [-500,-500,-500,-500],
			y: [500,500,-500,-500]
		},{
			// wall
			fill: {r:255, g:255, b:255, light:1},
			x: [490,1002,1002,490],
			z: [-500,-500,-500,-500],
			y: [500,500,-500,-500]
		},{
			// shadow
			fill: {r:0, g:0, b:0, a:0.2},
			x: [-420,420,420,-420],
			z: [-500,-500,-500,-500],
			y: [150, 150,-320,-320]
		},{
			// shadow
			fill: {r:0, g:0, b:0, a:0.2},
			x: [-20,20,20,-20],
			z: [-500,-500,-500,-500],
			y: [250, 250,150,150]
		},{
			// shadow
			fill: {r:0, g:0, b:0, a:0.2},
			x: [-20,20,20,-20],
			z: [-500,-500,-500,-500],
			y: [-320, -320,-500,-500]
		},{
			// shadow
			fill: {r:0, g:0, b:0, a:0.2},
			x: [-20,20,10,-10],
			z: [-500,-500,-100,-100],
			y: [-500, -500,-500,-500]
		},{
			// base
			fill: {r:32, g:32, b:32},
			x: [-50,50,50,-50],
			z: [-150,-150,-50,-50],
			y: [-500,-500,-500,-500]
		},{
			// support
			fill: {r:16, g:16, b:16},
			x: [-10,10,10,-10],
			z: [-100,-100,-100,-100],
			y: [300,300,-500,-500]
		},{
			// frame
			fill: {r:255, g:255, b:255},
			x: [-320,-320,-320,-320],
			z: [0,-20,-20,0],
			y: [-190,-190,190,190]
		},{
			// frame
			fill: {r:255, g:255, b:255},
			x: [320,320,320,320],
			z: [0,-20,-20,0],
			y: [-190,-190,190,190]
		},
		{img:true},
		{
			// ceilingLight
			fill: {r:255, g:128, b:0},
			x: [-50,50,50,-50],
			z: [450,450,550,550],
			y: [500,500,500,500]
		},{
			// groundLight
			fill: {r:255, g:128, b:0},
			x: [-50,50,50,-50],
			z: [450,450,550,550],
			y: [-500,-500,-500,-500]
		}
	],
	options:{
		imagesPath: ""
	}
});
